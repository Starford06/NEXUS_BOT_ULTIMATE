import axios from 'axios';

export const command = {
    name: 'advice',
    description: 'Get a random piece of advice',
    execute: async (sock, msg, args, cmd, plug, react) => {
        await react("🧠");
        try {
            // The API sometimes caches heavily, so we add a random number to the URL to get fresh advice
            const { data } = await axios.get(`https://api.adviceslip.com/advice?t=${Math.random()}`);
            
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `💡 *Advice #${data.slip.id}:*\n\n"${data.slip.advice}"` 
            });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to get advice.' });
        }
    }
};