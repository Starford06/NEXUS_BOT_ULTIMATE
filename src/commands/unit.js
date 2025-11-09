import { unit } from 'mathjs';

export const command = {
    name: 'unit',
    description: 'Convert units: .unit 5 inch to cm',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length < 3) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .unit <value> <from_unit> to <to_unit>\nExample: .unit 10 km to miles' });

        await react("📏");
        try {
            // Join args to form a string like "100 kg to lbs"
            const input = args.join(' ').toLowerCase();
            // mathjs.unit(val, from).toNumber(to) is the standard way, but it also parses strings like "100 kg to lbs" directly if formatted right.
            // Let's try to parse the natural input first.
            
            const result = unit(input).toString(); 
            // Note: mathjs 'unit("10 kg to lbs")' doesn't auto-convert in string format directly often, 
            // it usually needs explicit .to(). Let's split it manually for reliability.
            
            // Better approach: split by 'to'
            const parts = input.split('to');
            if (parts.length !== 2) throw new Error("Invalid format");
            
            const from = unit(parts[0].trim());
            const toUnit = parts[1].trim();
            const converted = from.to(toUnit);

            await sock.sendMessage(msg.key.remoteJid, { 
                text: `📏 *Unit Conversion*\n\n📥 *Input:* ${parts[0].trim()}\n📤 *Result:* ${converted.format({ precision: 4 })}` 
            });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Invalid units or format. Try: .unit 500 mb to gb' });
            await react("❌");
        }
    }
};