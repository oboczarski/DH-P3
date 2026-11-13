import test from 'node:test';
import assert from 'node:assert/strict';
import { arrangeScatterLabels, formatScatterName, settleScatterLabels } from '../DH_P2.53/scripts/dashboard-scatter-layout.js';

test('scatter names retain surnames, compound surnames and suffixes after the first-name initial', () => {
  for (const [name, expected] of [
    ['Kenneth Walker III', 'K. Walker III'], ['Marvin Harrison Jr.', 'M. Harrison Jr.'],
    ['Brian Robinson Jr.', 'B. Robinson Jr.'], ['Michael Penix Jr.', 'M. Penix Jr.'],
    ['Amon-Ra St. Brown', 'A. St. Brown'], ['Jaxon Smith-Njigba', 'J. Smith-Njigba'],
    ['  Kenneth   Walker  III  ', 'K. Walker III'], ['Cher', 'Cher'], ['', '']
  ]) assert.equal(formatScatterName(name), expected);
});

test('complete scatter labels resolve a three-player edge cluster without hiding or clipping any name', () => {
  const boxes = [
    { x: 211, y: 30, width: 34, height: 10, alternateX: 245 },
    { x: 234, y: 25, width: 65, height: 10 },
    { x: 218, y: 21, width: 40, height: 10, alternateX: 258 },
    { x: 100, y: 120, width: 50, height: 10, alternateX: 50 }
  ];
  const placed = settleScatterLabels(boxes, 300, 310, true);
  assert.equal(placed.length, boxes.length);
  placed.forEach((label, index) => {
    assert.ok(label.x >= 0 && label.x + label.width <= 310);
    assert.ok(label.top >= 0 && label.top + label.height <= 300);
    assert.ok(Math.abs(label.top - boxes[index].y) <= 16);
    for (const other of placed.slice(index + 1)) {
      const overlapWidth = Math.min(label.x + label.width, other.x + other.width) - Math.max(label.x, other.x);
      const overlapHeight = Math.min(label.top + label.height, other.top + other.height) - Math.max(label.top, other.top);
      assert.ok(overlapWidth <= .5 || overlapHeight <= .5);
    }
  });
  assert.equal(placed[3].x, boxes[3].x);
  assert.equal(placed[3].top, boxes[3].y);
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
  assert.ok(result[1].top + result[1].height <= result[2].top, 'the nudge avoids creating a collision with the nearby name');
});

test('a blocked pair nudge uses the nearby free space without relocating the clear neighbor', () => {
  const boxes = [
    { name: 'Goff', x: 10, y: 40, width: 30, height: 10 },
    { name: 'Williams', x: 20, y: 47, width: 70, height: 10 },
    { name: 'McCaffrey', x: 60, y: 58, width: 80, height: 10 }
  ];
  const result = arrangeScatterLabels(boxes, 140, 1, 4);
  assert.equal(result[2].top, 58);
  assert.ok(result[0].top + result[0].height <= result[1].top);
  assert.ok(result[1].top + result[1].height <= result[2].top);
  result.forEach((label, i) => assert.ok(Math.abs(label.top - boxes[i].y) <= 4));
});

test('clear labels and unaffected nudges retain their positions while a blocked cluster is repaired', () => {
  const boxes = [
    { x: 10, y: 40, width: 30, height: 10 },
    { x: 20, y: 47, width: 70, height: 10 },
    { x: 60, y: 58, width: 80, height: 10 },
    { x: 180, y: 40, width: 40, height: 10 },
    { x: 180, y: 47, width: 40, height: 10 }
  ];
  assert.deepEqual(arrangeScatterLabels(boxes, 140).slice(3).map(label => label.top), [38, 49]);
});

test('the rendered Williams/McCaffrey cluster uses the open side without disturbing its other labels', () => {
  // Measured 390px home-chart text boxes reproduce the reported collision.
  const boxes = [
    { name: 'Goff', x: 227.6329, y: 124.6789, width: 24.3438, height: 9.5, anchor: 'start' },
    { name: 'McCaffrey', x: 255.6364, y: 136.7903, width: 47.3516, height: 9.5, anchor: 'end' },
    { name: 'Hubbard', x: 227.8947, y: 139.0766, width: 40.7187, height: 9.5, anchor: 'start' },
    { name: 'Williams', x: 241.9163, y: 127.2813, width: 38.1328, height: 9.5, anchor: 'start' },
    { name: 'Bowers', x: 267.7848, y: 122.3903, width: 35.2031, height: 9.5, anchor: 'end' },
    { name: 'McBride', x: 241.8641, y: 142.5714, width: 37.6563, height: 9.5, anchor: 'start' }
  ];
  boxes.forEach(box => {
    const alternateX = box.anchor === 'start' ? box.x - box.width : box.x + box.width;
    if (alternateX >= 0 && alternateX + box.width <= 312) box.alternateX = alternateX;
  });
  const result = arrangeScatterLabels(boxes, 240, 1, 4);
  const williams = result[3], mccaffrey = result[1];
  assert.ok(williams.x + williams.width <= mccaffrey.x, 'Williams uses free space on the other side of the same point');
  const unchangedShifts = [-3.9488, -4, 0.4975, null, -2.8045, 4];
  result.forEach((label, i) => {
    assert.ok(Math.abs(label.top - boxes[i].y) <= 4.001);
    if (i !== 3) {
      assert.equal(label.x, boxes[i].x);
      assert.ok(Math.abs(label.top - boxes[i].y - unchangedShifts[i]) < 0.001, label.name);
    }
  });
});

test('a barely touching original pair cannot be made into a deep overlap by nudges', () => {
  const boxes = [
    { x: 90, y: 40, width: 20, height: 10 },
    { x: 100, y: 47, width: 40, height: 10, alternateX: 60 },
    { x: 130, y: 56.95, width: 60, height: 10 }
  ];
  const result = arrangeScatterLabels(boxes, 140, 1, 4);
  assert.ok(result[1].x + result[1].width <= result[2].x);
  assert.ok(result[0].top + result[0].height <= result[1].top);
});

test('equal-height pairs split consistently, while plot edges limit both nudges equally', () => {
  const boxes = [{ x: 10, y: 40, width: 70, height: 10 }, { x: 10, y: 40, width: 70, height: 10 }];
  assert.deepEqual(arrangeScatterLabels(boxes, 100, 1, 4).map(label => label.top), [36, 44]);
  const edge = [{ x: 10, y: 1, width: 70, height: 10 }, { x: 10, y: 2, width: 70, height: 10 }];
  assert.deepEqual(arrangeScatterLabels(edge, 100).map(label => label.top), [0, 3]);
});
