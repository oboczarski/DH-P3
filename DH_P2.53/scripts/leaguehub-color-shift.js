/* Optional League Analysis color tester. Remove its script tag from leaguehub.html
   to remove the control, styles, and alternate palettes. The main renderer's
   optional hook then uses its normal colors, with no data or ranking changes. */
(function () {
  'use strict';
  if (document.body.dataset.page !== 'leaguehub') return;

  // One exact stop per stacked segment, in chart order. Unused stops remain
  // available (Roster Value currently has five segments, not six).
  const palettes = {
    value: ['#FF0AA5', '#FE26F7', '#D747FF', '#A74EFF', '#7866FF', '#4D79FF', '#00A9F1', '#00DDFA'],
    proj: ['#FFB847', '#FF916B', '#FF6B6B', '#F94D95', '#CE34F9', '#8F33FF', '#7B5CFF'],
    roster: ['#00FF99', '#69D6FF', '#52ACF8', '#6053D5', '#5F03DF', '#3A0CA3'],
  };
  let enabled = false;
  window.LeagueHubColorShift = {
    colors(metric, keys) {
      const palette = palettes[metric];
      if (!enabled || !palette) return null;
      return Object.fromEntries(keys.map((key, index) => [key, palette[Math.min(index, palette.length - 1)]]));
    },
  };

  document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('infographicContent');
    if (!content) return;
    const control = document.createElement('div');
    control.className = 'la-color-shift-tester';
    control.innerHTML = '<button type="button" role="switch" aria-checked="false" aria-controls="startersValueChart overallValueChart"><span>color shift</span><i aria-hidden="true"></i></button>';
    // Keep the tester directly above infographicContent, outside the summary grid.
    content.before(control);
    const style = document.createElement('style');
    style.dataset.leaguehubColorShift = '';
    style.textContent = `
      body[data-page="leaguehub"] #leagueAnalysisPanel .la-color-shift-tester { display: flex; justify-content: flex-end; margin: 0 0 8px; }
      body[data-page="leaguehub"] #leagueAnalysisPanel .la-color-shift-tester:has(+ #infographicContent.hidden) { display: none; }
      body[data-page="leaguehub"] #leagueAnalysisPanel .la-color-shift-tester button { display: inline-flex; align-items: center; gap: 9px; padding: 5px 10px; border: 1px solid #95a8d13d; border-radius: 99px; background: linear-gradient(135deg, #30394b99, #172136cc); color: #becce3; font: 500 11px 'Google Sans Flex', sans-serif; text-transform: none; cursor: pointer; }
      body[data-page="leaguehub"] #leagueAnalysisPanel .la-color-shift-tester i { width: 27px; height: 16px; border-radius: 99px; background: #101a2c; box-shadow: inset 0 0 0 1px #8ba2ca45; }
      body[data-page="leaguehub"] #leagueAnalysisPanel .la-color-shift-tester i::before { content: ''; display: block; width: 10px; height: 10px; margin: 3px; border-radius: 50%; background: #8397b9; }
      body[data-page="leaguehub"] #leagueAnalysisPanel .la-color-shift-tester [aria-checked="true"] { color: #e8d1ff; border-color: #b592ff66; }
      body[data-page="leaguehub"] #leagueAnalysisPanel .la-color-shift-tester [aria-checked="true"] i { background: linear-gradient(90deg, #FF0AA5, #7866FF, #00DDFA); }
      body[data-page="leaguehub"] #leagueAnalysisPanel .la-color-shift-tester [aria-checked="true"] i::before { transform: translateX(11px); background: #f3edff; }
    `;
    document.head.appendChild(style);
    control.querySelector('button').addEventListener('click', event => {
      enabled = !enabled;
      event.currentTarget.setAttribute('aria-checked', String(enabled));
      document.dispatchEvent(new CustomEvent('leaguehub:color-shift'));
    });
  });
})();
