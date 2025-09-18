const axios = require('axios');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { uploadImage } = require('../lib/uploadImage');

async function getQuotedOrOwnImageUrl(sock, message) {
    // 1) Quoted image (highest priority)
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (quoted?.imageMessage) {
        const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        return await uploadImage(buffer);
    }

    // 2) Image in the current message
    if (message.message?.imageMessage) {
        const stream = await downloadContentFromMessage(message.message.imageMessage, 'image');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        return await uploadImage(buffer);
    }

    return null;
}

async function reminiCommand(sock, chatId, message, args) {
    try {
        // 🔥 React when command is triggered
        await sock.sendMessage(chatId, {
            react: { text: "📸", key: message.key }
        });

        let imageUrl = null;
        
        // Check if args contain a URL
        if (args.length > 0) {
            const url = args.join(' ');
            if (isValidUrl(url)) {
                imageUrl = url;
            } else {
                return sock.sendMessage(chatId, { 
                    text: '❌ Invalid URL provided.\n\nUsage: `.remini https://example.com/image.jpg`' 
                }, { quoted: message });
            }
        } else {
            // Try to get image from message or quoted message
            imageUrl = await getQuotedOrOwnImageUrl(sock, message);
            
            if (!imageUrl) {
                return sock.sendMessage(chatId, { 
                    text: `
╭───────────✨───────────╮
│    *『 REMINI AI 』*  
│────────────────────────│
│ 📸 Usage:
│ • .remini <image_url>
│ • Reply to an image with .remini
│ • Send image with .remini
│
│ 💡 Example:
│ .remini https://example.com/image.jpg
╰───────────✨───────────╯`.trim()
                }, { quoted: message });
            }
        }

        // Call the Remini API
        const apiUrl = `https://api.princetechn.com/api/tools/remini?apikey=prince&url=${encodeURIComponent(imageUrl)}`;
        
        const response = await axios.get(apiUrl, {
            timeout: 60000, // 60 second timeout (AI processing takes longer)
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (response.data && response.data.success && response.data.result) {
            const result = response.data.result;
            
            if (result.image_url) {
                // Download the enhanced image
                const imageResponse = await axios.get(result.image_url, {
                    responseType: 'arraybuffer',
                    timeout: 30000
                });
                
                if (imageResponse.status === 200 && imageResponse.data) {
                    // Change reaction to ✨ when enhancement is ready
                    await sock.sendMessage(chatId, {
                        react: { text: "✨", key: message.key }
                    });

                    // Send the enhanced image
                    await sock.sendMessage(chatId, {
                        image: imageResponse.data,
                        caption: `
╭───────────👑───────────╮
│   ✨ *IMAGE ENHANCED!* ✨
│─────────────────────────│
│ 📸 Enhanced using Remini AI
│ 🤖 Powered by *PRINCE FAVE MDX*
│ 
│ Enjoy your sharper image! 🚀
╰───────────👑───────────╯`.trim()
                    }, { quoted: message });
                } else {
                    throw new Error('Failed to download enhanced image');
                }
            } else {
                throw new Error(result.message || 'Failed to enhance image');
            }
        } else {
            throw new Error('API returned invalid response');
        }

    } catch (error) {
        console.error('Remini Error:', error.message);
        
        let errorMessage = `
╭───────────⚠️───────────╮
│ ❌ *Remini Failed* ❌
│────────────────────────│
│ ${error.message || 'Unknown error'}
│
│ 💡 Try again later.
╰───────────⚠️───────────╯`.trim();
        
        if (error.response?.status === 429) {
            errorMessage = '⏰ Rate limit exceeded. Please try again later.';
        } else if (error.response?.status === 400) {
            errorMessage = '❌ Invalid image URL or format.';
        } else if (error.response?.status === 500) {
            errorMessage = '🔧 Server error. Please try again later.';
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = '⏰ Request timeout. Please try again.';
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
            errorMessage = '🌐 Network error. Please check your connection.';
        } else if (error.message.includes('Error processing image')) {
            errorMessage = '❌ Image processing failed. Please try with a different image.';
        }
        
        await sock.sendMessage(chatId, { 
            text: errorMessage 
        }, { quoted: message });
    }
}

// Helper function to validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

module.exports = { reminiCommand };
