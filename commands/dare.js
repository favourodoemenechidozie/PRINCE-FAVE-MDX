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
const fetch = require("node-fetch");
const fs = require("fs");


const localDares = [
    "Sing a song loudly for 30 seconds 🎤",
    "Dance without music for 1 minute 💃",
    "Post the last photo in your gallery 📸",
    "Send a voice note saying 'I love PRINCE FAVE MDX' 😍",
    "Call your crush and say 'I miss you' ❤️",
    "Send a random meme from your phone 😂",
    "Do 10 pushups right now 💪",
    "Type with your nose for the next 1 minute 👃",
    "Change your WhatsApp status to 'I am a potato 🥔' for 1 hour",
    "Talk in emojis only for the next 5 minutes 😎🔥✨😂💯",
    "Eat something without using your hands 🍽️",
    "Send a screenshot of your home screen 📱",
    "Say the alphabet backwards 🅰️➡️🧠",
    "Do your best celebrity impression 🎬",
    "Text 'I love you' to the 3rd person in your chat list ❤️",
    "Pretend to be a robot for 2 minutes 🤖",
    "Post a selfie without filters 📸",
    "Say a tongue twister 5 times fast 👅",
    "Do 20 jumping jacks right now 🏋️",
    "Pretend to be a cat for 1 minute 🐱",
    "Show us your funniest meme 😂",
    "Record yourself singing your favorite childhood song 🎶",
    "Talk in baby language for 3 minutes 👶",
    "Post the weirdest sticker in your collection 🤪",
    "Send a GIF that describes your mood now 🎞️",
    "Text 'Guess what?' to 5 random people 🤔",
    "Write a funny poem about your best friend ✍️",
    "Send the oldest photo from your gallery 📂",
    "Act like a monkey for 30 seconds 🐒",
    "Speak only in rhymes for the next 5 minutes 🎤",
    "Pretend you’re a news reporter and give the weather 🌦️",
    "Record yourself laughing like a villain 😈",
    "Dance like nobody is watching for 2 minutes 💃🕺",
    "Send a random voice note of you humming 🎵",
    "Post the most recent emoji you used 😅",
    "Do your best superhero pose 🦸",
    "Try to whistle for 1 minute 🎶",
    "Say 'banana' 20 times fast 🍌",
    "Post your lockscreen wallpaper 🔒",
    "Act like a teacher explaining maths 📚",
    "Send a selfie with a funny face 🤡",
    "Pretend to be an opera singer 🎤",
    "Say something nice about everyone in this group 💕",
    "Do a slow-motion video of yourself 🤳",
    "Write your name with your left hand ✍️",
    "Record yourself barking like a dog 🐶",
    "Act like you are crying dramatically 😭",
    "Send a funny TikTok you saved 🎬",
    "Make a weird sound and record it 🎙️",
    "Change your DP to a cartoon character 🧸",
    "Text 'goodnight' to a random contact 🌙",
    "Pretend you’re on a cooking show 🍳",
    "Balance something on your head for 1 minute 🎩",
    "Take a mirror selfie 🪞",
    "Say 'I am the best' 10 times loudly 🔊",
    "Do your best evil laugh 😈",
    "Say 'I love WhatsApp bots' in a voice note 🤖",
    "Post the funniest video in your gallery 🎥",
    "Pretend you are a chicken for 30 seconds 🐔",
    "Say a random word 15 times fast 🔁",
    "Do your best impression of your mom 👩",
    "Record yourself saying a tongue twister 🎤",
    "Draw a smiley face and send it ✏️",
    "Send the 10th picture in your gallery 📷",
    "Act like a waiter taking an order 🍽️",
    "Say a joke without laughing 😂",
    "Pretend you are stuck in slow-motion ⏳",
    "Show us your handwriting ✍️",
    "Do 15 sit-ups right now 🏃",
    "Act like your favorite movie character 🎬",
    "Pretend you are an alien 👽",
    "Send your most used sticker 🖼️",
    "Speak in a high-pitched voice for 1 minute 🎶",
    "Pretend to sneeze loudly 5 times 🤧",
    "Act like a DJ 🎧",
    "Say 'I love pizza' in 3 different accents 🍕",
    "Do your best ghost impression 👻",
    "Send a song you listen to on repeat 🎵",
    "Change your WhatsApp bio to 'I lost a dare 🤦' for 1 day",
    "Send a voice note of you singing badly 🎤",
    "Send a random motivational quote 💡",
    "Record yourself clapping nonstop for 20 seconds 👏",
    "Say your favorite food loudly 🍔",
    "Pretend you’re a superhero saving the world 🌍",
    "Send the weirdest photo you can find 🤯",
    "Say 'I am sleepy' 15 times 🛌",
    "Pretend to faint dramatically 🥴",
    "Send a sticker that best describes you 😎",
    "Do your best fake crying 😢",
    "Send the 5th photo in your gallery 📷",
    "Pretend you are a tour guide 🌍",
    "Post your favorite emoji combo 😁🔥💯",
    "Say 'I am a potato' in a voice note 🥔",
    "Do your best ninja pose 🥷",
    "Post your funniest screenshot 📱",
    "Say 'hello' in 5 languages 🌎",
    "Pretend you are a rapper 🎤",
    "Send a meme that never gets old 😂",
    "Act like a frog for 1 minute 🐸",
    "Say a random fact you know 📖",
    "Pretend you are giving a speech 🎙️",
    "Send your favorite TikTok 🎬",
    "Post your most embarrassing photo 😅",
    "Act like you are swimming 🏊",
    "Send your favorite sticker 🖼️",
    "Pretend you are in a horror movie 👹",
    "Record yourself laughing nonstop 😂",
    "Do your best sad face 😞",
    "Say 'good morning' 20 times 🌞",
    "Pretend you are a lion roaring 🦁",
    "Send the funniest voice note 🤣",
    "Post your favorite quote ✨",
    "Act like you are a robot 🤖",
    "Send a GIF that makes you laugh 🎞️",
    "Pretend you are cooking 🍲",
    "Post the 3rd picture in your gallery 📸",
    "Do 20 squats right now 🏋️",
    "Pretend you are a king/queen 👑",
    "Say something in a whisper 🗣️",
    "Send your favorite playlist 🎶",
    "Pretend you are a cat meowing 🐱",
    "Say 'thank you' 10 times fast 🙏",
    "Send a random funny video 🎥",
    "Act like you are scared 😱",
    "Send a funny filter selfie 🤡",
    "Pretend to be an angry teacher 👩‍🏫",
    "Post your favorite cartoon character 🧸",
    "Say 'I am happy' 20 times 😄",
    "Pretend you are a zombie 🧟",
    "Send a funny childhood picture 🧒",
    "Act like you are running 🏃",
    "Post the weirdest thing in your notes app 📓",
    "Send your current lock screen 🔒",
    "Say 'I love ice cream' 🍦",
    "Do a silly dance for 1 minute 💃",
    "Send a random sticker now 🖼️",
    "Pretend you are a radio host 📻",
    "Send a voice note of you whispering 🤫",
    "Say your crush’s name loudly 😏",
    "Act like you are a chef 🍴",
    "Send a funny YouTube video 🎬",
    "Pretend you are falling down dramatically 🤕",
    "Send the last thing you copied 📋",
    "Post a random quote ✍️",
    "Say 'yes' and 'no' 10 times fast 🔁",
    "Pretend you are a baby crying 👶",
    "Send your funniest saved meme 😂",
    "Act like you are stuck in slow motion ⏱️",
    "Send a random picture 📷",
    "Say 'oops' 15 times 😅",
    "Pretend you are sneezing 🤧",
    "Send your favorite emoji 🥳",
    "Do your best fish impression 🐟",
    "Say your favorite number 🔢",
    "Act like a snake 🐍",
    "Send a funny typo you once made ⌨️",
    "Post your favorite photo ever 🖼️",
    "Say 'hello world' loudly 🌍",
    "Pretend you are invisible 🕵️",
    "Send your weirdest photo 📷",
    "Act like a duck 🦆",
    "Say something in a robot voice 🤖",
    "Post the funniest sticker you have 😂",
    "Do your best evil face 😈",
    "Say 'I love chocolate' 🍫",
    "Act like a DJ 🎧",
    "Send your most recent screenshot 📸",
    "Say 'I am bored' 20 times 🥱",
    "Pretend you are a waiter 🍽️",
    "Send your most used GIF 🎞️",
    "Say 'goodbye' 10 times fast 👋",
    "Pretend you are asleep 😴",
    "Send your best selfie 😎",
    "Act like a superhero 🦸",
    "Send a funny random pic 📷",
    "Say your name backwards 🌀",
    "Pretend you are a dog 🐕",
    "Send your favorite funny video 😂",
    "Act like a clown 🤡",
    "Send your most liked post 📲",
    "Say your best pickup line 💘",
    "Pretend to sneeze loudly 🤧",
    "Send a random file 📁",
    "Say something romantic 💕",
    "Pretend to be an old person 👴",
    "Send your funniest DP 👀",
    "Say 'banana' 15 times 🍌",
    "Act like a robot 🤖",
    "Send a random audio 🎧",
    "Say 'I love bots' 🤖💚"
];

// ✅ Image for dare command
const dareImage = fs.readFileSync("./assets/dare.jpg"); 


async function dareCommand(sock, chatId, message) {
    try {
        const shizokeys = "shizo";
        const res = await fetch(
            `https://shizoapi.onrender.com/api/texts/dare?apikey=${shizokeys}`
        );

        let dareMessage;
        if (res.ok) {
            const json = await res.json();
            dareMessage = json.result;
        } else {
            // fallback to local dares
            dareMessage =
                localDares[Math.floor(Math.random() * localDares.length)];
        }

        // ✅ Send dare with image
        await sock.sendMessage(
            chatId,
            {
                image: dareImage,
                caption: `🎯 *Your Dare is:*\n\n${dareMessage}`
            },
            { quoted: message }
        );
    } catch (error) {
        console.error("Error in dare command:", error);

        // fallback on error
        const dareMessage =
            localDares[Math.floor(Math.random() * localDares.length)];
        await sock.sendMessage(
            chatId,
            {
                image: dareImage,
                caption: `🎯 *Your Dare is:*\n\n${dareMessage}`
            },
            { quoted: message }
        );
    }
}

module.exports = { dareCommand };
