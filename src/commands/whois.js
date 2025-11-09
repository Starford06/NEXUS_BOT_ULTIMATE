export const command = {
    name: 'whois',
    description: 'Randomly pick someone in the group: .whois is the imposter',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const remoteJid = msg.key.remoteJid;
        if (!remoteJid.endsWith('@g.us')) return await sock.sendMessage(remoteJid, { text: '❌ Group command only.' });

        if (args.length === 0) return await sock.sendMessage(remoteJid, { text: '❌ Usage: .whois <something>' });

        await react("🎲");
        try {
            const metadata = await sock.groupMetadata(remoteJid);
            const participants = metadata.participants;
            // Pick a random participant
            const randomUser = participants[Math.floor(Math.random() * participants.length)];

            const text = `👉 *WHO IS...*\n\n` +
                         `QUESTION: Who ${args.join(' ')}?\n` +
                         `ANSWER: It's @${randomUser.id.split('@')[0]}!`;

            await sock.sendMessage(remoteJid, { 
                text: text, 
                mentions: [randomUser.id] 
            });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(remoteJid, { text: '❌ Failed to fetch group members.' });
        }
    }
};