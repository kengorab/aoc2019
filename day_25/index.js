const _ = require('lodash');
const readline = require('readline');
const { combination } = require('js-combinatorics');
const { Intcode } = require('../intcode2');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const input = require('fs')
  .readFileSync('./input.txt', { encoding: 'utf-8' })
  .split('\n')
  .map(line => line.trim())
  .filter(x => !!x);

const instructions = input[0].split(',').map(_.parseInt);

const itemDirs = {
  'whirled peas': ['west'],
  'bowl of rice': ['south', 'west'],
  'mutex': ['south', 'east'],
  'astronaut ice cream': ['south', 'east', 'east'],
  'ornament': ['south', 'east', 'east', 'east'],
  // 'infinite loop': ['south', 'east', 'east', 'east', 'east'], // loops infinitely (obviously); lose
  // 'escape pod': ['south', 'east', 'south'], // blasts you away from the ship; lose
  'tambourine': ['south', 'east', 'east', 'south'],
  'mug': ['south', 'east', 'south', 'east'],
  // 'molten lava': ['south', 'east', 'south', 'south'], // melts you; lose
  // 'giant electromagnet': ['south', 'east', 'south', 'south', 'west'], // stick to you; lose
  'easter egg': ['south', 'east', 'south', 'south', 'west', 'south'],
  // 'photons': ['south'], // takes away the light; lose
};

const dirHull2Checkpoint = ['south', 'east', 'south', 'south', 'west', 'south', 'west', 'west'];

const toAscii = cmds => cmds.concat('').join('\n').split('').map(ch => ch.charCodeAt(0));

const goTo = item => toAscii(itemDirs[item].concat(`take ${item}`));
const goToAndBack = item => {
  const steps = goTo(item);
  const reversed = toAscii(
    [...itemDirs[item]].reverse().map(dir => ({ north: 'south', south: 'north', east: 'west', west: 'east' }[dir]))
  );
  return steps.concat(...reversed);
};

const asciiAttempt = (items) => [...items.map(item => `take ${item}`), 'west', ...items.map(item => `drop ${item}`)];

function allPossibleItems(items) {
  const combs = [];
  _.range(8).map(size => {
    const gen = combination(items, size + 1);
    let item = gen.next();
    while (item) {
      combs.push(item);
      item = gen.next();
    }
  });
  return combs;
}

const allItems = Object.keys(itemDirs);
let inputs = allItems
  .reduce((acc, item) => acc.concat(goToAndBack(item)), [])
  .concat(toAscii(dirHull2Checkpoint))
  .concat(toAscii(allItems.map(item => `drop ${item}`)))
  .concat(toAscii(allPossibleItems(allItems).reduce((acc, items) => acc.concat(asciiAttempt(items)))));

const prompt = () => new Promise(async res => {
  if (inputs.length === 0) {
    await new Promise(res => {
      rl.question('> ', (answer) => {
        const ascii = (answer + '\n').split('').map(ch => ch.charCodeAt(0));
        inputs.push(...ascii);
        res();
      });
    });
  }
  res(inputs.shift());
});

async function part1() {
  const droid = new Intcode([...instructions], prompt);

  let line = [];
  while (droid.running) {
    const out = await droid.run();
    if (out === 10) {
      console.log(line.map(ch => String.fromCharCode(ch)).join(''));
      line = [];
    } else {
      line.push(out);
    }
  }
}

part1() // 295944: [mutex, astronaut ice cream, tambourine, easter egg]
  .then(() => rl.close());

function part2() {
  // Merry Christmas! 🎄🎅
}
