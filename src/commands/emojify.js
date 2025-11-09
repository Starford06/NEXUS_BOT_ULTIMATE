export const command = {
    name: 'emojify',
    description: 'Convert text to emoji letters',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide text.' });

        const mapping = {
            'a': '🇦', 'b': '🇧', 'c': '🇨', 'd': '🇩', 'e': '🇪', 'f': '🇫', 'g': '🇬', 'h': '🇭', 'i': '🇮', 'j': '🇯', 'k': '🇰', 'l': '🇱', 'm': '🇲', 'n': '🇳', 'o': '🇴', 'p': '🇵', 'q': '🇶', 'r': '🇷', 's': '🇸', 't': '🇹', 'u': '🇺', 'v': '🇻', 'w': '🇼', 'x': '🇽', 'y': '🇾', 'z': '🇿',
            '0': '0️⃣', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
            '!': '❗', '?': '❓', '#': '#️⃣', '*': '*️⃣'
        };

        const text = args.join(' ').toLowerCase();
        let result = '';
        for (let char of text) {
            result += mapping[char] ? mapping[char] + ' ' : char + ' ';
        }

        await sock.sendMessage(msg.key.remoteJid, { text: result });
        await react("✅");
    }
};