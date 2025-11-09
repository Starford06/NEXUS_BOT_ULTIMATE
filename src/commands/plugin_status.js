// src/commands/plugin_status.js (Simple Version)
import { getStatusReport } from '../../plugins/status.js';

export const command = {
    name: 'plugin_status',
    description: 'Shows status via the plugin system',
    execute: async (sock, msg, args, allCommands) => {
        const report = getStatusReport();
        await sock.sendMessage(msg.key.remoteJid, { text: report });
    }
};