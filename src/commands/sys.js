import os from 'os';

export const command = {
    name: 'sys',
    description: 'Shows system stats (No extra dependencies)',
    execute: async (sock, msg, args) => {
        const start = Date.now();
        
        // Calculate RAM
        const totalMem = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
        const freeMem = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
        const usedMem = (totalMem - freeMem).toFixed(2);
        
        // Calculate Uptime
        const uptimeSec = os.uptime();
        const hours = Math.floor(uptimeSec / 3600);
        const minutes = Math.floor((uptimeSec % 3600) / 60);

        // CPU Info
        const cpus = os.cpus();
        const cpuModel = cpus.length > 0 ? cpus[0].model : 'Unknown CPU';
        const cores = cpus.length;

        const text = `🖥️ *SYSTEM STATUS* 🖥️\n\n` +
                     `💻 *Platform:* ${os.type()} ${os.release()} (${os.arch()})\n` +
                     `🧠 *RAM:* ${usedMem}GB / ${totalMem}GB\n` +
                     `⏱️ *Uptime:* ${hours}h ${minutes}m\n` +
                     `🔲 *CPU:* ${cores}x Cores\n_(${cpuModel})_\n` +
                     `📶 *Bot Speed:* ${Date.now() - start}ms`;

        await sock.sendMessage(msg.key.remoteJid, { text: text });
    }
};