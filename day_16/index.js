const _ = require('lodash');

function getMultipliers(phaseNum, inputLength) {
  const arr = [0, 1, 0, -1];

  let multipliers = [];
  for (let n of arr) {
    for (let i = 0; i < phaseNum; i++) {
      multipliers.push(n);
    }
  }
  while (multipliers.length - 1 < inputLength) {
    multipliers = multipliers.concat(multipliers);
  }
  multipliers.shift();
  return multipliers;
}

const onesDigit = number => _.parseInt(_.last(`${number}`.split('')));

function fft(digits, offset = 0) {
  if (offset > digits.length * 0.5) {
    const transformed = Array(digits.length).fill(0);
    let sum = _.sum(digits.slice(offset));
    for (let i = offset; i < digits.length; i++) {
      transformed[i] = sum % 10;
      sum -= digits[i];
    }
    return transformed;
  }

  const transformed = [];
  for (let idx = 0; idx < digits.length; idx++) {
    const factors = getMultipliers(idx + 1, digits.length);

    const res = _.sum(digits.map((d, idx) => d * factors[idx]));
    transformed.push(onesDigit(res));
  }
  return transformed;
}

const input = '59728839950345262750652573835965979939888018102191625099946787791682326347549309844135638586166731548034760365897189592233753445638181247676324660686068855684292956604998590827637221627543512414238407861211421936232231340691500214827820904991045564597324533808990098343557895760522104140762068572528148690396033860391137697751034053950225418906057288850192115676834742394553585487838826710005579833289943702498162546384263561449255093278108677331969126402467573596116021040898708023407842928838817237736084235431065576909382323833184591099600309974914741618495832080930442596854495321267401706790270027803358798899922938307821234896434934824289476011';

function part1() {
  let n = input.split('').map(_.parseInt);
  _.times(100, () => n = fft(n));
  n = n.join('');
  return n.substr(0, 8);
}

console.log(part1()); // 30369587

function part2() {
  const offset = _.parseInt(input.substr(0, 7));

  let in_ = input.split('').map(_.parseInt);
  let n = Array(in_.length * 10000).fill(0);
  for (let i = 0; i < 10000; i++) {
    for (let j = 0; j < in_.length; j++) {
      const idx = i*in_.length + j;
      n[idx] = in_[j];
    }
  }
  _.times(100, () => n = fft(n, offset));
  return n.slice(offset, offset + 8).join('');
}

console.log(part2()); // 27683551
