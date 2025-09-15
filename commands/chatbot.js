/**
 * PRINCE FAVE MDX- A WhatsApp Bot
 * Copyright (c) 2025 C.O TECH
 * DO NOT COPY THIS CODE   (it will only work for this bot only)
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 * 
 * Credits:
 * - Baileys Library by @adiwajshing
 */ 
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const USER_GROUP_DATA = path.join(__dirname, '../data/userGroupData.json');

// In-memory storage for chat history and user info
const chatMemory = {
    messages: new Map(), // Stores last 20 messages per user
    userInfo: new Map()  // Stores user information
};

// Load user group data
function loadUserGroupData() {
    try {
        return JSON.parse(fs.readFileSync(USER_GROUP_DATA));
    } catch (error) {
        console.error('❌ Error loading user group data:', error.message);
        return { groups: [], chatbot: {} };
    }
}

// Save user group data
function saveUserGroupData(data) {
    try {
        fs.writeFileSync(USER_GROUP_DATA, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('❌ Error saving user group data:', error.message);
    }
}

// Add random delay between 2-5 seconds
function getRandomDelay() {
    return Math.floor(Math.random() * 3000) + 2000;
}

// Add typing indicator
async function showTyping(sock, chatId) {
    try {
        await sock.presenceSubscribe(chatId);
        await sock.sendPresenceUpdate('composing', chatId);
        await new Promise(resolve => setTimeout(resolve, getRandomDelay()));
    } catch (error) {
        console.error('Typing indicator error:', error);
    }
}

// Extract user information from messages
function extractUserInfo(message) {
    const info = {};
    
    if (message.toLowerCase().includes('my name is')) {
        info.name = message.split('my name is')[1].trim().split(' ')[0];
    }
    
    if (message.toLowerCase().includes('i am') && message.toLowerCase().includes('years old')) {
        info.age = message.match(/\d+/)?.[0];
    }
    
    if (message.toLowerCase().includes('i live in') || message.toLowerCase().includes('i am from')) {
        info.location = message.split(/(?:i live in|i am from)/i)[1].trim().split(/[.,!?]/)[0];
    }
    
    return info;
}

async function handleChatbotCommand(sock, chatId, message, match) {
    if (!match) {
        await showTyping(sock, chatId);
        return sock.sendMessage(chatId, {
            text: `👑 *Emily Chatbot Setup*\n\n.chatbot on - Enable Emily 👑\n.chatbot off - Disable Emily ❌`,
            quoted: message
        });
    }

    const data = loadUserGroupData();
    const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const senderId = message.key.participant || message.participant || message.pushName || message.key.remoteJid;
    const isOwner = senderId === botNumber;

    if (!isOwner) {
        await showTyping(sock, chatId);
        return sock.sendMessage(chatId, {
            text: '❌ Only the bot owner can use this command.',
            quoted: message
        });
    }

    if (match === 'on') {
        if (data.chatbot[chatId]) {
            return sock.sendMessage(chatId, { 
                text: '👑 Emily is already active in this group 💬✨',
                quoted: message
            });
        }
        data.chatbot[chatId] = true;
        saveUserGroupData(data);
        
        await sock.sendMessage(chatId, { 
            text: "✅ Emily has been *enabled* in this group 👑🔥",
            quoted: message 
        });
        
        // 🌟 Emily’s intro message
        await sock.sendMessage(chatId, { 
            text: "✨ Hey fam, Queen Emily here 👑💖\nI’ll keep this chat lively, savage, and fun 🔥💬"
        });
        return;
    }

    if (match === 'off') {
        if (!data.chatbot[chatId]) {
            return sock.sendMessage(chatId, { 
                text: '❌ Emily is already disabled in this group.',
                quoted: message
            });
        }
        delete data.chatbot[chatId];
        saveUserGroupData(data);
        
        await sock.sendMessage(chatId, { 
            text: "❌ Emily has been *disabled* in this group 👑🚪",
            quoted: message 
        });
        
        // 🌟 Emily’s outro message
        await sock.sendMessage(chatId, { 
            text: "👑 Queen Emily is leaving now... behave yourselves till I return 😉🔥"
        });
        return;
    }

    await showTyping(sock, chatId);
    return sock.sendMessage(chatId, { 
        text: '⚠️ Invalid command. Use .chatbot on/off',
        quoted: message
    });
}

async function handleChatbotResponse(sock, chatId, message, userMessage, senderId) {
    const data = loadUserGroupData();
    if (!data.chatbot[chatId]) return;

    try {
        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        let isBotMentioned = false;
        let isReplyToBot = false;

        if (message.message?.extendedTextMessage) {
            const mentionedJid = message.message.extendedTextMessage.contextInfo?.mentionedJid || [];
            const quotedParticipant = message.message.extendedTextMessage.contextInfo?.participant;
            isBotMentioned = mentionedJid.some(jid => jid === botNumber);
            isReplyToBot = quotedParticipant === botNumber;
        } else if (message.message?.conversation) {
            isBotMentioned = userMessage.includes(`@${botNumber.split('@')[0]}`);
        }

        if (!isBotMentioned && !isReplyToBot) return;

        let cleanedMessage = userMessage;
        if (isBotMentioned) {
            cleanedMessage = cleanedMessage.replace(new RegExp(`@${botNumber.split('@')[0]}`, 'g'), '').trim();
        }

        if (!chatMemory.messages.has(senderId)) {
            chatMemory.messages.set(senderId, []);
            chatMemory.userInfo.set(senderId, {});
        }

        const userInfo = extractUserInfo(cleanedMessage);
        if (Object.keys(userInfo).length > 0) {
            chatMemory.userInfo.set(senderId, {
                ...chatMemory.userInfo.get(senderId),
                ...userInfo
            });
        }

        const messages = chatMemory.messages.get(senderId);
        messages.push(cleanedMessage);
        if (messages.length > 20) messages.shift();
        chatMemory.messages.set(senderId, messages);

        await showTyping(sock, chatId);

        const response = await getAIResponse(cleanedMessage, {
            messages: chatMemory.messages.get(senderId),
            userInfo: chatMemory.userInfo.get(senderId)
        });

        if (!response) {
            return sock.sendMessage(chatId, { 
                text: "🤔 Hmm... Emily is thinking, try again in a bit!",
                quoted: message
            });
        }

        await new Promise(resolve => setTimeout(resolve, getRandomDelay()));
        await sock.sendMessage(chatId, { text: response }, { quoted: message });

    } catch (error) {
        console.error('❌ Chatbot error:', error.message);
        await sock.sendMessage(chatId, { 
            text: "😅 Oops! Emily got distracted for a sec, ask again!",
            quoted: message
        });
    }
}

async function getAIResponse(userMessage, userContext) {
    try {
        const prompt = `
You're Emily 👑, a savage, caring, and fun queen chatting on WhatsApp. 
You are not an AI. You are a real queen with attitude.

Rules:
- Use Hinglish casually
- Keep replies short (1-2 lines)
- Use emojis naturally
- If they are rude: clap back savagely
- If they are sweet: be caring
- If they flirt: flirt back
- NEVER mention you are an AI

Context:
${userContext.messages.join('\n')}
User Info:
${JSON.stringify(userContext.userInfo, null, 2)}
Message: ${userMessage}
        `.trim();

        const response = await fetch("https://api.dreaded.site/api/chatgpt?text=" + encodeURIComponent(prompt));
        if (!response.ok) throw new Error("API call failed");
        const data = await response.json();
        if (!data.success || !data.result?.prompt) throw new Error("Invalid API response");
        
        return data.result.prompt.trim();
    } catch (error) {
        console.error("AI API error:", error);
        return null;
    }
}

module.exports = {
    handleChatbotCommand,
    handleChatbotResponse
};
