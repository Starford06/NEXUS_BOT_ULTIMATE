export const command = {
    name: 'promote',
    description: 'Promotes replied user to Admin (Bot must be admin)',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;
        if (!remoteJid.endsWith('@g.us')) return await sock.sendMessage(remoteJid, { text: '❌ This command is group-only.' });

        const targetUser = msg.message?.extendedTextMessage?.contextInfo?.participant;
        if (!targetUser) return await sock.sendMessage(remoteJid, { text: '❌ Please reply to the user you want to promote.' });

        try {
            await sock.groupParticipantsUpdate(remoteJid, [targetUser], 'promote');
            await sock.sendMessage(remoteJid, { text: `👑 @${targetUser.split('@')[0]} has been promoted!`, mentions: [targetUser] });
        } catch (e) {
            await sock.sendMessage(remoteJid, { text: '❌ Failed to promote. Ensure I am a group admin.' });
        }
    }
};