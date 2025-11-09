export const command = {
    name: 'pass',
    description: 'Generate a strong password: .pass <length>',
    execute: async (sock, msg, args, cmd, plug, react) => {
        await react("🔐");
        
        // Default length 12, max length 64 to prevent spam
        let length = parseInt(args[0]) || 12;
        if (length > 64) length = 64;
        if (length < 4) length = 4;

        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let password = "";
        
        // Ensure at least one of each type for strength
        password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
        password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
        password += "0123456789"[Math.floor(Math.random() * 10)];
        password += "!@#$%^&*()_+"[Math.floor(Math.random() * 12)];

        // Fill the rest
        for (let i = 4; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        // Shuffle the password
        password = password.split('').sort(() => 0.5 - Math.random()).join('');

        // Send it in a way that's easy to copy (monospace font)
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🔑 *Generated Password (${length} chars):*\n\n\`\`\`${password}\`\`\`` 
        }, { quoted: msg });
        
        await react("✅");
    }
};