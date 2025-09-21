/**
 * PRINCE FAVE MDX - A WhatsApp Bot
 * TIME TRAVELER'S DILEMMA - Unique Adventure Game with Endings
 * 
 * Copyright (c) 2025 C.O TECH
 * DO NOT COPY THIS CODE (works only for this bot)
 * Licensed under MIT
 * 
 * Credits:
 * - Baileys Library by @adiwajshing
 */

const fs = require("fs");
const path = require("path");

// Score storage file (optional)
const scoresFile = path.join(__dirname, "../data/tt_scores.json");
// Game scenarios
const scenarios = [
    {
        text: "You find a mysterious time machine in your basement. Do you enter it?\n\nA: Yes, explore the past.\nB: No, stay in the present.",
        image: path.join(__dirname, "../assets/Gemini_Generated_Image_a380nqa380nqa380.png"),
        choices: ["A", "B"]
    },
    {
        text: "Mini-challenge! Guess a number between 1 and 3. If you guess right, double your points!\n\nA: 1\nB: 2\nC: 3",
        image: path.join(__dirname, "../assets/timetraveler.png"),
        choices: ["A", "B", "C"]
    },
    {
        text: "You arrive in ancient Egypt. A Pharaoh approaches you. What do you do?\n\nA: Bow respectfully.\nB: Run away.",
        image: path.join(__dirname, "../assets/timetravel2.png"),
        choices: ["A", "B"]
    },
    {
        text: "You land in the future year 3000. Robots are everywhere. Do you:\n\nA: Make friends with a robot.\nB: Hide and observe.",
        image: path.join(__dirname, "../assets/timetravel3.png"),
        choices: ["A", "B"]
    },
    {
        text: "You find a magical potion. Do you:\n\nA: Drink it.\nB: Save it for later.",
        image: path.join(__dirname, "../assets/timetravel4.png"),
        choices: ["A", "B"]
    },
    {
        text: "You must choose your transport:\n\nA: Teleport to a random time.\nB: Walk through the time portal slowly.",
        image: path.join(__dirname, "../assets/timetravel5.png"),
        choices: ["A", "B"]
    },
    {
        text: "You encounter a talking dragon guarding a treasure.\n\nA: Fight the dragon.\nB: Talk to the dragon.",
        image: path.join(__dirname, "../assets/timetravel6.png"),
        choices: ["A", "B"]
    },
    {
        text: "Mini-challenge! Roll a dice (1-6). If you roll 6, gain extra points!\n\nA: Roll\nB: Skip",
        image: path.join(__dirname, "../assets/Gemini_Generated_Image_a380nqa380nqa380.png"),
        choices: ["A", "B"]
    },
    {
        text: "A mysterious stranger offers you a deal.\n\nA: Accept the deal.\nB: Refuse and walk away.",
        image: path.join(__dirname, "../assets/stranger.jpg"),
        choices: ["A", "B"]
    },
    {
        text: "You have reached the end of your journey. Choose your legacy:\n\nA: Become famous across time.\nB: Remain anonymous but happy.",
        image: path.join(__dirname, "../assets/legacy.jpg"),
        choices: ["A", "B"]
    },
    // 10 additional scenarios
    {
        text: "You step into medieval Europe. A knight challenges you to a duel.\n\nA: Accept the duel.\nB: Politely decline.",
        image: path.join(__dirname, "../assets/medieval.jpg"),
        choices: ["A", "B"]
    },
    {
        text: "You discover a portal to a parallel universe. Do you:\n\nA: Enter immediately.\nB: Study it first.",
        image: path.join(__dirname, "../assets/portal2.jpg"),
        choices: ["A", "B"]
    },
    {
        text: "A futuristic AI offers you unlimited knowledge.\n\nA: Accept the offer.\nB: Decline and keep your memories.",
        image: path.join(__dirname, "../assets/ai.jpg"),
        choices: ["A", "B"]
    },
    {
        text: "You see a rare cosmic event: a shooting star passing through space.\n\nA: Make a wish.\nB: Observe silently.",
        image: path.join(__dirname, "../assets/shooting_star.jpg"),
        choices: ["A", "B"]
    },
    {
        text: "You travel to the Jurassic era and see a T-Rex.\n\nA: Run for cover.\nB: Try to study it up close.",
        image: path.join(__dirname, "../assets/dinosaur.jpg"),
        choices: ["A", "B"]
    },
    {
        text: "You enter a cyberpunk city filled with neon lights and hackers.\n\nA: Hack into the mainframe.\nB: Avoid trouble.",
        image: path.join(__dirname, "../assets/cyberpunk.jpg"),
        choices: ["A", "B"]
    },
    {
        text: "You find a library with books from every time in history.\n\nA: Read everything.\nB: Pick a single era.",
        image: path.join(__dirname, "../assets/library.jpg"),
        choices: ["A", "B"]
    },
    {
        text: "You meet your past self. Do you:\n\nA: Talk to them.\nB: Avoid changing history.",
        image: path.join(__dirname, "../assets/past_self.jpg"),
        choices: ["A", "B"]
    },
    {
        text: "A wizard offers you a magic artifact.\n\nA: Take it.\nB: Refuse politely.",
        image: path.join(__dirname, "../assets/wizard.jpg"),
        choices: ["A", "B"]
    },
    {
        text: "You arrive at the edge of the universe.\n\nA: Step forward to explore.\nB: Stay safe and look back.",
        image: path.join(__dirname, "../assets/universe.jpg"),
        choices: ["A", "B"]
    }
];

// Helper function to generate random points
function getRandomPoints() {
    return Math.floor(Math.random() * 20) + 5; // 5-24 points
}

// Function to determine ending based on score
function getEnding(score) {
    if (score > 300) {
        return "🌟 Incredible! You mastered time and shaped history!";
    } else if (score > 200) {
        return "🎯 Great! You traveled wisely and had a memorable adventure.";
    } else if (score > 100) {
        return "🤔 Not bad! Some choices were risky, but you survived.";
    } else {
        return "😅 Oops! Time was tricky and some choices led to chaos!";
    }
}

// Main game function
async function timeTravelerCommand(sock, chatId, message) {
    let totalScore = 0;
    let path = [];

    for (let i = 0; i < scenarios.length; i++) {
        const scenario = scenarios[i];

        // Send scenario with image
        await sock.sendMessage(chatId, {
            image: { url: scenario.image },
            caption: `🎮 *Time Traveler's Dilemma*\n\n${scenario.text}`
        }, { quoted: message });

        // Wait for user's reply (you must implement waitForUserReply)
        const userReply = await waitForUserReply(sock, chatId);

        const choice = userReply.trim().toUpperCase();

        // Validate choice
        if (!scenario.choices.includes(choice)) {
            await sock.sendMessage(chatId, { text: "❌ Invalid choice! Defaulting to A." }, { quoted: message });
        }

        // Assign points
        const points = getRandomPoints();
        totalScore += points;

        path.push({ scenario: scenario.text, choice, points });
    }

    // Build path summary
    let summaryText = `🏆 *Time Traveler's Dilemma - Summary*\n\n`;
    path.forEach((step, index) => {
        summaryText += `Scenario ${index + 1}:\n${step.scenario}\nChoice: ${step.choice} (+${step.points} pts)\n\n`;
    });
    summaryText += `🎯 *Total Score:* ${totalScore} pts\n\n`;
    summaryText += getEnding(totalScore);

    await sock.sendMessage(chatId, { text: summaryText }, { quoted: message });
}

module.exports = timeTravelerCommand;
