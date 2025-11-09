import fs from 'fs';
import os from 'os';
import path from 'path';

export const command = {
    name: 'ls',
    description: 'Lists bot-downloaded files in the temp directory',
    execute: async (sock, msg, args) => {
        const tempDir = os.tmpdir();
        const remoteJid = msg.key.remoteJid;

        try {
            const files = fs.readdirSync(tempDir)
                .filter(name => name.endsWith('.m4a') || name.endsWith('.mp4')); // Filter for media
            
            if (files.length === 0) {
                return await sock.sendMessage(remoteJid, { text: '📂 No media files found in temp folder.' });
            }

            let responseText = '📂 *Temporary Media Files* 📂\n\n';
            files.forEach((file, index) => {
                const filePath = path.join(tempDir, file);
                const stats = fs.statSync(filePath);
                const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
                responseText += `${index + 1}. \`${file}\` (${sizeMB} MB)\n`;
            });

            responseText += '\n_Use .del_file <ID> to delete a file._';
            await sock.sendMessage(remoteJid, { text: responseText });

        } catch (e) {
            console.error("LS command failed:", e);
            await sock.sendMessage(remoteJid, { text: '❌ Failed to read temp directory.' });
        }
    }
};