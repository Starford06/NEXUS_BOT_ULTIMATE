export const command = {
    name: 'tiny',
    description: 'ᵐᵃᵏᵉ ᵗᵉˣᵗ ᵗⁱⁿʸ',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const text = args.join(' ') || 
                     msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;

        if (!text) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide text to shrink.' });

        // Mapping for standard characters to their superscript equivalents
        const map = {
            'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ',
            'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'q': 'q', 'r': 'ʳ',
            's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
            'A': 'ᴬ', 'B': 'ᴮ', 'C': 'ᶜ', 'D': 'ᴰ', 'E': 'ᴱ', 'F': 'ᶠ', 'G': 'ᴳ', 'H': 'ᴴ', 'I': 'ᴵ',
            'J': '', 'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ', 'Q': 'ᵠ', 'R': 'ᴿ',
            'S': 'ˢ', 'T': 'ᵀ', 'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ', 'X': 'ˣ', 'Y': 'ʸ', 'Z': 'ᶻ',
            '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
        };

        const tinyText = text.split('').map(char => map[char] || char).join('');
        
        await sock.sendMessage(msg.key.remoteJid, { text: tinyText });
        await react("🤏");
    }
};