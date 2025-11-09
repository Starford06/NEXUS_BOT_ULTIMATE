import 'dotenv/config';
import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, delay, downloadMediaMessage, getContentType, jidNormalizedUser } from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// --- CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../');
const SESSIONS_DIR = path.join(ROOT_DIR, 'data', 'sessions');
const COMMANDS_DIR = path.join(__dirname, 'commands');
const REPLIES_PATH = path.join(ROOT_DIR, 'data', 'autoreplies.json');
const SCHEDULES_PATH = path.join(ROOT_DIR, 'data', 'schedules.json');
const BADWORDS_PATH = path.join(ROOT_DIR, 'data', 'badwords.json');
const WARNS_PATH = path.join(ROOT_DIR, 'data', 'warns.json');
const CHAT_MODE_PATH = path.join(ROOT_DIR, 'data', 'chatmode.json');
const PLUGIN_DIR = path.resolve(__dirname, '../../plugins');

// 👇 SETTINGS 👇
global.OWNER_ID = process.env.OWNER_ID;
global.TEMP_MAIL_KEY = process.env.TEMP_MAIL_KEY;
// 👆👆👆👆👆👆👆

// --- GLOBAL STATE ---
const logger = pino({ level: 'silent' });
const sessions = new Map();
const commands = new Map();
let autoReplies = [];
let badWords = [];

function log(msg, type = 'SYSTEM', sessionId = '') {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] [${sessionId ? sessionId + '::' : ''}${type}] ${msg}`);
}

// --- OUTPUT INTERCEPTOR (For Console Logs) ---
function interceptSocket(originalSock, targetJid, sessionId) {
    return new Proxy(originalSock, {
        get(target, prop) {
            if (prop === 'sendMessage') {
                return async (jid, content, options) => {
                    const output = content.text || content.caption || (content.image ? '[IMAGE]' : '[MEDIA]');
                    // Log only if sending to the active chat to avoid spam
                    if (jid === targetJid || jid === targetJid + '@s.whatsapp.net') {
                         log(`>> ${output.substring(0, 100).replace(/\n/g, ' ')}...`, 'BOT', sessionId);
                    }
                    return await target.sendMessage(jid, content, options);
                };
            }
            return target[prop];
        }
    });
}

// --- BOT SESSION ---
async function startSession(id) {
    log(`Starting...`, 'INIT', id);
    const { state, saveCreds } = await useMultiFileAuthState(path.join(SESSIONS_DIR, id));
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version, auth: state, logger,
        printQRInTerminal: false, 
        browser: ["NEXUS-CONSOLE", "Chrome", "10.0"],
        connectTimeoutMs: 60000
    });

    sessions.set(id, sock);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log(`\n[${id}] SCAN QR BELOW:\n`);
            qrcode.generate(qr, { small: true });
            log('QR Ready. Scan it now.', 'AUTH', id);
        }
        if (connection === 'close') {
            const code = (lastDisconnect.error)?.output?.statusCode;
            if (code !== DisconnectReason.loggedOut && code !== 403 && code !== 405) {
                log(`Reconnecting in 5s... (Code: ${code})`, 'WARN', id);
                await delay(5000); startSession(id);
            } else {
                log('Session invalid/logged out.', 'ERROR', id);
                sessions.delete(id);
                try { fs.rmSync(path.join(SESSIONS_DIR, id), { recursive: true, force: true }); } catch {}
                if (id === 'main') { await delay(3000); startSession(id); }
            }
        } else if (connection === 'open') {
            log('>>> CONNECTED <<<', 'SUCCESS', id);
        }
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('messages.upsert', async m => {
        if (m.type !== 'notify') return;
        const msg = m.messages[0];
        if (!msg.message) return;
        const remoteJid = msg.key.remoteJid;
        const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').trim();

        if (!msg.key.fromMe && badWords.some(w => text.toLowerCase().includes(w))) return await sock.sendMessage(remoteJid, { delete: msg.key });
        const reply = autoReplies.find(r => text.toLowerCase().includes(r.trigger.toLowerCase()));
        if (reply && !msg.key.fromMe) return await sock.sendMessage(remoteJid, { text: reply.response }, { quoted: msg });

        if (text.startsWith('.')) {
            const cmdName = text.slice(1).split(' ')[0].toLowerCase();
            if (commands.has(cmdName)) {
                log(`Executing .${cmdName}`, 'CMD', id);
                try {
                    // Use interceptor for better logs
                    const monitoredSock = interceptSocket(sock, remoteJid, id);
                    const react = async(e) => { try{await sock.sendMessage(remoteJid,{react:{text:e,key:msg.key}})}catch{} };
                    
                    await commands.get(cmdName).execute(monitoredSock, msg, text.split(' ').slice(1), commands, null, react);
                } catch (e) {
                    log(`Error: ${e.message}`, 'ERROR', id);
                }
            }
        }
    });
}

// --- INIT & AUTO-RELOADER ---
async function loadData() {
    [SESSIONS_DIR, COMMANDS_DIR, path.dirname(REPLIES_PATH)].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });
    [REPLIES_PATH, BADWORDS_PATH, SCHEDULES_PATH, WARNS_PATH, CHAT_MODE_PATH].forEach(p => { if(!fs.existsSync(p)) fs.writeFileSync(p, (p===WARNS_PATH||p===CHAT_MODE_PATH)?'{}':'[]', 'utf8'); });

    try { autoReplies = JSON.parse(fs.readFileSync(REPLIES_PATH, 'utf8')); } catch { autoReplies = []; }
    try { badWords = JSON.parse(fs.readFileSync(BADWORDS_PATH, 'utf8')); } catch { badWords = []; }

    commands.clear();
    fs.readdirSync(COMMANDS_DIR).filter(f => f.endsWith('.js')).forEach(async f => {
        try {
            const m = await import(`file://${path.join(COMMANDS_DIR, f)}?t=${Date.now()}`);
            if (m.command?.name) commands.set(m.command.name, m.command);
        } catch (e) { log(`Failed to load ${f}`, 'ERROR'); }
    });
    log(`Loaded ${commands.size} commands.`, 'INIT');
}

// Auto-Reload Watcher
let isReloading = false;
try {
    fs.watch(COMMANDS_DIR, async (e, f) => {
        if (f?.endsWith('.js') && !isReloading) {
            isReloading = true; await delay(1000);
            log(`Change detected in ${f}. Reloading...`, 'WATCHER');
            await loadData();
            isReloading = false;
        }
    });
} catch (e) {}

// Start
loadData().then(() => {
    startSession('main');
    // Auto-start other sessions if they exist
    if (fs.existsSync(SESSIONS_DIR)) {
        fs.readdirSync(SESSIONS_DIR).forEach(id => {
            if (id !== 'main' && fs.statSync(path.join(SESSIONS_DIR, id)).isDirectory()) startSession(id);
        });
    }
});