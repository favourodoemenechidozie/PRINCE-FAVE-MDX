/**
 * PRINCE FAVE MDX - WhatsApp Bot
 * VCF Command (Enhanced)
 * 
 * Automatically generates a VCF of all group members
 * with names and adds the owner's contact.
 * 
 * Copyright (c) 2025 C.O TECH
 */

const fs = require('fs');
const path = require('path');

async function groupVcfCommand(sock, chatId, message) {
    try {
        // Fetch group metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;

        // Start building VCF content
        let vcfContent = '';

        // Add your contact (C.O TECH)
        vcfContent += 
`BEGIN:VCARD
VERSION:3.0
FN:C.O TECH
TEL;TYPE=CELL:+2349129279369
END:VCARD
`;

        // Loop through group members and add their contact
        for (let participant of participants) {
            const phone = participant.id.split('@')[0];

            // Skip if it's your own number (already added)
            if (phone === '2349129279369') continue;

            // Use the name if available, otherwise use the phone
            const name = participant.notify || phone;

            vcfContent += 
`BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;TYPE=CELL:+${phone}
END:VCARD
`;
        }

        // Save to a file
        const vcfFileName = path.join(__dirname, 'group_contacts.vcf');
        fs.writeFileSync(vcfFileName, vcfContent);

        // Send VCF to the group
        await sock.sendMessage(chatId, { 
            document: { url: vcfFileName },
            fileName: 'PRINCE_FAVE_MDX.vcf',
            mimetype: 'text/vcard',
            caption: '📇 Group contacts '
        }, { quoted: message });

        // Delete file after sending
        fs.unlinkSync(vcfFileName);

    } catch (err) {
        console.error(err);
        await sock.sendMessage(chatId, { text: '❌ Failed to generate VCF.' }, { quoted: message });
    }
}

module.exports = { groupVcfCommand };
