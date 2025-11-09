import axios from 'axios';

export const command = {
    name: 'country',
    description: 'Get country info: .country Kenya',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide a country name.' });

        await react("🏳️");
        try {
            const { data } = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(args.join(' '))}?fullText=true`);
            
            if (!data || data.length === 0) throw new Error("Not found");
            const c = data[0];

            const text = `🏳️ *${c.name.common} (${c.cca2})*\n\n` +
                         `🏛️ *Capital:* ${c.capital ? c.capital[0] : 'N/A'}\n` +
                         `👥 *Population:* ${c.population.toLocaleString()}\n` +
                         `🌍 *Region:* ${c.region} (${c.subregion})\n` +
                         `🗣️ *Languages:* ${Object.values(c.languages || {}).join(', ')}\n` +
                         `💰 *Currency:* ${Object.keys(c.currencies || {})[0]}`;

            await sock.sendMessage(msg.key.remoteJid, { 
                image: { url: c.flags.png }, 
                caption: text 
            }, { quoted: msg });
            await react("✅");

        } catch (e) {
            // Try fuzzy search if full text failed
            try {
                 const { data: fuzzy } = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(args.join(' '))}`);
                 if (fuzzy && fuzzy.length > 0) {
                     await sock.sendMessage(msg.key.remoteJid, { text: `❌ Did you mean: *${fuzzy[0].name.common}*?` });
                     return;
                 }
            } catch (err) {}
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Country not found.' });
        }
    }
};