const _ = require('lodash');
const input = require('fs')
  .readFileSync('./input.txt', { encoding: 'utf-8' })
  .split('\n')
  .map(line => line.trim())
  .filter(x => !!x);

function parseOps(input, len) {
  return input.map(line => {
    if (line.startsWith('deal with increment ')) {
      const n = parseInt(line.replace('deal with increment ', ''), 10);
      return dealWithIncrementN(len, n);
    } else if (line.startsWith('cut ')) {
      const n = parseInt(line.replace('cut ', ''), 10);
      return cutN(len, n);
    } else if (line === 'deal into new stack') {
      return dealIntoNewStack(len);
    }
  })
}

function dealIntoNewStack(len) {
  return pos => len - pos - 1;
}

function cutN(len, n) {
  return pos => {
    n = ((n + len) % len);
    if (pos < n) {
      return len + pos - n;
    } else {
      return pos - n;
    }
  }
}

function dealWithIncrementN(len, n) {
  return pos => (pos * n) % len;
}

function part1() {
  const operations = parseOps(input, 10007, { dealWithIncrementN, cutN, dealIntoNewStack });
  return operations.reduce((pos, op) => op(pos), 2019);
}

console.log(part1()); // 7614

function part2Orig() {
  const operations = parseOps(input, 119315717514047, { dealWithIncrementN, cutN, dealIntoNewStack });
  let idx = 2020;
  for (let i = 0; i < 101741582076661; i++) {
    idx = operations.reduce((deck, op) => op(deck), idx);
    if (idx === 2020) { // look for cycles?
      console.log(idx, i);
      return
    }
  }
  return idx;
}

// console.log(part2Orig()); // ¯\_(ツ)_/¯

// Part 2 seems to require some advanced math insights that I either don't know, or have long since forgotten.
// This is based on a (very well-written and brilliant) writeup on the subreddit by /u/mcpower_:
//   https://www.reddit.com/r/adventofcode/comments/ee0rqi/2019_day_22_solutions/fbnkaju/
// However, I don't think js is a good language to solve this problem in. It leads to a lot of numerical overflows
// and barring the usage of the big-integer dependency, I don't think it's possible to solve.
// I solved it in python (see index.py).
async function part2Cheating() {
  const len = 119315717514047;

  // In the writeup, /u/mcpower_ mentions that python has a handy implementation of Modular Exponentiation [1], but
  // sadly JS lacks that. So this is an implementation borrowed from stackoverflow [2].
  //
  // [1]: https://en.wikipedia.org/wiki/Modular_exponentiation#Right-to-left_binary_method
  // [2]: https://stackoverflow.com/a/5989549
  // function pow(base, exp, mod) {
  //   if (exp === 0) return 1;
  //   if (exp % 2 === 0) {
  //     return Math.pow(pow(base, (exp / 2), mod), 2) % mod;
  //   }
  //   return (base * pow(base, (exp - 1), mod)) % mod;
  // }

  // This was more of a joke than anything - calling into python to run its (vastly superior) `pow` function.
  // But even this didn't work, since when the number gets back to jsland it can overflow into the negatives.
  // const pow = async (base, exp, mod) => {
  //   return new Promise((res, rej) => {
  //     console.log(`pow(${base}, ${exp}, ${mod})`);
  //     PythonShell.runString(
  //       `print(pow(${base}, ${exp}, ${mod}))`,
  //       null,
  //       (err, [result]) => {
  //         const n = parseInt(result, 10);
  //         console.log(n);
  //         return err ? rej(err) : res(n)
  //       }
  //     );
  //   });
  // };

  let incrementMul = 1;
  let offsetDiff = 0;

  for (const line of input) {
    if (line.startsWith('deal with increment ')) {
      const n = parseInt(line.replace('deal with increment ', ''), 10);
      const f = await pow(n, len - 2, len);
      incrementMul *= f;
    } else if (line.startsWith('cut ')) {
      const n = parseInt(line.replace('cut ', ''), 10);
      offsetDiff += n * incrementMul;
    } else if (line === 'deal into new stack') {
      incrementMul *= -1;
      offsetDiff += incrementMul;
    }

    incrementMul %= len;
    offsetDiff %= len;
  }

  const increment = await pow(incrementMul, 101741582076661, len);
  let offset = offsetDiff * (1 - increment) * await pow((1 - incrementMul) % len, len - 2, len);
  offset %= len;

  return (offset + 2020 * increment) % len;
}

// part2Cheating().then(result => console.log(result));
