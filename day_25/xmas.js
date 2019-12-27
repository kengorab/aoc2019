// https://www.reddit.com/r/adventofcode/comments/ef0imt/intcode_merry_christmas_everyone/

const _ = require('lodash');
const { Intcode } = require('../intcode2');

const input = require('fs')
  .readFileSync('./xmas-input.txt', { encoding: 'utf-8' })
  .split('\n')
  .map(line => line.trim())
  .filter(x => !!x);

const instructions = input[0].split(',').map(_.parseInt);

(async () => {
  const comp = new Intcode(instructions, () => 0);
  const output = [];
  while (comp.running) {
    const out = await comp.run();
    output.push(String.fromCharCode(out));
  }
  console.log(output.join(''));
})();
