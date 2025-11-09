import { delay } from '@whiskeysockets/baileys';

export const command = {
    name: 'clone',
    description: 'Clone members one-by-one (Slowest but safest)',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const targetJid = msg.key.remoteJid;

        // 🛡️ SECURITY CHECK 🛡️
        if (sender !== global.OWNER_ID) {
            await react("⛔");
            return await sock.sendMessage(msg.key.remoteJid, { text: '⛔ This command is for the Bot Owner only.' });
        }
        await react("🐌"); // Snail emoji for slow mode

        if (!targetJid.endsWith('@g.us')) return await sock.sendMessage(targetJid, { text: '❌ Target Group only.' });
        if (args.length === 0) return await sock.sendMessage(targetJid, { text: '❌ Missing Source JID.' });

        try {
            const sourceJid = args[0].trim();
            const sourceMeta = await sock.groupMetadata(sourceJid);
            const targetMeta = await sock.groupMetadata(targetJid);

            // Calculate missing members (simple string match to avoid ID errors)
            const targetIds = JSON.stringify(targetMeta.participants.map(p => p.id));
            const toAdd = sourceMeta.participants
                .filter(p => !targetIds.includes(p.id.split('@')[0]))
                .map(p => p.id);

            if (toAdd.length === 0) {
                await react("🤷");
                return await sock.sendMessage(targetJid, { text: '✅ Everyone is already here!' });
            }

            await sock.sendMessage(targetJid, { text: `🐌 SLOW MODE: Attempting to add ${toAdd.length} members one by one...` });

            let success = 0;
            let privacy = 0;
            let failed = 0;

            // Loop through EVERY SINGLE USER one at a time
            for (const user of toAdd) {
                try {
                    // Try to add JUST THIS ONE person
                    const res = await sock.groupParticipantsUpdate(targetJid, [user], "add");
                    const status = res[0].status;

                    if (status === '200' || status === '201') success++;
                    else if (status === '403') privacy++;
                    else failed++;

                } catch (e) {
                    console.error(`Failed to add ${user}:`, e.message);
                    // If we get a 'forbidden' error here, the bot is definitively NOT an admin.
                    if (e.message.includes('forbidden') || e.message.includes('unauthorized')) {
                         await sock.sendMessage(targetJid, { text: '🚫 CRITICAL FAILURE: WhatsApp says I am NOT an admin. Stopping.' });
                         return;
                    }
                    failed++;
                }
                // Wait 2 seconds between EACH person
                await delay(2000);
            }

            await sock.sendMessage(targetJid, { 
                text: `🏁 *SLOW CLONE FINISHED*\n✅ Added: ${success}\n🔒 Privacy Blocked: ${privacy}\n❌ Failed: ${failed}` 
            });
            await react("✅");

        } catch (e) {
            console.error("Clone Error:", e);
            await sock.sendMessage(targetJid, { text: `☠️ Error: ${e.message}` });
        }
    }
};