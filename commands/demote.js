/**
 * PRINCE FAVE MDX - A WhatsApp Bot
 * Copyright (c) 2025 C.O TECH
 * DO NOT COPY THIS CODE   (it will only work for this bot only)
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 * 
 * Credits:
 * - Baileys Library by @adiwajshing
 */

const isAdmin = require('../lib/isAdmin');

async function demoteCommand(sock, chatId, mentionedJids, message) {
    try {
        // ✅ Step 1: Ensure this is a group
        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, { 
                text: '⚠️ This command can only be used *inside groups*!'
            }, { quoted: message });
        }

        // ✅ Step 2: Check admin privileges
        const adminStatus = await isAdmin(sock, chatId, message.key.participant || message.key.remoteJid);
        
        if (!adminStatus.isBotAdmin) {
            return sock.sendMessage(chatId, { 
                text: '❌ *PRINCE FAVE MDX ERROR:*\n\nPlease make the bot an *admin* first!'
            }, { quoted: message });
        }

        if (!adminStatus.isSenderAdmin) {
            return sock.sendMessage(chatId, { 
                text: '⛔ *PRINCE FAVE MDX WARNING:*\n\nOnly *group admins* can use the demote command.'
            }, { quoted: message });
        }

        // ✅ Step 3: Detect target users
        let userToDemote = [];
        if (mentionedJids && mentionedJids.length > 0) {
            userToDemote = mentionedJids;
        } else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToDemote = [message.message.extendedTextMessage.contextInfo.participant];
        }

        if (userToDemote.length === 0) {
            return sock.sendMessage(chatId, { 
                text: '⚠️ *PRINCE FAVE MDX NOTICE:*\n\nPlease *mention* a user or *reply* to their message to demote.'
            }, { quoted: message });
        }

        // ✅ Step 4: Perform demotion
        await sock.groupParticipantsUpdate(chatId, userToDemote, "demote");

        // ✅ Step 5: Build response
        const usernames = userToDemote.map(jid => `• @${jid.split('@')[0]}`);
        const demoter = `@${(message.key.participant || message.key.remoteJid).split('@')[0]}`;

        const demotionMessage = 
`*『 PRINCE FAVE MDX | GROUP DEMOTION 』*

👤 *Demoted User${userToDemote.length > 1 ? 's' : ''}:*
${usernames.join('\n')}

👑 *Demoted By:* ${demoter}
📅 *Date:* ${new Date().toLocaleString()}`;

        await sock.sendMessage(chatId, { 
            text: demotionMessage,
            mentions: [...userToDemote, message.key.participant || message.key.remoteJid]
        });

    } catch (error) {
        console.error('❌ Error in PRINCE FAVE MDX demoteCommand:', error);
        await sock.sendMessage(chatId, { 
            text: '⚠️ *PRINCE FAVE MDX ERROR:*\n\nFailed to demote user(s). Ensure the bot is an *admin* and try again.'
        }, { quoted: message });
    }
}

// 🔔 Auto handler for demotion events
async function handleDemotionEvent(sock, groupId, participants, author) {
    try {
        if (!groupId || !participants) return;

        const demotedUsernames = participants.map(jid => `• @${jid.split('@')[0]}`);
        const demoter = author ? `@${author.split('@')[0]}` : 'System';
        const mentionList = [...participants, ...(author ? [author] : [])];

        const demotionMessage = 
`*『 PRINCE FAVE MDX | GROUP DEMOTION 』*

👤 *Demoted User${participants.length > 1 ? 's' : ''}:*
${demotedUsernames.join('\n')}

👑 *Demoted By:* ${demoter}
📅 *Date:* ${new Date().toLocaleString()}`;

        await sock.sendMessage(groupId, {
            text: demotionMessage,
            mentions: mentionList
        });

    } catch (error) {
        console.error('❌ Error in PRINCE FAVE MDX handleDemotionEvent:', error);
    }
}

module.exports = { demoteCommand, handleDemotionEvent };