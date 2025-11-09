import fs from 'fs';
import os from 'os';
import path from 'path';

export const command = {
    name: 'del_file',
    description: 'Deletes a file listed by .ls',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;
        if (args.length === 0 || isNaN(args[0])) {
            return await sock.sendMessage(remoteJid, { text: '❌ Usage: .del_file <ID>. Get ID from .ls command.' });
        }

        const fileIndex = parseInt(args[0]) - 1; // Convert 1-based index to 0-based
        const tempDir = os.tmpdir();
        
        try {
            const files = fs.readdirSync(tempDir)
                .filter(name => name.endsWith('.m4a') || name.endsWith('.mp4'));

            if (fileIndex < 0 || fileIndex >= files.length) {
                return await sock.sendMessage(remoteJid, { text: `⚠️ Invalid file ID.` });
            }
            
            const fileToDelete = files[fileIndex];
            const filePath = path.join(tempDir, fileToDelete);

            fs.unlinkSync(filePath);
            await sock.sendMessage(remoteJid, { text: `🗑️ File \`${fileToDelete}\` deleted successfully.` });

        } catch (e) {
            console.error("DEL_FILE command failed:", e);
            await sock.sendMessage(remoteJid, { text: '❌ System error deleting file.' });
        }
    }
};