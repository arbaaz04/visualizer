// IBA Karachi - Department of Computer Science
// CSE-302: Computer Architecture Homework Verification
// Submitted to: Dr. Salman Zaffar
// Headless Cache Simulator & Register States (JSDOM Headless)

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

describe('Scrapbook Web App UI', () => {
    let dom;
    let document;
    let window;

    beforeEach(() => {
        vi.useFakeTimers();

        dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
        document = dom.window.document;
        window = dom.window;

        // Mock HTMLAudioElement properties & methods
        window.HTMLAudioElement.prototype.play = vi.fn().mockImplementation(() => Promise.resolve());
        window.HTMLAudioElement.prototype.pause = vi.fn();
        
        // Inject config script execution
        const configContent = fs.readFileSync(path.resolve(__dirname, './config.js'), 'utf8');
        const configEl = document.createElement('script');
        configEl.textContent = configContent;
        document.body.appendChild(configEl);

        // Inject script execution
        const scriptContent = fs.readFileSync(path.resolve(__dirname, './app.js'), 'utf8');
        const scriptEl = document.createElement('script');
        scriptEl.textContent = scriptContent;
        document.body.appendChild(scriptEl);

        // Dispatch DOMContentLoaded to trigger our application code
        const event = new window.Event('DOMContentLoaded');
        document.dispatchEvent(event);
    });

    it('should initialize with cover visible and pages hidden', () => {
        const cover = document.getElementById('scrapbook-cover');
        const pages = document.getElementById('scrapbook-pages');
        expect(cover.classList.contains('opened')).toBe(false);
        expect(pages.classList.contains('hidden')).toBe(true);
    });

    it('should open scrapbook and reveal pages when open button is clicked', () => {
        const openBtn = document.getElementById('open-book-btn');
        const cover = document.getElementById('scrapbook-cover');
        const pages = document.getElementById('scrapbook-pages');

        openBtn.click();

        // Cover starts animation immediately
        expect(cover.classList.contains('opened')).toBe(true);
        
        // Pages should show after the 300ms transition timeout in app.js
        vi.advanceTimersByTime(350);
        expect(pages.classList.contains('hidden')).toBe(false);
    });

    it('should close scrapbook when close button is clicked', () => {
        const openBtn = document.getElementById('open-book-btn');
        const closeBtn = document.getElementById('close-book-btn');
        const cover = document.getElementById('scrapbook-cover');
        const pages = document.getElementById('scrapbook-pages');

        // First open it
        openBtn.click();
        vi.advanceTimersByTime(350);
        expect(pages.classList.contains('hidden')).toBe(false);

        // Then close it
        closeBtn.click();
        expect(pages.classList.contains('hidden')).toBe(true);
        expect(cover.classList.contains('opened')).toBe(false);
    });

    it('should show the letter modal when clicking the envelope', () => {
        const envelope = document.getElementById('envelope');
        const letterModal = document.getElementById('letter-modal');

        expect(letterModal.classList.contains('hidden')).toBe(true);

        envelope.click();
        expect(letterModal.classList.contains('hidden')).toBe(false);
    });
});
