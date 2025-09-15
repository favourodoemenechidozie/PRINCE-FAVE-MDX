
const fs = require("fs");
const path = require("path");

// Path to scores file
const scoresFile = path.join(__dirname, "../data/scores.json");

// Load scores
function loadScores() {
    if (!fs.existsSync(scoresFile)) return {};
    return JSON.parse(fs.readFileSync(scoresFile));
}

// Save scores
function saveScores(scores) {
    fs.writeFileSync(scoresFile, JSON.stringify(scores, null, 2));
}

async function rpsCommand(sock, chatId, message) {
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
    const choice = text.split(" ")[1]?.toLowerCase();

    if (!choice || !["rock", "paper", "scissors"].includes(choice)) {
        return await sock.sendMessage(chatId, { 
            text: `❌ Please choose: rock, paper, or scissors.\nExample: *.rps rock*`
        }, { quoted: message });
    }

    const userId = message.key.participant || message.key.remoteJid;
    const scores = loadScores();
    if (!scores[userId]) scores[userId] = { wins: 0, losses: 0, ties: 0 };

    const choices = ["rock", "paper", "scissors"];
    const botChoice = choices[Math.floor(Math.random() * 3)];

    let result;
    if (choice === botChoice) {
        result = "🤝 It's a tie!";
        scores[userId].ties += 1;
    } else if (
        (choice === "rock" && botChoice === "scissors") ||
        (choice === "paper" && botChoice === "rock") ||
        (choice === "scissors" && botChoice === "paper")
    ) {
        result = "🎉 You win!";
        scores[userId].wins += 1;
    } else {
        result = "😎 I win this round!";
        scores[userId].losses += 1;
    }

    saveScores(scores);

    await sock.sendMessage(chatId, { 
        text: `✊✋✌️ *Rock Paper Scissors*\n\nYou chose: *${choice}*\nI chose: *${botChoice}*\n\n${result}\n\n📊 Your Score:\nWins: ${scores[userId].wins}\nLosses: ${scores[userId].losses}\nTies: ${scores[userId].ties}` 
    }, { quoted: message });
}

module.exports = rpsCommand;