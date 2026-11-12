import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const seasonPath = '/data/NFL-2026_Stats/SeasonStats/2026_Season.csv';

test('the service worker reads updated season CSV online, preserves offline data and leaves Sheets alone', async () => {
  const source = fs.readFileSync(new URL('../DH_P2.53/service-worker.js', import.meta.url), 'utf8');
  const listeners = {};
  const stored = new Map();
  const requests = [];
  let contents = 'Monday totals';
  let offline = false;
  const key = request => typeof request === 'string' ? request : request.url;
  const cache = { put(request, response) { stored.set(key(request), response); } };
  const context = vm.createContext({
    URL, console,
    self: { location: { origin: 'https://test.local' }, addEventListener(name, listener) { listeners[name] = listener; } },
    caches: { open: async () => cache, match: async request => stored.get(key(request)) },
    fetch: async (url, options) => {
      requests.push({ url, options });
      if (offline) throw new Error('Offline');
      return new Response(contents);
    },
  });
  vm.runInContext(source, context);
  const read = async url => {
    let pending;
    listeners.fetch({ request: { url, method: 'GET' }, respondWith(response) { pending = response; } });
    return pending;
  };
  const url = `https://test.local${seasonPath}`;
  assert.equal(await (await read(url)).text(), 'Monday totals');
  contents = 'Thursday totals';
  assert.equal(await (await read(url)).text(), 'Thursday totals', 'The previous SW entry cannot hide updated data');
  assert.equal(requests.length, 2);
  requests.forEach(({ options }) => assert.equal(options.cache, 'no-store'));
  offline = true;
  assert.equal(await (await read(url)).text(), 'Thursday totals');
  assert.equal(await read('https://docs.google.com/spreadsheets/d/example/export?sheet=DRK'), undefined);
  assert.equal(requests.length, 3, 'The SW never intercepts or caches unrelated Google Sheets');
});

test('Netlify revalidates only the maintained season CSV without changing unrelated data caching', () => {
  const config = fs.readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8');
  const headers = config.split('[[headers]]').slice(1);
  const season = headers.find(block => block.includes(`for = "${seasonPath}"`));
  assert.ok(season);
  assert.ok(headers.indexOf(season) < headers.findIndex(block => block.includes('for = "/*"')),
    'The exact season cache policy must precede the catch-all header rule');
  assert.match(season, /Cache-Control = "public, no-cache, max-age=0, must-revalidate"/);
  const otherData = headers.find(block => block.includes('for = "/data/*"'));
  assert.match(otherData, /max-age=86400, stale-while-revalidate=604800/);
});
