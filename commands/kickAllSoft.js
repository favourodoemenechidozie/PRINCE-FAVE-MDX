/**
 * PRINCE FAVE MDX - WhatsApp Bot
 * Soft Kick All Members Command
 * 
 * Usage: .kickallsoft (admin only)
 * 
 * Copyright (c) 2025 C.O TECH
 */

async function kickAllSoftCommand(sock, chatId, message) {
    try {
        // Get group metadata
        const metadata = await sock.groupMetadata(chatId);
        const participants = metadata.participants;

        // Get bot ID 
        const botId = sock.user.id.split(':')[0];

        // Kick everyone except admins and bot, with delay
        let kickedCount = 0;
        for (let participant of participants) {
            if (!participant.admin && participant.id !== botId) {
                await sock.groupParticipantsUpdate(chatId, [participant.id], 'remove');
                kickedCount++;
                // Delay 2 seconds between each kick
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        await sock.sendMessage(chatId, {
            text: `✅ Successfully kicked ${kickedCount} members from the group (soft mode).`
        }, { quoted: message });

    } catch (err) {
        console.error(err);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to kick members. Make sure I am admin and have permission.'
        }, { quoted: message });
    }
}

module.exports = { kickAllSoftCommand };
