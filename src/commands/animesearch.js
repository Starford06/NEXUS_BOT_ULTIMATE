import axios from 'axios';

export const command = {
    name: 'animesearch',
    description: 'Search for anime details: .animesearch Naruto',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide an anime name.' });

        await react("⛩️");
        try {
            // Jikan API (Unofficial MyAnimeList API)
            const { data } = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(args.join(' '))}&limit=1`);
            const anime = data.data[0];

            if (!anime) {
                await sock.sendMessage(msg.key.remoteJid, { text: '❌ Anime not found.' });
                return;
            }

            const caption = `⛩️ *${anime.title}* ⛩️\n\n` +
                            `⭐ *Score:* ${anime.score}/10\n` +
                            `📺 *Episodes:* ${anime.episodes || 'Unknown'}\n` +
                            `📅 *Aired:* ${anime.aired.string}\n\n` +
                            `📝 *Synopsis:* ${anime.synopsis?.substring(0, 300)}...`;

            await sock.sendMessage(msg.key.remoteJid, { 
                image: { url: anime.images.jpg.large_image_url },
                caption: caption
            }, { quoted: msg });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Anime search failed.' });
        }
    }
};