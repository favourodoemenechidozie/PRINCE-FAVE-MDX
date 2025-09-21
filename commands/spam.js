/**
 * ✦ 𝐏𝐑𝐈𝐍𝐂𝐄 𝐅𝐀𝐕𝐄 𝐌𝐃𝐗 ✦
 * Spam commands (owner-only)
 *
 * Commands:
 *  - .xcrash <number> <count> <message>
 *    Example: .xcrash 2349123456789 500 Hello!
 *
 *  - .xgroup <groupLink> <count> <message>
 *    Example: .xgroup https://chat.whatsapp.com/AbCdEfGhIj 1000 Boom!
 *
 * Notes:
 *  - Only bot owner(s) defined in settings.ownerNumbers can run these.
 *  - No max count limit, but use carefully to avoid bans.
 */

const settings = require('../settings');
const normalizePhone = (s) => ('' + s).replace(/[^0-9]/g, '');

const DELAY_MS = 6; // delay between each message

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function isOwner(jid) {
    const owners = Array.isArray(settings.ownerNumbers) ? settings.ownerNumbers : (settings.ownerNumber ? [settings.ownerNumber] : []);
    const cleanedOwners = owners.map(o => ('' + o).replace(/[^0-9]/g, ''));
    const sender = ('' + jid).split('@')[0].replace(/[^0-9]/g, '');
    return cleanedOwners.includes(sender);
}

/**
 * .xcrash command → spam DM
 */
async function xcrashCommand(sock, chatId, message, args = []) {
    try {
        const senderJid = message.key.participant || message.key.remoteJid;
        if (!isOwner(senderJid)) {
            return await sock.sendMessage(chatId, { text: '❌ Only the bot owner can use this command.' }, { quoted: message });
        }

        if (args.length < 3) {
            return await sock.sendMessage(chatId, { text: '❌ Usage: .xcrash <number> <count> <message>' }, { quoted: message });
        }

        const rawNumber = normalizePhone(args[0]);
        const count = parseInt(args[1], 10);
        const spamText = args.slice(2).join(' ').trim();

        if (!rawNumber || rawNumber.length < 7 || rawNumber.length > 15) {
            return await sock.sendMessage(chatId, { text: '❌ Invalid phone number.' }, { quoted: message });
        }
        if (isNaN(count) || count <= 0) {
            return await sock.sendMessage(chatId, { text: '❌ Invalid count number.' }, { quoted: message });
        }
        if (!spamText) {
            return await sock.sendMessage(chatId, { text: '❌ Message text cannot be empty.' }, { quoted: message });
        }

        const targetJid = `${rawNumber}@s.whatsapp.net`;

        await sock.sendMessage(chatId, { text: `⚠️ Spamming ${count} messages to ${rawNumber}...` }, { quoted: message });

        let success = 0, fail = 0;
        for (let i = 0; i < count; i++) {
            try {
                await sock.sendMessage(targetJid, { text: spamText });
                success++;
            } catch (err) {
                console.error(`[xcrash] failed #${i+1}:`, err?.message || err);
                fail++;
            }
            await sleep(DELAY_MS);
        }

        await sock.sendMessage(chatId, { text: `✅ Done. Sent: ${success}, Failed: ${fail}` }, { quoted: message });

    } catch (err) {
        console.error('xcrashCommand error:', err);
        await sock.sendMessage(chatId, { text: '❌ Unexpected error running xcrash.' }, { quoted: message });
    }
}

/**
 * .xgroup command → spam Group via invite link
 */
async function xgroupCommand(sock, chatId, message, args = []) {
    try {
        const senderJid = message.key.participant || message.key.remoteJid;
        if (!isOwner(senderJid)) {
            return await sock.sendMessage(chatId, { text: '❌ Only the bot owner can use this command.' }, { quoted: message });
        }

        if (args.length < 3) {
            return await sock.sendMessage(chatId, { text: '❌ Usage: .xgroup <groupLink> <count> <message>' }, { quoted: message });
        }

        const inviteLink = args[0];
        const count = parseInt(args[1], 10);
        const spamText = args.slice(2).join(' ').trim();

        if (!inviteLink.startsWith('https://chat.whatsapp.com/')) {
            return await sock.sendMessage(chatId, { text: '❌ Invalid group link.' }, { quoted: message });
        }
        if (isNaN(count) || count <= 0) {
            return await sock.sendMessage(chatId, { text: '❌ Invalid count number.' }, { quoted: message });
        }
        if (!spamText) {
            return await sock.sendMessage(chatId, { text: '❌ Message text cannot be empty.' }, { quoted: message });
        }

        // extract invite code
        const inviteCode = inviteLink.split('/').pop();

        // get group JID from invite link
        let groupJid;
        try {
            groupJid = await sock.groupAcceptInvite(inviteCode);
        } catch (err) {
            return await sock.sendMessage(chatId, { text: '❌ Failed to join group with that link.' }, { quoted: message });
        }

        await sock.sendMessage(chatId, { text: `⚠️ Spamming ${count} messages in group...` }, { quoted: message });

        let success = 0, fail = 0;
        for (let i = 0; i < count; i++) {
            try {
                await sock.sendMessage(groupJid, { text: spamText });
                success++;
            } catch (err) {
                console.error(`[xgroup] failed #${i+1}:`, err?.message || err);
                fail++;
            }
            await sleep(DELAY_MS);
        }

        await sock.sendMessage(chatId, { text: `✅ Done. Sent: ${success}, Failed: ${fail}` }, { quoted: message });

    } catch (err) {
        console.error('xgroupCommand error:', err);
        await sock.sendMessage(chatId, { text: '❌ Unexpected error running xgroup.' }, { quoted: message });
    }
}

module.exports = {
    xcrashCommand,
    xgroupCommand
};
