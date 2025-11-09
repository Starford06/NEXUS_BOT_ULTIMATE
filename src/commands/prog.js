export const command = {
    name: 'prog',
    description: 'Show all bases for a number: .prog 255',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide a number (default decimal, or use 0x for hex, 0b for binary).' });

        let input = args[0].toLowerCase();
        let number;

        // Auto-detect base prefixes
        if (input.startsWith('0x')) number = parseInt(input.substring(2), 16);
        else if (input.startsWith('0b')) number = parseInt(input.substring(2), 2);
        else if (input.startsWith('0o')) number = parseInt(input.substring(2), 8);
        else number = parseInt(input, 10);

        if (isNaN(number)) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Invalid number format.' });

        await react("🖥️");

        const text = `🖥️ *Programmer's View*\n\n` +
                     `🔟 *DEC:* ${number.toString(10)}\n` +
                     `#️⃣ *HEX:* ${number.toString(16).toUpperCase()}\n` +
                     `8️⃣ *OCT:* ${number.toString(8)}\n` +
                     `0️⃣ *BIN:* ${number.toString(2).padStart(8, '0')}`; // padStart ensures at least 8 bits shown

        await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
        await react("✅");
    }
};