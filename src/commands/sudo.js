import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SUDO_PATH = path.resolve(__dirname, '../../data/sudo.json');

export const command = {
    name: 'sudo',
    description: 'Add/Remove trusted bot admins (Owner Only)',
    execute: async (sock, msg, args, cmd, plug, react) => {
        const sender = msg.key.participant || msg.key.remoteJid;
        if (sender !== global.OWNER_ID) return;

        if (args.length < 2) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .sudo add/del 2547...' });

        const action = args[0].toLowerCase();
        const target = args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        
        let sudoList = [];
        try { sudoList = JSON.parse(fs.readFileSync(SUDO_PATH, 'utf8')); } catch (e) {}

        if (action === 'add') {
            if (!sudoList.includes(target)) sudoList.push(target);
            await sock.sendMessage(msg.key.remoteJid, { text: `✅ Added @${target.split('@')[0]} to Sudo list.`, mentions: [target] });
        } else if (action === 'del') {
            sudoList = sudoList.filter(id => id !== target);
            await sock.sendMessage(msg.key.remoteJid, { text: `🗑️ Removed @${target.split('@')[0]} from Sudo list.`, mentions: [target] });
        }
        
        fs.writeFileSync(SUDO_PATH, JSON.stringify(sudoList));
    }
};