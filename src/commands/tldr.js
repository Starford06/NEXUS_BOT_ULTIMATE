import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyDuWXWsh9sBi3p9WLlDd6gMLiVKaYC-aM0"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export const command = {
    name: 'tldr',
    description: 'AI Summarize replied text',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const quotedText = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation || 
                           msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;

        if (!quotedText) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Reply to a long text message.' });

        await react("📑");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(`Summarize this text in 3 bullet points:\n\n${quotedText}`);
            await sock.sendMessage(msg.key.remoteJid, { text: `📑 *TL;DR Summary:*\n\n${result.response.text()}` }, { quoted: msg });
            await react("✅");
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to summarize.' });
        }
    }
};