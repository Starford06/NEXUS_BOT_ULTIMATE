export const command = {
    name: 'b64',
    description: 'Base64 Encode/Decode: .b64 enc <text> OR .b64 dec <coded_text>',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length < 2) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .b64 enc <text> OR .b64 dec <text>' });

        const action = args[0].toLowerCase();
        const input = args.slice(1).join(' ');
        let output = '';

        try {
            if (action === 'enc' || action === 'encode') {
                output = Buffer.from(input).toString('base64');
            } else if (action === 'dec' || action === 'decode') {
                output = Buffer.from(input, 'base64').toString('utf-8');
            } else {
                return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Invalid action. Use "enc" or "dec".' });
            }

            await sock.sendMessage(msg.key.remoteJid, { text: `🔑 *Base64 Result:*\n\n\`\`\`${output}\`\`\`` });
            await react("✅");
        } catch (e) {
             await sock.sendMessage(msg.key.remoteJid, { text: '❌ Invalid input for decoding.' });
        }
    }
};