import test from 'node:test';
import assert from 'node:assert/strict';
import { arrangeScatterLabels, formatScatterName } from '../DH_P2.53/scripts/dashboard-scatter-layout.js';

test('scatter names retain surnames, compound surnames and suffixes after the first-name initial', () => {
  for (const [name, expected] of [
    ['Kenneth Walker III', 'K. Walker III'], ['Marvin Harrison Jr.', 'M. Harrison Jr.'],
    ['Brian Robinson Jr.', 'B. Robinson Jr.'], ['Michael Penix Jr.', 'M. Penix Jr.'],
    ['Amon-Ra St. Brown', 'A. St. Brown'], ['Jaxon Smith-Njigba', 'J. Smith-Njigba'],
    ['  Kenneth   Walker  III  ', 'K. Walker III'], ['Cher', 'Cher'], ['', '']
  ]) assert.equal(formatScatterName(name), expected);
});

function expectSeparated(layout, height, gap = 2) {
  for (const label of layout) {
    assert.ok(label.top >= 0 && label.top + label.height <= height, 'label stays within plot');
    for (const other of layout) {
      if (label.index >= other.index) continue;
      const overlapX = label.x < other.x + other.width + gap && label.x + label.width + gap > other.x;
      if (overlapX) assert.ok(label.top + label.height + gap <= other.top || other.top + other.height + gap <= label.top,
        `labels ${label.index}/${other.index} overlap`);
    }
  }
}

test('measured scatter names move vertically without changing their horizontal coordinates or source order', () => {
  const boxes = [
    { x: 20, y: 40, width: 80, height: 10 },
    { x: 25, y: 43, width: 90, height: 10 },
    { x: 30, y: 46, width: 75, height: 10 },
    { x: 180, y: 43, width: 40, height: 10 }
  ];
  const result = arrangeScatterLabels(boxes, 140);
  expectSeparated(result, 140);
  assert.deepEqual(result.map(label => label.x), boxes.map(box => box.x));
  assert.equal(result[3].top, boxes[3].y, 'isolated label stays in its natural position');
  assert.ok(result.some((label, i) => label.top !== boxes[i].y));
  assert.deepEqual(arrangeScatterLabels(boxes, 140), result, 'layout remains deterministic');
  assert.equal(boxes[1].y, 43, 'measured source bounds are preserved');
});

test('a crowded cluster near the lower plot edge stacks upward without clipping', () => {
  const boxes = Array.from({ length: 8 }, (_, i) => ({ x: 10 + i, y: 180 + i, width: 70, height: 10 }));
  expectSeparated(arrangeScatterLabels(boxes, 200), 200);
});

test('top-edge clusters stay inside, and existing well-separated names retain their placement', () => {
  expectSeparated(arrangeScatterLabels(Array.from({ length: 6 }, () => ({ x: 10, y: 0, width: 70, height: 10 })), 150), 150);
  const separated = [{ x: 10, y: 10, width: 60, height: 10 }, { x: 15, y: 40, width: 70, height: 10 }];
  assert.deepEqual(arrangeScatterLabels(separated, 100).map(label => label.top), [10, 40]);
});
