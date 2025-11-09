export const command = {
    name: 'ascii',
    description: 'Convert text to ASCII binary/hex: .ascii Hello',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide text to convert.' });

        const input = args.join(' ');
        let binaryStr = '';
        let hexStr = '';

        for (let i = 0; i < input.length; i++) {
            const code = input.charCodeAt(i);
            binaryStr += code.toString(2).padStart(8, '0') + ' ';
            hexStr += code.toString(16).toUpperCase().padStart(2, '0') + ' ';
        }

        const text = `🔤 *ASCII Encoder*\n\n` +
                     `📝 *Input:* "${input}"\n\n` +
                     `#️⃣ *HEX:*\n\`${hexStr.trim()}\`\n\n` +
                     `0️⃣ *BINARY:*\n\`${binaryStr.trim()}\``;

        await sock.sendMessage(msg.key.remoteJid, { text });
    }
};