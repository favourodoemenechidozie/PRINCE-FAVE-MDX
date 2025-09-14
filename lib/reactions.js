/**
 * PRINCE FAVE MDX - A WhatsApp Bot
 * Copyright (c) 2025 C.O TECH
 * DO NOT COPY THIS CODE (it is only work for this bot)
 * Licensed under the MIT License.
 * 
 * Credits:
 * - Baileys Library by @adiwajshing
 */  
const fs = require('fs');

// List of emojis for command reactions (you can add more if you want)
const commandEmojis = ['⚡️'];

// Function to always return the emoji
function getRandomEmoji() {
    return commandEmojis[0];
}

// ✅ Auto-reactions are always ON (no toggle)
let isAutoReactionEnabled = true;

// Function to add reaction to a command message
async function addCommandReaction(sock, message) {
    try {
        if (!message?.key?.id) return;
        
        const emoji = getRandomEmoji();
        await sock.sendMessage(message.key.remoteJid, {
            react: {
                text: emoji,
                key: message.key
            }
        });
    } catch (error) {
        console.error('Error adding command reaction:', error);
    }
}

// Since reactions are always on, no need for owner command
async function handleAreactCommand(sock, chatId, message, isOwner) {
    await sock.sendMessage(chatId, { 
        text: '⚡️ Auto-reactions are always enabled in *PRINCE FAVE MDX*.',
        quoted: message
    });
}

module.exports = {
    addCommandReaction,
    handleAreactCommand
};
