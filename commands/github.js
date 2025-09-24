/**
 * PRINCE FAVE MDX - A WhatsApp Bot
 * Copyright (c) 2025 C.O TECH
 * DO NOT COPY THIS CODE   (it will only work for this bot only)
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 * 
 * Credits:
 * - Baileys Library by @adiwajshing
 */

const moment = require('moment-timezone');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');


async function githubCommand(sock, chatId, message) {
  try {
    const res = await fetch('https://api.github.com/repos/favourodoemenechidozie/PRINCE-FAVE-MDX');
    if (!res.ok) throw new Error('Error fetching repository data');
    const json = await res.json();

    let txt = `*PRINCE FAVE MDX*\n\n`;
    txt += `✩  *Name* : ${json.name}\n`;
    txt += `✩  *Watchers* : ${json.watchers_count}\n`;
    txt += `✩  *Size* : ${(json.size / 1024).toFixed(2)} MB\n`;
    txt += `✩  *Last Updated* : ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`;
    txt += `✩  *URL* : ${json.html_url}\n`;
    txt += `✩  *Forks* : ${json.forks_count}\n`;
    txt += `✩  *Stars* : ${json.stargazers_count}\n\n`; 
    txt += `✩  *our channel link* : https://whatsapp.com/channel/0029Vb77pP4A89Mje20udJ32\n\n`; 
    txt += `> POWERED BY C.O TECH `;

    // Use the local asset image
    const imgPath = path.join(__dirname, '../assets/👑 Heir to the throne 👑.jpg');
    const imgBuffer = fs.readFileSync(imgPath);

    await sock.sendMessage(chatId, { image: imgBuffer, caption: txt }, { quoted: message });
  } catch (error) {
    await sock.sendMessage(chatId, { text: 'Oh damn couldnt fetch repository information. but hey  heres the repo link - https://github.com/favourodoemenechidozie/PRINCE-FAVE-MDX / and follow our channel - https://whatsapp.com/channel/0029Vb77pP4A89Mje20udJ32' }, { quoted: message });
  }
}

module.exports = githubCommand; 