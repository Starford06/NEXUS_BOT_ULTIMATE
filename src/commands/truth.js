const truths = [
    "What is your biggest fear?", "Have you ever lied to your best friend?", 
    "What is your most embarrassing moment?", "Who is your secret crush?", 
    "What is the worst gift you have ever received?"
];
export const command = {
    name: 'truth', description: 'Get a Truth question',
    execute: async (sock, msg, args) => {
        const t = truths[Math.floor(Math.random() * truths.length)];
        await sock.sendMessage(msg.key.remoteJid, { text: `🤫 *TRUTH:* ${t}` });
    }
};