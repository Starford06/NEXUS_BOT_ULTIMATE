import axios from 'axios';
import * as cheerio from 'cheerio'; // Ensure you installed this earlier: npm install cheerio

export const command = {
    name: 'google',
    description: 'Search the web (Multi-Server Redundancy)',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Give me something to search for.' });

        await react("🔍");
        const query = args.join(' ');

        // 1. Huge list of public SearXNG instances to try
        const instances = [
            "https://searx.be/search",
            "https://search.sapti.me/search",
            "https://northboot.xyz/search",
            "https://searx.work/search",
            "https://paulgo.io/search",
            "https://searx.tiekoetter.com/search",
            "https://search.ononoki.org/search",
            "https://opnxng.com/search"
        ];

        // Try instances one by one
        for (const base of instances) {
            try {
                const { data } = await axios.get(base, {
                    params: { q: query, format: 'json', language: 'en-US', safesearch: 1 },
                    timeout: 4000 // Short timeout to fail fast and try next
                });

                if (data.results && data.results.length > 0) {
                    return await sendResults(sock, msg, data.results, react);
                }
            } catch (e) { continue; }
        }

        // 2. FINAL FALLBACK: Direct DuckDuckGo HTML Scrape (If all above fail)
        try {
            const { data } = await axios.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
            });
            const $ = cheerio.load(data);
            const results = [];
            $('.result__body').each((i, el) => {
                if (results.length >= 5) return false;
                const title = $(el).find('.result__a').text();
                const link = $(el).find('.result__a').attr('href');
                const snippet = $(el).find('.result__snippet').text();
                if (title && link) results.push({ title, url: link, content: snippet });
            });

            if (results.length > 0) {
                return await sendResults(sock, msg, results, react);
            }
        } catch (e) {
            console.error("All search methods failed:", e.message);
        }

        await sock.sendMessage(msg.key.remoteJid, { text: '❌ Everything failed. The internet might be broken right now.' });
        await react("❌");
    }
};

// Helper function to format and send
async function sendResults(sock, msg, results, react) {
    let text = `🔍 *Search Results*\n\n`;
    const unique = new Set();
    results.filter(r => !unique.has(r.url) && unique.add(r.url)).slice(0, 5).forEach((res, i) => {
        text += `*${i + 1}. ${res.title}*\n`;
        if (res.content || res.snippet) text += `_${(res.content || res.snippet).trim().substring(0, 100)}..._\n`;
        text += `🔗 ${res.url}\n\n`;
    });
    await sock.sendMessage(msg.key.remoteJid, { text });
    await react("✅");
}