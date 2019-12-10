const _ = require('lodash');

const input = require('fs')
  .readFileSync('./input.txt', { encoding: 'utf-8' })
  .split('\n')
  .map(line => line.trim())
  .filter(line => !!line);

function findAsteroids(input) {
  const width = input[0].length;
  const height = input.length;

  const coords = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (input[y][x] === '#') coords.push([x, y])
    }
  }

  return coords;
}

function findSlopes(asteroids) {
  for (let i = 0; i < asteroids.length; i++) {
    const lineSlopes = [];

    for (let j = 0; j < asteroids.length; j++) {
      if (i === j) continue;

      const [x1, y1] = asteroids[i];
      const [x2, y2] = asteroids[j];
      const slope = (y2 - y1) / (x2 - x1 * 1.0);
      const relPos = [x2 - x1 < 0 ? -1 : 1, y2 - y1 < 0 ? -1 : 1];
      lineSlopes.push([slope, relPos, [x2, y2]]);
    }

    asteroids[i][2] = lineSlopes;
  }
}

function part1() {
  const asteroids = findAsteroids(input);
  findSlopes(asteroids);

  return _.sortBy(
    asteroids,
    (([, , slopes]) => {
      const numSlopes = _.uniqBy(slopes, ([s, [rx, ry]]) => `${s}${rx}${ry}`).length;
      return -numSlopes;
    })
  )[0];
}

console.log(part1()); // 309

function part2() {
  const station = part1();
  const [x, y, asteroids] = station;

  const dist = ([px, py]) => Math.abs(Math.sqrt((px - x) ** 2 + (py - y) ** 2));

  const getQuadrant = ([px, py]) => {
    if (px >= x && py < y) return 1;
    if (px > x && py >= y) return 2;
    if (px <= x && py > y) return 3;
    if (px < x && py <= y) return 4;
  };

  const shiftedAsteroids = asteroids.map(([,, point]) => {
    const tx = point[0] - x;
    const ty = -point[1] + y;
    return { point: [tx, ty], orig: point, slope: ty / tx };
  });

  const groupedByQuadrant = _.groupBy(shiftedAsteroids, ({ orig }) => getQuadrant(orig));

  const sortedByQuadrantBySlope = _.mapValues(groupedByQuadrant, points => {
    const groupedBySlopeSortedByDist = _.mapValues(
      _.groupBy(points, ({ slope }) => slope),
      points => _.sortBy(points, ({ orig }) => dist(orig))
    );
    return _.sortBy(
      Object.entries(groupedBySlopeSortedByDist),
      ([slope]) => parseFloat(slope)
    );
  });

  const ordered = [];
  while (ordered.length !== asteroids.length) {
    for (let i = 1; i < 5; i++) {
      const quadrantPoints = sortedByQuadrantBySlope[i];
      for (let j = quadrantPoints.length - 1; j >= 0; j--) {
        const [, points] = quadrantPoints[j];
        const point = points.shift();
        if (point && point.orig) ordered.push(point.orig);
      }
    }
  }

  return ordered[199];
}

console.log(part2()); // 416
