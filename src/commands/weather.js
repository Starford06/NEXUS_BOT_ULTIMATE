export const command = {
    name: 'weather',
    description: 'Check weather for a city',
    execute: async (sock, msg, args) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .weather Nairobi' });

        const city = args.join('+');
        // format=3 gives a nice one-line summary
        const url = `https://wttr.in/${city}?format=3`;

        try {
            const response = await fetch(url);
            const text = await response.text();

            if (text.includes('Unknown location')) {
                 return await sock.sendMessage(msg.key.remoteJid, { text: '❌ City not found.' });
            }

            await sock.sendMessage(msg.key.remoteJid, { text: `🌤️ *Weather Report:*\n${text.trim()}` });
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Weather service unavailable.' });
        }
    }
};