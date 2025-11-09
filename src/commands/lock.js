export const command = {
    name: 'lock',
    description: 'Lock group chat (Admins only)',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;
        if (!remoteJid.endsWith('@g.us')) return await sock.sendMessage(remoteJid, { text: '❌ Group command only.' });
        try {
            await sock.groupSettingUpdate(remoteJid, 'announcement');
            await sock.sendMessage(remoteJid, { text: '🔒 *Group Locked* (Only admins can text)' });
        } catch (e) {
            await sock.sendMessage(remoteJid, { text: '❌ Failed. Ensure I am an admin.' });
        }
    }
};