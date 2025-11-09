import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TODO_PATH = path.resolve(__dirname, '../../data/todos.json');

export const command = {
    name: 'todo',
    description: 'Manage tasks: .todo add <task>, .todo list, .todo del <ID>',
    execute: async (sock, msg, args) => {
        const remoteJid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid; // User's unique ID
        
        if (args.length === 0) return await sock.sendMessage(remoteJid, { text: '❌ Usage: .todo add/list/del' });

        const action = args[0].toLowerCase();
        let allTodos = {};
        try { allTodos = JSON.parse(fs.readFileSync(TODO_PATH, 'utf8')); } catch (e) { allTodos = {}; }
        
        if (!allTodos[sender]) allTodos[sender] = []; // Initialize user's list if missing

        if (action === 'add') {
            const task = args.slice(1).join(' ');
            if (!task) return await sock.sendMessage(remoteJid, { text: '❌ Provide a task to add.' });
            allTodos[sender].push(task);
            fs.writeFileSync(TODO_PATH, JSON.stringify(allTodos, null, 2));
            await sock.sendMessage(remoteJid, { text: `✅ Added task: "${task}"` });
        } 
        else if (action === 'list') {
            if (allTodos[sender].length === 0) return await sock.sendMessage(remoteJid, { text: '📂 Your to-do list is empty.' });
            let text = '📝 *Your To-Do List* 📝\n\n';
            allTodos[sender].forEach((task, i) => text += `${i + 1}. ${task}\n`);
            await sock.sendMessage(remoteJid, { text });
        } 
        else if (action === 'del') {
            const index = parseInt(args[1]) - 1;
            if (isNaN(index) || index < 0 || index >= allTodos[sender].length) return await sock.sendMessage(remoteJid, { text: '❌ Invalid task ID.' });
            const removed = allTodos[sender].splice(index, 1);
            fs.writeFileSync(TODO_PATH, JSON.stringify(allTodos, null, 2));
            await sock.sendMessage(remoteJid, { text: `🗑️ Deleted task: "${removed}"` });
        }
    }
};