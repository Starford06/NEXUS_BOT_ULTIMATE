export const command = {
    name: 'url',
    description: 'Encode or Decode URL components: .url enc <text> OR .url dec <text>',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length < 2) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .url enc <text> OR .url dec <text>' });

        const action = args[0].toLowerCase();
        const input = args.slice(1).join(' ');
        let output = '';

        try {
            if (action === 'enc' || action === 'encode') {
                output = encodeURIComponent(input);
            } else if (action === 'dec' || action === 'decode') {
                output = decodeURIComponent(input);
            } else {
                return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Invalid action. Use "enc" or "dec".' });
            }

            await sock.sendMessage(msg.key.remoteJid, { text: `🔗 *URL ${action.toUpperCase()} Result:*\n\n\`\`\`${output}\`\`\`` });
        } catch (e) {
             await sock.sendMessage(msg.key.remoteJid, { text: '❌ Malformed URL sequence.' });
        }
    }
};