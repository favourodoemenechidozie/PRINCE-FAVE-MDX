/**
 * PRINCE FAVE MDX- A WhatsApp Bot
 * Copyright (c) 2025 C.O TECH
 * DO NOT COPY THIS CODE   (it will only work for this bot only)
 * Credits:
 * - Baileys Library by @adiwajshing
 */ 
const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require('fs/promises');

// Store messages temporarily
const messageStore = new Map();
const CONFIG_PATH = path.join(__dirname, '../data/antidelete.json');
const TEMP_MEDIA_DIR = path.join(__dirname, '../tmp');

// Ensure tmp dir exists
if (!fs.existsSync(TEMP_MEDIA_DIR)) {
    fs.mkdirSync(TEMP_MEDIA_DIR, { recursive: true });
}

// 🗂️ Get folder size in MB
const getFolderSizeInMB = (folderPath) => {
    try {
        const files = fs.readdirSync(folderPath);
        let totalSize = 0;
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            if (fs.statSync(filePath).isFile()) {
                totalSize += fs.statSync(filePath).size;
            }
        }
        return totalSize / (1024 * 1024); 
    } catch {
        return 0;
    }
};

// 🧹 Clean temp folder if larger than 100MB
const cleanTempFolderIfLarge = () => {
    try {
        const sizeMB = getFolderSizeInMB(TEMP_MEDIA_DIR);
        if (sizeMB > 100) {
            const files = fs.readdirSync(TEMP_MEDIA_DIR);
            for (const file of files) {
                fs.unlinkSync(path.join(TEMP_MEDIA_DIR, file));
            }
        }
    } catch {}
};
setInterval(cleanTempFolderIfLarge, 60 * 1000);

// 🔧 Load config
function loadAntideleteConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) return { enabled: false };
        return JSON.parse(fs.readFileSync(CONFIG_PATH));
    } catch {
        return { enabled: false };
    }
}

// 💾 Save config
function saveAntideleteConfig(config) {
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    } catch {}
}

// ⚙️ Command Handler
async function handleAntideleteCommand(sock, chatId, message, match) {
    if (!message.key.fromMe) {
        return sock.sendMessage(chatId, { text: '❌ *Only the bot owner can use this command.*' }, { quoted: message });
    }

    const config = loadAntideleteConfig();

    if (!match) {
        return sock.sendMessage(chatId, {
            text: `*🛡️ PRINCE FAVE MDX • ANTIDELETE PROTECTION 🛡️*\n\nCurrent Status: ${config.enabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                  `*.antidelete on*  - Enable\n` +
                  `*.antidelete off* - Disable`
        }, { quoted: message });
    }

    if (match === 'on') config.enabled = true;
    else if (match === 'off') config.enabled = false;
    else return sock.sendMessage(chatId, { text: '⚠️ Invalid command. Use *.antidelete* to see usage.' }, { quoted: message });

    saveAntideleteConfig(config);
    return sock.sendMessage(chatId, { text: `✅ Antidelete is now *${match === 'on' ? 'ENABLED' : 'DISABLED'}*.` }, { quoted: message });
}

// 📥 Store incoming messages
async function storeMessage(message) {
    try {
        const config = loadAntideleteConfig();
        if (!config.enabled || !message.key?.id) return;

        const messageId = message.key.id;
        let content = '';
        let mediaType = '';
        let mediaPath = '';
        const sender = message.key.participant || message.key.remoteJid;

        if (message.message?.conversation) {
            content = message.message.conversation;
        } else if (message.message?.extendedTextMessage?.text) {
            content = message.message.extendedTextMessage.text;
        } else if (message.message?.imageMessage) {
            mediaType = 'image';
            content = message.message.imageMessage.caption || '';
            const buffer = await downloadContentFromMessage(message.message.imageMessage, 'image');
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.jpg`);
            await writeFile(mediaPath, buffer);
        } else if (message.message?.stickerMessage) {
            mediaType = 'sticker';
            const buffer = await downloadContentFromMessage(message.message.stickerMessage, 'sticker');
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.webp`);
            await writeFile(mediaPath, buffer);
        } else if (message.message?.videoMessage) {
            mediaType = 'video';
            content = message.message.videoMessage.caption || '';
            const buffer = await downloadContentFromMessage(message.message.videoMessage, 'video');
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.mp4`);
            await writeFile(mediaPath, buffer);
        } else if (message.message?.audioMessage) {
            mediaType = 'audio';
            const buffer = await downloadContentFromMessage(message.message.audioMessage, 'audio');
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.mp3`);
            await writeFile(mediaPath, buffer);
        } else if (message.message?.documentMessage) {
            mediaType = 'document';
            const fileName = message.message.documentMessage.fileName || `${messageId}`;
            const extension = path.extname(fileName) || '.doc';
            const buffer = await downloadContentFromMessage(message.message.documentMessage, 'document');
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}${extension}`);
            await writeFile(mediaPath, buffer);
            content = `📄 ${fileName}`;
        }

        messageStore.set(messageId, {
            content,
            mediaType,
            mediaPath,
            sender,
            group: message.key.remoteJid.endsWith('@g.us') ? message.key.remoteJid : null,
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        console.error('storeMessage error:', err);
    }
}

