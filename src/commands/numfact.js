import axios from 'axios';

export const command = {
    name: 'numfact',
    description: 'Get a fact about a number: .numfact 42',
    execute: async (sock, msg, args, cmd, plug, react) => {
        let number = 'random';
        if (args.length > 0 && !isNaN(args[0])) {
            number = args[0];
        }

        await react("🔢");
        try {
            // The Numbers API returns plain text by default
            const { data } = await axios.get(`http://numbersapi.com/${number}/trivia`);
            await sock.sendMessage(msg.key.remoteJid, { text: `🔢 *Number Fact:*\n\n${data}` });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Could not find a fact for that.' });
        }
    }
};