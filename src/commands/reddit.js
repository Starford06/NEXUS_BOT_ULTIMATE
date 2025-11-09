import axios from 'axios';

export const command = {
    name: 'reddit',
    description: 'Fetch a random post from a subreddit: .reddit funny',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .reddit <subreddit name>' });

        await react("👾");
        const subreddit = args[0];

        try {
            // Using a public meme API that scrapes Reddit cleanly
            const { data } = await axios.get(`https://meme-api.com/gimme/${subreddit}`);

            if (data.code) { // API returns a 'code' property on error
                 return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Subreddit not found or is private.' });
            }

            const caption = `👾 *r/${data.subreddit}*\n` +
                            `🗣️ *${data.title}*\n` +
                            `👍 ${data.ups} | 👤 u/${data.author}\n` +
                            `🔗 ${data.postLink}`;

            // If it's an image/gif, send it as media
            if (data.url.match(/\.(jpg|jpeg|png|gif)$/i)) {
                await sock.sendMessage(msg.key.remoteJid, { image: { url: data.url }, caption: caption }, { quoted: msg });
            } else {
                // If it's just text or a weird link, send just the caption
                await sock.sendMessage(msg.key.remoteJid, { text: caption });
            }
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch from Reddit.' });
        }
    }
};