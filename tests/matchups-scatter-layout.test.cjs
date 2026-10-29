const test = require('node:test');
const assert = require('node:assert/strict');
const { spreadScatterPoints } = require('../DH_P2.53/matchups/chart-utils.js');

const bounds = { left: 43, right: 320, top: 18, bottom: 286 };
const movement = point => Math.hypot(point.displayX - point.x, point.displayY - point.y);
const overlap = points => points.reduce((total, a, index) => total + points.slice(index + 1).reduce((sum, b) =>
  sum + Math.max(0, 18.5 - Math.hypot(a.displayX - b.displayX, a.displayY - b.displayY)), 0), 0);

test('isolated markers keep their exact positions and inputs stay untouched', () => {
  const points = [{ team: 'BAL', x: 60, y: 40 }, { team: 'BUF', x: 220, y: 200 }];
  const original = structuredClone(points);
  const placed = spreadScatterPoints(points, bounds);
  assert.deepEqual(points, original);
  assert.ok(placed.every(point => movement(point) === 0));
  assert.deepEqual(placed.map(({ team, x, y }) => ({ team, x, y })), original);
  assert.deepEqual(spreadScatterPoints([], bounds), []);
});

test('nearby and identical values separate while retaining exact anchors', () => {
  for (const distance of [0, 4, 12]) {
    const points = [{ team: 'BAL', x: 150, y: 150 }, { team: 'BUF', x: 150 + distance, y: 150 }];
    const placed = spreadScatterPoints(points, bounds);
    assert.ok(Math.hypot(placed[0].displayX - placed[1].displayX, placed[0].displayY - placed[1].displayY) >= 18.4);
    assert.ok(placed.every(point => movement(point) <= 14 + 1e-9));
    assert.deepEqual(placed.map(({ team, x, y }) => ({ team, x, y })), points);
    assert.deepEqual(spreadScatterPoints(points, bounds), placed);
  }
});

test('dense clusters reduce overlap without exceeding the displacement cap', () => {
  const points = Array.from({ length: 12 }, (_, index) => ({ team: `T${index}`, x: 150 + index % 4 * 3, y: 140 + Math.floor(index / 4) * 3 }));
  const before = points.map(point => ({ ...point, displayX: point.x, displayY: point.y }));
  const placed = spreadScatterPoints(points, bounds);
  assert.ok(overlap(placed) < overlap(before) * .5);
  assert.ok(placed.every(point => movement(point) <= 14 + 1e-9));
  assert.deepEqual(spreadScatterPoints(points, bounds), placed);
});

test('crowding at plot edges stays inside mobile and desktop bounds', () => {
  for (const right of [260, 640]) {
    const plot = { ...bounds, right };
    for (const [x, y] of [[plot.left, plot.top], [plot.right, plot.bottom]]) {
      const points = Array.from({ length: 4 }, (_, index) => ({ team: `T${index}`, x, y }));
      const placed = spreadScatterPoints(points, plot);
      assert.ok(placed.every(point => Number.isFinite(point.displayX) && Number.isFinite(point.displayY)));
      assert.ok(placed.every(point => point.displayX >= plot.left && point.displayX <= plot.right && point.displayY >= plot.top && point.displayY <= plot.bottom));
      assert.ok(placed.every(point => movement(point) <= 14 + 1e-9));
      assert.ok(overlap(placed) < overlap(points.map(point => ({ ...point, displayX: point.x, displayY: point.y }))));
    }
  }
});
