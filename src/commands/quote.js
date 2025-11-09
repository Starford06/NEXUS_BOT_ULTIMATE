// src/commands/quote.js
const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "Dream big and dare to fail. - Norman Vaughan"
];

export const command = {
    name: 'quote',
    description: 'Sends an inspirational quote',
    execute: async (sock, msg, args) => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        await sock.sendMessage(msg.key.remoteJid, { text: `✨ "${randomQuote}"` });
    }
};