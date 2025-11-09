import { jidNormalizedUser } from '@whiskeysockets/baileys';

export const command = {
    name: 'kick',
    description: 'Kick a user from the group (Admin only)',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const remoteJid = msg.key.remoteJid;
        /*
        // 🛡️ SECURITY LOCK 🛡️

        const sender = msg.key.participant || msg.key.remoteJid;
        if (sender !== global.OWNER_ID) {
             await react("⛔");
             return await sock.sendMessage(remoteJid, { text: '⛔ Owner only.' });
        }
       */
    
        if (!remoteJid.endsWith('@g.us')) return await sock.sendMessage(remoteJid, { text: '❌ Groups only.' });

        // 1. Get Target (Reply or Mention)
        const target = msg.message?.extendedTextMessage?.contextInfo?.participant || 
                       msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (!target) return await sock.sendMessage(remoteJid, { text: '❌ Reply to someone to kick them.' });

        // Prevent kicking the bot itself
        const botJid = jidNormalizedUser(sock.user.id);
        if (target === botJid) return await sock.sendMessage(remoteJid, { text: '❌ I cannot kick myself.' });

        await react("🥾");

        try {
            // 2. Attempt Kick
            await sock.groupParticipantsUpdate(remoteJid, [target], 'remove');
            await sock.sendMessage(remoteJid, { text: `👋 @${target.split('@')[0]} has been kicked.`, mentions: [target] });
            await react("✅");

        } catch (e) {
            console.error("Kick Error:", e);
            await sock.sendMessage(remoteJid, { text: '❌ Failed to kick. Make sure I am an Admin.' });
            await react("❌");
        }
    }
};