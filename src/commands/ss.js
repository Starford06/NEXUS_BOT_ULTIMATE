export const command = {
    name: 'ss',
    description: 'Take a screenshot of a website: .ss google.com',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .ss <url>' });

        let url = args[0];
        if (!url.startsWith('http')) url = 'https://' + url;

        await react("📸");

        try {
            // Using a free public API for screenshots (thum.io)
            // No API key required for basic use.
            const ssUrl = `https://image.thum.io/get/width/1280/fonts/png/${url}`;

            await sock.sendMessage(msg.key.remoteJid, { 
                image: { url: ssUrl },
                caption: `📸 *Screenshot of:* ${url}`
            }, { quoted: msg });
            
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to take screenshot.' });
        }
    }
};