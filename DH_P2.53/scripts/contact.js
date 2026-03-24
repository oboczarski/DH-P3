/**
 * Contact page navigation logic.
 * - Targets the standalone Contact page header and More dropdown only.
 * - Preserves username / league query context when available so cross-page navigation stays smooth.
 * - Keeps behavior isolated from app.js to avoid unrelated data loading on this page.
 */
document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('usernameInput');
  const leagueSelect = document.getElementById('leagueSelect');
  const moreButton = document.getElementById('moreButton');
  const moreDropdown = document.getElementById('moreDropdown');
  const params = new URLSearchParams(window.location.search);

  const pageMap = {
    home: '/index.html',
    rosters: '/rosters/rosters.html',
    stats: '/stats/stats.html',
    analyzer: '/analyzer/analyzer.html',
    research: '/research/research.html',
    ownership: '/ownership/ownership.html',
    contact: '/contact/contact.html'
  };

  const pagesWithLeagueContext = new Set(['rosters', 'stats', 'analyzer']);
  const resolvedUsername = (params.get('username') || readStoredUsername() || '').trim();
  const resolvedLeagueId = (params.get('leagueId') || '').trim();

  if (resolvedUsername) {
    usernameInput.value = resolvedUsername;
    try {
      localStorage.setItem('sleeper_username', resolvedUsername);
    } catch (error) {
      // Local storage is a convenience only; navigation still works without it.
    }
  }

  if (resolvedLeagueId) {
    const option = document.createElement('option');
    option.value = resolvedLeagueId;
    option.textContent = resolvedLeagueId;
    option.selected = true;
    leagueSelect.appendChild(option);
  }

  ['homeButton', 'rostersButton', 'statsButton', 'analyzerButton', 'researchButton'].forEach((id) => {
    const button = document.getElementById(id);
    if (!button) return;
    button.addEventListener('click', () => {
      navigateTo(button.dataset.nav);
    });
  });

  if (moreButton && moreDropdown) {
    portalDropdown();

    moreButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const willOpen = moreDropdown.classList.contains('hidden');

      if (willOpen) {
        moreDropdown.classList.remove('hidden');
        moreDropdown.style.visibility = 'hidden';
        positionMoreDropdown();
        requestAnimationFrame(() => {
          positionMoreDropdown();
          moreDropdown.style.visibility = '';
        });
        moreButton.setAttribute('aria-expanded', 'true');
        moreDropdown.setAttribute('aria-hidden', 'false');
      } else {
        closeMoreDropdown();
      }
    });

    document.addEventListener('click', (event) => {
      if (!moreDropdown.contains(event.target) && !moreButton.contains(event.target)) {
        closeMoreDropdown();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMoreDropdown();
      }
    });

    window.addEventListener('resize', () => {
      if (!moreDropdown.classList.contains('hidden')) {
        positionMoreDropdown();
      }
    });

    window.addEventListener('scroll', () => {
      if (!moreDropdown.classList.contains('hidden')) {
        positionMoreDropdown();
      }
    }, { passive: true });

    moreDropdown.querySelectorAll('.contact-nav-more-item').forEach((button) => {
      button.addEventListener('click', () => {
        const destinationPage = button.dataset.nav;
        const destinationUrl = button.dataset.url;

        closeMoreDropdown();

        if (destinationUrl) {
          window.location.href = destinationUrl;
          return;
        }

        if (destinationPage) {
          navigateTo(destinationPage);
        }
      });
    });
  }

  function readStoredUsername() {
    try {
      return localStorage.getItem('sleeper_username') || '';
    } catch (error) {
      return '';
    }
  }

  function buildPageUrl(page) {
    const baseUrl = pageMap[page] || pageMap.home;

    if (page === 'home') {
      return baseUrl;
    }

    const nextParams = new URLSearchParams();
    const activeUsername = (usernameInput?.value || '').trim();
    const activeLeagueId = (leagueSelect?.value || '').trim();

    if (activeUsername) {
      nextParams.set('username', activeUsername);
    }

    if (pagesWithLeagueContext.has(page) && activeLeagueId && activeLeagueId !== 'Select a league...') {
      nextParams.set('leagueId', activeLeagueId);
    }

    const query = nextParams.toString();
    return query ? `${baseUrl}?${query}` : baseUrl;
  }

  function navigateTo(page) {
    window.location.href = buildPageUrl(page);
  }

  function portalDropdown() {
    try {
      if (document.body && moreDropdown.parentElement !== document.body) {
        document.body.appendChild(moreDropdown);
      }
    } catch (error) {
      // If portaling fails, the dropdown still works from its original DOM position.
    }
  }

  function positionMoreDropdown() {
    try {
      const rect = moreButton.getBoundingClientRect();
      const margin = 8;
      const gap = 4;
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth;

      const wasHidden = moreDropdown.classList.contains('hidden');
      if (wasHidden) {
        moreDropdown.classList.remove('hidden');
        moreDropdown.style.visibility = 'hidden';
      }

      let menuRect = moreDropdown.getBoundingClientRect();
      const menuWidth = menuRect.width || 0;
      let left = rect.left + (rect.width - menuWidth) / 2;
      const maxLeft = viewportWidth - margin - menuWidth;

      if (Number.isFinite(maxLeft)) {
        left = Math.max(margin, Math.min(left, maxLeft));
      }

      moreDropdown.style.left = `${Math.round(left)}px`;
      moreDropdown.style.top = `${Math.round(rect.bottom + gap)}px`;
      moreDropdown.style.right = 'auto';
      moreDropdown.style.bottom = 'auto';

      menuRect = moreDropdown.getBoundingClientRect();
      const menuHeight = menuRect.height || 0;
      const belowY = rect.bottom + gap;

      if (belowY + menuHeight + margin > window.innerHeight) {
        const aboveY = rect.top - gap - menuHeight;
        if (aboveY >= margin) {
          moreDropdown.style.top = `${Math.round(aboveY)}px`;
        }
      }

      if (wasHidden) {
        moreDropdown.classList.add('hidden');
        moreDropdown.style.visibility = '';
      }
    } catch (error) {
      // Positioning is best-effort only; the menu remains functional without the extra adjustment.
    }
  }

  function closeMoreDropdown() {
    moreDropdown.classList.add('hidden');
    moreDropdown.style.visibility = '';
    moreButton.setAttribute('aria-expanded', 'false');
    moreDropdown.setAttribute('aria-hidden', 'true');
  }
});
