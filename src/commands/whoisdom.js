import axios from 'axios';

export const command = {
    name: 'whoisdom',
    description: 'Domain WHOIS lookup: .whoisdom google.com',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide a domain name.' });

        const domain = args[0].replace(/(^\w+:|^)\/\//, '');
        await react("🗃️");

        try {
            // Using a free public RDAP/WHOIS JSON API
            const { data } = await axios.get(`https://rdap.org/domain/${domain}`);

            const handle = data.handle || 'N/A';
            // Try to find relevant events (registration, expiration)
            const created = data.events?.find(e => e.eventAction === 'registration')?.eventDate || 'Unknown';
            const expires = data.events?.find(e => e.eventAction === 'expiration')?.eventDate || 'Unknown';
            const registrar = data.entities?.find(e => e.roles.includes('registrar'))?.vcardArray[1]?.find(i => i[0] === 'fn')?.[3] || 'Unknown';

            const text = `🗃️ *WHOIS: ${domain.toUpperCase()}*\n\n` +
                         `🏷️ *Registrar:* ${registrar}\n` +
                         `📅 *Created:* ${new Date(created).toLocaleDateString()}\n` +
                         `⏳ *Expires:* ${new Date(expires).toLocaleDateString()}\n` +
                         `🆔 *Handle:* ${handle}`;

            await sock.sendMessage(msg.key.remoteJid, { text });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ WHOIS data not found or private.' });
        }
    }
};