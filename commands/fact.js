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

const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = async function factCommand(sock, chatId, message) {
    try {
        // Fetch random fact
        const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
        const fact = response.data.text;

        // Path to your custom image (in assets folder)
        const imagePath = path.join(__dirname, '../assets/Time For Facts.jpg'); 

        // Send image + fact as caption
        await sock.sendMessage(chatId, {
            image: fs.readFileSync(imagePath),
            caption: `📖 *RANDOM FACT*\n\n${fact}\n\n🤖 _Powered by C.O TECH_`
        }, { quoted: message });

    } catch (error) {
        console.error('Error fetching fact:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Sorry, I could not fetch a fact right now. Please try again later!' 
        }, { quoted: message });
    }
};
