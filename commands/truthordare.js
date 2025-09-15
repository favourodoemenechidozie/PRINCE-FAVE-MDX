/**
 * PRINCE FAVE MDX - A WhatsApp Bot
 * Copyright (c) 2025 C.O TECH
 * DO NOT COPY THIS CODE (it will only work for this bot only)
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 *
 * Credits:
 * - Baileys Library by @adiwajshing
 */

const fs = require('fs');
const fetch = require('node-fetch');


const imagePath = './assets/dare.jpg'; // Path to your image file
const dareImage = fs.readFileSync(imagePath);
// -------------------------
// Local Fallback Truths (200 items)
// -------------------------
const localTruths = [
  "What is your biggest fear?",
  "Have you ever lied to your best friend?",
  "Who was your first crush?",
   "What is your biggest fear?",
  "Have you ever lied to your best friend?",
  "Who was your first crush?",
  "What is the most embarrassing thing you’ve done?",
  "Have you ever cheated in a test?",
  "What’s your guilty pleasure?",
  "If you could date anyone in this group, who would it be?",
  "What’s a secret you’ve never told anyone?",
  "What’s your worst habit?",
  "Have you ever stolen something?",
  "Who do you stalk the most on social media?",
  "What’s the weirdest dream you’ve had?",
  "Have you ever cried in public?",
  "What’s your biggest regret?",
  "Who was your first kiss?",
  "Do you believe in love at first sight?",
  "What’s your worst lie?",
  "Have you ever been rejected by someone?",
  "What’s your dream job?",
  "Have you ever ghosted someone?",
  "What’s your biggest insecurity?",
  "Do you sing in the shower?",
  "What’s the most childish thing you still do?",
  "Who is your secret crush?",
  "What is your most useless talent?",
  "Have you ever broken the law?",
  "What’s the craziest rumor you’ve heard about yourself?",
  "Do you talk in your sleep?",
  "Have you ever faked being sick?",
  "Who do you text the most?",
  "What’s the most awkward date you’ve been on?",
  "Have you ever been caught cheating?",
  "What’s your weirdest food combination?",
  "Do you still sleep with a stuffed toy?",
  "What’s your worst fashion choice?",
  "Who is your celebrity crush?",
  "What’s the meanest thing you’ve done?",
  "What’s your most embarrassing childhood memory?",
  "Have you ever been in love?",
  "What’s your most recent lie?",
  "What’s the biggest trouble you’ve been in?",
  "Have you ever pretended to like a gift?",
  "What’s your strangest fear?",
  "Have you ever spied on someone?",
  "Who was the last person you stalked online?",
  "What’s your weirdest nickname?",
  "Do you believe in ghosts?",
  "Have you ever been caught sneaking out?",
  "What’s the most childish thing you’ve done recently?",
  "Do you pick your nose?",
  "What’s your dream vacation?",
  "Have you ever laughed at the wrong moment?",
  "Do you snore?",
  "What’s your favorite guilty snack?",
  "Have you ever lied to your parents?",
  "What’s your most embarrassing school memory?",
  "Do you have a secret talent?",
  "What’s the weirdest thing you’ve eaten?",
  "Have you ever farted in public?",
  "Who in this group do you trust the most?",
  "What’s the longest you’ve gone without a shower?",
  "Have you ever been jealous of a friend?",
  "Do you believe in aliens?",
  "What’s the worst movie you love?",
  "What’s your favorite childhood show?",
  "Have you ever had an imaginary friend?",
  "What’s your biggest achievement?",
  "Do you talk to yourself?",
  "What’s the dumbest thing you’ve done for love?",
  "Have you ever cried during a movie?",
  "What’s the last lie you told?",
  "Have you ever kissed someone you regret?",
  "What’s your dream wedding?",
  "Have you ever been caught daydreaming?",
  "What’s your most awkward moment?",
  "Do you have a crush on someone in this group?",
  "What’s your favorite comfort food?",
  "Have you ever sent a text to the wrong person?",
  "What’s the meanest thing someone has said to you?",
  "What’s your hidden talent?",
  "Do you have a favorite sibling?",
  "Have you ever laughed so hard you peed?",
  "What’s your most used emoji?",
  "Have you ever had a crush on a teacher?",
  "What’s your worst haircut?",
  "Do you believe in fate?",
  "Have you ever embarrassed yourself in front of a crush?",
  "What’s your most embarrassing selfie?",
  "Who was your first best friend?",
  "Have you ever lied in Truth or Dare?",
  "What’s your worst fear?",
  "Do you believe in soulmates?",
  "What’s your dream house?",
  "Who do you admire the most?",
  "Have you ever ruined a surprise?",
  "What’s the weirdest place you’ve fallen asleep?",
  "Do you dance when no one’s watching?",
  "What’s your worst date?",
  "What’s your biggest turn-off?",
  "Have you ever lied to get out of trouble?",
  "What’s your most embarrassing ringtone?",
  "Do you sing in front of a mirror?",
  "Have you ever been friend-zoned?",
  "What’s the weirdest text you’ve received?",
  "What’s your favorite memory?",
  "Have you ever laughed at someone falling?",
  "What’s your worst nightmare?",
  "Have you ever cheated in a game?",
  "What’s the most expensive thing you own?",
  "What’s your weirdest obsession?",
  "Have you ever embarrassed yourself on social media?",
  "What’s your biggest dream?",
  "What’s your worst subject in school?",
  "Do you ever talk to pets?",
  "What’s your favorite holiday?",
  "Have you ever broken a promise?",
  "What’s the weirdest gift you’ve received?",
  "What’s your most embarrassing text?",
  "Do you still watch cartoons?",
  "Have you ever stalked your ex?",
  "What’s your guilty TV show?",
  "Do you have a silly fear?",
  "What’s your dream car?",
  "What’s your favorite hobby?",
  "Do you believe in luck?",
  "What’s your favorite song?",
  "Have you ever been scared of the dark?",
  "What’s your favorite color?",
  "Have you ever pretended to be someone else online?",
  "What’s the worst grade you’ve gotten?",
  "Do you keep a diary?",
  "What’s your favorite movie?",
  "Have you ever cried over a cartoon?",
  "What’s your most awkward chat?",
  "Have you ever been dumped?",
  "Do you believe in karma?",
  "What’s your favorite app?",
  "Do you sleep with lights on?",
  "What’s the weirdest rumor you believed?",
  "Have you ever lied about your age?",
  "What’s your favorite drink?",
  "Do you still believe in Santa?",
  "What’s your weirdest dream job?",
  "What’s your most embarrassing nickname?",
  "Have you ever lied in this game?",
  "What’s the funniest dream you had?",
  "Have you ever talked in your sleep?",
  "What’s your favorite season?",
  "Do you have a lucky number?",
  "What’s your dream country to visit?",
  "What’s your favorite dessert?",
  "Do you sing badly but still sing?",
  "Have you ever had stage fright?",
  "What’s your favorite meme?",
  "Do you believe in magic?",
  "What’s your most embarrassing selfie caption?",
  "Have you ever tripped in public?",
  "What’s your guilty playlist?",
  "Do you love someone secretly?",
  "What’s your favorite emoji?",
  "Have you ever ignored someone on purpose?",
  "What’s the weirdest lie you’ve told?",
  "Do you believe in reincarnation?",
  "What’s your favorite quote?",
  "Have you ever peed in a pool?",
  "What’s your favorite book?",
  "Do you still have a childhood toy?",
  "What’s your worst laugh?",
  "Have you ever fallen asleep in class?",
  "What’s your guilty celebrity crush?",
  "Do you have a crush right now?",
  "What’s your weirdest social media post?",
  "Have you ever broken something and blamed someone else?",
  "What’s your favorite childhood memory?",
  "Do you like someone here secretly?",
  "What’s your most embarrassing online search?",
  "Have you ever copied homework?",
  "What’s your favorite snack?",
  "Do you believe in destiny?",
  "What’s your favorite emoji spam?",
  "Have you ever cheated in a board game?",
  "What’s the weirdest place you’ve slept?",
  "Do you still believe in fairy tales?",
  "What’s your dream career?",
  "What’s the most annoying habit you have?",
  "Do you believe in horoscopes?",
  "What’s your favorite ice cream flavor?",
  "Do you have a weird scar story?",
  "What’s your guilty comfort habit?",
  "Do you love scary movies?",
  "What’s your weirdest laugh?",
  "Do you ever cry for no reason?",
  "What’s your dream phone?",
  "Have you ever pranked someone?",
  "What’s the weirdest pet you’d want?",
  "Do you have a secret account?",
  "What’s your guilty online habit?",
  "Do you believe in parallel worlds?",
  "What’s your favorite cartoon?",
  "Do you sing to yourself?",
  "What’s your most useless purchase?",
  "Do you believe in true love?",
  "What’s your most embarrassing call?",
  "Do you have a phobia?",
  "What’s your dream vacation spot?"
];

