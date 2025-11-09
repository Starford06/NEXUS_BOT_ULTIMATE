export const command = {
    name: 'demote',
    description: 'Demotes replied admin to user (Bot must be admin)',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;
        if (!remoteJid.endsWith('@g.us')) return await sock.sendMessage(remoteJid, { text: '❌ This command is group-only.' });

        const targetUser = msg.message?.extendedTextMessage?.contextInfo?.participant;
        if (!targetUser) return await sock.sendMessage(remoteJid, { text: '❌ Please reply to the user you want to demote.' });

        try {
            await sock.groupParticipantsUpdate(remoteJid, [targetUser], 'demote');
            await sock.sendMessage(remoteJid, { text: `🔻 @${targetUser.split('@')[0]} has been demoted.`, mentions: [targetUser] });
        } catch (e) {
            await sock.sendMessage(remoteJid, { text: '❌ Failed to demote. Ensure I am a group admin.' });
        }
    }
};