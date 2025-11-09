import axios from 'axios';

export const command = {
    name: 'hacker',
    description: 'Top 5 Hacker News stories',
    execute: async (sock, msg, args, cmd, plug, react) => {
        await react("👨‍💻");
        try {
            // 1. Get top 500 IDs
            const { data: topIds } = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
            // 2. Take top 5
            const top5 = topIds.slice(0, 5);
            
            let text = `👨‍💻 *Hacker News Top 5*\n\n`;

            // 3. Fetch details for each in parallel for speed
            // We use Promise.all to wait for all 5 requests to finish at once
            const storyPromises = top5.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
            const stories = await Promise.all(storyPromises);

            stories.forEach((s, i) => {
                const story = s.data;
                text += `*${i+1}. ${story.title}*\n`;
                text += `⬆️ ${story.score} | 🔗 ${story.url || '(No link)'}\n\n`;
            });

            await sock.sendMessage(msg.key.remoteJid, { text });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch Hacker News.' });
        }
    }
};