// -------------------------
// Local Fallback Dares (200 items)
// -------------------------
const localDares = [
  "Do 10 push-ups right now!",
  "Send your most recent photo to the group.",
  "Say 'I love you' to the last person you texted.",
 "Do 10 push-ups right now!",
  "Send your most recent photo to the group.",
  "Say 'I love you' to the last person you texted.",
  "Do your best dance move for 30 seconds.",
  "Sing a song in voice note.",
  "Pretend to be a dog for 1 minute.",
  "Post an embarrassing photo as your status.",
  "Call your crush and say 'I like you'.",
  "Let someone in the group change your nickname.",
  "Send the last photo from your gallery.",
  "Talk in an accent for the next 10 minutes.",
  "Send a selfie making a funny face.",
  "Eat something without using your hands.",
  "Change your profile pic to something silly.",
  "Send your phone battery screenshot.",
  "Confess your latest crush in the group.",
  "Text 'I’m hungry' to a random contact.",
  "Do a plank for 1 minute.",
  "Type without using the spacebar for 5 mins.",
  "Draw something and send a pic of it.",
  "Act like your favorite cartoon character.",
  "Don’t use emojis for the next 10 mins.",
  "Speak only in rhymes for 10 mins.",
  "Send a random voice note singing ABCs.",
  "Change your status to 'I’m crazy' for 1 hour.",
  "Talk like a baby for the next 5 mins.",
  "Pretend to cry and send a video.",
  "Do jumping jacks while recording yourself.",
  "Text 'I miss you' to your ex.",
  "Send a pic of your current outfit.",
  "Don’t type for the next 10 mins.",
  "Let the group choose your next status.",
  "Record yourself saying a tongue twister.",
  "Send your last 3 emojis used.",
  "Pretend to be a celebrity in voice note.",
  "Share the last video you watched.",
  "Do 15 squats on video.",
  "Post 'I’m the best' on your status.",
  "Send a meme from your gallery.",
  "Act like a teacher and scold someone.",
  "Share the oldest pic on your phone.",
  "Dance without music for 30 secs.",
  "Tell a joke in voice note.",
  "Eat something weird together.",
  "Send your search history screenshot.",
  "Do a handstand or try.",
  "Make an animal noise and send it.",
  "Type without using vowels for 3 mins.",
  "Take a silly selfie filter pic.",
  "Spin 10 times and walk straight.",
  "Send a video singing your favorite song.",
  "Post a funny gif in the group.",
  "Whisper a secret in voice note.",
  "Act like a robot for 1 minute.",
  "Eat a spoon of sugar/salt.",
  "Pretend to rap in a voice note.",
  "Post your most embarrassing pic.",
  "Say the alphabet backwards in voice note.",
  "Text 'Goodnight' to a random contact.",
  "Draw a self-portrait and send it.",
  "Wear something silly and send a pic.",
  "Don’t reply for 10 minutes.",
  "Send a pic of your shoes.",
  "Imitate someone from the group.",
  "Post a silly quote as your status.",
  "Send a screenshot of your chat list.",
  "Make a scary face selfie.",
  "Do a 10-sec TikTok dance.",
  "Pretend you’re a waiter taking orders.",
  "Send your last YouTube search.",
  "Act like a superhero for 1 min.",
  "Text 'I like you' to a random number.",
  "Post 'Feeling cute' as your status.",
  "Send your call history screenshot.",
  "Do 10 squats on video.",
  "Send a selfie without smiling.",
  "Talk only with emojis for 5 mins.",
  "Dance to a song for 20 secs.",
  "Post a funny meme on your status.",
  "Imitate your mom/dad.",
  "Whistle a song in voice note.",
  "Share your lock screen pic.",
  "Act like a baby for 1 min.",
  "Send your most recent Google search.",
  "Post 'I’m bored' as your status.",
  "Make a silly face video.",
  "Tell the group a fake secret.",
  "Send your last photo clicked.",
  "Do 20 sit-ups on video.",
  "Act like a news reporter.",
  "Send the weirdest sticker you have.",
  "Say 'banana' 20 times fast.",
  "Sing happy birthday in voice note.",
  "Send your last sent emoji.",
  "Pretend to be asleep on video.",
  "Make a love confession to a random group member.",
  "Post 'Who wants pizza?' as your status.",
  "Do a push-up challenge.",
  "Send your contact list screenshot.",
  "Say your crush’s name in voice note.",
  "Share your last WhatsApp call pic.",
  "Draw a heart and send pic.",
  "Post 'I’m in love' on status.",
  "Do 5-star jumps now!",
  "Send a silly drawing.",
  "Act like a villain in voice note.",
  "Send your favorite emoji spam.",
  "Sing a lullaby in voice note.",
  "Post 'Single and happy' status.",
  "Share your last audio file.",
  "Act like a monkey on video.",
  "Send your WhatsApp wallpaper.",
  "Write your name with nose & send pic.",
  "Say a tongue twister in voice note.",
  "Send your phone brightness screenshot.",
  "Do 10 burpees on video.",
  "Post 'I’m crazy' status.",
  "Send a selfie with funny filter.",
  "Whisper 'I’m the best' in voice note.",
  "Send your alarm screenshot.",
  "Imitate your teacher in voice note.",
  "Do 5 push-ups clapping.",
  "Sing your fav song wrongly.",
  "Post 'I love WhatsApp' on status.",
  "Send your WhatsApp about.",
  "Pretend to cry loudly in voice note.",
  "Dance with no music video.",
  "Share your last Spotify song.",
  "Send your fav emoji.",
  "Act like an animal on voice note.",
  "Post a weird fact status.",
  "Send your chat wallpaper.",
  "Pretend you’re a baby crying.",
  "Do 10 jumping jacks.",
  "Post 'I love this group!' status.",
  "Share a funny voice note.",
  "Send your fav selfie.",
  "Act like a YouTuber in video.",
  "Post 'Follow your dreams' status.",
  "Send your fav cartoon pic.",
  "Pretend to be a ghost in voice note.",
  "Do 15 push-ups now!",
  "Post your fav quote status.",
  "Send a screenshot of music player.",
  "Sing badly on purpose.",
  "Share your fav dance video.",
  "Do a TikTok move.",
  "Send a selfie with messy hair.",
  "Post 'Good vibes only' status.",
  "Send your fav food pic.",
  "Pretend to be teacher in video.",
  "Do 20 squats.",
  "Send your fav meme.",
  "Sing a random song in voice note.",
  "Post 'I’m the king/queen' status.",
  "Send your fav outfit selfie.",
  "Act like drunk in voice note.",
  "Send your fav emoji combo.",
  "Do a dance challenge.",
  "Share your last selfie.",
  "Post 'Feeling sleepy' status.",
  "Send your fav movie pic.",
  "Pretend to be DJ in voice note.",
  "Do 25 sit-ups.",
  "Post 'I love challenges!' status.",
  "Send your fav drink pic.",
  "Act like rapper in voice note.",
  "Send your fav smile selfie.",
  "Post 'Game on!' status.",
  "Send your fav shoes pic.",
  "Sing in funny voice note.",
  "Pretend to be news anchor.",
  "Do 30 jumping jacks.",
  "Post 'Best day ever!' status.",
  "Send your last drawing pic.",
  "Send random funny selfie.",
  "Pretend to be cat/dog.",
  "Post 'I’m cool' status.",
  "Send your fav stickers.",
  "Dance like crazy in video.",
  "Sing your fav chorus.",
  "Post 'Challenge accepted!' status.",
  "Send your fav throwback pic.",
  "Act like robot in video.",
  "Post 'No pain, no gain' status.",
  "Send your fav childhood photo.",
  "Do plank challenge.",
  "Send random object selfie.",
  "Sing lullaby badly.",
  "Post 'Smile always!' status.",
  "Send your fav wallpaper.",
  "Pretend to be bossy teacher.",
  "Do 10 push-ups again.",
  "Post 'Feeling awesome!' status.",
  "Send last funny emoji.",
  "Dance & send video.",
  "Post 'Life is fun!' status.",
  "Send fav song screenshot.",
  "Pretend to be angry in voice note."
];

