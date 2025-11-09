import { delay } from '@whiskeysockets/baileys';

export const command = {
    name: 'numdetails',
    description: 'Fetch FULL details (Pic, About, Business info) for numbers.',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide numbers separated by spaces.' });

        await react("🕵️");

        const rawInput = args.join(' ');
        const numbers = [...new Set(rawInput.match(/\d+/g) || [])]; // Deduplicate

        if (numbers.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ No valid numbers found.' });

        await sock.sendMessage(msg.key.remoteJid, { text: `🔍 Scanning ${numbers.length} numbers... (This might take a moment)` });

        for (const number of numbers) {
            const jid = `${number}@s.whatsapp.net`;

            try {
                // 1. Check existence
                const exists = await sock.onWhatsApp(jid);
                if (!exists || exists.length === 0 || !exists[0].exists) {
                    await sock.sendMessage(msg.key.remoteJid, { text: `❌ *+${number}*: Not on WhatsApp` });
                    continue;
                }

                // 2. Fetch ALL details in parallel for speed
                const [statusData, ppUrl, businessData] = await Promise.all([
                    sock.fetchStatus(jid).catch(() => ({ status: '🔒 Private / None' })),
                    sock.profilePictureUrl(jid, 'image').catch(() => null),
                    sock.getBusinessProfile(jid).catch(() => null)
                ]);

                // 3. Build the Full Report
                let caption = `👤 *CONTACT DETAILS*\n` +
                              `📱 *Number:* +${number}\n` +
                              `🆔 *JID:* \`${jid}\`\n\n` +
                              `📝 *About:* ${statusData.status}\n`;
                              if (statusData.setAt) caption += `🕒 *Set:* ${new Date(statusData.setAt).toLocaleDateString()}\n`;

                // Add Business Details if they exist
                if (businessData) {
                    caption += `\n🏢 *BUSINESS DETAILS*\n`;
                    if (businessData.description) caption += `📄 *Desc:* ${businessData.description}\n`;
                    if (businessData.email) caption += `📧 *Email:* ${businessData.email}\n`;
                    if (businessData.website && businessData.website.length > 0) caption += `🌐 *Web:* ${businessData.website.join(', ')}\n`;
                    caption += `🏷️ *Category:* ${businessData.category || 'N/A'}\n`;
                }

                // 4. Send Result (Image or Text)
                if (ppUrl) {
                    await sock.sendMessage(msg.key.remoteJid, { image: { url: ppUrl }, caption: caption });
                } else {
                    await sock.sendMessage(msg.key.remoteJid, { text: caption + `\n🖼️ *Profile Pic:* 🔒 Private / None` });
                }

            } catch (e) {
                console.error(`Failed details for ${number}:`, e);
                await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ Error fetching +${number}` });
            }

            // Polite delay between heavy fetches
            await delay(1500);
        }
        await react("✅");
    }
};