export const command = {
    name: 'groups',
    description: 'List all groups the bot is in (DM only)',
    execute: async (sock, msg, args, cmd, plug, react) => {
        // Check if it's a DM (remoteJid ends in @s.whatsapp.net)
        if (!msg.key.remoteJid.endsWith('@s.whatsapp.net')) {
            return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Please use this command in private chat to avoid spamming groups.' });
        }

        await react("🔍");
        try {
            // Fetch all groups the bot is in
            const groups = await sock.groupFetchAllParticipating();
            const groupList = Object.values(groups);

            if (groupList.length === 0) {
                await sock.sendMessage(msg.key.remoteJid, { text: '❌ I am not in any groups.' });
                return await react("🤷");
            }

            let text = `📋 *MY GROUPS (${groupList.length})* 📋\n\n`;
            groupList.forEach((g, i) => {
                text += `*${i + 1}.* ${g.subject}\n`;
                text += `🆔 \`${g.id}\`\n\n`;
            });

            text += `_To extract members from a restricted group:_\n_Type: .memberlist <ID>_\n_Example: .memberlist 123456789@g.us_`;

            await sock.sendMessage(msg.key.remoteJid, { text });
            await react("✅");

        } catch (e) {
            console.error("Groups Error:", e);
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch group list.' });
        }
    }
};