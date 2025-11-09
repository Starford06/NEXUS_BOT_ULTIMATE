import axios from 'axios';

export const command = {
    name: 'rhyme',
    description: 'Find rhyming words: .rhyme cat',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide a word.' });

        await react("🎵");
        try {
            // Datamuse API (Free, no key required)
            const { data } = await axios.get(`https://api.datamuse.com/words?rel_rhy=${args[0]}&max=20`);
            
            if (data.length === 0) {
                await sock.sendMessage(msg.key.remoteJid, { text: '❌ No rhymes found.' });
                return;
            }

            const words = data.map(obj => obj.word).join(', ');
            await sock.sendMessage(msg.key.remoteJid, { text: `🎵 *Rhymes for "${args[0]}":*\n\n${words}` });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch rhymes.' });
        }
    }
};