import { GoogleGenerativeAI } from "@google/generative-ai";
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const command = {
    name: 'ocr',
    description: 'Extract text from an image',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const imageMsg = quotedMsg?.imageMessage || msg.message?.imageMessage;
        if (!imageMsg) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Reply to an image.' });

        await react("📠");
        try {
            const stream = await downloadContentFromMessage(imageMsg, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent([
                "Extract ONLY the text visible in this image exactly as it appears. If no text, say 'No text detected'.",
                { inlineData: { data: buffer.toString("base64"), mimeType: "image/jpeg" } }
            ]);
            await sock.sendMessage(msg.key.remoteJid, { text: `📠 *Extracted Text:*\n\n${result.response.text()}` }, { quoted: msg });
            await react("✅");
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ OCR Failed.' });
        }
    }
};
