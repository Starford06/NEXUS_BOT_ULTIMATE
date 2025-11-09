export const command = {
    name: 'tagall',
    description: 'Mentions everyone in the group',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;
        if (!remoteJid.endsWith('@g.us')) return; // Group only

        // 1. Fetch group metadata to get participant list
        const groupMetadata = await sock.groupMetadata(remoteJid);
        const participants = groupMetadata.participants;

        // 2. Create the message text and mention array
        let text = `📢 *ATTENTION EVERYONE* 📢\n\n`;
        const mentions = [];

        for (const participant of participants) {
            text += `@${participant.id.split('@')[0]} `;
            mentions.push(participant.id);
        }

        // 3. Send with mentions
        await sock.sendMessage(remoteJid, { 
            text: text, 
            mentions: mentions 
        });
    }
};