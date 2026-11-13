(() => {
  'use strict';

  // Prism owns its navigation, charts and interactions. Its sole stats
  // request remains dashboard-data.js's fresh local 2026 season CSV.
  const $ = id => document.getElementById(id);
  const positions = ['QB', 'RB', 'WR', 'TE'];
  const state = { players: [], selectedId: null, ppgPosition: 'all', scatterPosition: 'ALL',
    hiddenSeries: new Set(), ready: false, loading: false };
  let dataApi, labelApi, resizeTimer;
  const tooltip = $('chart-tooltip');
  const colors = { QB: '#ff56b3', RB: '#22e7cf', WR: '#31d0ff', TE: '#ff9c5b' };
  const radarSpectrum = ['#fa67bd','#d264ff','#9d6aff','#707aff','#399bff','#19c4ff','#53e5f0','#99c6ff'];

  // The distribution retains DataHub's exact position line/area color pairs,
  // horizontal stop placement and gently fading area opacity, independently.
  const distributionPalette = {
    QB: { line: ['#ff9a3d', '#ff4187'], area: ['#ff9a3d', '#ff4187'] },
    RB: { line: ['#1ac2ff', '#06ff97'], area: ['#64d8ff', '#06ffa8'] },
    WR: { line: ['#8153ff', '#0299fe'], area: ['#6e10fb', '#0d72ff'] },
    TE: { line: ['#ff6bc8', '#7f2fff'], area: ['#ff6bc8', '#7f2fff'] }
  };
  const radarConfig = {
    QB: { max: 36, stats: ['fpts','ppg','pass_rtg','cmp_pct','yds_total','ttt','epa_db','cpoe'],
      labels: ['FPTS','PPG','paRTG','CMP%','YDS(t)','TTT','EPA/DB','CPOE'] },
    RB: { max: 48, stats: ['fpts','ppg','yds_total','snp_pct','ypc','rec_tgt','mtf_per_att','yco_per_att'],
      labels: ['FPTS','PPG','YDS(t)','SNP%','YPC','TGT','MTF/A','YCO/A'] },
    WR: { max: 72, stats: ['fpts','ppg','rec','rec_ypg','ts_per_rr','yprr','first_down_rec_rate','imp_per_g'],
      labels: ['FPTS','PPG','REC','recYPG','TS%','YPRR','1DRR','IMP/G'] },
    TE: { max: 24, stats: ['fpts','ppg','rec','rec_ypg','ts_per_rr','yprr','first_down_rec_rate','imp_per_g'],
      labels: ['FPTS','PPG','REC','recYPG','TS%','YPRR','1DRR','IMP/G'] }
  };
  const text = (id, value) => { if ($(id)) $(id).textContent = value; };
  const number = (value, decimals = 1) => Number.isFinite(value) ? value.toFixed(decimals) : '—';
  const integer = value => Number.isFinite(value) ? value.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—';
  const shortName = name => {
    const words = String(name).split(' ');
    return words.length > 1 ? words[0][0] + '. ' + words.slice(1).join(' ') : name;
  };
  const rankFor = (player, key) => key === 'fpts' ? player.ranks.posRank
    : key === 'ppg' ? player.ranks.ppgPosRank : player.statRanks[key];
  const teamLogo = team => 'assets/NFL_logos_svg/' + String(team).toLowerCase() + '.svg';
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  function element(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }
  function logo(team) {
    const image = element('img');
    image.src = teamLogo(team); image.alt = ''; image.width = 26; image.height = 26;
    image.loading = 'lazy';
    image.addEventListener('error', () => { image.hidden = true; }, { once: true });
    return image;
  }
  function formatStat(value, key) {
    if (!Number.isFinite(value)) return '—';
    const percents = ['cmp_pct','cpoe','snp_pct','ts_per_rr','csty'];
    const decimals = ['mtf_per_att','first_down_rec_rate'].includes(key) ? 3
      : ['epa_db','ttt','ypc','yco_per_att','yprr'].includes(key) ? 2
      : ['yds_total','rec','rec_tgt'].includes(key) ? 0 : 1;
    return (['epa_db','cpoe'].includes(key) && value > 0 ? '+' : '') + number(value, decimals)
      + (percents.includes(key) ? '%' : '');
  }

  // Native links preserve shared-page paths, username propagation, the saved
  // Rosters league and Trophy Room's profile route without loading app.js.
  function setupNavigation() {
    const input = $('usernameInput');
    let stored = '';
    try { stored = localStorage.getItem('sleeper_username') || ''; } catch {}
    input.value = new URLSearchParams(location.search).get('username') || stored || input.value;
    const userLinks = [...document.querySelectorAll('[data-user-link]')];
    userLinks.forEach(link => { link.dataset.base = link.getAttribute('href'); });
    const username = () => input.value.trim().toLowerCase();
    function syncLinks() {
      const user = username();
      userLinks.forEach(link => {
        const url = new URL(link.dataset.base, document.baseURI);
        if (link.dataset.userLink === 'trophy') {
          if (user) url.pathname = '/user/' + encodeURIComponent(user);
        } else if (user) {
          url.searchParams.set('username', user);
          if (link.dataset.userLink === 'rosters') {
            try {
              const league = localStorage.getItem('dh_rosters_last_league:' + user);
              if (league) url.searchParams.set('leagueId', league);
            } catch {}
          }
        }
        link.href = url.href;
      });
    }
    function saveUsername() {
      try {
        if (username()) localStorage.setItem('sleeper_username', username());
        else localStorage.removeItem('sleeper_username');
      } catch {}
    }
    input.addEventListener('input', syncLinks);
    input.addEventListener('change', saveUsername);
    window.addEventListener('pageshow', syncLinks);
    userLinks.forEach(link => link.addEventListener('click', () => { syncLinks(); saveUsername(); }));
    $('league-sync-form').addEventListener('submit', event => {
      event.preventDefault();
      syncLinks(); saveUsername(); input.blur();
      location.href = document.querySelector('[data-user-link="rosters"]').href;
    });
    syncLinks();
    const menu = $('homeMenu'), toggle = $('homeMenuToggle');
    function closeMenu(restoreFocus = false) {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      if (restoreFocus) toggle.focus();
    }
    toggle.addEventListener('click', () => {
      const opening = menu.hidden;
      menu.hidden = !opening;
      toggle.setAttribute('aria-expanded', String(opening));
      toggle.setAttribute('aria-label', opening ? 'Close navigation menu' : 'Open navigation menu');
      if (opening) menu.querySelector('a').focus();
    });
    document.addEventListener('click', event => {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    document.addEventListener('focusin', event => {
      if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        if (!menu.hidden) { closeMenu(true); event.preventDefault(); }
        hideTooltip();
      }
    });
    // Preserve installability and the existing one-reload SW update behavior.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!window.__reloadedOnce) { window.__reloadedOnce = true; location.reload(); }
      });
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js?v=20250825104842').catch(() => {});
      });
    }
  }

  // A single tooltip serves mouse, touch and keyboard input across all charts.
  // It uses viewport coordinates and clamps both axes so phones never clip it.
  function showTooltip(event, heading, rows) {
    tooltip.replaceChildren(element('strong', '', heading));
    rows.forEach(([label, value]) => {
      const row = element('div', 'dh-tooltip-row');
      row.append(element('span', '', label), element('b', '', value));
      tooltip.append(row);
    });
    tooltip.hidden = false;
    const bounds = event.currentTarget?.getBoundingClientRect();
    const x = event.clientX || (bounds ? bounds.left + bounds.width / 2 : innerWidth / 2);
    const y = event.clientY || (bounds ? bounds.top + bounds.height / 2 : innerHeight / 2);
    const { width, height } = tooltip.getBoundingClientRect();
    tooltip.style.left = clamp(x + 14, 10, innerWidth - width - 10) + 'px';
    tooltip.style.top = clamp(y - height - 12 < 10 ? y + 15 : y - height - 12, 10, innerHeight - height - 10) + 'px';
  }
  function hideTooltip() { tooltip.hidden = true; }
  function bindTooltip(selection, heading, rows) {
    selection.attr('tabindex', 0).attr('data-tooltip-trigger', '').attr('role', 'button')
      .attr('aria-label', d => heading(d) + '. ' + rows(d).map(row => row.join(': ')).join('. '))
      .on('pointerenter focus', (event, d) => showTooltip(event, heading(d), rows(d)))
      .on('pointerleave blur', hideTooltip)
      .on('click', (event, d) => showTooltip(event, heading(d), rows(d)))
      .on('keydown', (event, d) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault(); showTooltip(event, heading(d), rows(d));
        }
      });
  }
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('[data-tooltip-trigger]')) hideTooltip();
  });
  window.addEventListener('scroll', hideTooltip, { passive: true });

  function renderSummary() {
    const { topFpts, topEPAQB, topCstyRB, topTSWR } = dataApi.selectSummaryLeaders(state.players);
    const cards = [
      ['total-points', topFpts, player => number(player.stats.fpts)],
      ['ppg', topEPAQB, player => formatStat(player.stats.epa_db, 'epa_db')],
      ['consistency', topCstyRB, player => number(player.stats.csty) + '%'],
      ['share', topTSWR, player => number(player.stats.ts) + '%']
    ];
    cards.forEach(([prefix, player, format]) => {
      text(prefix + '-value', player ? format(player) : '—');
      text(prefix + '-name', player?.name || (prefix === 'consistency' ? 'No qualified RB at 100%' : 'Unavailable'));
      text(prefix + '-meta', player ? player.position + ' / ' + player.team + ' · ' + player.games + ' GAMES' : 'No qualifying result');
      const image = $(prefix + '-logo');
      image.hidden = !player;
      if (player) {
        image.src = teamLogo(player.team);
        image.onerror = () => { image.hidden = true; };
      }
    });
    const recordedGames = Math.max(...state.players.map(player => player.games || 0));
    text('season-progress', 'THROUGH ' + recordedGames + ' GAMES');
  }

  function renderPpg() {
    const leaders = dataApi.selectPpgLeaders(state.players, state.ppgPosition);
    const host = $('bar-chart');
    host.replaceChildren();
    const maximum = Math.max(1, ...leaders.map(player => player.stats.ppg));
    const compact = innerWidth < 600;
    leaders.forEach((player, index) => {
      const row = element('button', 'dh-ppg-row');
      row.type = 'button';
      row.dataset.playerId = player.id;
      row.dataset.tooltipTrigger = '';
      row.setAttribute('aria-label', player.name + ', ' + player.position + ', ' + number(player.stats.ppg) + ' PPR points per game. View statistics.');
      row.title = player.name + ' · ' + number(player.stats.ppg) + ' PPG';
      row.style.setProperty('--bar-width', Math.max(0, player.stats.ppg / maximum * 100) + '%');
      // PPG bars progress through an electric blue/violet/magenta spectrum.
      // Each bar has three saturated stops and an illuminated rim, not a flat
      // position-color fill; every row still shares the same zero-based scale.
      const progress = index / Math.max(1, leaders.length - 1);
      row.style.setProperty('--bar-start', d3.interpolateRgb('#1478fa', '#7332df')(progress));
      row.style.setProperty('--bar-mid', d3.interpolateRgb('#2cbaff', '#c14bfb')(progress));
      row.style.setProperty('--bar-end', d3.interpolateRgb('#83eaff', '#ffa0e4')(progress));
      const who = element('span', 'dh-ppg-row__player'), name = element('span');
      name.append(element('span', 'dh-ppg-row__name', compact ? shortName(player.name) : player.name),
        element('span', 'dh-ppg-row__meta', player.position + ' / ' + player.team + ' · ' + player.games + ' G'));
      who.append(logo(player.team), name);
      const track = element('span', 'dh-ppg-row__track'), bar = element('span', 'dh-ppg-row__bar');
      track.setAttribute('aria-hidden', 'true'); track.append(bar);
      row.append(element('span', 'dh-ppg-row__rank', String(index + 1).padStart(2, '0')), who, track,
        element('span', 'dh-ppg-row__value', number(player.stats.ppg)));
      row.addEventListener('click', () => openPlayerDialog(player));
      host.append(row);
    });
    if (!leaders.length) host.append(element('p', 'dh-chart-placeholder', 'No players with 3 recorded games.'));
    text('ppg-caption', 'TOP ' + leaders.length + ' · MIN. 3 GAMES');
  }

  function svgFrame(id, margins, label) {
    const host = $(id); host.replaceChildren();
    const rect = host.getBoundingClientRect();
    const width = rect.width, height = rect.height;
    const svg = d3.select(host).append('svg').attr('viewBox', [0, 0, width, height].join(' '))
      .attr('width', width).attr('height', height).attr('role', 'group').attr('aria-label', label);
    svg.append('title').text(label);
    const g = svg.append('g').attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');
    return { svg, g, width, height, w: width - margins.left - margins.right, h: height - margins.top - margins.bottom };
  }
  function gradient(defs, id, stops) {
    const fill = defs.append('linearGradient').attr('id', id).attr('x1', '0%').attr('x2', '100%').attr('y1', '0%').attr('y2', '0%');
    stops.forEach(([offset, color, opacity = 1]) => fill.append('stop').attr('offset', offset)
      .attr('stop-color', color).attr('stop-opacity', opacity));
    return 'url(#' + id + ')';
  }

  // Cumulative Top 60 is calculated from current CSV rows, never DataHub's fixed
  // reference counts. Monotone curves preserve the ordering of cumulative data.
  function renderDistribution() {
    const model = dataApi.buildPositionalDistribution(state.players);
    const summary = $('distribution-summary'); summary.replaceChildren();
    if (!model.total) {
      $('distribution-chart').replaceChildren(element('p', 'dh-chart-placeholder', 'No recorded PPR results.'));
      return;
    }
    const frame = svgFrame('distribution-chart', { left: 24, right: 19, top: 16, bottom: 29 },
      'Cumulative QB, RB, WR and TE counts among the top ' + model.total + ' PPR scorers');
    const { svg, g, w, h } = frame, defs = svg.append('defs');
    const x = d3.scaleLinear().domain([0, model.total]).range([0, w]);
    const y = d3.scaleLinear().domain([0, Math.max(...Object.values(model.counts)) + 1]).nice(4).range([h, 0]);
    const ticks = y.ticks(4).filter(Number.isInteger);
    g.append('g').attr('class', 'dh-grid').call(d3.axisLeft(y).tickValues(ticks).tickSize(-w).tickFormat(''));
    g.append('g').attr('class', 'dh-axis').call(d3.axisLeft(y).tickValues(ticks).tickSize(0).tickPadding(7));
    g.append('g').attr('class', 'dh-axis').attr('transform', 'translate(0,' + h + ')')
      .call(d3.axisBottom(x).tickValues([0, .2, .4, .6, .8, 1].map(value => Math.round(value * model.total))).tickSize(0).tickPadding(8));
    g.append('text').attr('class', 'dh-axis-label').attr('x', 0).attr('y', -7).text('PLAYERS');
    g.append('text').attr('class', 'dh-axis-label').attr('x', w).attr('y', h + 27).attr('text-anchor', 'end').text('PPR RANK →');
    positions.forEach(position => {
      const palette = distributionPalette[position];
      const hidden = state.hiddenSeries.has(position);
      const areaFill = gradient(defs, 'distribution-area-' + position, [
        ['0%', palette.area[0], .44], ['40%', palette.area[0], .32], ['82%', palette.area[1], .21], ['100%', palette.area[1], .14]
      ]);
      const lineFill = gradient(defs, 'distribution-line-' + position, [
        ['0%', palette.line[0]], ['42%', palette.line[0]], ['82%', palette.line[1]], ['100%', palette.line[1]]
      ]);
      const series = g.append('g').attr('opacity', hidden ? 0 : 1).attr('aria-hidden', hidden ? 'true' : 'false');
      const area = d3.area().x(row => x(row.rank)).y0(h).y1(row => y(row[position])).curve(d3.curveMonotoneX);
      const line = d3.line().x(row => x(row.rank)).y(row => y(row[position])).curve(d3.curveMonotoneX);
      series.append('path').attr('class', 'dh-distribution-area').attr('fill', areaFill).attr('d', area(model.rows));
      series.append('path').attr('class', 'dh-distribution-line').attr('stroke', lineFill).attr('d', line(model.rows));
      series.append('circle').attr('cx', x(model.total)).attr('cy', y(model.counts[position])).attr('r', 2.7).attr('fill', palette.line[1]);
      const button = element('button'); button.type = 'button';
      button.style.setProperty('--line-start', palette.line[0]); button.style.setProperty('--line-end', palette.line[1]);
      button.setAttribute('aria-pressed', String(!hidden));
      button.setAttribute('aria-label', position + ': ' + model.counts[position] + ' of ' + model.total + ' players. Toggle series.');
      const count = element('span', 'dh-distribution-summary__count', model.counts[position]);
      count.append(element('small', '', number(model.counts[position] / model.total * 100) + '%'));
      button.append(element('span', 'dh-distribution-summary__key', position), count);
      button.addEventListener('click', () => {
        if (state.hiddenSeries.has(position)) state.hiddenSeries.delete(position); else state.hiddenSeries.add(position);
        renderDistribution();
        $('distribution-summary').children[positions.indexOf(position)].focus({ preventScroll: true });
      });
      summary.append(button);
    });
    const guide = g.append('line').attr('stroke', '#f0f0e740').attr('stroke-dasharray', '3 4').attr('y1', 0).attr('y2', h).attr('visibility', 'hidden');
    let cursorRank = model.total;
    function inspect(event, rank) {
      cursorRank = clamp(rank, 1, model.total);
      const row = model.rows[cursorRank];
      guide.attr('x1', x(cursorRank)).attr('x2', x(cursorRank)).attr('visibility', 'visible');
      showTooltip(event, 'PPR rank ' + cursorRank + ' / ' + model.total, [
        [shortName(row.player.name), row.player.position + ' · ' + number(row.player.stats.fpts) + ' PTS'],
        ...positions.map(position => [position, row[position] + ' players'])
      ]);
    }
    const hit = g.append('rect').attr('class', 'dh-chart-hit').attr('width', w).attr('height', h)
      .attr('tabindex', 0).attr('role', 'slider').attr('aria-label', 'Explore cumulative positional counts by PPR rank')
      .attr('aria-valuemin', 1).attr('aria-valuemax', model.total).attr('aria-valuenow', cursorRank).attr('data-tooltip-trigger', '');
    const pointerInspect = event => {
      const rank = Math.round(x.invert(d3.pointer(event, hit.node())[0]));
      inspect(event, rank);
      hit.attr('aria-valuenow', cursorRank);
    };
    hit.on('pointermove', event => { if (event.pointerType !== 'touch') pointerInspect(event); })
      .on('click', pointerInspect).on('focus', event => inspect(event, cursorRank))
      .on('pointerleave blur', () => { guide.attr('visibility', 'hidden'); hideTooltip(); })
      .on('keydown', event => {
        if (['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) {
          event.preventDefault();
          inspect(event, event.key === 'Home' ? 1 : event.key === 'End' ? model.total : cursorRank + (event.key === 'ArrowRight' ? 1 : -1));
          hit.attr('aria-valuenow', cursorRank);
        }
      });
  }

  function renderPlayerPicker() {
    const select = $('player-select'); select.replaceChildren();
    state.players.slice(0, 100).forEach((player, index) => {
      const option = element('option', '', String(index + 1).padStart(2, '0') + ' / ' + player.name + ' · ' + player.position);
      option.value = player.id; select.append(option);
    });
    select.value = state.selectedId;
  }
  function renderRadar() {
    const player = state.players.find(item => item.id === state.selectedId);
    if (!player) return;
    const config = radarConfig[player.position];
    const frame = svgFrame('radar-chart', { left: 0, right: 0, top: 0, bottom: 0 }, player.name + ' performance map using eight positional stat ranks');
    const { svg, width, height } = frame;
    // Performance Map is a luminous eight-ring iris. Gradient lighting belongs
    // to each ring; arc length represents its positional rank, and absent ranks
    // leave an empty track rather than inventing a low numeric result.
    const g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    const radius = Math.min(width * .43, height * .47), inner = 36;
    const ringWidth = (radius - inner) / config.stats.length;
    const startAngle = -.84 * Math.PI, sweep = 1.82 * Math.PI;
    const defs = svg.append('defs');
    const points = config.stats.map((key, index) => ({
      key, label: config.labels[index], rank: rankFor(player, key), index
    }));
    points.forEach(item => {
      const color = radarSpectrum[item.index];
      const fill = gradient(defs, 'performance-ring-' + item.index, [
        ['0%', d3.interpolateRgb(color, '#b9e7ff')(.28)],
        ['42%', color], ['100%', d3.interpolateRgb(color, '#4729b8')(.4)]
      ]);
      const filter = defs.append('filter').attr('id', 'performance-glow-' + item.index)
        .attr('x', '-30%').attr('y', '-30%').attr('width', '160%').attr('height', '160%');
      filter.append('feDropShadow').attr('dx', 0).attr('dy', 0).attr('stdDeviation', 1.4)
        .attr('flood-color', color).attr('flood-opacity', .45);
      const arc = d3.arc().innerRadius(inner + item.index * ringWidth + 1.1)
        .outerRadius(inner + (item.index + 1) * ringWidth - .5).cornerRadius(ringWidth / 2).startAngle(startAngle);
      g.append('path').attr('d', arc.endAngle(startAngle + sweep)())
        .attr('fill', color).attr('opacity', .1);
      if (Number.isFinite(item.rank)) {
        g.append('path').datum(item).attr('class', 'dh-radar-ring')
          .attr('d', arc.endAngle(startAngle + sweep * clamp((config.max - item.rank + 1) / config.max, .025, 1))())
          .attr('fill', fill).attr('stroke', color).attr('stroke-width', .35)
          .attr('filter', 'url(#performance-glow-' + item.index + ')');
      }
    });
    bindTooltip(g.selectAll('.dh-radar-ring'), item => player.name + ' / ' + item.label,
      item => [['VALUE', formatStat(player.stats[item.key], item.key)], ['POSITION RANK', player.position + ' ' + item.rank]]);
    text('rating-value', Number.isFinite(player.ranks.posRank) ? player.ranks.posRank : '—');
    text('rating-meta', player.position + ' / VIEW STATS ↗');
    $('radar-details').setAttribute('aria-label', 'View ' + player.name + ' statistics and positional rankings');
    const legend = $('radar-legend'); legend.replaceChildren();
    config.labels.forEach((label, index) => {
      const item = element('span'), dot = element('i');
      dot.style.background = 'linear-gradient(135deg,' + radarSpectrum[index] + ',#676dff)';
      dot.style.boxShadow = '0 0 5px ' + radarSpectrum[index] + '55';
      item.append(dot, document.createTextNode(label)); legend.append(item);
    });
  }

  // Ground / Air is a butterfly chart: a shared zero line compares actual
  // rushing yards on the left and receiving yards on the right. Both scales
  // use the same maximum; row totals are actual rush + receiving yards.
  function renderYardage() {
    const leaders = dataApi.selectYardageLeaders(state.players);
    if (!leaders.length) {
      $('yardage-chart').replaceChildren(element('p', 'dh-chart-placeholder', 'No qualified rushing and receiving results.'));
      return;
    }
    const { svg, g, w, h } = svgFrame('yardage-chart', { left: 0, right: 0, top: 5, bottom: 25 }, 'Ground and Air: rushing versus receiving yards for the top six skill players');
    const defs = svg.append('defs');
    const rushingFill = gradient(defs, 'yardage-ground', [['0%','#13d5f4'],['52%','#258aff'],['100%','#7d68ff']]);
    const receivingFill = gradient(defs, 'yardage-air', [['0%','#8c4dff'],['50%','#c84fe7'],['100%','#ff87bc']]);
    const labelWidth = Math.min(100, w * .33), valueWidth = 34;
    const maximum = Math.max(1, ...leaders.flatMap(player => [Math.abs(player.stats.rushing_yards), Math.abs(player.stats.receiving_yards)]));
    const x = d3.scaleLinear().domain([-maximum * 1.08, maximum * 1.08]).range([labelWidth, w - valueWidth]);
    const y = d3.scaleBand().domain(leaders.map(player => player.id)).range([0, h - 4]).padding(.28);
    g.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1', -3).attr('y2', h).attr('stroke', '#ffffff33');
    g.append('g').attr('class', 'dh-axis').attr('transform', 'translate(0,' + h + ')')
      .call(d3.axisBottom(x).tickValues([-Math.ceil(maximum / 100) * 100,0,Math.ceil(maximum / 100) * 100].filter(value => Math.abs(value) <= maximum * 1.08))
        .tickFormat(value => Math.abs(value) >= 1000 ? number(Math.abs(value) / 1000) + 'k' : Math.abs(value)).tickSize(0).tickPadding(8));
    const rows = g.selectAll('.dh-yardage-row').data(leaders).join('g').attr('class', 'dh-yardage-row')
      .attr('transform', player => 'translate(0,' + y(player.id) + ')');
    rows.append('line').attr('x1', labelWidth).attr('x2', w - valueWidth).attr('y1', y.bandwidth() / 2).attr('y2', y.bandwidth() / 2).attr('stroke', '#ffffff05');
    rows.append('text').attr('class', 'dh-yardage-name').attr('x', 0).attr('y', y.bandwidth() / 2 + 3)
      .text(player => shortName(player.name));
    const barHeight = Math.min(14, y.bandwidth());
    rows.append('rect').attr('x', player => Math.min(x(-player.stats.rushing_yards), x(0)))
      .attr('width', player => Math.abs(x(0) - x(-player.stats.rushing_yards)))
      .attr('y', (y.bandwidth() - barHeight) / 2).attr('height', barHeight).attr('rx', 3).attr('fill', rushingFill)
      .attr('stroke','#87cfff').attr('stroke-width',.5);
    rows.append('rect').attr('x', player => Math.min(x(0), x(player.stats.receiving_yards)))
      .attr('width', player => Math.abs(x(player.stats.receiving_yards) - x(0)))
      .attr('y', (y.bandwidth() - barHeight) / 2).attr('height', barHeight).attr('rx', 3).attr('fill', receivingFill)
      .attr('stroke','#e38aff').attr('stroke-width',.5);
    rows.append('text').attr('class', 'dh-yardage-total').attr('x', w).attr('y', y.bandwidth() / 2 + 3).attr('text-anchor', 'end')
      .text(player => integer(player.totalYards));
    rows.append('rect').attr('fill', 'transparent').attr('width', w).attr('height', y.bandwidth());
    bindTooltip(rows, player => player.name + ' · ' + player.position, player => [
      ['RUSHING', integer(player.stats.rushing_yards) + ' YDS'], ['RECEIVING', integer(player.stats.receiving_yards) + ' YDS'],
      ['TOTAL', integer(player.totalYards) + ' YDS']
    ]);
  }

  // Scatter preserves the original all-label presentation on every viewport.
  // Close markers separate with the original bounded collision behavior, then
  // the existing small-nudge helper keeps each complete surname by its marker.
  function renderScatter() {
    const all = dataApi.selectScatterPlayers(state.players);
    const data = state.scatterPosition === 'ALL' ? all : all.filter(player => player.position === state.scatterPosition);
    if (!data.length) {
      $('scatter-chart').replaceChildren(element('p', 'dh-chart-placeholder', 'No recorded consistency and ceiling data for this position.'));
      return;
    }
    const mobile = innerWidth <= 768;
    const { svg, g, w, h } = svgFrame('scatter-chart', { left: mobile ? 26 : 38, right: 7, top: 16, bottom: 33 },
      'Consistency percentage against ceiling for the top eight PPG players at each position');
    const bounds = dataApi.getScatterBounds(all);
    const x = d3.scaleLinear().domain(bounds.x).range([0, w]), y = d3.scaleLinear().domain(bounds.y).range([h, 0]);
    g.append('g').attr('class', 'dh-grid').call(d3.axisLeft(y).ticks(4).tickSize(-w).tickFormat(''));
    g.append('g').attr('class', 'dh-axis').call(d3.axisLeft(y).ticks(4).tickSize(0).tickPadding(7));
    g.append('g').attr('class', 'dh-axis').attr('transform', 'translate(0,' + h + ')')
      .call(d3.axisBottom(x).tickValues(x.ticks(mobile ? 6 : 7).filter(value => value <= 100)).tickFormat(value => value + '%').tickSize(0).tickPadding(8));
    g.append('text').attr('class', 'dh-axis-label').attr('x', 0).attr('y', -7).text('CEILING (CL)');
    g.append('text').attr('class', 'dh-axis-label').attr('x', w / 2).attr('y', h + 32).attr('text-anchor', 'middle').text('CONSISTENCY RATE (CSTY %) →');
    // Position beads use a bright specular core, saturated rim and SVG glow,
    // which also renders in mobile WebKit. Labels retain a clear white face.
    const defs = svg.append('defs');
    positions.forEach(position => {
      const bead = defs.append('radialGradient').attr('id', 'scatter-bead-' + position).attr('cx','35%').attr('cy','25%').attr('r','75%');
      bead.append('stop').attr('offset','0%').attr('stop-color','#edfbff');
      bead.append('stop').attr('offset','30%').attr('stop-color',colors[position]);
      bead.append('stop').attr('offset','100%').attr('stop-color',d3.color(colors[position]).darker(1.4).formatHex());
      const glow = defs.append('filter').attr('id','scatter-glow-' + position).attr('x','-100%').attr('y','-100%').attr('width','300%').attr('height','300%');
      glow.append('feDropShadow').attr('dx',0).attr('dy',0).attr('stdDeviation',mobile ? 2 : 3)
        .attr('flood-color',colors[position]).attr('flood-opacity',.8);
    });
    const dotRadius = mobile ? 4.8 : 7.6, minDistance = dotRadius * 3;
    const dots = data.map(player => ({ cx: x(player.stats.csty), cy: y(player.stats.ceiling) }));
    for (let pass = 0; pass < 25; pass += 1) {
      let moved = false;
      for (let i = 0; i < dots.length; i += 1) {
        for (let j = i + 1; j < dots.length; j += 1) {
          const dx = dots[j].cx - dots[i].cx, dy = dots[j].cy - dots[i].cy;
          const distance = Math.hypot(dx, dy);
          if (distance < minDistance) {
            const angle = distance === 0 ? ((i * 37 + j * 17) % 360) * Math.PI / 180 : Math.atan2(dy, dx);
            const push = (minDistance - distance) / 2;
            const px = Math.cos(angle) * push, py = Math.sin(angle) * push;
            dots[i].cx -= px; dots[i].cy -= py; dots[j].cx += px; dots[j].cy += py;
            moved = true;
          }
          [dots[i], dots[j]].forEach(dot => {
            dot.cx = clamp(dot.cx,0,w); dot.cy = clamp(dot.cy,0,h);
          });
        }
      }
      if (!moved) break;
    }
    const circles = g.selectAll('.dh-scatter-dot').data(data).join('circle').attr('class', 'dh-scatter-dot')
      .attr('cx', (_, index) => dots[index].cx).attr('cy', (_, index) => dots[index].cy)
      .attr('r', dotRadius).attr('fill', player => 'url(#scatter-bead-' + player.position + ')')
      .attr('stroke', player => colors[player.position]).attr('filter', player => 'url(#scatter-glow-' + player.position + ')');
    const tooltipRows = player => [
      ['CONSISTENCY', number(player.stats.csty) + '% · ' + (rankFor(player, 'csty') ? player.position + ' ' + rankFor(player, 'csty') : 'Unranked')],
      ['CEILING', number(player.stats.ceiling) + ' · ' + (rankFor(player, 'cl') ? player.position + ' ' + rankFor(player, 'cl') : 'Unranked')],
      ['PPG', number(player.stats.ppg)]
    ];
    bindTooltip(circles, player => player.name + ' · ' + player.position, tooltipRows);
    const labelDx = mobile ? -2 : 3, labelDy = mobile ? 2 : 1;
    const labels = g.selectAll('.dh-scatter-label').data(data).join('text').attr('class', 'dh-scatter-label')
      .attr('text-anchor', (_, index) => dots[index].cx > w * .8 ? 'end' : 'start')
      .attr('x', (_, index) => dots[index].cx + (dots[index].cx > w * .8 ? -Math.abs(labelDx) : labelDx))
      .attr('y', (_, index) => dots[index].cy + labelDy).text(player => labelApi.formatScatterName(player.name))
      .attr('data-tooltip-trigger','')
      .on('click pointerenter', (event, player) => showTooltip(event,player.name + ' · ' + player.position,tooltipRows(player)))
      .on('pointerleave',hideTooltip);
    const boxes = labels.nodes().map(node => {
      const box = node.getBBox(), anchor = node.getAttribute('text-anchor');
      const alternateX = anchor === 'start' ? box.x - box.width : box.x + box.width;
      return { x: box.x, y: box.y, width: box.width, height: box.height, anchor, baseline: Number(node.getAttribute('y')),
        alternateX: alternateX >= 0 && alternateX + box.width <= w ? alternateX : undefined };
    });
    const layout = labelApi.settleScatterLabels(boxes, h, w, mobile);
    labels.attr('text-anchor', (_, index) => layout[index].x === boxes[index].x ? boxes[index].anchor
      : boxes[index].anchor === 'start' ? 'end' : 'start')
      .attr('y', (_, index) => boxes[index].baseline + layout[index].top - boxes[index].y);
    // Only repaired clusters need a short, quiet leader; labels stay next to
    // the original marker instead of becoming a separate callout list.
    const leaders = g.insert('g', '.dh-scatter-dot').attr('aria-hidden','true');
    labels.nodes().forEach((node, index) => {
      if (Math.abs(layout[index].top - boxes[index].y) <= 6) return;
      leaders.append('line').attr('x1',dots[index].cx).attr('y1',dots[index].cy)
        .attr('x2',Number(node.getAttribute('x'))).attr('y2',Number(node.getAttribute('y')) - 3)
        .attr('stroke',colors[data[index].position]).attr('stroke-opacity',.4).attr('stroke-width',.6);
    });
  }

  function openPlayerDialog(player) {
    hideTooltip();
    const config = radarConfig[player.position];
    text('radar-modal-title', player.name);
    text('radar-modal-description', player.position + ' / ' + player.team + ' · ' + player.games + ' recorded games · 2026 season');
    const body = $('radar-modal-body'); body.replaceChildren();
    config.stats.forEach((key, index) => {
      const rank = rankFor(player, key), row = element('div', 'dh-stat-row');
      row.append(element('span', '', config.labels[index]), element('strong', '', formatStat(player.stats[key], key)),
        element('small', '', Number.isFinite(rank) ? player.position + ' ' + rank : 'UNRANKED'));
      body.append(row);
    });
    $('radar-modal').showModal();
  }
  $('radar-modal-close').addEventListener('click', () => $('radar-modal').close());
  $('radar-modal').addEventListener('click', event => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
  });
  $('radar-details').addEventListener('click', () => {
    const selected = state.players.find(player => player.id === state.selectedId);
    if (selected) openPlayerDialog(selected);
  });
  $('player-select').addEventListener('change', event => {
    state.selectedId = event.target.value;
    if (state.ready) renderRadar();
  });
  $('filter-buttons').addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button || !state.ready) return;
    state.ppgPosition = button.dataset.filter;
    $('filter-buttons').querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderPpg();
  });
  $('scatter-filters').addEventListener('click', event => {
    const button = event.target.closest('[data-pos]');
    if (!button || !state.ready) return;
    state.scatterPosition = button.dataset.pos;
    $('scatter-filters').querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderScatter();
  });

  function renderCharts() {
    hideTooltip();
    renderPpg(); renderDistribution(); renderRadar(); renderYardage(); renderScatter();
  }
  async function initialize() {
    if (state.loading) return;
    state.loading = true; state.ready = false;
    $('dashboard').setAttribute('aria-busy', 'true');
    const status = $('dashboard-data-status');
    status.hidden = false; status.removeAttribute('data-error');
    status.textContent = 'Loading the 2026 season…';
    try {
      [dataApi, labelApi] = await Promise.all([
        import('./dashboard-data.js?v=DH3.72-prism'),
        import('./dashboard-scatter-layout.js?v=DH3.72-prism-all-labels')
      ]);
      state.players = dataApi.rankDashboardPlayers(await dataApi.loadDashboardPlayers());
      state.selectedId = state.players[0].id;
      renderSummary(); renderPlayerPicker();
      if (!window.d3) throw new Error('Dashboard chart library is unavailable.');
      renderCharts();
      state.ready = true; status.hidden = true;
    } catch (error) {
      console.error('Dashboard could not load.', error);
      status.dataset.error = '';
      status.textContent = '2026 season dashboard unavailable. Refresh or try again.';
      const retry = element('button', '', 'Try again'); retry.type = 'button';
      retry.addEventListener('click', initialize); status.append(retry);
      ['bar-chart','distribution-chart','radar-chart','yardage-chart','scatter-chart'].forEach(id => {
        $(id).replaceChildren(element('p', 'dh-chart-placeholder', 'Chart unavailable. Try loading again.'));
      });
      if (!state.players.length) {
        ['total-points','ppg','consistency','share'].forEach(prefix => {
          text(prefix + '-value', '—'); text(prefix + '-name', 'Unavailable');
          text(prefix + '-meta', '2026 data not loaded');
        });
      }
    } finally {
      state.loading = false;
      $('dashboard').setAttribute('aria-busy', 'false');
    }
  }
  // Only genuine container-width/font changes redraw plots. Controls and their
  // active filters survive resize and orientation changes without another fetch.
  let observedWidth = 0;
  const scheduleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (state.ready) renderCharts(); }, 120);
  };
  if ('ResizeObserver' in window) {
    new ResizeObserver(entries => {
      const width = entries[0].contentRect.width;
      if (Math.abs(width - observedWidth) > 1) { observedWidth = width; scheduleResize(); }
    }).observe($('dashboard'));
  } else window.addEventListener('resize', scheduleResize);
  document.fonts?.ready.then(scheduleResize);
  setupNavigation();
  window.initFantasyDashboard = initialize;
  initialize();
})();
