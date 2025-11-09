import axios from 'axios';

export const command = {
    name: 'devjoke',
    description: 'Get a programming joke',
    execute: async (sock, msg, args, cmd, plug, react) => {
        await react("💻");
        try {
            const { data } = await axios.get('https://official-joke-api.appspot.com/jokes/programming/random');
            // API returns a single object or an array depending on endpoint, this one usually returns array of 1
            const joke = Array.isArray(data) ? data[0] : data;

            await sock.sendMessage(msg.key.remoteJid, { 
                text: `💻 *Dev Joke*\n\n❓ ${joke.setup}\n\n📢 ${joke.punchline}` 
            });
            await react("😆");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ 404 Joke Not Found.' });
        }
    }
};