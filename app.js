/* =========================================================================
   IBA Karachi - CSE-302: Computer Architecture Homework Assignment
   Submitted to: Dr. Salman Zaffar
   Cache Memory Mapping Visualizer & Signal Processor Interactions
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const bgMusic = document.getElementById("bg-music");
    const popSound = document.getElementById("pop-sound");
    const paperSound = document.getElementById("paper-sound");

    const musicWidget = document.getElementById("music-widget");
    const musicToggleBtn = document.getElementById("music-toggle-btn");
    const musicStatus = musicWidget.querySelector(".music-status");
    const musicVinyl = document.getElementById("music-vinyl");

    const scrapbookCover = document.getElementById("scrapbook-cover");
    const scrapbookPages = document.getElementById("scrapbook-pages");
    const openBookBtn = document.getElementById("open-book-btn");
    const closeBookBtn = document.getElementById("close-book-btn");

    const entryText = document.getElementById("entry-text");
    const prevEntryBtn = document.getElementById("prev-entry-btn");
    const nextEntryBtn = document.getElementById("next-entry-btn");
    const entryPageNum = document.getElementById("entry-page-num");

    const envelope = document.getElementById("envelope");
    const letterModal = document.getElementById("letter-modal");
    const closeLetterBtn = document.getElementById("close-letter-btn");

    const sparklesContainer = document.getElementById("sparkles");
    const stickerItems = document.querySelectorAll(".sticker-item");
    const scrapbookPageElements = document.querySelectorAll(".scrapbook-page");

    // Audio Setup
    bgMusic.volume = 0.25; // Keep background track gentle
    popSound.volume = 0.4;
    paperSound.volume = 0.5;

    // Load config from window.CONFIG (loaded from config.js)
    // with local defaults fallback
    const config = window.CONFIG || {
        TITLE: "Lorem Ipsum",
        SUBTITLE: "Dolor sit amet, consectetur adipiscing elit.",
        OPEN_BTN_TEXT: "Open me",
        PAGE_DATE: "January 2000",
        JOURNAL_TITLE: "Lorem Message",
        JOURNAL_ENTRIES: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        ],
        POLAROID_1_CAPTION: "Lorem 1",
        POLAROID_2_CAPTION: "Lorem 2",
        POLAROID_3_CAPTION: "Lorem 3",
        POLAROID_3_TEXT_1: "Lorem",
        POLAROID_3_TEXT_2: "Ipsum",
        LETTER_TITLE: "Dear Lorem,",
        LETTER_PARAGRAPHS: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        ],
        LETTER_SIGNATURE: "Lorem!!!",
        MUSIC_TITLE: "Lorem Beats",
        STICKER_PANEL_TITLE: "Add Some Stickers!"
    };

    // Update DOM texts from configuration
    try {
        if (document.title) {
            document.title = config.TITLE;
        }
        
        const coverTitle = document.getElementById("cover-title");
        if (coverTitle) coverTitle.textContent = config.TITLE;
        
        const coverSubtitle = document.getElementById("cover-subtitle");
        if (coverSubtitle) coverSubtitle.textContent = config.SUBTITLE;
        
        const openBtnText = document.getElementById("open-btn-text");
        if (openBtnText) openBtnText.textContent = config.OPEN_BTN_TEXT;
        
        const musicTitle = document.getElementById("music-title");
        if (musicTitle) musicTitle.textContent = config.MUSIC_TITLE;
        
        const pageDate = document.getElementById("page-date");
        if (pageDate) pageDate.textContent = config.PAGE_DATE;
        
        const journalTitle = document.getElementById("journal-title");
        if (journalTitle) journalTitle.textContent = config.JOURNAL_TITLE;
        
        const polaroid1Caption = document.getElementById("polaroid-1-caption");
        if (polaroid1Caption) polaroid1Caption.textContent = config.POLAROID_1_CAPTION;
        
        const polaroid2Caption = document.getElementById("polaroid-2-caption");
        if (polaroid2Caption) polaroid2Caption.textContent = config.POLAROID_2_CAPTION;
        
        const polaroid3Caption = document.getElementById("polaroid-3-caption");
        if (polaroid3Caption) polaroid3Caption.textContent = config.POLAROID_3_CAPTION;
        
        const polaroid3Text1 = document.getElementById("polaroid-3-text-1");
        if (polaroid3Text1) polaroid3Text1.textContent = config.POLAROID_3_TEXT_1;
        
        const polaroid3Text2 = document.getElementById("polaroid-3-text-2");
        if (polaroid3Text2) polaroid3Text2.textContent = config.POLAROID_3_TEXT_2;
        
        const stickerPanelTitle = document.getElementById("sticker-panel-title");
        if (stickerPanelTitle) stickerPanelTitle.textContent = config.STICKER_PANEL_TITLE;

        // Render letter content dynamically
        const letterLines = document.querySelector(".letter-lines");
        if (letterLines) {
            letterLines.innerHTML = ""; // Clear
            
            const letterTitle = document.createElement("h2");
            letterTitle.className = "letter-title";
            letterTitle.id = "letter-title";
            letterTitle.textContent = config.LETTER_TITLE;
            letterLines.appendChild(letterTitle);
            
            config.LETTER_PARAGRAPHS.forEach(paraText => {
                const p = document.createElement("p");
                p.className = "letter-paragraph";
                p.textContent = paraText;
                letterLines.appendChild(p);
            });
            
            const signature = document.createElement("p");
            signature.className = "letter-signature";
            signature.textContent = config.LETTER_SIGNATURE;
            letterLines.appendChild(signature);
        }
    } catch (e) {
        console.error("Failed to populate configurations:", e);
    }

    // Journal Entry Messages
    const journalEntries = config.JOURNAL_ENTRIES;
    let currentEntryIndex = 0;

    // Set initial text content and indicator
    if (entryText && journalEntries.length > 0) {
        entryText.textContent = journalEntries[0];
    }
    if (entryPageNum && journalEntries.length > 0) {
        entryPageNum.textContent = `Page 1 / ${journalEntries.length}`;
    }

    // --- 1. Sound Control & Background Music ---
    let isMusicPlaying = false;

    function toggleMusic() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicStatus.textContent = "Paused";
            musicVinyl.style.animationPlayState = "paused";
            musicToggleBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
        } else {
            bgMusic.play().catch(err => console.log("Audio play blocked by browser. Ready on interaction."));
            musicStatus.textContent = "Playing";
            musicVinyl.style.animationPlayState = "running";
            musicToggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }
        isMusicPlaying = !isMusicPlaying;
    }

    musicToggleBtn.addEventListener("click", toggleMusic);

    function playSound(sound) {
        sound.currentTime = 0;
        sound.play().catch(e => { });
    }

    // --- 2. Scrapbook Open/Close Animations ---
    openBookBtn.addEventListener("click", () => {
        playSound(paperSound);
        scrapbookCover.classList.add("opened");

        // Let cover slide open then show inner pages
        setTimeout(() => {
            scrapbookPages.classList.remove("hidden");
        }, 300);

        // Auto play music on book open if not already playing (helps with user action policy)
        if (!isMusicPlaying) {
            toggleMusic();
        }
    });

    closeBookBtn.addEventListener("click", () => {
        playSound(paperSound);
        scrapbookPages.classList.add("hidden");
        scrapbookCover.classList.remove("opened");
    });

    // --- 3. Journal Entry Pagination ---
    function updateJournalPage() {
        // Fade out
        entryText.style.opacity = 0;

        setTimeout(() => {
            entryText.textContent = journalEntries[currentEntryIndex];
            entryPageNum.textContent = `Page ${currentEntryIndex + 1} / ${journalEntries.length}`;

            // Fade in
            entryText.style.opacity = 1;

            // Toggle nav buttons
            prevEntryBtn.disabled = currentEntryIndex === 0;
            nextEntryBtn.disabled = currentEntryIndex === journalEntries.length - 1;
        }, 200);
    }

    prevEntryBtn.addEventListener("click", () => {
        if (currentEntryIndex > 0) {
            currentEntryIndex--;
            playSound(paperSound);
            updateJournalPage();
        }
    });

    nextEntryBtn.addEventListener("click", () => {
        if (currentEntryIndex < journalEntries.length - 1) {
            currentEntryIndex++;
            playSound(paperSound);
            updateJournalPage();
        }
    });

    // --- 4. Interactive Envelope popup ---
    envelope.addEventListener("click", () => {
        playSound(paperSound);
        letterModal.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // Disable background scrolling
    });

    closeLetterBtn.addEventListener("click", () => {
        playSound(paperSound);
        letterModal.classList.add("hidden");
        document.body.style.overflow = ""; // Re-enable background scrolling
    });

    letterModal.addEventListener("click", (e) => {
        if (e.target === letterModal) {
            playSound(paperSound);
            letterModal.classList.add("hidden");
            document.body.style.overflow = ""; // Re-enable background scrolling
        }
    });

    // --- 5. Interactive Drag and Drop Stickers ---
    let draggedStickerEmoji = "";

    stickerItems.forEach(item => {
        // Setup Drag start (Desktop)
        item.addEventListener("dragstart", (e) => {
            draggedStickerEmoji = item.getAttribute("data-emoji");
            e.dataTransfer.setData("text/plain", draggedStickerEmoji);
        });

        // Setup Touch-Drag for Mobile (iOS Safari / Android)
        let activeTouchClone = null;
        let touchStartEmoji = "";
        let touchStartX = 0;
        let touchStartY = 0;
        let isDrag = false;

        item.addEventListener("touchstart", (e) => {
            if (e.touches.length > 1) return; // ignore multi-touch

            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            isDrag = false;
            touchStartEmoji = item.getAttribute("data-emoji") || item.textContent;

            // Create temporary floating sticker clone
            activeTouchClone = document.createElement("div");
            activeTouchClone.classList.add("placed-sticker", "dragging-active");
            activeTouchClone.textContent = touchStartEmoji;

            // Position initially centered on finger using translate3d
            activeTouchClone.style.left = "0px";
            activeTouchClone.style.top = "0px";
            activeTouchClone.style.transform = `translate3d(${touch.clientX}px, ${touch.clientY}px, 0) translate(-50%, -50%) scale(1.4) rotate(12deg)`;

            document.body.appendChild(activeTouchClone);
            playSound(popSound);

            // Prevent body scrolling while dragging
            e.preventDefault();
        }, { passive: false });

        item.addEventListener("touchmove", (e) => {
            if (!activeTouchClone) return;

            const touch = e.touches[0];
            const dist = Math.hypot(touch.clientX - touchStartX, touch.clientY - touchStartY);
            if (dist > 8) {
                isDrag = true;
            }

            // Move clone smoothly with translate3d centered on finger
            activeTouchClone.style.transform = `translate3d(${touch.clientX}px, ${touch.clientY}px, 0) translate(-50%, -50%) scale(1.4) rotate(12deg)`;

            e.preventDefault();
        }, { passive: false });

        item.addEventListener("touchend", (e) => {
            if (!activeTouchClone) return;

            const touch = e.changedTouches[0];
            const clientX = touch.clientX;
            const clientY = touch.clientY;

            const dist = Math.hypot(clientX - touchStartX, clientY - touchStartY);
            if (dist <= 8 && !isDrag) {
                // Quick tap fallback: Drop sticker in the center of the right page
                const rightPage = document.querySelector(".page-right");
                const rect = rightPage.getBoundingClientRect();
                const randomX = Math.random() * (rect.width - 60) + 30;
                const randomY = Math.random() * (rect.height - 180) + 120;
                placeSticker(touchStartEmoji, randomX, randomY, rightPage);
            } else {
                let targetPage = null;
                let relativeX = 0;
                let relativeY = 0;

                // Determine which page the coordinate fell inside
                scrapbookPageElements.forEach(page => {
                    const rect = page.getBoundingClientRect();
                    if (
                        clientX >= rect.left &&
                        clientX <= rect.right &&
                        clientY >= rect.top &&
                        clientY <= rect.bottom
                    ) {
                        targetPage = page;
                        relativeX = clientX - rect.left;
                        relativeY = clientY - rect.top;
                    }
                });

                // Place it permanently if dropped inside a page
                if (targetPage) {
                    placeSticker(touchStartEmoji, relativeX, relativeY, targetPage);
                }
            }

            activeTouchClone.remove();
            activeTouchClone = null;
        });

        // Click to stamp support (Mobile/Accessibility fallback)
        item.addEventListener("click", () => {
            // Fallback: Drop sticker in the center of the right page with small offset
            const rightPage = document.querySelector(".page-right");
            const rect = rightPage.getBoundingClientRect();

            const randomX = Math.random() * (rect.width - 60) + 30;
            const randomY = Math.random() * (rect.height - 180) + 120;

            placeSticker(draggedStickerEmoji || item.textContent, randomX, randomY, rightPage);
        });
    });

    // Setup drop zones for both pages (Desktop only)
    scrapbookPageElements.forEach(page => {
        page.addEventListener("dragover", (e) => {
            e.preventDefault(); // Necessary to allow drop
        });

        page.addEventListener("drop", (e) => {
            e.preventDefault();
            const emoji = e.dataTransfer.getData("text/plain") || draggedStickerEmoji;
            if (!emoji) return;

            // Get exact coordinates relative to the page
            const rect = page.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            placeSticker(emoji, x, y, page);
        });
    });

    function placeSticker(emoji, x, y, pageElement) {
        const sticker = document.createElement("div");
        sticker.classList.add("placed-sticker");
        sticker.textContent = emoji;

        // Random tilt angle
        const rotation = Math.random() * 40 - 20; // Between -20 and 20deg
        sticker.style.setProperty("--sticker-rot", `${rotation}deg`);

        // Position
        sticker.style.left = `${x - 20}px`;
        sticker.style.top = `${y - 20}px`;

        // Play drop sound
        playSound(popSound);

        // Double click to delete
        sticker.addEventListener("dblclick", () => {
            sticker.style.transition = "transform 0.2s, opacity 0.2s";
            sticker.style.transform = "scale(0) rotate(0deg)";
            sticker.style.opacity = 0;
            playSound(popSound);
            setTimeout(() => {
                sticker.remove();
            }, 200);
        });

        // Add visual title tip
        sticker.setAttribute("title", "Double click to remove sticker");

        pageElement.appendChild(sticker);
    }

    // --- 6. Pipeline Energy Dissipation / Thermal Visual Particle Simulator ---
    // Represents floating electrons and heat dissipation from active caching circuits
    const sparkleEmojis = ["✨", "🌸", "⭐️", "🍃"];
    function spawnSparkle() {
        const sparkle = document.createElement("span");
        sparkle.classList.add("sparkle");
        sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];

        // Random horizontal position and size
        sparkle.style.left = `${Math.random() * 100}vw`;
        sparkle.style.top = `${Math.random() * 100}vh`;
        sparkle.style.fontSize = `${Math.random() * 1.5 + 0.8}rem`;

        sparklesContainer.appendChild(sparkle);

        // Clear after animation ends
        setTimeout(() => {
            sparkle.remove();
        }, 4000);
    }

    // Spawn sparkles at intervals
    setInterval(spawnSparkle, 2000);
});
