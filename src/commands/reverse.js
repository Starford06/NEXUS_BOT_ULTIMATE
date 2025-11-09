export const command = {
    name: 'reverse',
    description: 'Reverse text: .reverse hello',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide text to reverse.' });

        const text = args.join(' ');
        const reversed = text.split('').reverse().join('');

        await sock.sendMessage(msg.key.remoteJid, { text: `🔄 *Reversed:*\n\n${reversed}` });
        await react("✅");
    }
};