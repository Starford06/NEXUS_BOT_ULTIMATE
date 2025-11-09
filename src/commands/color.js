export const command = {
    name: 'color',
    description: 'Convert colors: .color #ff0000 OR .color 255,0,0',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .color #HEX or .color R,G,B' });

        const input = args.join('').replace(/\s/g, '');
        let hex, rgb;

        // Check if input is HEX
        if (input.startsWith('#') || /^[0-9a-fA-F]{6}$/.test(input)) {
            hex = input.startsWith('#') ? input : '#' + input;
            const bigint = parseInt(hex.slice(1), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            rgb = `${r}, ${g}, ${b}`;
        } 
        // Check if input is RGB
        else if (input.includes(',')) {
            const parts = input.split(',');
            if (parts.length === 3) {
                const r = parseInt(parts[0]);
                const g = parseInt(parts[1]);
                const b = parseInt(parts[2]);
                if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
                    rgb = `${r}, ${g}, ${b}`;
                    hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
                }
            }
        }

        if (!hex || !rgb) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Invalid color format.' });

        // Send result with a generated preview image from a public API
        await sock.sendMessage(msg.key.remoteJid, { 
            image: { url: `https://singlecolorimage.com/get/${hex.substring(1)}/200x100` },
            caption: `🎨 *Color Converter*\n\n#️⃣ *HEX:* ${hex}\n🌈 *RGB:* ${rgb}`
        }, { quoted: msg });
    }
};