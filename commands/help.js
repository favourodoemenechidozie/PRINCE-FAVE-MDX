const settings = require('../settings');
const fs = require('fs');
const path = require('path');

// ====== Get bot uptime ======
function formatUptime(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    seconds %= 60;
    minutes %= 60;
    hours %= 24;
    return `${hours}h ${minutes}m ${seconds}s`;
} 
 
async function helpCommand(sock, chatId, message) { 
    try {
        // ====== Dynamic Greeting ======
        const currentHour = new Date().getHours();
        let greeting;
        if (currentHour >= 5 && currentHour < 12) {
            greeting = "🌅 Good Morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            greeting = "☀️ Good Afternoon";
        } else {
            greeting = "🌙 Good Night";
        }

        // ====== Bot Stats ======
        const uptime = formatUptime(process.uptime() * 1000);
        const start = Date.now();
        const avgSpeed = `${Date.now() - start}ms`;
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const platform = process.platform;
        const memoryInfo = (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + " MB";
        const userInfo = message.pushName || "User";

        // ====== Count Commands Dynamically ======
        const commandDir = path.join(__dirname, '../commands');
        let totalCommands = 0;
        if (fs.existsSync(commandDir)) {
            totalCommands = fs.readdirSync(commandDir).filter(file => file.endsWith('.js')).length;
        }

    
        let menu = ` 
╭─────────────────────────────╮
│        👑 PRINCE FAVE MDX 👑
│─────────────────────────────│
│ ${greeting}, *${userInfo}* ✨
│─────────────────────────────│
│ ⚙️ Version: ${settings.version || '1.0'}
│ 👨‍💻 Developer: ${settings.botOwner || 'C.O TECH'}
│ 📜 Commands: ${totalCommands}
│ ⏳ Uptime: ${uptime}
│ ⚡ Speed: ${avgSpeed}
│ 🕒 Time: ${currentTime} (${currentDate})
│ 📅 Day: ${day}
│ 💻 Platform: ${platform}
│ 🧠 Memory: ${memoryInfo}
│ 🙋 User: ${userInfo}
│ 🔑 Prefix: ${settings.prefix || '.'}
╰─────────────────────────────╯

╭──────────  GENERAL  ──────────╮ 
• .help / .menu 
• .ping
• .alive
• .tts [text]
• .owner
• .joke  
• .quote
• .weather [city]
• .news
• .attp [text]
• .8ball [question]
• .staff / .admins
• .vv
• .trt [text] [lang]
• .ss [link]
• .jid
╰─────────────────────────────╯

╭──────────  FUN/AI  ──────────╮
• .gpt5 [query]
• .gemini [query]
• .imagine [prompt]
• .flux [prompt]
• .remini  [reply to an image to enhance]
• .compliment
• .insult
• .flirt
• .shayari
• .goodnight
• .roseday
• .character
• .wasted
• .ship
• .simp
• .stupid [text]
╰─────────────────────────────╯
╭──────────  ADMIN  ───────────╮
• .ban [@user]
• .promote [@user]
• .demote [@user]
• .mute [minutes]
• .unmute
• .delete / .del
• .kick [@user]
• .warnings [@user]
• .warn [@user]
• .antilink on/off
• .antibadword on/off
• .clear
• .groupinfo
• .vcf (to get group contacts)
• .tag [message]
• .tagall
• .chatbot on/off
• .resetlink
• .antitag on/off 
• .welcome on/off
• .goodbye on/off
╰─────────────────────────────╯

╭──────────  OWNER  ───────────╮
• .mode [public/private]
• .clearsession
• .antidelete on/off
• .cleartmp 
• .scalc [expression]
• .update
• .setpp <reply to image>
• .autoreact on/off
• .autostatus on/off
• .autotyping on/off
• .autorecording on/off
• .autoread on/off
• .anticall on/off
╰─────────────────────────────╯

╭───────── IMAGE/STICKER ──────╮
• .blur [img]
• .simage
• .sticker
• .removebg <reply to an image>
• .crop [img]
• .tgsticker [link]
• .meme
• .take [pack] 
• .emojimix 🙂
• .igs [link]
• .igsc [link]
╰─────────────────────────────╯

╭───────────  GAMES  ──────────╮
• .tictactoe [@user]
• .hangman
• .guess [letter]
• .trivia
• .answer [ans]
• .truth
• .dare
• .tod [truth/dare]
• .fact 
• .rps <rock, paper or scissors> 
• .score <this is for the rps game> 
• .wcg <would you rather>
• .timetravel <play time traveler game>
╰─────────────────────────────╯

╭──────────  TEXTMAKER  ───────╮
• .metallic [txt]
• .ice [txt]
• .snow [txt] 
• .matrix [txt]
• .light [txt]
• .neon [txt]
• .devil [txt]
• .purple [txt]
• .thunder [txt]
• .leaves [txt]
• .1917 [txt]
• .arena [txt]
• .hacker [txt]
• .sand [txt]
• .blackpink [txt]
• .glitch [txt]
• .fire [txt]
╰─────────────────────────────╯

╭──────────  PIE COMMANDS  ───────╮
• .pies <country>
• .china
• .indonesia
• .japan 
• .korea 
• .hijab 
╰─────────────────────────────╯
╭─────────  DOWNLOADERS  ─────╮
• .play [song]
• .song [name]
• .instagram [link]
• .facebook [link]
• .tiktok [link]
• .video [name]
• .ytmp4 [link]
• .lyrics [song]
╰─────────────────────────────╯

╭──────────  MISC/ANIME  ─────╮
• .heart
• .horny
• .circle
• .lgbt
• .lolice
• .its-so-stupid
• .namecard
• .jail
• .triggered
• .oogway
• .tweet
• .ytcomment
• .comrade
• .passed
• .waifu
• .neko
• .loli
• .pat
• .hug
• .kiss
• .wink
• .cry
• .facepalm
• .gay
╰─────────────────────────────╯

╭──────────  GITHUB  ─────────╮
• .git
• .github
• .sc
• .script
• .repo
╰─────────────────────────────╯

🚀 *Join our channel for updates!*`; 

        // ====== Send With Image or Text ======
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: menu,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'PRINCE FAVE MDX',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: menu,
                contextInfo: { forwardingScore: 999, isForwarded: true }
            }, { quoted: message });
        }

    } catch (error) {
        console.error("Error in help command:", error);
        await sock.sendMessage(chatId, { text: "❌ Error showing menu." });
    }
}

module.exports = helpCommand;
