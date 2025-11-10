// We need to import the AI model directly since we can't easily "call" another command's file
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔑 ENSURE YOUR API KEY IS HERE TOO
const API_KEY = process.env.GOOGLE_API_KEY; 
const genAI = new GoogleGenerativeAI(API_KEY);

export const command = {
    name: 'roast',
    description: 'AI will roast the replied user',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const remoteJid = msg.key.remoteJid;
        const target = msg.message?.extendedTextMessage?.contextInfo?.participant || 
                       msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (!target) return await sock.sendMessage(remoteJid, { text: '❌ Reply to someone to roast them!' });

        await react("🔥");

        try {
            // Updated to use a currently available model
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            // The prompt that makes it mean
            const prompt = "Generate a short, brutal, but funny roast for someone. Keep it under 50 words. Do not use generic insults, be creative.";
            
            const result = await model.generateContent(prompt);
            const roast = result.response.text().replace(/"/g, ''); // Remove extra quotes AI sometimes adds

            await sock.sendMessage(remoteJid, { 
                text: `@${target.split('@')[0]} 🔥\n${roast}`, 
                mentions: [target] 
            });
            await react("💀");

        } catch (e) {
            await sock.sendMessage(remoteJid, { text: '❌ AI failed to cook up a roast.' });
        }
    }
};
