import axios from 'axios';

export const command = {
    name: 'ip',
    description: 'Geolocate an IP address: .ip 8.8.8.8',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide an IP address.' });

        await react("🌐");
        try {
            const { data } = await axios.get(`http://ip-api.com/json/${args[0]}?fields=status,message,country,regionName,city,isp,org,as,query`);
            
            if (data.status === 'fail') {
                await sock.sendMessage(msg.key.remoteJid, { text: `❌ Lookup failed: ${data.message}` });
                return;
            }

            const text = `🌐 *IP Lookup: ${data.query}*\n\n` +
                         `🏳️ *Country:* ${data.country}\n` +
                         `🏙️ *Region:* ${data.regionName}, ${data.city}\n` +
                         `🏢 *ISP:* ${data.isp}\n` +
                         `📡 *Org:* ${data.org}`;

            await sock.sendMessage(msg.key.remoteJid, { text });
            await react("✅");
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ IP lookup service unavailable.' });
        }
    }
};