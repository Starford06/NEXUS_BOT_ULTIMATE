import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyDuWXWsh9sBi3p9WLlDd6gMLiVKaYC-aM0"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export const command = {
    name: 'fix',
    description: 'Fix grammar or code in replied text',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const quotedText = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation || 
                           msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;

        if (!quotedText) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Reply to text or code to fix it.' });

        await react("🔧");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(`Fix the grammar OR code errors in this text. Output ONLY the fixed version:\n\n${quotedText}`);
            await sock.sendMessage(msg.key.remoteJid, { text: result.response.text() }, { quoted: msg });
            await react("✅");
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Fix failed.' });
        }
    }
};