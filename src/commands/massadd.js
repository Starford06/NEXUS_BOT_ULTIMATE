import { delay } from '@whiskeysockets/baileys';

export const command = {
    name: 'massadd',
    description: 'Bulk add users (Filters existing members first)',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const remoteJid = msg.key.remoteJid;
        // 🛡️ SECURITY LOCK 🛡️
        const sender = msg.key.participant || msg.key.remoteJid;
        if (sender !== global.OWNER_ID) {
            await react("⛔");
            return await sock.sendMessage(msg.key.remoteJid, { text: '⛔ Permission Denied: Owner only.' }, { quoted: msg });
        }
        if (!remoteJid.endsWith('@g.us')) return await sock.sendMessage(remoteJid, { text: '❌ Groups only.' });

        // 1. Get Input Text
        const quotedText = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation || 
                           msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;
        const fullText = (args.join(' ') + ' ' + (quotedText || '')).trim();

        if (!fullText) return await sock.sendMessage(remoteJid, { text: '❌ Please reply to or paste a list of numbers.' });

        await react("⏳");

        try {
            // 2. Extract all potential numbers from input
            const rawNumbers = fullText.match(/\d{8,15}/g) || [];
            if (rawNumbers.length === 0) {
                await react("❌");
                return await sock.sendMessage(remoteJid, { text: '❌ No valid numbers found in input.' });
            }
            const inputJids = new Set(rawNumbers.map(n => `${n}@s.whatsapp.net`));

            // 3. Fetch CURRENT group members to avoid redundant adds
            const metadata = await sock.groupMetadata(remoteJid);
            const existingParticipants = new Set(metadata.participants.map(p => p.id));

            // 4. Filter: Only keep people NOT already in the group
            const toAdd = [...inputJids].filter(jid => !existingParticipants.has(jid));

            if (toAdd.length === 0) {
                await react("🤷");
                return await sock.sendMessage(remoteJid, { text: '⚠️ Everyone in that list is already in this group!' });
            }

            await sock.sendMessage(remoteJid, { text: `📋 Input: ${inputJids.size} numbers.\n🆕 New members to add: ${toAdd.length}.\n🚀 Starting batched process...` });

            // 5. BATCH PROCESSING (Slow & Steady)
            const BATCH_SIZE = 10;
            const DELAY_MS = 3000; // 3 seconds between batches to be safe
            let success = 0;
            let failed = 0;
            let privacyBlocked = 0;

            for (let i = 0; i < toAdd.length; i += BATCH_SIZE) {
                const batch = toAdd.slice(i, i + BATCH_SIZE);
                try {
                    const results = await sock.groupParticipantsUpdate(remoteJid, batch, "add");
                    for (const res of results) {
                        if (res.status === '200' || res.status === '201') success++;
                        else if (res.status === '403') privacyBlocked++;
                        else failed++;
                    }
                } catch (e) {
                    console.error(`Batch failed:`, e);
                    failed += batch.length;
                }
                if (i + BATCH_SIZE < toAdd.length) await delay(DELAY_MS);
            }

            // 6. Final Report
            await sock.sendMessage(remoteJid, { 
                text: `👥 *Mass Add Complete* 👥\n\n` +
                      `✅ *Added:* ${success}\n` +
                      `🔒 *Privacy Blocked:* ${privacyBlocked}\n` +
                      `❌ *Failed:* ${failed}`
            }, { quoted: msg });
            await react("✅");

        } catch (e) {
            console.error("MassAdd Error:", e);
            await sock.sendMessage(remoteJid, { text: '❌ Failed. Ensure I am Admin and connected.' });
            await react("❌");
        }
    }
};