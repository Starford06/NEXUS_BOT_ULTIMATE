import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyDuWXWsh9sBi3p9WLlDd6gMLiVKaYC-aM0"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export const command = {
    name: 'dream',
    description: 'Generate a random AI hallucination',
    execute: async (sock, msg, args, cmd, plug, react) => {
        await react("🌌");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent("Generate a single, short, surreal, futuristic concept or 'AI thought'. Be creative and weird. Max 2 sentences.");
            await sock.sendMessage(msg.key.remoteJid, { text: `🌌 *NEXUS DREAM:*\n_${result.response.text()}_` });
            await react("✅");
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Dream sequence failed.' });
        }
    }
};