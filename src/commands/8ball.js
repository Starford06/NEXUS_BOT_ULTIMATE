const answers = ["Yes, definitely.", "It is certain.", "Reply hazy, try again.", "Ask again later.", "Don't count on it.", "My sources say no."];

export const command = {
    name: '8ball',
    description: 'Ask a Yes/No question',
    execute: async (sock, msg, args) => {
        if (args.length === 0) {
            await sock.sendMessage(msg.key.remoteJid, { text: "❓ You must ask a question! (e.g., !8ball Am I cool?)" });
            return;
        }
        const answer = answers[Math.floor(Math.random() * answers.length)];
        await sock.sendMessage(msg.key.remoteJid, { text: `🔮 *Magic 8-Ball says:*\n${answer}` });
    }
};