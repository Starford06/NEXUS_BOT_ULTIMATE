import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔑 REPLACE WITH YOUR REAL API KEY
const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Models to try in order of preference
const MODELS = ["gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-1.5-pro-latest"];

export const command = {
    name: 'ai',
    description: 'Chat with AI: .ai hello',
    execute: async (sock, msg, args) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❓ Hi! Ask me anything. (.ai who is Batman?)' });
        
        const remoteJid = msg.key.remoteJid;
        const prompt = args.join(' ');
        await sock.sendMessage(remoteJid, { react: { text: "💭", key: msg.key } });

        for (const modelName of MODELS) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                await sock.sendMessage(remoteJid, { text: text }, { quoted: msg });
                await sock.sendMessage(remoteJid, { react: { text: "🤖", key: msg.key } });
                return; // Success, exit loop
            } catch (e) {
                // console.log(`Model ${modelName} failed, trying next...`);
                continue;
            }
        }
        
        await sock.sendMessage(remoteJid, { text: '❌ All AI models are currently busy. Please try again in a minute.' });
    }
};