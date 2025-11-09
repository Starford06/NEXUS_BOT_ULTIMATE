export const command = {
    name: 'flip',
    description: 'Flip a coin',
    execute: async (sock, msg, args, cmd, plug, react) => {
        await react("🪙");
        const outcome = Math.random() > 0.5 ? 'Heads' : 'Tails';
        await sock.sendMessage(msg.key.remoteJid, { text: `🪙 *Coin Flip:*\n\nIt's **${outcome}**!` }, { quoted: msg });
    }
};