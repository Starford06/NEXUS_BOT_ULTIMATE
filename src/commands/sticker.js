import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';

export const command = {
    name: 'sticker',
    description: 'Convert replied media to sticker',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const mediaMsg = quotedMsg?.imageMessage || quotedMsg?.videoMessage || msg.message?.imageMessage || msg.message?.videoMessage;

        if (!mediaMsg) return await sock.sendMessage(remoteJid, { text: '❌ Reply to an image or video.' });

        // 1. START REACT
        await sock.sendMessage(remoteJid, { react: { text: "⏳", key: msg.key } });

        try {
            const mediaType = mediaMsg.seconds ? 'video' : 'image';
            const stream = await downloadContentFromMessage(mediaMsg, mediaType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            const sticker = new Sticker(buffer, {
                pack: 'NEXUS BOT',
                author: 'NEXUS',
                type: StickerTypes.FULL,
                quality: 50
            });

            await sock.sendMessage(remoteJid, { sticker: await sticker.toBuffer() });
            
            // 2. SUCCESS REACT
            await sock.sendMessage(remoteJid, { react: { text: "✅", key: msg.key } });

        } catch (e) {
            console.error(e);
            // 3. ERROR REACT
            await sock.sendMessage(remoteJid, { react: { text: "❌", key: msg.key } });
        }
    }
};