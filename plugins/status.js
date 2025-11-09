// plugins/status.js
// This module exports a simple function that can be called by the bot core.

export function getStatusReport() {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    return `*Plugin System Active*\n` +
           `Core Uptime: ${hours}h ${minutes}m\n` +
           `Status: Operational.`;
}

// You can add more complex functions here.