// -------------------------
// TRUTH Command
// -------------------------
async function truthCommand(sock, chatId, message) {
  try {
    const shizokeys = 'shizo';
    const res = await fetch(`https://shizoapi.onrender.com/api/texts/truth?apikey=${shizokeys}`);
    
    let truthMessage;
    if (res.ok) {
      const json = await res.json();
      truthMessage = json.result;
    } else {
      truthMessage = localTruths[Math.floor(Math.random() * localTruths.length)];
    }

    await sock.sendMessage(chatId, { 
      image: dareImage, 
      caption: `🤔 Truth: ${truthMessage}` 
    }, { quoted: message });

  } catch (error) {
    console.error('Error in truth command:', error);
    const fallback = localTruths[Math.floor(Math.random() * localTruths.length)];
    await sock.sendMessage(chatId, { 
      image: dareImage, 
      caption: `🤔 Truth: ${fallback}` 
    }, { quoted: message });
  }
}

// -------------------------
// DARE Command
// -------------------------
async function dareCommand(sock, chatId, message) {
  try {
    const shizokeys = 'shizo';
    const res = await fetch(`https://shizoapi.onrender.com/api/texts/dare?apikey=${shizokeys}`);
    
    let dareMessage;
    if (res.ok) {
      const json = await res.json();
      dareMessage = json.result;
    } else {
      dareMessage = localDares[Math.floor(Math.random() * localDares.length)];
    }

    await sock.sendMessage(chatId, { 
      image: dareImage, 
      caption: `🔥 Dare: ${dareMessage}` 
    }, { quoted: message });

  } catch (error) {
    console.error('Error in dare command:', error);
    const fallback = localDares[Math.floor(Math.random() * localDares.length)];
    await sock.sendMessage(chatId, { 
      image: dareImage, 
      caption: `🔥 Dare: ${fallback}` 
    }, { quoted: message });
  }
}

// -------------------------
// TRUTH OR DARE Command
// -------------------------
async function truthOrDareCommand(sock, chatId, message) {
  try {
    const choice = Math.random() < 0.5 ? "truth" : "dare";
    if (choice === "truth") {
      await truthCommand(sock, chatId, message);
    } else {
      await dareCommand(sock, chatId, message);
    }
  } catch (error) {
    console.error('Error in truthOrDare command:', error);
    await sock.sendMessage(chatId, { 
      image: dareImage, 
      caption: ' Something went wrong with Truth or Dare!' 
    }, { quoted: message });
  }
}

module.exports = { truthCommand, dareCommand, truthordareCommand };