import fs from 'fs';
import path from 'path';

// Parse .env file if it exists
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
        // Ignore comments and empty lines
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        
        // Find the first '='
        const index = trimmed.indexOf('=');
        if (index === -1) return;
        
        const key = trimmed.substring(0, index).trim();
        let value = trimmed.substring(index + 1).trim();
        
        // Remove surrounding quotes if they exist
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.substring(1, value.length - 1);
        }
        
        // Unescape newlines if any
        value = value.replace(/\\n/g, '\n');
        
        // Only set if not already set by environment
        if (!process.env[key]) {
            process.env[key] = value;
        }
    });
}

// Build configuration block with Lorem Ipsum fallbacks
const config = {
    TITLE: process.env.TITLE || "Lorem Ipsum",
    SUBTITLE: process.env.SUBTITLE || "Dolor sit amet, consectetur adipiscing elit.",
    OPEN_BTN_TEXT: process.env.OPEN_BTN_TEXT || "Open me",
    PAGE_DATE: process.env.PAGE_DATE || "January 2000",
    JOURNAL_TITLE: process.env.JOURNAL_TITLE || "Lorem Message",
    JOURNAL_ENTRIES: [
        process.env.JOURNAL_ENTRY_1 || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        process.env.JOURNAL_ENTRY_2 || "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        process.env.JOURNAL_ENTRY_3 || "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    ],
    POLAROID_1_CAPTION: process.env.POLAROID_1_CAPTION || "Lorem 1",
    POLAROID_2_CAPTION: process.env.POLAROID_2_CAPTION || "Lorem 2",
    POLAROID_3_CAPTION: process.env.POLAROID_3_CAPTION || "Lorem 3",
    POLAROID_3_TEXT_1: process.env.POLAROID_3_TEXT_1 || "Lorem",
    POLAROID_3_TEXT_2: process.env.POLAROID_3_TEXT_2 || "Ipsum",
    LETTER_TITLE: process.env.LETTER_TITLE || "Dear Lorem,",
    LETTER_PARAGRAPHS: [
        process.env.LETTER_PARAGRAPH_1 || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        process.env.LETTER_PARAGRAPH_2 || "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        process.env.LETTER_PARAGRAPH_3 || "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    ],
    LETTER_SIGNATURE: process.env.LETTER_SIGNATURE || "Lorem!!!",
    MUSIC_TITLE: process.env.MUSIC_TITLE || "Lorem Beats",
    STICKER_PANEL_TITLE: process.env.STICKER_PANEL_TITLE || "Add Some Stickers!"
};

// Helper to recursively unescape newlines in strings and arrays
function unescapeNewlines(val) {
    if (typeof val === 'string') {
        return val.replace(/\\n/g, '\n');
    }
    if (Array.isArray(val)) {
        return val.map(unescapeNewlines);
    }
    return val;
}

// Apply unescaping to all config values
for (const key in config) {
    config[key] = unescapeNewlines(config[key]);
}

// Helper to recursively obfuscate strings to Base64
function obfuscate(val) {
    if (typeof val === 'string') {
        return Buffer.from(val, 'utf8').toString('base64');
    }
    if (Array.isArray(val)) {
        return val.map(obfuscate);
    }
    return val;
}

// Obfuscate all values to Base64 for privacy in public Git history
for (const key in config) {
    config[key] = obfuscate(config[key]);
}

// Write config.js
const fileContent = `// Auto-generated configuration file. Do not edit directly.\nwindow.CONFIG = ${JSON.stringify(config, null, 2)};\n`;
fs.writeFileSync(path.resolve('config.js'), fileContent, 'utf8');
console.log('config.js generated successfully!');
