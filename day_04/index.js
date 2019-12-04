const _ = require('lodash');

const start = 193651;
const end = 649729;

const getDigits = pw => `${pw}`.split('').map(i => parseInt(i, 10));

function isValidPart1(pw) {
  const digits = getDigits(pw);

  if (!_.isEqual([...digits].sort(), digits)) {
    return false;
  }

  let hasDouble = false;
  for (let i = 0; i < digits.length; i++) {
    if (digits[i] === digits[i + 1]) {
      hasDouble = true;
    }
  }

  return hasDouble;
}

console.log('part 1:', _.range(start, end).filter(isValidPart1).length); // 1605

function isValidPart2(pw) {
  const digits = getDigits(pw);

  if (!_.isEqual([...digits].sort(), digits)) {
    return false;
  }

  return _.uniq(Object.values(_.countBy(digits))).includes(2);
}

console.log('part 2:', _.range(start, end).filter(isValidPart2).length); // 1102
