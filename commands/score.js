
const fs = require("fs");
const path = require("path");

const scoresFile = path.join(__dirname, "../data/scores.json");

function loadScores() {
    if (!fs.existsSync(scoresFile)) return {};
    return JSON.parse(fs.readFileSync(scoresFile));
}

async function scoreCommand(sock, chatId, message) {
    const userId = message.key.participant || message.key.remoteJid;
    const scores = loadScores();
    const userScore = scores[userId] || { wins: 0, losses: 0, ties: 0 };

    await sock.sendMessage(chatId, { 
        text: `📊 *Your Game Stats*\n\nWins: ${userScore.wins}\nLosses: ${userScore.losses}\nTies: ${userScore.ties}` 
    }, { quoted: message });
}

module.exports = scoreCommand;
