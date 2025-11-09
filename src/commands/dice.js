export const command = {
    name: 'dice',
    description: 'Roll a 6-sided die',
    execute: async (sock, msg, args) => {
        const roll = Math.floor(Math.random() * 6) + 1;
        await sock.sendMessage(msg.key.remoteJid, { text: `🎲 You rolled a *${roll}*!` });
    }
};