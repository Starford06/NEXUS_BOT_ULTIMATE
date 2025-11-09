import axios from 'axios';

export const command = {
    name: 'news',
    description: 'Get top 5 news headlines',
    execute: async (sock, msg, args, cmd, plug, react) => {
        await react("📰");
        try {
            // Using a free public mirror of NewsAPI for demonstration
            const { data } = await axios.get('https://saurav.tech/NewsAPI/top-headlines/category/general/us.json');
            const articles = data.articles.slice(0, 5);

            let text = `📰 *Top News Headlines*\n\n`;
            articles.forEach((art, i) => {
                text += `*${i+1}.* ${art.title}\n`;
                text += `🔗 ${art.url}\n\n`;
            });

            await sock.sendMessage(msg.key.remoteJid, { text });
            await react("✅");
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch news.' });
        }
    }
};