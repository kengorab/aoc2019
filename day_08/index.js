const _ = require('lodash');

const input = require('fs')
  .readFileSync('./input.txt', { encoding: 'utf-8' })
  .split('\n')
  .map(line => line.trim())[0];
const width = 25;
const height = 6;

function readImg(width, height, data) {
  return _.chunk(data, width * height)
    .map(layer => _.chunk(layer, width));
}

function part1() {
  const imgLayers = readImg(width, height, input.split(''));
  const sorted = _.sortBy(imgLayers, layer => {
    const count = _.countBy(layer.reduce((acc, l) => acc.concat(l), []));
    return count['0'];
  });

  const first = _.countBy(sorted[0].reduce((acc, l) => acc.concat(l), []));
  return first['1'] * first['2'];
}

console.log(part1()); // 828

function part2() {
  const layers = readImg(width, height, input.split(''));
  const finalImage = [];

  for (let j = 0; j < height; j++) {
    finalImage.push([]);

    for (let i = 0; i < width; i++) {
      const pixel = layers.map(l => l[j][i]).find(p => p !== '2');
      finalImage[j].push(pixel);
    }
  }

  return finalImage.map(line => {
    return line.map(ch => {
      if (ch === '1') {
        return '▒';
      } else {
        return ' ';
      }
    }).join('');
  }).join('\n');
}

console.log(part2()); // ZLBJF
