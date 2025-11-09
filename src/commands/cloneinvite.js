import { delay, jidNormalizedUser } from '@whiskeysockets/baileys';

export const command = {
    name: 'cloneinvite',
    description: 'DM invite links to members of another group (Slow & Safe)',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const targetJid = msg.key.remoteJid;
        const botJid = jidNormalizedUser(sock.user.id);

        if (!targetJid.endsWith('@g.us')) return await sock.sendMessage(targetJid, { text: '❌ Use in Target Group.' });
        if (args.length === 0) return await sock.sendMessage(targetJid, { text: '❌ Provide Source Group ID.' });

        await react("📨");

        try {
            // 1. Get Invite Code for THIS group
            // If this fails, the bot is definitely not an admin.
            const code = await sock.groupInviteCode(targetJid);
            const inviteLink = `https://chat.whatsapp.com/${code}`;

            // 2. Get Source Members
            const sourceJid = args[0].trim();
            const sourceMeta = await sock.groupMetadata(sourceJid);
            const targetMeta = await sock.groupMetadata(targetJid);

            // 3. Calculate who needs an invite
            const targetMembers = new Set(targetMeta.participants.map(p => jidNormalizedUser(p.id)));
            const toInvite = sourceMeta.participants
                .map(p => jidNormalizedUser(p.id))
                .filter(jid => !targetMembers.has(jid) && jid !== botJid);

            if (toInvite.length === 0) {
                await react("🤷");
                return await sock.sendMessage(targetJid, { text: '✅ Everyone is already here!' });
            }

            await sock.sendMessage(targetJid, { 
                text: `📨 *INVITE CLONE STARTED* 📨\n\n` +
                      `Sending invites to ${toInvite.length} members.\n` +
                      `⏱️ ETA: ~${Math.round((toInvite.length * 10) / 60)} minutes.\n` +
                      `_Running very slowly to avoid bans._`
            });

            // 4. SLOW SENDING LOOP (10 seconds per person)
            let sent = 0;
            for (const userJid of toInvite) {
                try {
                    await sock.sendMessage(userJid, { 
                        text: `👋 Hello! You are invited to join the new group:\n\n${inviteLink}`
                    });
                    sent++;
                    // Optional: Log progress to console if you want to watch it
                    // console.log(`Invite sent to ${userJid.split('@')[0]} (${sent}/${toInvite.length})`);
                } catch (e) {
                    console.error(`Failed to DM ${userJid}`);
                }
                await delay(10000); // 10 SECOND WAIT - DO NOT LOWER THIS
            }

            await sock.sendMessage(targetJid, { text: `✅ *Finished sending ${sent} invites.*` });
            await react("✅");

        } catch (e) {
            console.error("Invite Clone Error:", e);
            await sock.sendMessage(targetJid, { text: '❌ Failed. Ensure I am Admin (to get invite link).' });
        }
    }
};