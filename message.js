const { spamCommand, spamDmCommand } = require('./commands/spam');

async function handleMessage(sock, message) {
    try {
        const from = message.key.remoteJid; // chatId
        const userMessage = (message.message?.conversation ||
                             message.message?.extendedTextMessage?.text ||
                             "").trim();

        if (!userMessage.startsWith('.')) return; // not a command

        const args = userMessage.split(/\s+/);
        const command = args[0].toLowerCase();
        const cmdArgs = args.slice(1);

        switch (command) {
            case '.spam':
                await spamCommand(sock, from, message, cmdArgs);
                break;

            case '.spamdm':
                await spamDmCommand(sock, from, message, cmdArgs);
                break;
        }

    } catch (err) {
        console.error("Error in handler:", err);
    }
}

module.exports = handleMessage;
