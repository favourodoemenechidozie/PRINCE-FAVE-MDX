const isAdmin = require('../lib/isAdmin');
const settings = require('../settings'); // must export ownerNumbers & channelJid

// Normalize phone number
const normalizePhone = (s) => ('' + s).replace(/[^0-9]/g, '');
function isOwner(jid) {
    const owners = Array.isArray(settings.ownerNumbers)
        ? settings.ownerNumbers
        : (settings.ownerNumber ? [settings.ownerNumber] : []);
    const cleanedOwners = owners.map(o => normalizePhone(o));
    const sender = ('' + jid).split('@')[0].replace(/[^0-9]/g, '');
    return cleanedOwners.includes(sender);
}

async function tagAllCommand(sock, chatId, senderId, messageText = '') {
    try {
        const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);

        // Bot must be admin
        if (!isBotAdmin) {
            await sock.sendMessage(chatId, { text: '❌ I need to be an admin to tag everyone.' });
            return;
        }

        // Allow owners always, admins only otherwise
        if (!isOwner(senderId) && !isSenderAdmin) {
            await sock.sendMessage(chatId, { text: '❌ Only group admins or the bot owner can use the .tagall command.' });
            return;
        }

        // Get group participants
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata?.participants || [];

        if (participants.length === 0) {
            await sock.sendMessage(chatId, { text: '⚠️ No participants found in this group.' });
            return;
        }

        // Build the message with 🌹 for each user
        const header = `*Hii Everyone 😊!* \n${messageText ? `\n📝 ${messageText}\n` : ''}\n`;
        let message = header;

        participants.forEach((p) => {
            message += `🌹 @${p.id.split('@')[0]}\n`;
        });

        // Fake "forward from channel"
        const fakeForward = {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363401954819608@newsletter", 
                newsletterName: "PRINCE FAVE MDX", 
                serverMessageId: 123 
            }
        };

        // Send the message
        await sock.sendMessage(chatId, {
            text: message.trim(),
            mentions: participants.map(p => p.id),
            contextInfo: fakeForward
        });

    } catch (error) {
        console.error('Error in tagAllCommand:', error);
        await sock.sendMessage(chatId, { text: '❌ Failed to tag all members. Please try again.' });
    }
}

module.exports = tagAllCommand;
