import axios from 'axios';

export const command = {
    name: 'define',
    description: 'Define a word: .define surreal',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .define <word>' });

        const word = args[0];
        await react("📖");

        try {
            const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const entry = data[0];
            const meaning = entry.meanings[0];
            const def = meaning.definitions[0].definition;
            const example = meaning.definitions[0].example || 'No example available.';

            const text = `📚 *Definition: ${entry.word}*\n` +
                         `_(${meaning.partOfSpeech})_\n\n` +
                         `*Meaning:* ${def}\n\n` +
                         `*Example:* "${example}"`;

            await sock.sendMessage(msg.key.remoteJid, { text });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Word not found.' });
            await react("❌");
        }
    }
};