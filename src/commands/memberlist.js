export const command = {
    name: 'memberlist',
    description: 'Extract raw phone numbers (e.g., 2547...) from group',
    execute: async (sock, msg, args, cmd, plug, react) => {
        let targetJid = msg.key.remoteJid;

        // Support for remote extraction via DM
        if (targetJid.endsWith('@s.whatsapp.net')) {
            if (args.length === 0) return await sock.sendMessage(targetJid, { text: '❌ In DM, provide Group ID: `.memberlist <id>`' });
            targetJid = args[0];
        }

        if (!targetJid.includes('@g.us')) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Target must be a group.' });

        await react("📋");

        try {
            const metadata = await sock.groupMetadata(targetJid);
            const participants = metadata.participants;
            
            // Extract JUST the number part before the '@'
            const phoneList = participants.map(p => p.id.split('@')[0]);

            const text = `📋 *Member List: ${metadata.subject}*\n` +
                         `🔢 *Total:* ${phoneList.length}\n\n` +
                         `\`\`\`${phoneList.join('\n')}\`\`\``;

            await sock.sendMessage(msg.key.remoteJid, { text });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch members. Check Group ID.' });
        }
    }
};