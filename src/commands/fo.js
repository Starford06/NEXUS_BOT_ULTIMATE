import axios from 'axios';

export const command = {
    name: 'fo',
    description: 'Tell someone off politely (FOAAS)',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const target = mentions[0] ? mentions[0].split('@')[0] : (args[0] || 'Everyone');
        const senderName = msg.pushName || 'Me';

        await react("🖕");
        try {
            // Lots of different endpoints available: /off/:name/:from, /you/:name/:from, etc.
            // We'll use a generic one for flexibility
            const { data } = await axios.get(`https://foaas.com/off/${target}/${senderName}`, {
                headers: { 'Accept': 'application/json' }
            });

            await sock.sendMessage(msg.key.remoteJid, { 
                text: `🖕 ${data.message}\n_${data.subtitle}_`,
                mentions: mentions // tagging them if they were mentioned
            });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to tell them off.' });
        }
    }
};