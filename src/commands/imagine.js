export const command = {
    name: 'imagine',
    description: 'Generate an image: .imagine a cyberpunk cat',
    execute: async (sock, msg, args) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .imagine <description>' });
        
        const remoteJid = msg.key.remoteJid;
        const prompt = args.join(' ');
        
        // React to show it's working
        await sock.sendMessage(remoteJid, { react: { text: "🎨", key: msg.key } });

        try {
            // Use a random seed to get different images for the same prompt
            const seed = Math.floor(Math.random() * 1000000);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&width=1024&height=1024&nologo=true`;

            await sock.sendMessage(remoteJid, { 
                image: { url: imageUrl }, 
                caption: `🎨 *Generated for:* "${prompt}"` 
            }, { quoted: msg });

            await sock.sendMessage(remoteJid, { react: { text: "✅", key: msg.key } });

        } catch (e) {
            console.error("Imagine Error:", e);
            await sock.sendMessage(remoteJid, { text: '❌ Failed to generate image. Try again later.' });
        }
    }
};