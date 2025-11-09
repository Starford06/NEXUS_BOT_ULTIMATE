import { delay, jidNormalizedUser } from '@whiskeysockets/baileys';

export const command = {
    name: 'forceclone',
    description: 'Clone members from another group. DMs invite if direct add fails.',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const targetJid = msg.key.remoteJid;
        const botJid = jidNormalizedUser(sock.user.id);

        // 1. Basic Validation
        if (!targetJid.endsWith('@g.us')) return await sock.sendMessage(targetJid, { text: '❌ Use this in the Target Group.' });
        if (args.length === 0) return await sock.sendMessage(targetJid, { text: '❌ Provide Source Group JID (use .groups to find it).' });
        const sourceJid = args[0].trim();
        if (sourceJid === targetJid) return await sock.sendMessage(targetJid, { text: '❌ Source cannot be the same as Target.' });

        await react("😈");

        try {
            // 2. Preparation (Get Invite Link first to ensure we are Admin)
            let inviteLink;
            try {
                const code = await sock.groupInviteCode(targetJid);
                inviteLink = `https://chat.whatsapp.com/${code}`;
            } catch (e) {
                await react("❌");
                return await sock.sendMessage(targetJid, { text: '❌ I am NOT an Admin here. Cannot generate invite link for fallbacks.' });
            }

            // 3. Fetch & Diff Members
            await sock.sendMessage(targetJid, { text: '🔍 Scanning groups... please wait.' });
            const sourceMeta = await sock.groupMetadata(sourceJid);
            const targetMeta = await sock.groupMetadata(targetJid);

            // Create a set of current members for fast lookup
            const currentMembers = new Set(targetMeta.participants.map(p => jidNormalizedUser(p.id)));
            
            // Filter: People in Source NOT in Target (and not the bot itself)
            const toProcess = sourceMeta.participants
                .map(p => jidNormalizedUser(p.id))
                .filter(jid => !currentMembers.has(jid) && jid !== botJid);

            if (toProcess.length === 0) {
                await react("🤷");
                return await sock.sendMessage(targetJid, { text: `✅ Everyone from *${sourceMeta.subject}* is already here!` });
            }

            // 4. Start the Loop
            const inviteMsg = `👋 Hello! You are invited to join *${targetMeta.subject}*.\nI tried adding you, but your privacy settings blocked it.\n\nJoin here: ${inviteLink}`;
            await sock.sendMessage(targetJid, { 
                text: `🚀 FORCE CLONE STARTED\n\n📂 Source: ${sourceMeta.subject}\n👥 Moving: ${toProcess.length} members\n\n_Starting slow process (Add -> Fail -> DM)..._` 
            });

            let added = 0;
            let invited = 0;
            let failed = 0;

            for (let i = 0; i < toProcess.length; i++) {
                const user = toProcess[i];
                try {
                    // A. Try Direct Add
                    const res = await sock.groupParticipantsUpdate(targetJid, [user], "add");
                    const status = res[0]?.status;

                    if (status === '200' || status === '201') {
                        added++;
                    } 
                    // B. If blocked (403), switch to DM Invite
                    else if (status === '403') {
                        await sock.sendMessage(user, { text: inviteMsg });
                        invited++;
                    } 
                    else {
                        failed++;
                    }
                } catch (e) {
                    // Fallback: If add crashes completely, try DMing anyway
                    try { await sock.sendMessage(user, { text: inviteMsg }); invited++; } catch (err) { failed++; }
                }

                // CRITICAL DELAY to prevent account bans during mass DMs/Adds
                await delay(3000); // 3 seconds per person
            }

            // 5. Final Report
            await sock.sendMessage(targetJid, { 
                text: `🏁 *FORCE CLONE COMPLETE* 🏁\n\n` +
                      `✅ Added directly: ${added}\n` +
                      `📨 DMed Invite: ${invited}\n` +
                      `❌ Failed: ${failed}\n` +
                      `🔢 Total Processed: ${toProcess.length}`
            });
            await react("✅");

        } catch (e) {
            console.error("ForceClone Error:", e);
            await sock.sendMessage(targetJid, { text: `☠️ Critical Error: ${e.message}` });
        }
    }
};