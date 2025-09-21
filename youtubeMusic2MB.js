// ==UserScript==
// @name         YouTube Music to MusicBrainz Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在YouTube Music专辑页面添加MusicBrainz搜索按钮
// @author       You
// @match        https://music.youtube.com/playlist?list=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function check() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                } else {
                    setTimeout(check, 100);
                }
            }

            check();
        });
    }

    // 获取专辑名称
    function getAlbumTitle() {
        const titleElement = document.querySelector('.title.style-scope.ytmusic-responsive-header-renderer');
        return titleElement ? titleElement.textContent.trim() : '';
    }

    // 获取艺术家名称
    function getArtistName() {
        const artistElement = document.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string[href*="channel/"]');
        return artistElement ? artistElement.textContent.trim() : '';
    }

    // 创建MusicBrainz搜索URL
    function createMBSearchURL(albumTitle, artistName) {
        const query = `${albumTitle} ${artistName}`;
        const encodedQuery = encodeURIComponent(query);
        return `https://musicbrainz.org/search?query=${encodedQuery}&type=release&limit=25&method=indexed`;
    }

    // 创建MusicBrainz按钮
    function createMBButton() {
        const button = document.createElement('button');

        // 创建按钮结构，避免使用innerHTML
        const iconDiv = document.createElement('div');
        iconDiv.setAttribute('aria-hidden', 'true');
        iconDiv.className = 'yt-spec-button-shape-next__icon';

        const iconWrapper = document.createElement('span');
        iconWrapper.className = 'ytIconWrapperHost';
        iconWrapper.style.width = '24px';
        iconWrapper.style.height = '24px';

        const iconShape = document.createElement('span');
        iconShape.className = 'yt-icon-shape ytSpecIconShapeHost';

        const iconContainer = document.createElement('div');
        iconContainer.style.width = '100%';
        iconContainer.style.height = '100%';
        iconContainer.style.display = 'block';
        iconContainer.style.fill = 'currentcolor';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '24');
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('aria-hidden', 'true');
        svg.style.pointerEvents = 'none';
        svg.style.display = 'inherit';
        svg.style.width = '100%';
        svg.style.height = '100%';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z');

        // 组装元素
        svg.appendChild(path);
        iconContainer.appendChild(svg);
        iconShape.appendChild(iconContainer);
        iconWrapper.appendChild(iconShape);
        iconDiv.appendChild(iconWrapper);
        button.appendChild(iconDiv);

        button.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-only-default yt-spec-button-shape-next--enable-backdrop-filter-experiment';
        button.title = 'Search in MusicBrainz';
        button.setAttribute('aria-label', 'Search in MusicBrainz');
        button.style.marginLeft = '8px';

        // 添加点击事件
        button.addEventListener('click', function() {
            const albumTitle = getAlbumTitle();
            const artistName = getArtistName();

            if (albumTitle && artistName) {
                const searchURL = createMBSearchURL(albumTitle, artistName);
                window.open(searchURL, '_blank');
            } else {
                alert('无法获取专辑或艺术家信息');
            }
        });

        return button;
    }

    // 创建悬浮按钮（备用方案）
    function createFloatingButton() {
        const floatingButton = document.createElement('div');
        floatingButton.style.position = 'fixed';
        floatingButton.style.top = '20px';
        floatingButton.style.right = '20px';
        floatingButton.style.zIndex = '9999';
        floatingButton.style.background = '#1976d2';
        floatingButton.style.color = 'white';
        floatingButton.style.border = 'none';
        floatingButton.style.borderRadius = '50%';
        floatingButton.style.width = '56px';
        floatingButton.style.height = '56px';
        floatingButton.style.cursor = 'pointer';
        floatingButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        floatingButton.style.display = 'flex';
        floatingButton.style.alignItems = 'center';
        floatingButton.style.justifyContent = 'center';
        floatingButton.style.transition = 'background-color 0.3s';

        // 创建SVG图标，避免使用innerHTML
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '24');
        svg.setAttribute('fill', 'white');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z');

        svg.appendChild(path);
        floatingButton.appendChild(svg);

        floatingButton.title = 'Search in MusicBrainz';

        // 悬停效果
        floatingButton.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#1565c0';
        });

        floatingButton.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#1976d2';
        });

        // 添加点击事件
        floatingButton.addEventListener('click', function() {
            const albumTitle = getAlbumTitle();
            const artistName = getArtistName();

            if (albumTitle && artistName) {
                const searchURL = createMBSearchURL(albumTitle, artistName);
                window.open(searchURL, '_blank');
            } else {
                alert('无法获取专辑或艺术家信息');
            }
        });

        return floatingButton;
    }

    // 尝试添加按钮到操作按钮区域
    async function addButtonToActionArea() {
        try {
            // 等待操作按钮区域加载
            const actionButtons = await waitForElement('#action-buttons');

            // 创建按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'inline-flex';
            buttonContainer.style.alignItems = 'center';

            // 创建MusicBrainz按钮
            const mbButton = createMBButton();
            buttonContainer.appendChild(mbButton);

            // 将按钮添加到操作按钮区域的最后面（右侧）
            actionButtons.appendChild(buttonContainer);

            console.log('MusicBrainz按钮已成功添加到操作按钮区域右侧');
            return true;
        } catch (error) {
            console.log('无法添加按钮到操作按钮区域:', error.message);
            return false;
        }
    }

    // 添加悬浮按钮作为备用方案
    function addFloatingButton() {
        const floatingButton = createFloatingButton();
        document.body.appendChild(floatingButton);
        console.log('MusicBrainz悬浮按钮已添加');
    }

    // 主函数
    async function init() {
        // 检查是否是专辑页面
        if (!window.location.href.includes('music.youtube.com/playlist?list=')) {
            return;
        }

        // 等待页面内容加载
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 尝试添加按钮到操作区域，如果失败则使用悬浮按钮
        const success = await addButtonToActionArea();
        if (!success) {
            addFloatingButton();
        }
    }

    // 监听页面变化（YouTube Music是单页应用）
    let currentURL = window.location.href;
    const observer = new MutationObserver(function() {
        if (window.location.href !== currentURL) {
            currentURL = window.location.href;
            // 页面URL变化时重新初始化
            setTimeout(init, 1000);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();