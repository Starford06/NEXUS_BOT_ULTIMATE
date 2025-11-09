import dns from 'dns/promises';

export const command = {
    name: 'dns',
    description: 'Lookup domain IP: .dns google.com',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide a domain name.' });

        const domain = args[0].replace('https://', '').replace('http://', '').split('/')[0];
        await react("🔎");

        try {
            const addresses = await dns.resolve4(domain);
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `🌐 *DNS Lookup (${domain})*\n\n*A Records (IPv4):*\n${addresses.join('\n')}` 
            });
            await react("✅");
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: `❌ Could not resolve domain. It might be invalid or down.` });
        }
    }
};