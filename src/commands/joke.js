import axios from 'axios';

export const command = {
    name: 'joke',
    description: 'Tells a random dad joke',
    execute: async (sock, msg, args) => {
        try {
            const { data } = await axios.get('https://icanhazdadjoke.com/', {
                headers: { 'Accept': 'application/json' } // Essential header to get JSON instead of HTML
            });

            await sock.sendMessage(msg.key.remoteJid, { text: `🤡 *Dad Joke:*\n\n${data.joke}` });

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ I seem to have run out of jokes.' });
        }
    }
};