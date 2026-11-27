(() => {
    const page = document.body.dataset.page;
    if (page !== 'rosters' && page !== 'datahub') return;

    // Device input keeps the resume feature available when a phone rotates
    // into the wide layout, while a narrow desktop window keeps its own behavior.
    const handheld = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        || (navigator.maxTouchPoints > 0 && matchMedia('(hover: none) and (pointer: coarse)').matches);
    if (!handheld) return;

    const key = 'dynastyHubMobileViewV1';
    const gameLogsScrollAreas = [
        '#modal-body', '.game-logs-hscroll', '.game-logs-table-body',
        '.game-logs-szn-view', '.career-stats-scroll-pane', '#glOwnershipBody', '.team-modal-body',
    ];

    // Let WebKit drop decorative backing layers while these pages are in the
    // background. Showing the document again only redraws those layers.
    const syncBackgroundLayers = () => {
        document.documentElement.classList.toggle('dh-mobile-page-hidden', document.hidden);
    };
    document.addEventListener('visibilitychange', syncBackgroundLayers);
    window.addEventListener('pageshow', syncBackgroundLayers);
    syncBackgroundLayers();

    window.DynastyHubMobileView = {
        read() {
            const entry = history.state?.[key];
            return entry?.page === page ? entry.view : null;
        },
        saveOnHide(getView) {
            // A live tab already has its view. Save just the controls and
            // position on this history entry in case Safari has to rebuild it.
            const save = () => {
                const view = getView();
                if (!view) return;
                try {
                    const previous = history.state;
                    if (JSON.stringify(previous?.[key]?.view) === JSON.stringify(view)) return;
                    history.replaceState({ ...previous, [key]: { page, view } }, '');
                } catch {
                    // The live view still works when history state is unavailable.
                }
            };
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') save();
            });
            window.addEventListener('pagehide', save);
        },
        saveGameLogsScroll(modal) {
            // Game Logs uses independent scroll panes for its table and views.
            return gameLogsScrollAreas.map(selector => {
                const area = modal.querySelector(selector);
                return area ? [area.scrollLeft, area.scrollTop] : null;
            });
        },
        restoreGameLogsScroll(modal, offsets) {
            gameLogsScrollAreas.forEach((selector, index) => {
                const offset = offsets?.[index];
                if (offset) modal.querySelector(selector)?.scrollTo(...offset);
            });
        }
    };
})();
