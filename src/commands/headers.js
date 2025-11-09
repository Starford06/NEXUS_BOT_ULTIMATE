import axios from 'axios';

export const command = {
    name: 'headers',
    description: 'Inspect HTTP headers: .headers google.com',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide a URL.' });

        let url = args[0];
        if (!url.startsWith('http')) url = 'http://' + url;

        await react("📡");

        try {
            // Make a HEAD request just to get headers without downloading the whole body
            const response = await axios.head(url, { timeout: 5000, validateStatus: () => true });
            
            let headerText = `📡 *HTTP Headers for ${new URL(url).hostname}*\n` +
                             `*Status:* ${response.status} ${response.statusText}\n\n`;

            for (const [key, value] of Object.entries(response.headers)) {
                // Filter out some internal axios headers if necessary, but usually they are fine
                 headerText += `*${key}:* \`${value}\`\n`;
            }

            await sock.sendMessage(msg.key.remoteJid, { text: headerText.substring(0, 2000) }); // Ensure it doesn't exceed WhatsApp limits
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: `❌ Failed to connect: ${e.message}` });
            await react("❌");
        }
    }
};