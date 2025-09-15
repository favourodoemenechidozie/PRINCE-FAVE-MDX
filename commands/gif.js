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
const settings = require('../settings'); // Assuming the API key is stored here

async function gifCommand(sock, chatId, query) {
    const apiKey = settings.giphyApiKey; // Replace with your Giphy API Key

    if (!query) {
        await sock.sendMessage(chatId, { text: 'Please provide a search term for the GIF.' });
        return;
    }

    try {
        const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
            params: {
                api_key: apiKey,
                q: query,
                limit: 1,
                rating: 'g'
            }
        });

        const gifUrl = response.data.data[0]?.images?.downsized_medium?.url;

        if (gifUrl) {
            await sock.sendMessage(chatId, { video: { url: gifUrl }, caption: `Here is your GIF for "${query}"` });
        } else {
            await sock.sendMessage(chatId, { text: 'No GIFs found for your search term.' });
        }
    } catch (error) {
        console.error('Error fetching GIF:', error);
        await sock.sendMessage(chatId, { text: 'Failed to fetch GIF. Please try again later.' });
    }
}

module.exports = gifCommand;
