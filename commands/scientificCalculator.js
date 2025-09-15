/**
 * PRINCE FAVE MDX - WhatsApp Bot
 * Scientific Calculator Command
 * 
 * Usage: .scalc 2^3 or .scalc sqrt(16)
 * Supports: +, -, *, /, %, ^, sqrt(), sin(), cos(), tan(), log(), ln()
 * 
 * Copyright (c) 2025 C.O TECH
 */

async function scientificCalculatorCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        let input = text.replace('.scalc', '').trim();

        if (!input) {
            return await sock.sendMessage(chatId, { 
                text: '❌ Please provide an expression to calculate.\nExample: *.scalc 2^3*'
            }, { quoted: message });
        }

        // Replace ^ with ** for exponentiation 
        input = input.replace(/\^/g, '**');

        // Replace sqrt(), sin(), cos(), tan(), log(), ln() with Math functions
        input = input.replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
                     .replace(/sin\(([^)]+)\)/g, 'Math.sin(($1)*Math.PI/180)') // degrees to radians
                     .replace(/cos\(([^)]+)\)/g, 'Math.cos(($1)*Math.PI/180)')
                     .replace(/tan\(([^)]+)\)/g, 'Math.tan(($1)*Math.PI/180)')
                     .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
                     .replace(/ln\(([^)]+)\)/g, 'Math.log($1)');

        // Validate safe characters
        if (!/^[0-9+\-*/().%Math\s**]+$/.test(input)) {
            return await sock.sendMessage(chatId, { 
                text: '❌ Invalid characters detected! Only numbers, operators and supported functions are allowed.'
            }, { quoted: message });
        }

        let result;
        try {
            result = eval(input);
        } catch (err) {
            return await sock.sendMessage(chatId, { 
                text: '❌ Error evaluating the expression. Check your syntax.'
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { 
            text: `🧪 *Scientific Calculator*\n\nExpression: ${text.replace('.scalc', '').trim()}\nResult: ${result}`
        }, { quoted: message });

    } catch (err) {
        console.error(err);
        await sock.sendMessage(chatId, { text: '❌ Something went wrong.' }, { quoted: message });
    }
}

module.exports = { scientificCalculatorCommand };
