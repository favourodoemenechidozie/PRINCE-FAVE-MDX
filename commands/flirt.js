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
const fetch = require('node-fetch');

async function flirtCommand(sock, chatId, message) {
    try {
        const shizokeys = 'shizo';
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/flirt?apikey=${shizokeys}`);
        
        if (!res.ok) {
            throw await res.text();
        }
        
        const json = await res.json();
        const flirtMessage = json.result;

        // Send the flirt message
        await sock.sendMessage(chatId, { text: flirtMessage }, { quoted: message });
    } catch (error) {
        console.error('Error in flirt command:', error);
        await sock.sendMessage(chatId, { text: '❌ Failed to get flirt message. Please try again later!' }, { quoted: message });
    }
}

module.exports = { flirtCommand }; 