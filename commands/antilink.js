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

const { setAntilink, getAntilink, removeAntilink } = require('../lib/index');
const isAdmin = require('../lib/isAdmin');

async function handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message) {
    try {
        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, { text: '❌ *This command is for Group Admins only!*' }, { quoted: message });
            return;
        }

        const prefix = '.';
        const args = userMessage.slice(9).toLowerCase().trim().split(' ');
        const action = args[0];

        if (!action) {
            const usage = 
`*🛡️ PRINCE FAVE MDX | ANTILINK SETTINGS 🛡️*

\`\`\`
${prefix}antilink on        - Enable Antilink
${prefix}antilink off       - Disable Antilink
${prefix}antilink set <action>
   • delete  - Delete links
   • kick    - Remove member
   • warn    - Warn member
${prefix}antilink get       - Show status
\`\`\``;
            await sock.sendMessage(chatId, { text: usage }, { quoted: message });
            return;
        }

        switch (action) {
            case 'on': {
                const existingConfig = await getAntilink(chatId, 'on');
                if (existingConfig?.enabled) {
                    await sock.sendMessage(chatId, { text: '⚠️ Antilink is *already enabled*.' }, { quoted: message });
                    return;
                }
                const result = await setAntilink(chatId, 'on', 'delete');
                await sock.sendMessage(chatId, { 
                    text: result ? '✅ Antilink has been *ENABLED*.' : '❌ Failed to enable Antilink.' 
                }, { quoted: message });
                break;
            }

            case 'off': {
                await removeAntilink(chatId, 'on');
                await sock.sendMessage(chatId, { text: '✅ Antilink has been *DISABLED*.' }, { quoted: message });
                break;
            }

            case 'set': {
                if (args.length < 2) {
                    await sock.sendMessage(chatId, { 
                        text: `⚠️ Please specify an action:\n\n${prefix}antilink set delete | kick | warn` 
                    }, { quoted: message });
                    return;
                }
                const setAction = args[1];
                if (!['delete', 'kick', 'warn'].includes(setAction)) {
                    await sock.sendMessage(chatId, { 
                        text: '❌ Invalid action. Choose *delete*, *kick*, or *warn*.' 
                    }, { quoted: message });
                    return;
                }
                const setResult = await setAntilink(chatId, 'on', setAction);
                await sock.sendMessage(chatId, { 
                    text: setResult ? `✅ Antilink action set to *${setAction.toUpperCase()}*.` : '❌ Failed to set Antilink action.' 
                }, { quoted: message });
                break;
            }

            case 'get': {
                const status = await getAntilink(chatId, 'on');
                const actionConfig = await getAntilink(chatId, 'on');
                await sock.sendMessage(chatId, { 
                    text: `*📌 Antilink Status:*\n\nStatus: ${status ? '🟢 ON' : '🔴 OFF'}\nAction: ${actionConfig ? actionConfig.action.toUpperCase() : 'Not set'}` 
                }, { quoted: message });
                break;
            }

            default:
                await sock.sendMessage(chatId, { text: `⚠️ Use *${prefix}antilink* to see usage options.` });
        }
    } catch (error) {
        console.error('Error in antilink command:', error);
        await sock.sendMessage(chatId, { text: '❌ Error processing Antilink command.' });
    }
}

async function handleLinkDetection(sock, chatId, message, userMessage, senderId, antilinkSetting) {
    if (!antilinkSetting || antilinkSetting === 'off') return;

    let shouldDelete = false;
    const linkPatterns = {
        whatsappGroup: /chat\.whatsapp\.com\/[A-Za-z0-9]{20,}/,
        whatsappChannel: /wa\.me\/channel\/[A-Za-z0-9]{20,}/,
        telegram: /t\.me\/[A-Za-z0-9_]+/i,
        allLinks: /https?:\/\/[^\s]+/i,
    };

    if (linkPatterns.whatsappGroup.test(userMessage) || 
        linkPatterns.whatsappChannel.test(userMessage) ||
        linkPatterns.telegram.test(userMessage) || 
        linkPatterns.allLinks.test(userMessage)) {
        shouldDelete = true;
    }

    if (shouldDelete) {
        try {
            // Delete message
            await sock.sendMessage(chatId, {
                delete: {
                    remoteJid: chatId,
                    fromMe: false,
                    id: message.key.id,
                    participant: message.key.participant || senderId
                }
            });

            // Warn user
            await sock.sendMessage(chatId, { 
                text: `⚠️ @${senderId.split('@')[0]}, posting links is not allowed in this group!`, 
                mentions: [senderId] 
            });

            // Future: you can extend this with kick/warn system if action is set
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    }
}

module.exports = {
    handleAntilinkCommand,
    handleLinkDetection,
};
