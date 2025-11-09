import axios from 'axios';

export const command = {
    name: 'npm',
    description: 'Search for an NPM package: .npm baileys',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide a package name.' });

        await react("📦");
        const query = args.join(' ');

        try {
            const { data } = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(query.toLowerCase())}`);
            
            if (data.error) {
                await sock.sendMessage(msg.key.remoteJid, { text: '❌ Package not found.' });
                await react("❓");
                return;
            }

            const latest = data['dist-tags'].latest;
            const versionInfo = data.versions[latest];
            
            const text = `📦 *NPM Package: ${data.name}*\n\n` +
                         `🔖 *Latest:* v${latest}\n` +
                         `📄 *License:* ${data.license || 'Unknown'}\n` +
                         `👤 *Author:* ${data.author?.name || 'Unknown'}\n\n` +
                         `📝 *Description:*\n${data.description}\n\n` +
                         `⬇️ *Install:* \`npm i ${data.name}\`\n` +
                         `🔗 *Link:* https://npmjs.com/package/${data.name}`;

            await sock.sendMessage(msg.key.remoteJid, { text });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Package not found or registry error.' });
            await react("❌");
        }
    }
};