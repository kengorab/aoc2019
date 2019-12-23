const _ = require('lodash');
const { Intcode } = require('../intcode2');

const input = require('fs')
  .readFileSync('./input.txt', { encoding: 'utf-8' })
  .split('\n')
  .map(line => line.trim())[0];

const instructions = input.split(',').map(_.parseInt);

function setup() {
  const queues = Array(50).fill([]).map((_arr, idx) => [idx]);

  function getInput(qIdx) {
    return () => {
      const q = queues[qIdx];
      if (q.length === 0) return -1;
      else return q.shift();
    };
  }

  const computers = _.range(0, 50).map(i => new Intcode([...instructions], getInput(i)));

  return { queues, computers };
}

function part1() {
  const { queues, computers } = setup();

  while (true) {
    for (const comp of computers) {
      const destAddr = comp.run(10); // If we're blocked on startup, just continue
      if (destAddr === undefined) continue;

      const xVal = comp.run();
      const yVal = comp.run();

      if (destAddr === 255) return yVal;

      queues[destAddr].push(xVal);
      queues[destAddr].push(yVal);
    }
  }
}

console.log(part1()); // 24555

// There are 2 things that I'm not super happy about with this part2:
//
// 1) The seemingly arbitrary `numBlockedLoops` heuristic; why is >7 the cutoff? If I run it
// with >6 I get an (incorrect) first-repeated-y-value of 20333.
// 2) I'm not sure why the previously-valid instruction timeout of 10 doesn't work here; in
// fact when I try with various other numbers I also get varying first-repeated-y-values. 94
// seems to be the lowest that produces the correct value.
//
// I must have missed something, because normally these problems aren't so focused on guess-and-check.
function part2() {
  const { queues, computers } = setup();

  let NATVal = null;
  let lastNATY = null;

  let numBlockedLoops = 0;
  while (true) {
    if (numBlockedLoops > 7) {
      const [natX, natY] = NATVal;
      if (lastNATY === natY) {
        return natY;
      } else {
        lastNATY = natY;
      }
      queues[0].push(natX, natY);
    }

    for (const comp of computers) {
      const destAddr = comp.run(94);
      if (destAddr === undefined) continue;
      numBlockedLoops = 0;

      const xVal = comp.run();
      const yVal = comp.run();

      if (destAddr === 255) {
        NATVal = [xVal, yVal];
      } else {
        queues[destAddr].push(xVal, yVal);
      }
    }
    numBlockedLoops++;
  }
}

console.log(part2()); // 19463
