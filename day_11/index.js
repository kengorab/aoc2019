const _ = require('lodash');
const { run } = require('../intcode');

function* always(v) {
  while (true) {
    yield v
  }
}

const instructions = [3,8,1005,8,345,1106,0,11,0,0,0,104,1,104,0,3,8,102,-1,8,10,1001,10,1,10,4,10,108,1,8,10,4,10,102,1,8,28,1006,0,94,2,106,5,10,1,1109,12,10,3,8,1002,8,-1,10,1001,10,1,10,4,10,1008,8,1,10,4,10,101,0,8,62,1,103,6,10,1,108,12,10,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,0,10,4,10,102,1,8,92,2,104,18,10,2,1109,2,10,2,1007,5,10,1,7,4,10,3,8,102,-1,8,10,1001,10,1,10,4,10,108,0,8,10,4,10,102,1,8,129,2,1004,15,10,2,1103,15,10,2,1009,6,10,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,1,10,4,10,101,0,8,164,2,1109,14,10,1,1107,18,10,1,1109,13,10,1,1107,11,10,3,8,102,-1,8,10,101,1,10,10,4,10,108,0,8,10,4,10,1001,8,0,201,2,104,20,10,1,107,8,10,1,1007,5,10,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,1,10,4,10,101,0,8,236,3,8,1002,8,-1,10,1001,10,1,10,4,10,108,0,8,10,4,10,1001,8,0,257,3,8,102,-1,8,10,101,1,10,10,4,10,108,1,8,10,4,10,102,1,8,279,1,107,0,10,1,107,16,10,1006,0,24,1,101,3,10,3,8,102,-1,8,10,101,1,10,10,4,10,108,0,8,10,4,10,1002,8,1,316,2,1108,15,10,2,4,11,10,101,1,9,9,1007,9,934,10,1005,10,15,99,109,667,104,0,104,1,21101,0,936995730328,1,21102,362,1,0,1105,1,466,21102,1,838210728716,1,21101,373,0,0,1105,1,466,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,21102,1,235350789351,1,21101,0,420,0,1105,1,466,21102,29195603035,1,1,21102,1,431,0,1105,1,466,3,10,104,0,104,0,3,10,104,0,104,0,21101,0,825016079204,1,21101,0,454,0,1105,1,466,21101,837896786700,0,1,21102,1,465,0,1106,0,466,99,109,2,21201,-1,0,1,21101,0,40,2,21102,1,497,3,21101,0,487,0,1105,1,530,109,-2,2106,0,0,0,1,0,0,1,109,2,3,10,204,-1,1001,492,493,508,4,0,1001,492,1,492,108,4,492,10,1006,10,524,1101,0,0,492,109,-2,2105,1,0,0,109,4,2102,1,-1,529,1207,-3,0,10,1006,10,547,21102,1,0,-3,21201,-3,0,1,22102,1,-2,2,21101,1,0,3,21102,1,566,0,1105,1,571,109,-4,2106,0,0,109,5,1207,-3,1,10,1006,10,594,2207,-4,-2,10,1006,10,594,21201,-4,0,-4,1106,0,662,21201,-4,0,1,21201,-3,-1,2,21202,-2,2,3,21101,613,0,0,1105,1,571,22101,0,1,-4,21101,0,1,-1,2207,-4,-2,10,1006,10,632,21101,0,0,-1,22202,-2,-1,-2,2107,0,-3,10,1006,10,654,22101,0,-1,1,21102,654,1,0,105,1,529,21202,-2,-1,-2,22201,-4,-2,-4,109,-5,2105,1,0];

function printGrid(grid, robotLoc, robotDir) {
  const coords = Object.keys(grid).map(k => k.split(',').map(i => parseInt(i, 10)));
  const xs = coords.map(([x]) => x);
  const xRange = [Math.min(...xs), Math.max(...xs) + 1];
  const ys = coords.map(([,y]) => y);
  const yRange = [Math.min(...ys), Math.max(...ys) + 1];

  const rows = _.range(...yRange).map(y => {
    return _.range(...xRange).map(x => {
      if (x === robotLoc[0] && y === robotLoc[1]) {
        switch (robotDir) {
          case 'N': return '^';
          case 'E': return '>';
          case 'S': return 'v';
          case 'W': return '<';
        }
      } else {
        return grid[`${x},${y}`] || ' ';
      }
    }).join(' ');
  }).concat('').join('\n');
  console.log(rows);
}

function nextDirection(turnDir, robotDirection, [rx, ry]) {
  const goWest = ['W', [rx - 1, ry]];
  const goEast = ['E', [rx + 1, ry]];
  const goNorth = ['N', [rx, ry - 1]];
  const goSouth = ['S', [rx, ry + 1]];

  switch (robotDirection) {
    case 'N':
      return turnDir === 0 ? goWest : goEast;
    case 'S':
      return turnDir === 0 ? goEast : goWest;
    case 'E':
      return turnDir === 0 ? goNorth : goSouth;
    case 'W':
      return turnDir === 0 ? goSouth : goNorth;
  }
}

function runRobot(part1) {
  const grid = {};

  let inputs = part1 ? always(0) : always(1);

  let robotDirection = 'N';
  let robotLoc = [2, 2];
  const robot = run(instructions, inputs);

  while (true) {
    const outputs = [];
    let out = robot.next(inputs);
    if (out.done) break;
    outputs.push(out.value);

    out = robot.next(inputs);
    if (out.done) break;
    outputs.push(out.value);

    const [color, turnDir] = outputs;
    grid[robotLoc.join(',')] = color;

    const nd = nextDirection(turnDir, robotDirection, robotLoc);
    robotDirection = nd[0];
    robotLoc = nd[1];

    const curTileColor = grid[robotLoc.join(',')] || 0;
    inputs = always(curTileColor);
  }

  if (part1) {
    console.log(Object.keys(grid).length);
  } else {
    printGrid(grid, robotLoc, robotDirection);
  }
}

runRobot(true); // Part 1: 1709
runRobot(false); // Part 2: PGUEHCJH
