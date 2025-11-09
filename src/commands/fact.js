import axios from 'axios';

export const command = {
    name: 'fact',
    description: 'Get a random useless fact',
    execute: async (sock, msg, args) => {
        try {
            const { data } = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
            await sock.sendMessage(msg.key.remoteJid, { text: `🧠 *Did you know?*\n\n${data.text}` });
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch fact.' });
        }
    }
};