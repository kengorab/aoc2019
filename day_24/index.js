const _ = require('lodash');
const input = require('fs')
  .readFileSync('./input.txt', { encoding: 'utf-8' })
  .split('\n')
  .map(line => line.trim())
  .filter(x => !!x);

const WIDTH = 5;
const HEIGHT = 5;

function buildGrid(input) {
  const grid = {};
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      grid[`${x},${y}`] = input[y][x]
    }
  }
  return grid;
}

function emptyGrid() {
  return buildGrid('.....\n.....\n.....\n.....\n.....'.split('\n'));
}

function gridToRows(grid) {
  const rows = [];
  for (let y = 0; y < HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < WIDTH; x++) {
      row.push(grid[`${x},${y}`]);
    }
    rows.push(row);
  }
  return rows;
}

function serializeGrid(grid) {
  const rows = gridToRows(grid);
  return rows.map(row => row.join('')).join('\n')
}

function printGrid(grid) {
  console.log(serializeGrid(grid));
  console.log();
}

function part1() {
  function biodiversity(grid) {
    return serializeGrid(grid)
      .replace('\n', '').replace('\n', '').replace('\n', '').replace('\n', '').split('')
      .reduce(
        (acc, ch, idx) => {
          if (ch === '.') return acc;
          return acc + 2 ** idx;
        },
        0
      )
  }

  function tick(grid) {
    const newGrid = {};
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const coord = `${x},${y}`;
        const neighbors = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]
          .map(([x, y]) => grid[`${x},${y}`])
          .filter(n => !!n);
        const numAdjBugs = neighbors.filter(n => n === '#').length;
        if (grid[coord] === '#') {
          newGrid[`${x},${y}`] = numAdjBugs === 1 ? '#' : '.';
        } else {
          newGrid[`${x},${y}`] = numAdjBugs === 1 || numAdjBugs === 2 ? '#' : '.';
        }
      }
    }
    return newGrid;
  }

  const seen = new Set();
  let grid = buildGrid(input);
  seen.add(serializeGrid(grid));

  while (true) {
    grid = tick(grid);
    if (seen.has(serializeGrid(grid))) {
      return biodiversity(grid);
    }
    seen.add(serializeGrid(grid));
  }
}

// console.log(part1()); // 14539258

function part2() {
  let levels = { 0: buildGrid(input) };

  function printLevels(levels) {
    const keys = _.sortBy(Object.keys(levels).map(_.parseInt));
    for (const level of keys) {
      console.log(`Depth: ${level}`);
      printGrid(levels[level]);
    }
    console.log('==========\n')
  }

  function tickLevels(levels) {
    const newLevels = {};

    // Preemptively add extra inner + outer layers; the +/-2 ones are ignored in the loop, but the +/-1 ones are needed
    // because we may need to populate some bugs there on the first pass and not wait until the second pass.
    const minLevel = Math.min(...Object.keys(levels).map(_.parseInt));
    const maxLevel = Math.max(...Object.keys(levels).map(_.parseInt));
    levels[minLevel - 1] = emptyGrid();
    levels[minLevel - 2] = emptyGrid();
    levels[maxLevel + 1] = emptyGrid();
    levels[maxLevel + 2] = emptyGrid();

    Object.entries(levels).forEach(([level, grid]) => {
      level = parseInt(level, 10);
      if (level === minLevel - 2 || level === maxLevel + 2) {
        newLevels[level] = grid;
        return;
      }

      const newGrid = {};
      for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
          if (x === 2 && y === 2) {
            newGrid['2,2'] = '?';
            continue; // Don't do anything w/ the midpoint
          }

          let numAdj = 0;

          // Check out a layer
          if (x === 0) { // left edge
            numAdj += levels[level - 1]['1,2'] === '#' ? 1 : 0;
          } else if (x === WIDTH - 1) { // right edge
            numAdj += levels[level - 1]['3,2'] === '#' ? 1 : 0;
          }
          if (y === 0) { // top edge
            numAdj += levels[level - 1]['2,1'] === '#' ? 1 : 0;
          } else if (y === HEIGHT - 1) { // bottom edge
            numAdj += levels[level - 1]['2,3'] === '#' ? 1 : 0;
          }

          // Check in a layer
          if (x === 2 && y === 1) {
            // num bugs in top edge
            numAdj += _.range(WIDTH).map(x => levels[level + 1][`${x},0`]).filter(p => p === '#').length;
          } else if (x === 2 && y === 3) {
            // num bugs in bottom edge
            numAdj += _.range(WIDTH).map(x => levels[level + 1][`${x},4`]).filter(p => p === '#').length;
          } else if (x === 1 && y === 2) {
            // num bugs in left edge
            numAdj += _.range(HEIGHT).map(y => levels[level + 1][`0,${y}`]).filter(p => p === '#').length;
          } else if (x === 3 && y === 2) {
            // num bugs in right edge
            numAdj += _.range(HEIGHT).map(y => levels[level + 1][`4,${y}`]).filter(p => p === '#').length;
          }

          // Otherwise, check neighbors
          numAdj += [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]
            .map(([x, y]) => `${x},${y}`)
            .filter(p => grid[p] && grid[p] === '#')
            .length;

          const coord = `${x},${y}`;
          if (grid[coord] === '#') {
            newGrid[`${x},${y}`] = numAdj === 1 ? '#' : '.';
          } else {
            newGrid[`${x},${y}`] = numAdj === 1 || numAdj === 2 ? '#' : '.';
          }
        }
      }
      newLevels[level] = newGrid;
    });

    return newLevels;
  }

  _.times(200, () => {
    levels = tickLevels(levels);
  });

  return Object.values(levels)
    .map(grid => serializeGrid(grid).split('').filter(ch => ch === '#').length)
    .reduce((acc, n) => acc + n, 0);
}

console.log(part2()); // 1977
