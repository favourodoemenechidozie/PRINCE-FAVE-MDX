const { ttdl } = require("ruhend-scraper");
const axios = require('axios');

// Store processed message IDs to prevent duplicates
const processedMessages = new Set();

async function tiktokCommand(sock, chatId, message) {
    try {
        // Prevent duplicate processing
        if (processedMessages.has(message.key.id)) {
            return;
        }
        processedMessages.add(message.key.id);

        // Clean old message IDs after 5 minutes
        setTimeout(() => {
            processedMessages.delete(message.key.id);
        }, 5 * 60 * 1000);

        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        if (!text) {
            return await sock.sendMessage(chatId, { text: "⚠️ Please provide a TikTok link for the video." });
        }

        // Extract URL
        const url = text.split(' ').slice(1).join(' ').trim();
        if (!url) {
            return await sock.sendMessage(chatId, { text: "⚠️ Please provide a TikTok link for the video." });
        }

        // Validate TikTok URL
        const tiktokPatterns = [
            /https?:\/\/(?:www\.)?tiktok\.com\//,
            /https?:\/\/(?:vm\.)?tiktok\.com\//,
            /https?:\/\/(?:vt\.)?tiktok\.com\//,
            /https?:\/\/(?:www\.)?tiktok\.com\/@/,
            /https?:\/\/(?:www\.)?tiktok\.com\/t\//
        ];
        const isValidUrl = tiktokPatterns.some(pattern => pattern.test(url));
        if (!isValidUrl) {
            return await sock.sendMessage(chatId, { text: "❌ Invalid TikTok link. Please provide a valid TikTok video link." });
        }

        await sock.sendMessage(chatId, { react: { text: '🔄', key: message.key } });

        try {
            // API endpoints to try
            const apis = [
                `https://api.princetechn.com/api/download/tiktok?apikey=prince_tech_api_azfsbshfb&url=${encodeURIComponent(url)}`,
                `https://api.princetechn.com/api/download/tiktokdlv2?apikey=prince_tech_api_azfsbshfb&url=${encodeURIComponent(url)}`,
                `https://api.princetechn.com/api/download/tiktokdlv3?apikey=prince_tech_api_azfsbshfb&url=${encodeURIComponent(url)}`,
                `https://api.princetechn.com/api/download/tiktokdlv4?apikey=prince_tech_api_azfsbshfb&url=${encodeURIComponent(url)}`,
                `https://api.dreaded.site/api/tiktok?url=${encodeURIComponent(url)}`
            ];

            let videoUrl = null;
            let audioUrl = null;
            let title = null;

            // Try each API
            for (const apiUrl of apis) {
                try {
                    const response = await axios.get(apiUrl, { timeout: 10000 });
                    if (response.data) {
                        if (response.data.result && response.data.result.videoUrl) {
                            videoUrl = response.data.result.videoUrl;
                            audioUrl = response.data.result.audioUrl;
                            title = response.data.result.title;
                            break;
                        } else if (response.data.tiktok && response.data.tiktok.video) {
                            videoUrl = response.data.tiktok.video;
                            break;
                        } else if (response.data.video) {
                            videoUrl = response.data.video;
                            break;
                        }
                    }
                } catch (apiError) {
                    console.error(`TikTok API failed: ${apiError.message}`);
                    continue;
                }
            }

            // Fallback to ruhend-scraper
            if (!videoUrl) {
                let downloadData = await ttdl(url);
                if (downloadData && downloadData.data && downloadData.data.length > 0) {
                    for (let media of downloadData.data.slice(0, 20)) {
                        const mediaUrl = media.url;
                        const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl) || media.type === 'video';

                        if (isVideo) {
                            await sock.sendMessage(chatId, {
                                video: { url: mediaUrl },
                                mimetype: "video/mp4",
                                caption: "🎬 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗱 𝗯𝘆 PRINCE FAVE MDX"
                            }, { quoted: message });
                        } else {
                            await sock.sendMessage(chatId, {
                                image: { url: mediaUrl },
                                caption: "📸 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗱 𝗯𝘆 PRINCE FAVE MDX"
                            }, { quoted: message });
                        }
                    }
                    return;
                }
            }

            // Send video from API
            if (videoUrl) {
                try {
                    const videoResponse = await axios.get(videoUrl, {
                        responseType: 'arraybuffer',
                        timeout: 30000,
                        headers: { 'User-Agent': 'Mozilla/5.0' }
                    });
                    const videoBuffer = Buffer.from(videoResponse.data);

                    const caption = title ? `🎬 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗱 𝗯𝘆 PRINCE FAVE MDX\n\n📝 Title: ${title}` : "🎬 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗱 𝗯𝘆 PRINCE FAVE MDX";
                    await sock.sendMessage(chatId, { video: videoBuffer, mimetype: "video/mp4", caption }, { quoted: message });

                    // Send audio if available
                    if (audioUrl) {
                        try {
                            const audioResponse = await axios.get(audioUrl, {
                                responseType: 'arraybuffer',
                                timeout: 30000,
                                headers: { 'User-Agent': 'Mozilla/5.0' }
                            });
                            const audioBuffer = Buffer.from(audioResponse.data);

                            await sock.sendMessage(chatId, {
                                audio: audioBuffer,
                                mimetype: "audio/mp3",
                                caption: "🎵 Audio from TikTok"
                            }, { quoted: message });
                        } catch (audioError) {
                            console.error(`Failed to download audio: ${audioError.message}`);
                        }
                    }
                    return;
                } catch (downloadError) {
                    console.error(`Failed to download video: ${downloadError.message}`);
                    await sock.sendMessage(chatId, {
                        video: { url: videoUrl },
                        mimetype: "video/mp4",
                        caption: "🎬 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗱 𝗯𝘆 PRINCE FAVE MDX"
                    }, { quoted: message });
                    return;
                }
            }

            // If all failed
            return await sock.sendMessage(chatId, { text: "❌ Failed to download TikTok video. Please try another link." });
        } catch (error) {
            console.error('Error in TikTok download:', error);
            await sock.sendMessage(chatId, { text: "⚠️ An error occurred while processing the TikTok link." });
        }
    } catch (error) {
        console.error('Error in TikTok command:', error);
        await sock.sendMessage(chatId, { text: "⚠️ An error occurred. Please try again later." });
    }
}

module.exports = tiktokCommand;
