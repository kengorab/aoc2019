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
    } else {
      console.error('Unknown instruction: ', line);
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

function part2() {
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

// console.log(part2()); // ¯\_(ツ)_/¯
