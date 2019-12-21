const _ = require('lodash');

const input = require('fs')
  .readFileSync('./input.txt', { encoding: 'utf-8' })
  .split('\n')
  .filter(x => !!x)
  .map(line => line.split(''));

function parseMaze(input) {
  const grid = {};
  const portals = {};

  const height = input.length;
  const width = Math.max(...input.map(i => i.length));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tile = input[y][x];
      if (!tile) continue;

      if (tile === '.' || tile === '#') {
        grid[`${x},${y}`] = input[y][x];
      } else if (tile.match(/[A-Z]/)) {
        const neighbors = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]
          .filter(([x, y]) => input[y] && input[y][x]);
        const letters = neighbors.filter(([x, y]) => input[y][x].match(/[A-Z]/));
        const dots = neighbors.filter(([x, y]) => input[y][x] === '.');
        if (letters.length === 0 || dots.length === 0) continue;

        const [letter] = letters;
        const [dot] = dots;
        let points;
        if (x === letter[0] && letter[0] === dot[0]) {
          points = _.sortBy([[x, y], letter, dot], ([,y]) => y);
        } else if (y === letter[1] && letter[1] === dot[1]) {
          points = _.sortBy([[x, y], letter, dot], ([x]) => x);
        }

        const portal = points.map(([x, y]) => input[y][x]).join('');
        const portalName = portal.replace('.', '');
        if (!portals[portalName]) portals[portalName] = new Set();
        portals[portalName].add(dot.join(','));
      }
    }
  }

  const start = [...portals['AA']][0];
  const end = [...portals['ZZ']][0];
  delete portals['AA'];
  delete portals['ZZ'];

  const portalCoords = {};
  for (const portal of Object.values(portals)) {
    const [start, end] = [...portal];
    portalCoords[start] = end;
    portalCoords[end] = start;
  }

  return { grid, width, height, start, end, portals, portalCoords };
}

function bfs({ grid, start, end, portalCoords }) {
  const q = [[start]];
  const seen = new Set();

  while (q.length) {
    const path = q.shift();
    if (path.length === 0) break;

    const last = _.last(path);
    if (last === end) return path;

    const [x, y] = last.split(',').map(_.parseInt);
    const neighbors = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    if (portalCoords[last]) {
      neighbors.push(portalCoords[last].split(',').map(_.parseInt));
    }
    for (const [nx, ny] of neighbors) {
      const coord = `${nx},${ny}`;
      const n = grid[coord];
      if (!n || n === '#') continue;

      if (seen.has(coord)) continue;
      seen.add(coord);

      q.push(path.concat(coord));
    }
  }
}

function part1() {
  const maze = parseMaze(input);
  const path = bfs(maze);
  return path.length - 1;
}

console.log(part1()); // 476

function part2() {

}

part2();
