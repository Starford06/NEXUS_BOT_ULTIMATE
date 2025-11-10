import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔴 IMPORTANT: ENSURE THIS KEY IS CORRECT OR USE GLOBAL CONFIG IF YOU SET IT UP
const API_KEY = process.env.GOOGLE_API_KEY; 
const genAI = new GoogleGenerativeAI(API_KEY);

export const command = {
    name: 'vibe',
    description: 'Analyze sentiment of text',
    execute: async (sock, msg, args, cmd, plug, react) => { // Added 'react'
        const text = args.join(' ') || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;
        if (!text) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide text or reply to a message.' });

        await react("🔮");
        try {
            // Updated to a newer model if 'gemini-1.5-flash' is deprecated for you
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Analyze the sentiment of this text: "${text}". Give it a Vibe Score from 0 (Toxic) to 100 (Wholesome) and a 1-sentence explanation. Format: "Score: [number]/100\n[Explanation]"`;
            const result = await model.generateContent(prompt);
            await sock.sendMessage(msg.key.remoteJid, { text: `🔮 *Vibe Check:*\n${result.response.text()}` }, { quoted: msg });
            await react("✅");
        } catch (e) {
            console.error("Vibe Error:", e);
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Vibe machine broke (Check API Key).' });
            await react("❌");
        }
    }
};
