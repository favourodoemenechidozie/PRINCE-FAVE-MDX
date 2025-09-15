const fs = require("fs");
const path = require("path");

async function groupInfoCommand(sock, chatId, msg) {
    try {
        // Fetch group metadata
        const groupMetadata = await sock.groupMetadata(chatId);

        // Load your custom asset image for thumbnail
        const assetPath = path.join(__dirname, "../assets/mythumbnail.jpg"); 
        const thumb = fs.readFileSync(assetPath);

        // Get participants & admins
        const participants = groupMetadata.participants || [];
        const groupAdmins = participants.filter(p => p.admin);
        const listAdmin = groupAdmins
            .map((v, i) => `${i + 1}. @${v.id.split("@")[0]}`)
            .join("\n") || "No admins found";

        // Get group owner
        const owner =
            groupMetadata.owner ||
            groupAdmins.find(p => p.admin === "superadmin")?.id ||
            chatId.split("-")[0] + "@s.whatsapp.net";

        // Creation date
        const createdAt = groupMetadata.creation
            ? new Date(groupMetadata.creation * 1000)
            : null;
        const createdDate = createdAt
            ? createdAt.toLocaleString("en-US", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric", 
                hour: "2-digit", 
                minute: "2-digit" 
              })
            : "Unknown";

        // Group link (if bot is admin)
        let groupLink = "Bot is not an admin, cannot fetch link.";
        try {
            const inviteCode = await sock.groupInviteCode(chatId);
            groupLink = `https://chat.whatsapp.com/${inviteCode}`;
        } catch {}

        // Build group info text
        const infoText = `
*『 GROUP INFORMATION 』*

📛 *Name:* ${groupMetadata.subject}
🆔 *ID:* ${groupMetadata.id}
📅 *Created On:* ${createdDate}
👥 *Members:* ${participants.length}
👑 *Owner:* @${owner.split("@")[0]}

🕵️‍♂️ *Admins:*
${listAdmin}

🔗 *Group Link:*
${groupLink}

📝 *Description:*
${groupMetadata.desc?.toString() || "No description set."}

🤖 _Powered by PRINCE FAVE MDX_
        `.trim();

        // Send with your custom thumbnail
        await sock.sendMessage(chatId, {
            text: infoText,
            mentions: [...groupAdmins.map(v => v.id), owner],
            contextInfo: {
                externalAdReply: {
                    title: "GROUP INFO",
                    body: groupMetadata.subject,
                    thumbnail: "assets/👑 Heir to the throne 👑.jpg",
                    sourceUrl: groupLink.startsWith("http") ? groupLink : "https://github.com/princefave"
                }
            }
        }, { quoted: msg });

    } catch (error) {
        console.error("Error in groupInfoCommand:", error);
        await sock.sendMessage(chatId, {
            text: "❌ Failed to fetch group information!"
        }, { quoted: msg });
    }
}

module.exports = groupInfoCommand;
