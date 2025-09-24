async function getJidCommand(sock, chatId, message) {
    try {
        // If message is from a channel
        if (message.key.remoteJid.endsWith('@newsletter')) {
            await sock.sendMessage(chatId, {
                text: `🆔 Channel JID:\n\n\`${message.key.remoteJid}\``
            }, { quoted: message });
            return;
        }

        // If the user replied to a message, get that JID
        if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            const targetJid = message.message.extendedTextMessage.contextInfo.participant;
            await sock.sendMessage(chatId, {
                text: `🆔 Replied User JID:\n\n\`${targetJid}\``
            }, { quoted: message });
            return;
        }

        // Otherwise send the sender’s JID
        await sock.sendMessage(chatId, {
            text: `🆔 Your JID:\n\n\`${message.key.participant || message.key.remoteJid}\``
        }, { quoted: message });

    } catch (err) {
        console.error("Error in getjid command:", err);
        await sock.sendMessage(chatId, { text: "❌ Failed to fetch JID." }, { quoted: message });
    }
}

module.exports = getJidCommand;
