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
const settings = require("../settings");
const fs = require("fs"); // to load local image

async function aliveCommand(sock, chatId, message) {
    try {
        // 📝 Alive message text
        const caption = `👑 *PRINCE FAVE MDX IS ACTIVE!*\n\n` +
                        `📌 *Version:* ${settings.version}\n` +
                        `🟢 *Status:* Running Smoothly\n` +
                        `🌐 *Mode:* Public\n\n` +
                        `✨ *Key Features:*\n` +
                        `• 👥 Group Management\n` +
                        `• 🔗 Antilink Protection\n` +
                        `• 🎉 Fun & Entertainment\n` +
                        `• 🛡️ Anti-Delete System\n` +
                        `• ⚡ Super Fast & Reliable\n\n` +
                        `📖 Type *.menu* to view all commands\n\n` +
                        `>  Powered by C.O TECH `;

        // 📸 Path to your alive image
        const imagePath = "./assets/princefave.png"; 

        await sock.sendMessage(chatId, {
            image: fs.readFileSync(imagePath),
            caption: caption,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363299879944380@newsletter', // your channel JID
                    newsletterName: 'PRINCE FAVE MDX',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: '⚡ PRINCE FAVE MDX is alive and running!' }, { quoted: message });
    }
}

module.exports = aliveCommand;
