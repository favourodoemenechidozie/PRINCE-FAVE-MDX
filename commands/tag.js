/**
 * PRINCE FAVE MDX
 * .tag command (spoofed as forwarded from channel)
 *
 * Usage:
 *   Reply to a message and type: .tag <optional text>
 *   Or just type: .tag <text>
 */

const isAdmin = require('../lib/isAdmin');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

// helper to download media from quoted messages
async function downloadMediaMessage(message, mediaType) {
    const stream = await downloadContentFromMessage(message, mediaType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    const filePath = path.join(__dirname, '../temp/', `${Date.now()}.${mediaType}`);
    fs.writeFileSync(filePath, buffer);
    return filePath;
}

async function tagCommand(sock, chatId, senderId, messageText, replyMessage, message) {
    const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);

    if (!isBotAdmin) {
        await sock.sendMessage(chatId, { text: '❌ Please make the bot an admin first.' }, { quoted: message });
        return;
    }

    if (!isSenderAdmin) {
        return await sock.sendMessage(chatId, { text: '❌ Only group admins can use .tag' }, { quoted: message });
    }

    const groupMetadata = await sock.groupMetadata(chatId);
    const participants = groupMetadata.participants;
    const mentionedJidList = participants.map(p => p.id);

    // fake "forwarded from channel" context
    const fakeContext = {
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "", // fake channel JID
            serverMessageId: 999,
            newsletterName: "PRINCE FAVE MDX" // shows as channel name
        },
        mentionedJid: mentionedJidList
    };

    let messageContent = {};

    if (replyMessage) {
        if (replyMessage.imageMessage) {
            const filePath = await downloadMediaMessage(replyMessage.imageMessage, 'image');
            messageContent = {
                image: { url: filePath },
                caption: messageText || replyMessage.imageMessage.caption || '',
                contextInfo: fakeContext
            };
        } else if (replyMessage.videoMessage) {
            const filePath = await downloadMediaMessage(replyMessage.videoMessage, 'video');
            messageContent = {
                video: { url: filePath },
                caption: messageText || replyMessage.videoMessage.caption || '',
                contextInfo: fakeContext
            };
        } else if (replyMessage.conversation || replyMessage.extendedTextMessage) {
            messageContent = {
                text: messageText || replyMessage.conversation || replyMessage.extendedTextMessage.text,
                contextInfo: fakeContext
            };
        } else if (replyMessage.documentMessage) {
            const filePath = await downloadMediaMessage(replyMessage.documentMessage, 'document');
            messageContent = {
                document: { url: filePath },
                fileName: replyMessage.documentMessage.fileName,
                caption: messageText || '',
                contextInfo: fakeContext
            };
        }
    } else {
        messageContent = {
            text: messageText || "📢 Tagged message",
            contextInfo: fakeContext
        };
    }

    if (Object.keys(messageContent).length > 0) {
        await sock.sendMessage(chatId, messageContent);
    }
}

module.exports = tagCommand;