// 🚫 Handle message deletion
async function handleMessageRevocation(sock, revocationMessage) {
    try {
        const config = loadAntideleteConfig();
        if (!config.enabled) return;

        const messageId = revocationMessage.message.protocolMessage.key.id;
        const deletedBy = revocationMessage.participant || revocationMessage.key.participant || revocationMessage.key.remoteJid;
        const ownerNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';

        if (deletedBy.includes(sock.user.id) || deletedBy === ownerNumber) return;

        const original = messageStore.get(messageId);
        if (!original) return;

        const sender = original.sender;
        const senderName = sender.split('@')[0];
        const groupName = original.group ? (await sock.groupMetadata(original.group)).subject : '';
        const chatId = original.group || sender;

        const time = new Date().toLocaleString('en-US', {
            timeZone: 'Africa/Lagos',
            hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit',
            day: '2-digit', month: '2-digit', year: 'numeric'
        });

        let text = `*🛡️ PRINCE FAVE MDX | ANTIDELETE ALERT 🛡️*\n\n` +
            `*🗑️ Deleted By:* @${deletedBy.split('@')[0]}\n` +
            `*👤 Original Sender:* @${senderName}\n` +
            `*🕒 Time:* ${time}\n`;

        if (groupName) text += `*👥 Group:* ${groupName}\n`;
        if (original.content) text += `\n* Deleted Message:*\n${original.content}`;

        await sock.sendMessage(chatId, { text, mentions: [deletedBy, sender] });
        await sock.sendMessage(ownerNumber, { text: `📌 Deleted message recovered in *${groupName || "Private Chat"}*.\n\n${text}`, mentions: [deletedBy, sender] });

        if (original.mediaType && fs.existsSync(original.mediaPath)) {
            const mediaOptions = {
                caption: `*📌 Deleted ${original.mediaType} recovered by PRINCE FAVE MDX*\nFrom: @${senderName}`,
                mentions: [sender]
            };
            try {
                switch (original.mediaType) {
                    case 'image':
                        await sock.sendMessage(chatId, { image: { url: original.mediaPath }, ...mediaOptions });
                        break;
                    case 'sticker':
                        await sock.sendMessage(chatId, { sticker: { url: original.mediaPath }, ...mediaOptions });
                        break;
                    case 'video':
                        await sock.sendMessage(chatId, { video: { url: original.mediaPath }, ...mediaOptions });
                        break;
                    case 'audio':
                        await sock.sendMessage(chatId, { audio: { url: original.mediaPath }, mimetype: 'audio/mp4', ...mediaOptions });
                        break;
                    case 'document':
                        await sock.sendMessage(chatId, { document: { url: original.mediaPath }, fileName: path.basename(original.mediaPath), mimetype: 'application/octet-stream', ...mediaOptions });
                        break;
                }
            } catch (err) {
                await sock.sendMessage(chatId, { text: `⚠️ Error recovering media: ${err.message}` });
            }
            try { fs.unlinkSync(original.mediaPath); } catch {}
        }

        messageStore.delete(messageId);

    } catch (err) {
        console.error('handleMessageRevocation error:', err);
    }
}

module.exports = {
    handleAntideleteCommand,
    handleMessageRevocation,
    storeMessage
};
