import axios from 'axios';

export const command = {
    name: 'convert',
    description: 'Convert currency: .convert 100 USD KES',
    execute: async (sock, msg, args) => {
        if (args.length < 3) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .convert <amount> <from> <to>\nExample: .convert 50 USD KES' });

        const amount = parseFloat(args[0]);
        const from = args[1].toUpperCase();
        const to = args[2].toUpperCase();

        try {
            // Free API for exchange rates
            const { data } = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
            const rate = data.rates[to];

            if (!rate) {
                return await sock.sendMessage(msg.key.remoteJid, { text: `❌ Currency code "${to}" not found.` });
            }

            const result = (amount * rate).toFixed(2);
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `💱 *Currency Converter*\n\n${amount} ${from} = *${result} ${to}*\n_Rate: 1 ${from} = ${rate} ${to}_` 
            }, { quoted: msg });

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: `❌ Failed to fetch rates for "${from}". Ensure the code is correct (e.g., USD, EUR, KES).` });
        }
    }
};