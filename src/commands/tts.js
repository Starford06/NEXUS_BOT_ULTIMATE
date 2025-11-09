import * as googleTTS from 'google-tts-api'; // Standard import might fail depending on version, try this if it does: const googleTTS = require('google-tts-api');

export const command = {
    name: 'tts',
    description: 'Converts text to speech',
    execute: async (sock, msg, args) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .tts Hello world' });

        const text = args.join(' ');
        try {
            // Generate Audio URL (standard Google Translate voice)
            const url = googleTTS.getAudioUrl(text, {
                lang: 'en',
                slow: false,
                host: 'https://translate.google.com',
            });

            // Send as Voice Note (ptt: true makes it a playable waveform)
            await sock.sendMessage(msg.key.remoteJid, { 
                audio: { url: url }, 
                mimetype: 'audio/mp4', 
                ptt: true 
            }, { quoted: msg });

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ TTS failed.' });
        }
    }
};