export const command = {
    name: 'del',
    description: 'Delete a message (Reply to it). Requires Admin for others messages.',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const remoteJid = msg.key.remoteJid;
        // 🛡️ SECURITY LOCK 🛡️
        const sender = msg.key.participant || msg.key.remoteJid;
        if (sender !== global.OWNER_ID) {
            await react("⛔");
            return await sock.sendMessage(msg.key.remoteJid, { text: '⛔ Permission Denied: Owner only.' }, { quoted: msg });
        }
        const quoted = msg.message?.extendedTextMessage?.contextInfo;

        if (!quoted) {
            return await sock.sendMessage(remoteJid, { text: '❌ Reply to the message you want to delete with .del' });
        }

        try {
            await react("🚮");
            
            // Determine if the message was sent by the bot itself
            // sock.user.id format is sometimes "12345:9@s.whatsapp.net", we need just "12345"
            const botNumber = sock.user.id.split(':')[0];
            const isFromMe = quoted.participant.includes(botNumber);

            // Construct the precise key needed to delete the message
            const keyToDelete = {
                remoteJid: remoteJid,
                fromMe: isFromMe,
                id: quoted.stanzaId,
                participant: quoted.participant
            };

            await sock.sendMessage(remoteJid, { delete: keyToDelete });

        } catch (e) {
            console.error("Delete Error:", e);
            await sock.sendMessage(remoteJid, { text: '❌ Failed to delete. Make sure I am an Admin and the message is not too old.' });
        }
    }
};