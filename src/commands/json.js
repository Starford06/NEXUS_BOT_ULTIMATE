export const command = {
    name: 'json',
    description: 'Format/Validate JSON: .json {"a":1, "b":2}',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide JSON data to format.' });

        try {
            const input = args.join(' ');
            const parsed = JSON.parse(input);
            // Format with 2-space indentation
            const pretty = JSON.stringify(parsed, null, 2);

            await sock.sendMessage(msg.key.remoteJid, { 
                text: `🔧 *Valid JSON Formatted:*\n\n\`\`\`${pretty}\`\`\`` 
            });
            await react("✅");
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: `❌ *Invalid JSON Error:*\n\n_${e.message}_` });
            await react("❌");
        }
    }
};