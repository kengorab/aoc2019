const _ = require('lodash');

function parseInstr(instr) {
  const code = `${instr}`.padStart(5, '0').split('');
  const mode = code.slice(0, code.length - 2).reverse();
  const op = code.slice(code.length - 2);
  return [mode, parseInt(op.join(''), 10)];
}

function run(instrs, inputs) {
  const outputs = [];
  let inputIdx = 0;
  let ip = 0;
  let running = true;

  while (running) {
    const [mode, code] = parseInstr(instrs[ip]);

    switch (code) {
      case 1: {
        const l = mode[0] === '0' ? instrs[instrs[ip + 1]] : instrs[ip + 1];
        const r = mode[1] === '0' ? instrs[instrs[ip + 2]] : instrs[ip + 2];
        instrs[instrs[ip + 3]] = l + r;
        ip += 4;
        break;
      }
      case 2: {
        const l = mode[0] === '0' ? instrs[instrs[ip + 1]] : instrs[ip + 1];
        const r = mode[1] === '0' ? instrs[instrs[ip + 2]] : instrs[ip + 2];
        instrs[instrs[ip + 3]] = l * r;
        ip += 4;
        break;
      }
      case 3: {
        const val = inputs[inputIdx++];
        if (val === null || val === undefined) {
          console.error('Missing input!');
          running = false;
        }
        instrs[instrs[ip + 1]] = val;
        ip += 2;
        break;
      }
      case 4: {
        outputs.push(instrs[instrs[ip + 1]]);
        ip += 2;
        break;
      }
      case 5: {
        const l = mode[0] === '0' ? instrs[instrs[ip + 1]] : instrs[ip + 1];
        const r = mode[1] === '0' ? instrs[instrs[ip + 2]] : instrs[ip + 2];
        if (l !== 0) {
          ip = r;
        } else {
          ip += 3;
        }
        break;
      }
      case 6: {
        const l = mode[0] === '0' ? instrs[instrs[ip + 1]] : instrs[ip + 1];
        const r = mode[1] === '0' ? instrs[instrs[ip + 2]] : instrs[ip + 2];
        if (l === 0) {
          ip = r;
        } else {
          ip += 3;
        }
        break;
      }
      case 7: {
        const l = mode[0] === '0' ? instrs[instrs[ip + 1]] : instrs[ip + 1];
        const r = mode[1] === '0' ? instrs[instrs[ip + 2]] : instrs[ip + 2];
        if (l < r) {
          instrs[instrs[ip + 3]] = 1;
        } else {
          instrs[instrs[ip + 3]] = 0;
        }
        ip += 4;
        break;
      }
      case 8: {
        const l = mode[0] === '0' ? instrs[instrs[ip + 1]] : instrs[ip + 1];
        const r = mode[1] === '0' ? instrs[instrs[ip + 2]] : instrs[ip + 2];
        if (l === r) {
          instrs[instrs[ip + 3]] = 1;
        } else {
          instrs[instrs[ip + 3]] = 0;
        }
        ip += 4;
        break;
      }
      case 99:
        running = false;
        break;
      default:
        console.error(`Unknown opcode: ${code}`);
        running = false;
    }
  }

  return outputs;
}

