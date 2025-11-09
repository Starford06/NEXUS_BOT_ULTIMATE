export const command = {
    name: 'add',
    description: 'Add multiple users to group: .add 2547123... 2547456...',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const remoteJid = msg.key.remoteJid;

        // 1. Check group & admin status (basic check)
        if (!remoteJid.endsWith('@g.us')) {
             return await sock.sendMessage(remoteJid, { text: '❌ Group command only.' });
        }
        if (args.length === 0) {
            return await sock.sendMessage(remoteJid, { text: '❌ Usage: .add <number1> <number2> ...\nExample: .add 254111222333 254444555666' });
        }

        await react("⏳");

        try {
            // 2. Process ALL arguments into a clean participant list
            const participants = args.map(arg => {
                // Remove all non-numeric characters (spaces, +, -, etc.)
                const cleanNumber = arg.replace(/[^0-9]/g, '');
                return cleanNumber ? `${cleanNumber}@s.whatsapp.net` : null;
            }).filter(p => p !== null); // Remove any empty results

            if (participants.length === 0) {
                await react("❌");
                return await sock.sendMessage(remoteJid, { text: '❌ No valid phone numbers found.' });
            }

            // 3. Execute Batch Add
            const response = await sock.groupParticipantsUpdate(
                remoteJid, 
                participants,
                "add"
            );

            // 4. Process Results
            let successCount = 0;
            let failedList = [];

            for (const res of response) {
                if (res.status === '200') {
                    successCount++;
                } else {
                    // Store failed numbers to notify admin
                    failedList.push(res.jid.split('@')[0]);
                }
            }

            // 5. Send Summary Report
            let resultMsg = `✅ *Batch Add Complete*\n\n👥 Added: ${successCount}/${participants.length}`;
            if (failedList.length > 0) {
                resultMsg += `\n\n⚠️ *Failed (${failedList.length}):*\n${failedList.join(', ')}\n_(Usually due to privacy settings)_`;
            }

            await sock.sendMessage(remoteJid, { text: resultMsg }, { quoted: msg });
            await react(failedList.length > 0 ? "⚠️" : "✅");

        } catch (e) {
            console.error("Add Error:", e);
            await sock.sendMessage(remoteJid, { text: '❌ Failed to execute add command. Ensure I am an Admin.' });
            await react("❌");
        }
    }
};