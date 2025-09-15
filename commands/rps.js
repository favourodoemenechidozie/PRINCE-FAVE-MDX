/**
 * PRINCE FAVE MDX- A WhatsApp Bot
 * Copyright (c) 2025 C.O TECH
 * DO NOT COPY THIS CODE   (it will only work for this bot only)
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 * 
 * Credits:
 * - Baileys Library by @adiwajshing
 */
async function rpsCommand(sock, chatId, message) {
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
    const choice = text.split(" ")[1]?.toLowerCase();

    if (!choice || !["rock", "paper", "scissors"].includes(choice)) {
        return await sock.sendMessage(chatId, { 
            text: `❌ Please choose: rock, paper, or scissors.\nExample: *.rps rock*`
        }, { quoted: message });
    }

    const choices = ["rock", "paper", "scissors"];
    const botChoice = choices[Math.floor(Math.random() * 3)];

    let result;
    if (choice === botChoice) {
        result = "🤝 It's a tie!";
    } else if (
        (choice === "rock" && botChoice === "scissors") ||
        (choice === "paper" && botChoice === "rock") ||
        (choice === "scissors" && botChoice === "paper")
    ) {
        result = "🎉 You win!";
    } else {
        result = "😎 I win this round!";
    }

    await sock.sendMessage(chatId, { 
        text: `✊✋✌️ *Rock Paper Scissors*\n\nYou chose: *${choice}*\nI chose: *${botChoice}*\n\n${result}` 
    }, { quoted: message });
}

module.exports = rpsCommand;
