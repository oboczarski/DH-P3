import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../DH_P2.53/scripts/mobile-page-view.js', import.meta.url), 'utf8');

function tab(page, { mobile = true, historyState = null } = {}) {
    const window = new EventTarget();
    const document = new EventTarget();
    const classes = new Set();
    document.body = { dataset: { page } };
    document.documentElement = { classList: {
        toggle(name, present) {
            if (present) classes.add(name);
            else classes.delete(name);
        },
    } };
    document.hidden = false;
    document.visibilityState = 'visible';
    const history = {
        state: historyState,
        writes: 0,
        replaceState(state) {
            this.state = structuredClone(state);
            this.writes++;
        },
    };
    vm.runInNewContext(source, {
        window, document, history, navigator: { userAgent: mobile ? 'iPhone' : 'Macintosh' },
        matchMedia: () => ({ matches: false }),
    });
    return { window, document, history, classes, view: window.DynastyHubMobileView };
}

test('a mobile hidden tab saves its own history entry and resumes without a navigation', () => {
    const open = tab('rosters', { historyState: { otherState: 12 } });
    open.view.saveOnHide(() => ({ league: '123', bodyScroll: [124, 417] }));
    open.document.hidden = true;
    open.document.visibilityState = 'hidden';
    open.document.dispatchEvent(new Event('visibilitychange'));
    open.window.dispatchEvent(new Event('pagehide'));
    assert.equal(open.history.writes, 1, 'pagehide and visibilitychange share one saved view');
    assert.equal(open.history.state.otherState, 12);
    assert.equal(open.classes.has('dh-mobile-page-hidden'), true);

    open.document.hidden = false;
    open.document.visibilityState = 'visible';
    open.document.dispatchEvent(new Event('visibilitychange'));
    assert.equal(open.classes.has('dh-mobile-page-hidden'), false);
    assert.equal(open.history.writes, 1);

    const recreated = tab('rosters', { historyState: open.history.state });
    assert.deepEqual(recreated.view.read(), { league: '123', bodyScroll: [124, 417] });
    assert.equal(tab('rosters').view.read(), null, 'A new history entry starts fresh');
    assert.equal(tab('datahub', { historyState: open.history.state }).view.read(), null);
});

test('desktop and other pages skip mobile history and background handling', () => {
    assert.equal(tab('rosters', { mobile: false }).view, undefined);
    assert.equal(tab('datahub', { mobile: false }).view, undefined);
    assert.equal(tab('leaguehub').view, undefined);
});
