import axios from 'axios';

export const command = {
    name: 'ud',
    description: 'Look up slang on Urban Dictionary: .ud yeet',
    execute: async (sock, msg, args) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .ud <slang term>' });

        const term = args.join(' ');
        try {
            const { data } = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`);
            
            if (!data.list || data.list.length === 0) {
                return await sock.sendMessage(msg.key.remoteJid, { text: '❌ No definition found.' });
            }

            // Get the top result
            const def = data.list[0];
            // Clean up brackets [] that UD uses for links
            const definition = def.definition.replace(/\[|\]/g, '');
            const example = def.example.replace(/\[|\]/g, '');

            const responseText = `📖 *Urban Dictionary: "${def.word}"*\n\n` +
                                 `*Definition:*\n${definition}\n\n` +
                                 `*Example:*\n_${example}_`;

            await sock.sendMessage(msg.key.remoteJid, { text: responseText });

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch definition.' });
        }
    }
};