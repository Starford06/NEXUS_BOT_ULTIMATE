export const command = {
    name: 'lmgtfy',
    description: 'Generate sarcastic Google link: .lmgtfy how to tie shoes',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ What should I Google for you?' });

        const query = encodeURIComponent(args.join(' '));
        const url = `https://letmegooglethat.com/?q=${query}`;

        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🙄 *Here, let me Google that for you:*\n\n${url}` 
        });
        await react("✅");
    }
};