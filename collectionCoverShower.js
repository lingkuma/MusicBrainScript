// ==UserScript==
// @name         MusicBrainz Collection Cover Display
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Display album covers on MusicBrainz collection pages.
// @author       Gemini
// @match        https://musicbrainz.org/collection/*
// @connect      coverartarchive.org
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Target table
    const table = document.querySelector('table.tbl');
    if (!table) {
        return;
    }

    // Add "Cover" column to table header
    const headerRow = table.querySelector('thead > tr');
    if (headerRow) {
        const coverHeader = document.createElement('th');
        coverHeader.textContent = 'Cover';
        // Insert after the title column
        headerRow.insertBefore(coverHeader, headerRow.children[1]);
    }

    // Iterate through each row to add covers
    const rows = table.querySelectorAll('tbody > tr');
    rows.forEach(row => {
        // Find <a> tags containing release links
        const releaseLink = row.querySelector('a[href^="/release/"]');

        // If no release link is found (possibly pagination, etc.), add an empty cell to align the table
        if (!releaseLink) {
            const emptyCell = document.createElement('td');
            row.insertBefore(emptyCell, row.children[1]);
            return;
        }

        // Extract MBID (MusicBrainz Identifier) from the link
        const mbid = releaseLink.href.split('/')[4];
        const coverCell = document.createElement('td');
        coverCell.style.width = '100px'; // Fixed width
        coverCell.style.textAlign = 'center';

        if (mbid) {
            // Build cover API URL (using 250px thumbnail)
            const imageUrl = `https://coverartarchive.org/release/${mbid}/front-250`;

            const img = document.createElement('img');
            img.style.maxWidth = '100px';
            img.style.maxHeight = '100px';
            img.style.display = 'none'; // Hidden by default, show when loaded successfully

            img.onload = function() {
                img.style.display = 'block'; // Load successful, display image
            };
            img.onerror = function() {
                coverCell.textContent = 'No Cover'; // Load failed
            };
            img.src = imageUrl;
            coverCell.appendChild(img);
        }

        // Insert the new cell into the row
        row.insertBefore(coverCell, row.children[1]);
    });
})();