function* runG(instrs, inputs) {
  let inputIdx = 0;
  let ip = 0;
  let running = true;

  while (running) {
    const [mode, code] = parseInstr(instrs[ip]);

    switch (code) {
      case 1: {
        const l = mode[0] === '0' ? instrs[instrs[ip + 1]] : instrs[ip + 1];
        const r = mode[1] === '0' ? instrs[instrs[ip + 2]] : instrs[ip + 2];
        instrs[instrs[ip + 3]] = l + r;
        ip += 4;
        break;
      }
      case 2: {
        const l = mode[0] === '0' ? instrs[instrs[ip + 1]] : instrs[ip + 1];
        const r = mode[1] === '0' ? instrs[instrs[ip + 2]] : instrs[ip + 2];
        instrs[instrs[ip + 3]] = l * r;
        ip += 4;
        break;
      }
      case 3: {
        const val = inputs[inputIdx++];
        if (val === null || val === undefined) {
          console.error('Missing input!');
          running = false;
        }
        instrs[instrs[ip + 1]] = val;
        ip += 2;
        break;
      }
      case 4: {
        const o = mode[0] === '0' ? instrs[instrs[ip + 1]] : instrs[ip + 1];
        inputs = yield o;
        inputIdx = 0;
        ip += 2;
        break;
      }
      case 5: {
        const l = mode[0] === '0' ? instrs[instrs[ip + 1]] : instrs[ip + 1];
        const r = mode[1] === '0' ? instrs[instrs[ip + 2]] : instrs[ip + 2];
        if (l !== 0) {
          ip = r;
        } else {
          ip += 3;
        }
        break;
      }
      case 6: {
        const l = mode[0] === '0' ? instrs[instrs[ip + 1]] : instrs[ip + 1];
        const r = mode[1] === '0' ? instrs[instrs[ip + 2]] : instrs[ip + 2];
        if (l === 0) {
          ip = r;
        } else {
          ip += 3;
        }
        break;
      }
      case 7: {
        const l = mode[0] === '0' ? instrs[instrs[ip + 1]] : instrs[ip + 1];
        const r = mode[1] === '0' ? instrs[instrs[ip + 2]] : instrs[ip + 2];
        if (l < r) {
          instrs[instrs[ip + 3]] = 1;
        } else {
          instrs[instrs[ip + 3]] = 0;
        }
        ip += 4;
        break;
      }
      case 8: {
        const l = mode[0] === '0' ? instrs[instrs[ip + 1]] : instrs[ip + 1];
        const r = mode[1] === '0' ? instrs[instrs[ip + 2]] : instrs[ip + 2];
        if (l === r) {
          instrs[instrs[ip + 3]] = 1;
        } else {
          instrs[instrs[ip + 3]] = 0;
        }
        ip += 4;
        break;
      }
      case 99:
        return;
      default:
        console.error(`Unknown opcode: ${code}`);
        running = false;
    }
  }
}

function permutations(opts) {
  if (opts.length === 1) return opts;

  return _.flatten(
    opts.map((opt, i) => {
      const remaining = opts.filter((_, idx) => idx !== i);
      return permutations(remaining).map(arr => [opt].concat(arr));
    })
  );
}

const instructions = [3,8,1001,8,10,8,105,1,0,0,21,38,59,84,97,110,191,272,353,434,99999,3,9,1002,9,2,9,101,4,9,9,1002,9,2,9,4,9,99,3,9,102,5,9,9,1001,9,3,9,1002,9,5,9,101,5,9,9,4,9,99,3,9,102,5,9,9,101,5,9,9,1002,9,3,9,101,2,9,9,1002,9,4,9,4,9,99,3,9,101,3,9,9,1002,9,3,9,4,9,99,3,9,102,5,9,9,1001,9,3,9,4,9,99,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,99];

function part1() {
  const possibilities = permutations([0, 1, 2, 3, 4], 5)
    .filter(p => {
      return p.length === _.uniq(p).length
    });
  return Math.max(...possibilities.map(p => {
    return p.reduce((acc, phase) => {
      return _.last(run([...instructions], [phase, acc]));
    }, 0);
  }));
}

console.log(part1()); // 338603

function part2() {
  const possibilities = permutations([5, 6, 7, 8, 9], 5)
    .filter(p => {
      return p.length === _.uniq(p).length
    });

  return Math.max(...possibilities.map(p => {
    const amps = [];

    let prevVal = 0;
    while (true) {
      for (let i = 0; i < 5; i++) {
        let args;
        if (!amps[i]) {
          amps.push(runG([...instructions, i], [p[i], prevVal]));
          args = [p[i], prevVal];
        } else {
          args = [prevVal];
        }
        const amp = amps[i];

        const { done, value } = amp.next(args);
        if (done) {
          return prevVal;
        }
        prevVal = value;
      }
    }
  }));
}

console.log(part2());
