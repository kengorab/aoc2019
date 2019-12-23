const _ = require('lodash');

const input = require('fs')
  .readFileSync('./input.txt', { encoding: 'utf-8' })
  .split('\n')
  .filter(x => !!x)
  .map(line => line.split(''));

function parseMaze(input) {
  const grid = {};
  const portals = {};

  const innerEdge = [];
  const height = input.length;
  const width = Math.max(...input.map(i => i.length));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tile = input[y][x];
      if (tile === ' ') {
        if (input[y - 1] && input[y - 1][x] === '#' && input[y][x - 1] === '#') {
          innerEdge.push([x - 1, y - 1]);
        } else if (input[y + 1] && input[y + 1][x] === '#' && input[y][x + 1] === '#') {
          innerEdge.push([x + 1, y + 1]);
        }
      }
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
  const portalLevels = {};
  for (const portal of Object.values(portals)) {
    const [[tx, ty], [bx, by]] = innerEdge;

    const [start, end] = [...portal];
    portalCoords[start] = end;
    portalCoords[end] = start;

    const [sx, sy] = start.split(',').map(_.parseInt);
    let level = (ty <= sy && sy <= by && (sx === tx || sx === bx)) || (tx <= sx && sx <= bx && (sy === ty || sy === by)) ? -1 : 1;
    portalLevels[start] = level;

    const [ex, ey] = end.split(',').map(_.parseInt);
    level = (ty <= ey && ey <= by && (ex === tx || ex === bx)) || (tx <= ex && ex <= bx && (ey === ty || ey === by)) ? -1 : 1;
    portalLevels[end] = level;
  }

  return { grid, width, height, start, end, portals, portalCoords, portalLevels };
}

function part1() {
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

  const maze = parseMaze(input);
  const path = bfs(maze);
  return path.length - 1;
}

// console.log(part1()); // 476

function part2() {
  function bfs({ grid, start, end, portalCoords, portalLevels }) {
    const q = [ { steps: 0, pos: start, level: 0 }];
    const seen = new Set(start);

    while (q.length) {
      const { pos, steps, level } = q.shift();

      if (pos === end && level === 0) return steps;

      const [x, y] = pos.split(',').map(_.parseInt);
      const neighbors = [[[x + 1, y], 0], [[x - 1, y], 0], [[x, y + 1], 0], [[x, y - 1], 0]];
      if (portalCoords[pos]) {
        if (portalLevels[pos] === 1 && level === 0) {}
        else {
          neighbors.push([
            portalCoords[pos].split(',').map(_.parseInt),
            portalLevels[pos]
          ]);
        }
      }
      for (const [[nx, ny], dLevel] of neighbors) {
        const coord = `${nx},${ny}`;
        const n = grid[coord];
        if (!n || n === '#') continue;

        const nextLevel = level + dLevel;
        if (seen.has(`${coord},${nextLevel}`)) continue;
        seen.add(`${coord},${nextLevel}`);

        const next = { steps: steps + 1, pos: coord, level: nextLevel };
        q.push(next);
      }
    }
  }

  const maze = parseMaze(input);
  return bfs(maze);
}

console.log(part2()); // 5350
