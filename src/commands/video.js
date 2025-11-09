import yts from 'yt-search';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execPromise = promisify(exec);

// --- ROBUST PATH SETUP ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');
// -------------------------

export const command = {
    name: 'video',
    description: 'Downloads a video from YouTube',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;

        if (args.length === 0) {
            return await sock.sendMessage(remoteJid, { text: '❌ Usage: .video <video name>' });
        }

        await sock.sendMessage(remoteJid, { react: { text: "🔍", key: msg.key } });

        try {
            // 1. Search
            const query = args.join(' ');
            const searchResults = await yts(query);
            const video = searchResults.videos[0];

            if (!video) {
                return await sock.sendMessage(remoteJid, { text: '❌ No results found.' });
            }

            // Check duration (avoid downloading 10-hour videos)
            if (video.seconds > 1800) { // 30 minutes limit
                 return await sock.sendMessage(remoteJid, { text: '❌ Video is too long for WhatsApp.' });
            }

            await sock.sendMessage(remoteJid, { react: { text: "⬇️", key: msg.key } });

            // 2. Setup Paths
            const ytDlpPath = path.join(ROOT_DIR, 'yt-dlp.exe');
            const outputPath = path.join(os.tmpdir(), `${video.videoId}.mp4`);

            if (!fs.existsSync(ytDlpPath)) {
                 throw new Error(`yt-dlp.exe not found!`);
            }

            // 3. Download Command
            // -f "best[ext=mp4]/best" tries to find the best single file with both video+audio
            // -S "res:720" limits it to 720p to keep file size reasonable for WhatsApp
            const command = `"${ytDlpPath}" -f "best[ext=mp4]/best" -S "res:720" -o "${outputPath}" "${video.url}"`;
            
            await execPromise(command);

            // 4. Check File Size before sending (WhatsApp has strict limits, usually ~64MB for bots)
            const stats = fs.statSync(outputPath);
            const fileSizeInMB = stats.size / (1024 * 1024);

            if (fileSizeInMB > 70) { // Safety buffer for WhatsApp's limit
                 fs.unlinkSync(outputPath);
                 return await sock.sendMessage(remoteJid, { text: '❌ Video is too big to send via WhatsApp.' });
            }

            await sock.sendMessage(remoteJid, { react: { text: "⬆️", key: msg.key } });

            // 5. Send Video
            await sock.sendMessage(remoteJid, { 
                video: { url: outputPath }, 
                caption: `🎥 *${video.title}*\nDuration: ${video.timestamp}`,
                gifPlayback: false 
            }, { quoted: msg });

            // 6. Cleanup
            fs.unlinkSync(outputPath);
            await sock.sendMessage(remoteJid, { react: { text: "✅", key: msg.key } });

        } catch (error) {
            console.error("Video command failed:", error.message);
            await sock.sendMessage(remoteJid, { text: '❌ Failed to download video.' });
        }
    }
};