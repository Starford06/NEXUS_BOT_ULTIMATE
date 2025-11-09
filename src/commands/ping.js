export const command = {
    name: 'ping',
    description: 'Checks if bot is online',
    execute: async (sock, msg, args) => {
        const start = Date.now();
        await sock.sendMessage(msg.key.remoteJid, { react: { text: "🏓", key: msg.key } });
        const end = Date.now();
        await sock.sendMessage(msg.key.remoteJid, { text: `*Pong!* 🤖\nLatency: ${end - start}ms` });
    }
};