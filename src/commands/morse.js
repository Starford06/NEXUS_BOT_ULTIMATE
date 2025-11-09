const MORSE_CODE = { 'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/' };
const REVERSE_MORSE = Object.fromEntries(Object.entries(MORSE_CODE).map(([k, v]) => [v, k]));

export const command = {
    name: 'morse',
    description: 'Convert to/from Morse code',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide text or dots/dashes.' });

        const input = args.join(' ').toUpperCase();
        // Auto-detect if input is morse (contains only . - / and spaces)
        const isMorse = /^[.\- /]+$/.test(input);

        let output = '';
        if (isMorse) {
            output = input.split(' ').map(code => REVERSE_MORSE[code] || '?').join('');
        } else {
            output = input.split('').map(char => MORSE_CODE[char] || char).join(' ');
        }

        await sock.sendMessage(msg.key.remoteJid, { text: `🔦 *Morse ${isMorse ? 'Decode' : 'Encode'}*\n\n\`\`\`${output}\`\`\`` });
        await react("✅");
    }
};