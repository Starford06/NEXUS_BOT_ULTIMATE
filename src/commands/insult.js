import axios from 'axios';

export const command = {
    name: 'insult',
    description: 'Generate a sophisticated insult',
    execute: async (sock, msg, args, cmd, plug, react) => {
        await react("📜");
        try {
            // A fun, free API for creative insults
            const { data } = await axios.get('https://evilinsult.com/generate_insult.php?lang=en&type=json');
            
            await sock.sendMessage(msg.key.remoteJid, { text: `📜 *Thou art...*\n\n"${data.insult}"` });
            await react("✅");

        } catch (e) {
             await sock.sendMessage(msg.key.remoteJid, { text: '❌ I cannot insult thee right now.' });
        }
    }
};