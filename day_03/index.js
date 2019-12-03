const _ = require('lodash');

function getInputLines() {
  // const input = `
  //   R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
  //   U98,R91,D20,R16,D67,R40,U7,R15,U6,R7
  // `;
  const input = require('fs').readFileSync('./input.txt', { encoding: 'utf-8' });

  return input.trim()
    .split('\n')
    .filter(i => i.length)
    .map(line => line.trim());
}

const origin = [1, 1];

function wirePoints(wirePath) {
  const dirs = wirePath.split(',');
  const points = [origin];

  dirs.forEach(dir => {
    const [d, ...n] = dir.split('');
    const num = parseInt(n.join(''), 10);

    const offsets = {
      'R': [1, 0],
      'U': [0, 1],
      'L': [-1, 0],
      'D': [0, -1],
    };

    for (let i = 0; i < num; i++) {
      const [x, y] = points[points.length - 1];
      const [xOff, yOff] = offsets[d];
      points.push([x + xOff, y + yOff])
    }
  });
  return points;
}

function manhattanDist([x1, y1], [x2, y2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

const [line1, line2] = getInputLines();
const wire1 = wirePoints(line1).map(([x, y]) => `${x},${y}`);
const wire2 = wirePoints(line2).map(([x, y]) => `${x},${y}`);

function part1() {
  const intersections = _.intersection(wire1, wire2)
    .map(p => p.split(',').map(i => parseInt(i, 10)))
    .map(p => [p, manhattanDist(origin, p)]);
  const sorted = _.sortBy(intersections, ([p, d]) => d);

  const [_point, dist] = sorted[1];
  return dist;
}

function part2() {
  const intersections = _.intersection(wire1, wire2)
    .map(p => [p, wire1.indexOf(p) + wire2.indexOf(p)]);
  const sorted = _.sortBy(intersections, ([p, d]) => d);

  const [_point, dist] = sorted[1];
  return dist;
}

console.log('part 1:', part1()); // 870
console.log('part 2:', part2()); // 13698
