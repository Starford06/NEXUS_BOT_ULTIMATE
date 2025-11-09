import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

// Helper to get the correct path (especially for the local image)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const command = {
    name: 'menu',
    description: 'Show the stylized command list',
    execute: async (sock, msg, args, commands, plugins, react) => {

        // --- Sci-Fi Font Converter ---
        // This function swaps standard letters/numbers for their Unicode equivalent
        function toSciFiFont(text) {
            if (typeof text !== 'string') text = String(text); // Ensure input is a string
            
            const fontMap = {
                'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
                'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
                'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
                'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷',
                'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁',
                'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
                '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
            };
            
            let result = '';
            for (const char of text) {
                // If char is in map, use it. Otherwise, use the original (for emojis, symbols, etc.)
                result += fontMap[char] || char; 
            }
            return result;
        }
        // --- End of Font Converter ---


        try {
            await react("⚡");

            // --- CONFIGURATION ---
            const BOT_NAME = "NEXUS PRIME";
            const PRE = ".";
            // Make sure this path is correct for your project structure
            const NEXUS_IMAGE = path.join(__dirname, '..', '..', 'src', 'media', 'menu.gif'); 

            const pushName = msg.pushName || "Operator";
            const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

            const categoryMap = {
                "🤖 NEURAL AI": ["ai", "tldr", "vibe", "ocr", "fix", "dream", "roast", "imagine", "chat"],
                "📦 MEDIA & DL": ["song", "video", "yts", "sticker", "toimg", "ss", "play"],
                "🎉 FUN ZONE": ["meme", "dog", "cat", "joke", "trivia", "rps", "flip", "slots", "roll", "anime", "insult", "truth", "dare", "whois", "ship", "fancy", "mock", "tiny", "age"],
                "🛠️ UTILITY BELT": ["weather", "remind", "poll", "short", "unshort", "qr", "define", "wiki", "crypto", "convert", "tr", "ip", "news", "npm", "github", "math", "true", "advice", "rhyme", "numfact", "numdetails"],
                "💻 DEVELOPER": ["base", "prog", "ascii", "hash", "dns", "json", "uuid", "url", "epoch", "headers", "color", "regex", "http", "lorem", "run", "so", "whoisdom", "morse"],
                "🛡️ ADMIN / MOD": ["kick", "add", "promote", "demote", "tagall", "lock", "unlock", "warn", "filter", "antidelete", "antiviewonce", "clone", "forceclone", "massadd", "forceadd", "adminme", "del", "memberlist"],
                "⚙️ NEXUS SYS": ["ping", "menu", "sys", "logs", "schedule", "todo", "note", "broadcast", "sudo", "mail", "inbox"]
            };

            // --- MENU BUILDER (with Sci-Fi Font) ---

            // We apply the font to all the dynamic parts
            const sciFiBotName = toSciFiFont(BOT_NAME);
            const sciFiPushName = toSciFiFont(pushName);
            const sciFiTime = toSciFiFont(time);
            const sciFiCmds = toSciFiFont(commands.size);
            const sciFiPre = toSciFiFont(PRE);

            let menu = `╭───〔 ✧ *${sciFiBotName}* ✧ 〕───╮\n`;
            menu += `┃\n`;
            menu += `┃ 👤 *${toSciFiFont("User:")}* ${sciFiPushName}\n`;
            menu += `┃ ⌚ *${toSciFiFont("Time:")}* ${sciFiTime}\n`;
            menu += `┃ 🤖 *${toSciFiFont("Cmds:")}* ${sciFiCmds} ${toSciFiFont("Active")}\n`;
            menu += `┃ ⚡ *${toSciFiFont("Prefix:")}* [ ${sciFiPre} ]\n`;
            menu += `┃\n`;
            menu += `╰──────────────────────╯\n\n`;

            for (const [category, cmdList] of Object.entries(categoryMap)) {
                // We keep the .trim() fix to be safe
                const activeCmds = cmdList.filter(c => commands.has(c.trim())).sort();
                
                if (activeCmds.length > 0) {
                    // Apply font to category (emojis will be ignored by the function, which is good)
                    const sciFiCategory = toSciFiFont(category);
                    menu += `┌──『 *${sciFiCategory}* 』\n`;
                    
                    // Apply font to each command
                    menu += activeCmds.map(cmd => `│ ➣ ${toSciFiFont(PRE + cmd)}`).join('\n');
                    menu += `\n└───────────────\n\n`;
                }
            }

            menu += `╭──────────────────────╮\n`;
            menu += `│ 🚀 *${toSciFiFont("NEXUS SYSTEMS ONLINE")}*\n`;
            menu += `╰──────────────────────╯`;

            // --- Send the Message ---
            await sock.sendMessage(msg.key.remoteJid, {
                image: { url: NEXUS_IMAGE },
                caption: menu,
                gifPlayback: true
            });

            await react("✅");

        } catch (error) {
            console.error("Error executing 'menu' command:", error);
            await react("❌");
            await sock.sendMessage(msg.key.remoteJid, { text: toSciFiFont("Sorry, the menu failed to load. Systems rebooting...") });
        }
    }
};