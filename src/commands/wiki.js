import wiki from 'wikipedia';

export const command = {
    name: 'wiki',
    description: 'Search Wikipedia',
    execute: async (sock, msg, args, cmd, plug, react) => { // Added 'react'
        if (args.length === 0) {
            return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .wiki <search term>' });
        }

        await react("📚"); // Added reaction
        const query = args.join(' ');
        try {
            const page = await wiki.page(query);
            const summary = await page.summary();

            const text = `📚 *${summary.title}*\n\n${summary.extract}\n\n🔗 _${summary.content_urls.desktop.page}_`;
            await sock.sendMessage(msg.key.remoteJid, { text: text });
            await react("✅"); // Added success reaction
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ No results found.' });
            await react("❌"); // Added fail reaction
        }
    }
};