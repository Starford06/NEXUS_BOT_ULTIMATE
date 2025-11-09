import axios from 'axios';

export const command = {
    name: 'geek',
    description: 'Get a nerdy joke',
    execute: async (sock, msg, args, cmd, plug, react) => {
        await react("🤓");
        try {
            const { data } = await axios.get('https://geek-jokes.sameerkumar.website/api?format=json');
            await sock.sendMessage(msg.key.remoteJid, { text: `🤓 *Geek Joke:*\n\n${data.joke}` });
            await react("😆");
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ 404 Joke Not Found.' });
        }
    }
};