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
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function facebookCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const url = text.split(' ').slice(1).join(' ').trim();
        
        if (!url) {
            return await sock.sendMessage(chatId, { 
                text: "📌 Usage: *.fb <Facebook Video URL>*\n\nExample: *.fb https://www.facebook.com/...*"
            }, { quoted: message });
        }

        if (!url.includes('facebook.com')) {
            return await sock.sendMessage(chatId, { 
                text: "❌ That link is not a valid Facebook URL."
            }, { quoted: message });
        }

        // React to show processing
        await sock.sendMessage(chatId, { react: { text: '⏳', key: message.key } });

        // Try resolving final URL
        let resolvedUrl = url;
        try {
            const res = await axios.get(url, { 
                timeout: 20000, 
                maxRedirects: 10, 
                headers: { 'User-Agent': 'Mozilla/5.0' } 
            });
            const possible = res?.request?.res?.responseUrl;
            if (possible) resolvedUrl = possible;
        } catch {
            // Ignore and continue with original URL
        }

        // Fetch video data from API
        async function fetchFromApi(u) {
            const apiUrl = `https://api.princetechn.com/api/download/facebook?apikey=prince_tech_api_azfsbshfb&url=${encodeURIComponent(u)}`;
            return axios.get(apiUrl, {
                timeout: 40000,
                headers: { 
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'application/json'
                },
                validateStatus: s => s >= 200 && s < 500
            });
        }

        let response;
        try {
            response = await fetchFromApi(resolvedUrl);
            if (!response || response.status >= 400 || !response.data) throw new Error('bad');
        } catch {
            response = await fetchFromApi(url);
        }

        const data = response.data;
        if (!data || data.status !== 200 || !data.success || !data.result) {
            return await sock.sendMessage(chatId, { 
                text: "⚠️ Sorry, the API didn’t return a valid response. Try again later."
            }, { quoted: message });
        }

        const fbvid = data.result.hd_video || data.result.sd_video;
        if (!fbvid) {
            return await sock.sendMessage(chatId, { 
                text: "❌ Couldn’t fetch the video. Ensure the Facebook video is public and available."
            }, { quoted: message });
        }

        // Create temp directory if not exists
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        const tempFile = path.join(tmpDir, `fb_${Date.now()}.mp4`);

        // Download video
        const videoResponse = await axios({
            method: 'GET',
            url: fbvid,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8'
            }
        });

        const writer = fs.createWriteStream(tempFile);
        videoResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        if (!fs.existsSync(tempFile) || fs.statSync(tempFile).size === 0) {
            throw new Error('Failed to download video');
        }

        // Send the downloaded video
        await sock.sendMessage(chatId, {
            video: { url: tempFile },
            mimetype: "video/mp4",
            caption: "📥 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗩𝗶𝗱𝗲𝗼\n\n✅ 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗱 𝗯𝘆 *PRINCE FAVE MDX*"
        }, { quoted: message });

        // Cleanup
        try { fs.unlinkSync(tempFile); } catch {}

    } catch (error) {
        console.error('Error in facebookCommand:', error);
        await sock.sendMessage(chatId, { 
            text: "❌ An error occurred. API may be down.\n\nError: " + error.message
        }, { quoted: message });
    }
}

module.exports = facebookCommand;
