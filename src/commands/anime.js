import axios from 'axios';

export const command = {
    name: 'anime',
    description: 'Get a random anime quote',
    execute: async (sock, msg, args, cmd, plug, react) => {
        await react("🍥");
        try {
            const { data } = await axios.get('https://animechan.xyz/api/random');
            
            const text = `🗯️ *Anime Quote*\n\n` +
                         `"${data.quote}"\n\n` +
                         `— *${data.character}* (${data.anime})`;

            await sock.sendMessage(msg.key.remoteJid, { text });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch an anime quote.' });
        }
    }
};