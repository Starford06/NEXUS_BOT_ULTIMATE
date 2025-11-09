import axios from 'axios';

export const command = {
    name: 'lorem',
    description: 'Generate placeholder text: .lorem (defaults to 2 paragraphs)',
    execute: async (sock, msg, args, cmd, plug, react) => {
        // Default to 2 paragraphs, max 5 to avoid spam
        let paras = parseInt(args[0]) || 2;
        if (paras > 5) paras = 5;
        if (paras < 1) paras = 1;

        await react("📄");

        try {
            // Bacon Ipsum is a reliable, free JSON API for this
            const { data } = await axios.get(`https://baconipsum.com/api/?type=all-meat&paras=${paras}&start-with-lorem=1`);
            
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `📄 *Lorem Ipsum (${paras} paras)*\n\n${data.join('\n\n')}` 
            });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to generate text.' });
        }
    }
};