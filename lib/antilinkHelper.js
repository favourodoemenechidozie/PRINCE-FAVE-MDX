/**
 * PRINCE FAVE MDX- A WhatsApp Bot
 * Copyright (c) 2025 C.O TECH
 * DO NOT COPY THIS CODE   (it will only for this bot only)
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 * 
 * Credits:
 * - Baileys Library by @adiwajshing
 */ 
const fs = require('fs');
const path = require('path');

const antilinkFilePath = path.join(__dirname, '../data', 'antilinkSettings.json');

function loadAntilinkSettings() {
    if (fs.existsSync(antilinkFilePath)) {
        const data = fs.readFileSync(antilinkFilePath);
        return JSON.parse(data);
    }
    return {};
}

function saveAntilinkSettings(settings) {
    fs.writeFileSync(antilinkFilePath, JSON.stringify(settings, null, 2));
}

function setAntilinkSetting(groupId, type) {
    const settings = loadAntilinkSettings();
    settings[groupId] = type;
    saveAntilinkSettings(settings);
}

function getAntilinkSetting(groupId) {
    const settings = loadAntilinkSettings();
    return settings[groupId] || 'off';
}

module.exports = {
    setAntilinkSetting,
    getAntilinkSetting
};
