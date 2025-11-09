import axios from 'axios';
import { decode } from 'html-entities';

export const command = {
    name: 'so',
    description: 'Search StackOverflow: .so javascript array filter',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide a coding question.' });

        await react("🥞");
        try {
            const { data } = await axios.get(`https://api.stackexchange.com/2.3/search/advanced`, {
                params: {
                    order: 'desc',
                    sort: 'relevance',
                    q: args.join(' '),
                    site: 'stackoverflow',
                    filter: '!b1MME4l0eF)416' // Custom filter to get body snippets
                }
            });

            if (data.items.length === 0) {
                await sock.sendMessage(msg.key.remoteJid, { text: '❌ No results found.' });
                return;
            }

            const top = data.items.slice(0, 3);
            let text = `🥞 *StackOverflow Results*\n\n`;
            top.forEach((item, i) => {
                text += `*${i+1}. ${decode(item.title)}*\n`;
                text += `👍 ${item.score} | 💬 ${item.answer_count} answers\n`;
                text += `🔗 ${item.link}\n\n`;
            });

            await sock.sendMessage(msg.key.remoteJid, { text });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to search StackOverflow.' });
        }
    }
};