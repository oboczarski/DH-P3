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

test('a colliding pair moves by equal, opposite small amounts', () => {
  const boxes = [
    { x: 20, y: 40, width: 80, height: 10 },
    { x: 25, y: 47, width: 90, height: 10 },
    { x: 180, y: 43, width: 40, height: 10 }
  ];
  const result = arrangeScatterLabels(boxes, 140);
  assert.equal(result[0].top, 38);
  assert.equal(result[1].top, 49);
  assert.equal(result[2].top, 43, 'isolated name stays put');
  assert.deepEqual(result.map(label => label.x), boxes.map(box => box.x));
  assert.deepEqual(arrangeScatterLabels(boxes, 140), result);
  assert.equal(boxes[0].y, 40, 'source boxes stay unchanged');
});

test('dense clusters cannot accumulate more than the small per-label nudge limit', () => {
  const boxes = Array.from({ length: 8 }, (_, i) => ({ x: 10 + i, y: 80 + i, width: 70, height: 10 }));
  for (const limit of [4, 6]) {
    const result = arrangeScatterLabels(boxes, 200, 1, limit);
    result.forEach((label, i) => assert.ok(Math.abs(label.top - boxes[i].y) <= limit));
  }
});

test('only originally intersecting names move, without propagating a shift to nearby labels', () => {
  const boxes = [
    { x: 10, y: 40, width: 70, height: 10 },
    { x: 10, y: 47, width: 70, height: 10 },
    { x: 10, y: 58, width: 70, height: 10 },
    { x: 100, y: 40, width: 70, height: 10 }
  ];
  const result = arrangeScatterLabels(boxes, 140);
  assert.equal(result[2].top, 58);
  assert.equal(result[3].top, 40);
});

test('equal-height pairs split consistently, while plot edges limit both nudges equally', () => {
  const boxes = [{ x: 10, y: 40, width: 70, height: 10 }, { x: 10, y: 40, width: 70, height: 10 }];
  assert.deepEqual(arrangeScatterLabels(boxes, 100, 1, 4).map(label => label.top), [36, 44]);
  const edge = [{ x: 10, y: 1, width: 70, height: 10 }, { x: 10, y: 2, width: 70, height: 10 }];
  assert.deepEqual(arrangeScatterLabels(edge, 100).map(label => label.top), [0, 3]);
});
