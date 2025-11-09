import axios from 'axios';

export const command = {
    name: 'true',
    description: 'Truecaller lookup: .true +2547...',
    execute: async (sock, msg, args) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .true <phone number with country code>' });

        const number = args[0].replace(/[^0-9]/g, '');
        await sock.sendMessage(msg.key.remoteJid, { react: { text: "🔍", key: msg.key } });

        try {
            // This is a common free API endpoint for Truecaller lookups.
            // If it stops working, you may need to find a new one.
            const { data } = await axios.get(`https://api.p.2chat.io/open/truecaller?phone=${number}`);
            
            if (!data || !data.name) {
                return await sock.sendMessage(msg.key.remoteJid, { text: '❌ No results found.' });
            }

            const text = `👤 *Truecaller Result* 👤\n\n` +
                         `*Name:* ${data.name}\n` +
                         `*Carrier:* ${data.carrier || 'Unknown'}\n` +
                         `*Location:* ${data.location || 'Unknown'}`;

            await sock.sendMessage(msg.key.remoteJid, { text: text });

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Lookup failed. API might be busy.' });
        }
    }
};