/**
 * PRINCE FAVE MDX - WhatsApp Bot
 * Kick All Members Command
 * 
 * Usage: .kickall (admin only)
 * 
 * Copyright (c) 2025 C.O TECH
 */

async function kickAllCommand(sock, chatId, message) {
    try {
        // Get group metadata
        const metadata = await sock.groupMetadata(chatId);
        const participants = metadata.participants;

        // Get bot ID
        const botId = sock.user.id.split(':')[0];

        // Kick everyone except admins and bot
        let kickedCount = 0;
        for (let participant of participants) {
            if (!participant.admin && participant.id !== botId) {
                await sock.groupParticipantsUpdate(chatId, [participant.id], 'remove');
                kickedCount++;
            }
        }

        await sock.sendMessage(chatId, {
            text: `✅ Successfully kicked ${kickedCount} members from the group.`
        }, { quoted: message });

    } catch (err) {
        console.error(err);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to kick members. Make sure I am admin and have permission.'
        }, { quoted: message });
    }
}

module.exports = { kickAllCommand };
