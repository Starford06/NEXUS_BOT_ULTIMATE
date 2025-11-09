import axios from 'axios';

export const command = {
    name: 'nasa',
    description: 'Get NASA Picture of the Day',
    execute: async (sock, msg, args, cmd, plug, react) => {
        await react("🌌");
        try {
            // DEMO_KEY is provided by NASA for low-volume testing. 
            // It works fine for a personal bot.
            const { data } = await axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');

            if (data.media_type === 'image') {
                await sock.sendMessage(msg.key.remoteJid, { 
                    image: { url: data.url },
                    caption: `🌌 *${data.title}*\n\n_${data.date}_\n\n${data.explanation}`
                }, { quoted: msg });
            } else {
                // Sometimes it's a video (YouTube link)
                await sock.sendMessage(msg.key.remoteJid, { 
                    text: `🌌 *${data.title}*\n\n${data.explanation}\n\n📺 Video: ${data.url}` 
                });
            }
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ NASA API is currently unavailable.' });
        }
    }
};