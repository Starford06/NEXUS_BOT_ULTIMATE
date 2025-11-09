export const command = {
    name: 'luhn',
    description: 'Validate a number using the Luhn algorithm (Offline Format Check)',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .luhn <number_sequence>' });

        const number = args[0].replace(/\D/g, ''); // Remove non-digits
        if (number.length < 8) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Sequence too short.' });

        await react("🧮");

        // The Luhn Algorithm Implementation
        let sum = 0;
        let shouldDouble = false;
        // Loop through digits from right to left
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i));

            if (shouldDouble) {
                if ((digit *= 2) > 9) digit -= 9;
            }

            sum += digit;
            shouldDouble = !shouldDouble;
        }

        const isValid = (sum % 10) === 0;
        const status = isValid ? '✅ VALID FORMAT' : '❌ INVALID FORMAT';

        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🧮 *Luhn Check (Mod 10)*\n\n📥 *Input:* ${number}\nrunning offline validation...\n\n*Result:* ${status}` 
        }, { quoted: msg });
        
        await react(isValid ? "✅" : "❌");
    }
};