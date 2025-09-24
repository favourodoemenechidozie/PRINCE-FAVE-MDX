/**
 * PRINCE FAVE MDX - A WhatsApp Bot
 * GitHub info command with mention (tag the user who ran the command)
 *
 * Usage:
 *  .github
 *
 * Copyright (c) 2025 C.O TECH
 */

const moment = require('moment-timezone');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function githubCommand(sock, chatId, message) {
  try {
    // Identify the sender (works for groups and private)
    const senderJid = message.key.participant || message.key.remoteJid || '';
    const senderShort = senderJid.split('@')[0];

    // fetch GitHub repository data
    const res = await fetch('https://api.github.com/repos/favourodoemenechidozie/PRINCE-FAVE-MDX', {
      headers: { 'User-Agent': 'PRINCE-FAVE-MDX-Bot' }
    });

    // If fetching failed
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);

    const json = await res.json();

    // Build caption text and include a mention placeholder
    let txt = `*PRINCE FAVE MDX*\n\n`;
    txt += `✦ Name        : ${json.name}\n`;
    txt += `✦ Watchers    : ${json.watchers_count}\n`;
    txt += `✦ Size        : 1.8 MB\n`;
    txt += `✦ Last Update : ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`;
    txt += `✦ URL         : ${json.html_url}\n`;
    txt += `✦ Forks       : ${json.forks_count}\n`;
    txt += `✦ Stars       : ${json.stargazers_count}\n\n`;
    txt += `✦ Our Channel : https://whatsapp.com/channel/0029Vb77pP4A89Mje20udJ32\n\n`;

    // The call-to-action that tags the user who typed the command
    txt += `@${senderShort} 👋 — please *star* ⭐ and *fork* 🍴 the repo!\n\n`;
    txt += `> POWERED BY C.O TECH`;

    // Try to send a local image as header if available
    const imgPath = path.join(__dirname, '../assets/princefave.png');

    // Build message options with the mention so WhatsApp highlights the tagged user
    const opts = {
      quoted: message,
      mentions: senderJid ? [senderJid] : []
    };

    if (fs.existsSync(imgPath)) {
      const imgBuffer = fs.readFileSync(imgPath);
      await sock.sendMessage(chatId, {
        image: imgBuffer,
        caption: txt
      }, opts);
    } else {
      // fallback to text if image missing
      await sock.sendMessage(chatId, {
        text: txt
      }, opts);
    }
  } catch (error) {
    console.error('githubCommand error:', error);
    const senderJid = message.key.participant || message.key.remoteJid || '';
    const senderShort = senderJid.split('@')[0];
    const fallbackText =
      `@${senderShort} — couldn't fetch repository details right now.\n` +
      `You can visit the repo here:\n` +
      `https://github.com/favourodoemenechidozie/PRINCE-FAVE-MDX\n\n` +
      `Also follow our channel: https://whatsapp.com/channel/0029Vb77pP4A89Mje20udJ32\n\n` +
      `— POWERED BY C.O TECH`;

    await sock.sendMessage(chatId, { text: fallbackText }, { quoted: message, mentions: senderJid ? [senderJid] : [] });
  }
}

module.exports = githubCommand;
