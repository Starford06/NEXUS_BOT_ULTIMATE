export const command = {
    name: 'base',
    description: 'Convert number bases: .base <number> <from_base> <to_base>',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length < 3) {
            return await sock.sendMessage(msg.key.remoteJid, { 
                text: '❌ Usage: .base <number> <from> <to>\nExample: `.base 1010 2 10` (Binary to Decimal)' 
            });
        }

        const numStr = args[0];
        const fromBase = parseInt(args[1]);
        const toBase = parseInt(args[2]);

        if (isNaN(fromBase) || isNaN(toBase) || fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) {
            return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Bases must be between 2 and 36.' });
        }

        try {
            // Convert to decimal first, then to target base
            const decimalValue = parseInt(numStr, fromBase);

            if (isNaN(decimalValue)) {
                return await sock.sendMessage(msg.key.remoteJid, { text: `❌ "${numStr}" is not a valid base-${fromBase} number.` });
            }

            const result = decimalValue.toString(toBase).toUpperCase();

            await sock.sendMessage(msg.key.remoteJid, { 
                text: `🔢 *Base Conversion*\n\n` +
                      `📥 *Input:* ${numStr} (Base ${fromBase})\n` +
                      `📤 *Output:* ${result} (Base ${toBase})` 
            }, { quoted: msg });

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Conversion failed. Number might be too large.' });
        }
    }
};