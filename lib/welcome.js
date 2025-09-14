const { addWelcome, delWelcome, isWelcomeOn, addGoodbye, delGoodBye, isGoodByeOn } = require('../lib/index');
const { delay } = require('@whiskeysockets/baileys');

async function handleWelcome(sock, chatId, message, match) {
    if (!match) {
        return sock.sendMessage(chatId, {
            text: `📥 *Welcome System Guide*\n\n✅ *.welcome on* — Activate welcome messages\n🛠️ *.welcome set [your text]* — Customize your own welcome message\n🚫 *.welcome off* — Deactivate welcome messages\n\n*You can use these variables:*\n• {user} - Tags the new member\n• {group} - Displays the group’s name\n• {description} - Displays the group’s description`,
            quoted: message
        });
    }
 
    const [command, ...args] = match.split(' ');
    const lowerCommand = command.toLowerCase();
    const customMessage = args.join(' ');

    if (lowerCommand === 'on') {
        if (await isWelcomeOn(chatId)) {
            return sock.sendMessage(chatId, { text: '⚠️ The welcome feature is *already active*.', quoted: message });
        }
        await addWelcome(chatId, true, '👋 Hello {user}, welcome to {group}! 🎉');
        return sock.sendMessage(chatId, { text: '✅ Welcome messages have been *activated*. Use *.welcome set [your text]* to personalize it.', quoted: message });
    }

    if (lowerCommand === 'off') {
        if (!(await isWelcomeOn(chatId))) {
            return sock.sendMessage(chatId, { text: '⚠️ The welcome feature is *already inactive*.', quoted: message });
        }
        await delWelcome(chatId);
        return sock.sendMessage(chatId, { text: '✅ Welcome messages have been *turned off* for this group.', quoted: message });
    }

    if (lowerCommand === 'set') {
        if (!customMessage) {
            return sock.sendMessage(chatId, { text: '⚠️ You need to type a custom message. Example: *.welcome set Hello {user}, enjoy your stay!*', quoted: message });
        }
        await addWelcome(chatId, true, customMessage);
        return sock.sendMessage(chatId, { text: '✅ Your custom welcome message has been *saved successfully*.', quoted: message });
    }

    // If no valid command is provided
    return sock.sendMessage(chatId, {
        text: `❌ Command not recognized. Try:\n*.welcome on* — Activate\n*.welcome set [message]* — Customize\n*.welcome off* — Deactivate`,
        quoted: message
    });
}

async function handleGoodbye(sock, chatId, message, match) {
    const lower = match?.toLowerCase();

    if (!match) {
        return sock.sendMessage(chatId, {
            text: `📤 *Goodbye System Guide*\n\n✅ *.goodbye on* — Activate goodbye messages\n🛠️ *.goodbye set [your text]* — Customize your own goodbye message\n🚫 *.goodbye off* — Deactivate goodbye messages\n\n*You can use these variables:*\n• {user} - Mentions the person leaving\n• {group} - Displays the group’s name`,
            quoted: message
        });
    }

    if (lower === 'on') {
        if (await isGoodByeOn(chatId)) {
            return sock.sendMessage(chatId, { text: '⚠️ The goodbye feature is *already active*.', quoted: message });
        }
        await addGoodbye(chatId, true, '👋 Goodbye {user}, we’ll miss you in {group}!');
        return sock.sendMessage(chatId, { text: '✅ Goodbye messages have been *activated*. Use *.goodbye set [your text]* to personalize it.', quoted: message });
    }

    if (lower === 'off') {
        if (!(await isGoodByeOn(chatId))) {
            return sock.sendMessage(chatId, { text: '⚠️ The goodbye feature is *already inactive*.', quoted: message });
        }
        await delGoodBye(chatId);
        return sock.sendMessage(chatId, { text: '✅ Goodbye messages have been *turned off* for this group.', quoted: message });
    }

    if (lower.startsWith('set ')) {
        const customMessage = match.substring(4);
        if (!customMessage) {
            return sock.sendMessage(chatId, { text: '⚠️ Please type a goodbye message. Example: *.goodbye set Farewell {user}, take care!*', quoted: message });
        }
        await addGoodbye(chatId, true, customMessage);
        return sock.sendMessage(chatId, { text: '✅ Your custom goodbye message has been *saved successfully*.', quoted: message });
    }

    // If no valid command is provided
    return sock.sendMessage(chatId, {
        text: `❌ Command not recognized. Try:\n*.goodbye on* — Activate\n*.goodbye set [message]* — Customize\n*.goodbye off* — Deactivate`,
        quoted: message
    });
}

module.exports = { handleWelcome, handleGoodbye };
// This code manages welcome and goodbye messages in a WhatsApp group using the Baileys library.
