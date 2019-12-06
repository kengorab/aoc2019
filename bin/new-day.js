const fs = require('fs');
const days = fs.readdirSync(`${__dirname}/..`)
  .filter(fileName => fileName.startsWith('day_'))
  .map(fileName => fileName.split('_')[1])
  .map(num => parseInt(num, 10));

const nextDay = `day_${(Math.max(...days) + 1).toString().padStart(2, '0')}`;
const newDir = [__dirname, '..', nextDay].join('/');

fs.mkdirSync(newDir);
fs.writeFileSync(`${newDir}/input.txt`, '');

const indexJsFile = `
const input = require('fs')
  .readFileSync('./input.txt', { encoding: 'utf-8' })
  .split('\\n')
  .map(line => line.trim());

function part1() {

}

part1();

function part2() {

}

part2();
`;

fs.writeFileSync(`${newDir}/index.js`, indexJsFile.trim());
console.log(`Wrote ${nextDay}/input.txt, ${nextDay}/index.js`);
