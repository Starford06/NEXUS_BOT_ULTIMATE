import { downloadContentFromMessage } from '@whiskeysockets/baileys';

export const command = {
    name: 'toimg',
    description: 'Convert replied sticker back to an image',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const remoteJid = msg.key.remoteJid;
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMsg?.stickerMessage) {
            return await sock.sendMessage(remoteJid, { text: '❌ Please reply to a sticker.' });
        }

        await react("🖼️");
        try {
            // 1. Download sticker data
            const stream = await downloadContentFromMessage(quotedMsg.stickerMessage, 'sticker');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            // 2. Send back as image (WhatsApp often auto-converts static webp to jpeg for display)
            await sock.sendMessage(remoteJid, { image: buffer, caption: '🖼️ Converted' }, { quoted: msg });
            await react("✅");

        } catch (e) {
            console.error(e);
            await sock.sendMessage(remoteJid, { text: '❌ Failed to convert. (Animated stickers might not work)' });
        }
    }
};