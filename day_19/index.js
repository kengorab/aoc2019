const _ = require('lodash');
const { Intcode } = require('../intcode2');

const input = require('fs')
  .readFileSync('./input.txt', { encoding: 'utf-8' })
  .split('\n')
  .map(line => line.trim())
  .filter(x => !!x);

const instructions = input[0].split(',').map(_.parseInt);

async function probeCoord([x, y]) {
  const coord = [x, y];

  function getInput() {
    if (coord.length === 0) throw `Error robot @ (${x}, ${y}): No more input!`;
    return coord.shift();
  }

  const droid = new Intcode([...instructions], getInput);

  const outs = [];
  while (droid.running) {
    const out = await droid.run();
    if (out !== undefined) {
      outs.push(out);
    }
  }
  return { coord: [x, y], hit: outs[0] === 1 };
}

async function part1() {
  const coords = _.flatten(
    _.range(50).map(x =>
      _.range(50).map(y => [x, y]))
  );

  const results = await Promise.all(coords.map(probeCoord));
  return results.filter(({ hit }) => hit).length;
}

part1() // 141
  .then(res => console.log(res));

async function part2() {
  let sRow = 100;
  let sCol = 0;

  while (true) {
    const { hit } = await probeCoord([sCol, sRow]);
    if (!hit) {
      sCol++;
      continue;
    }

    const { hit: isWideEnough } = await probeCoord([sCol + 99, sRow]);
    if (isWideEnough) {
      const { hit: isTallEnough } = await probeCoord([sCol + 99, sRow - 99]);
      if (isTallEnough) {
        return sCol * 10000 + sRow - 99;
      }
    }

    sRow++;
  }
}

part2() // 15641348
  .then(res => console.log(res));
