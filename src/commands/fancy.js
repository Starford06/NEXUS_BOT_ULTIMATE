export const command = {
    name: 'fancy',
    description: 'Convert text to fancy fonts: .fancy Hello World',
    execute: async (sock, msg, args) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide text to fancify.' });

        const text = args.join(' ');

        // Simple mapping for a few cool fonts
        const fonts = {
            script: t => t.replace(/[a-zA-Z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c >= 'a' ? 119997 : 119939))),
            bold: t => t.replace(/[0-9a-zA-Z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c >= 'a' ? 120205 : (c >= 'A' ? 120153 : 120744)))),
            monospace: t => t.replace(/[0-9a-zA-Z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c >= 'a' ? 104225 : (c >= 'A' ? 104193 : 104279)))),
            bubbles: t => t.replace(/[0-9a-zA-Z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c >= 'a' ? 9375 : (c >= 'A' ? 9375 : 9434)))) // simplified mapping
        };

        let response = `✨ *Fancy Text Generator* ✨\n\n`;
        response += `*Script:* ${fonts.script(text)}\n\n`;
        response += `*Bold:* ${fonts.bold(text)}\n\n`;
        response += `*Mono:* ${fonts.monospace(text)}\n`;
        // Note: Full font mapping is huge, this is a basic demo version. 
        // For perfect results, a dedicated library like 'fancy-text-generator' is better,
        // but this works without extra installs for basic English letters.

        await sock.sendMessage(msg.key.remoteJid, { text: response });
    }
};