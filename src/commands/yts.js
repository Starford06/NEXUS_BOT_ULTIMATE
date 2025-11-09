import yts from 'yt-search';

export const command = {
    name: 'yts',
    description: 'Search YouTube: .yts funny cats',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide a search query.' });

        await react("🔍");

        try {
            const result = await yts(args.join(' '));
            const videos = result.videos.slice(0, 5); // Get top 5

            let text = `📺 *YouTube Search Results*\n\n`;
            videos.forEach((v, i) => {
                text += `*${i + 1}. ${v.title}*\n`;
                text += `🕒 ${v.timestamp} | 👀 ${v.views}\n`;
                text += `🔗 ${v.url}\n\n`;
            });

            // Send the thumbnail of the first result along with the list
            await sock.sendMessage(msg.key.remoteJid, { 
                image: { url: videos[0].thumbnail },
                caption: text
            });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Search failed.' });
        }
    }
};