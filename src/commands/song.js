import yts from 'yt-search';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execPromise = promisify(exec);

// --- PATH FIX ---
// This ensures we always find the root folder correctly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Go up two levels from 'src/commands' to reach 'WhatsAppBot' root
const ROOT_DIR = path.resolve(__dirname, '../../');
// ----------------

export const command = {
    name: 'song',
    description: 'Downloads a song using yt-dlp',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;

        if (args.length === 0) {
            return await sock.sendMessage(remoteJid, { text: '❌ Usage: .song <song name>' });
        }

        await sock.sendMessage(remoteJid, { react: { text: "🔍", key: msg.key } });

        try {
            const query = args.join(' ');
            const searchResults = await yts(query);
            const video = searchResults.videos[0];

            if (!video) {
                return await sock.sendMessage(remoteJid, { text: '❌ No results found.' });
            }

            await sock.sendMessage(remoteJid, { react: { text: "⬇️", key: msg.key } });

            // USE ROBUST ROOT PATH
            const ytDlpPath = path.join(ROOT_DIR, 'yt-dlp.exe');
            const outputPath = path.join(os.tmpdir(), `${video.videoId}.m4a`);

            // Check if yt-dlp.exe actually exists there
            if (!fs.existsSync(ytDlpPath)) {
                 throw new Error(`yt-dlp.exe NOT FOUND at: ${ytDlpPath}`);
            }

            const command = `"${ytDlpPath}" -f "ba[ext=m4a]" -o "${outputPath}" "${video.url}"`;
            await execPromise(command);

            await sock.sendMessage(remoteJid, { react: { text: "⬆️", key: msg.key } });
            
            await sock.sendMessage(remoteJid, { 
                audio: { url: outputPath }, 
                mimetype: 'audio/mp4', 
                ptt: false, 
                fileName: `${video.title}.m4a`
            }, { quoted: msg });

            fs.unlinkSync(outputPath);
            await sock.sendMessage(remoteJid, { react: { text: "✅", key: msg.key } });

        } catch (error) {
            console.error("Song command failed:", error.message);
            await sock.sendMessage(remoteJid, { text: `❌ Failed: ${error.message.split('\n')[0]}` });
        }
    }
};