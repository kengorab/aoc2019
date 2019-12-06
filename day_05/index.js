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
        if (!val) {
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

const instructions = [3,225,1,225,6,6,1100,1,238,225,104,0,1102,9,19,225,1,136,139,224,101,-17,224,224,4,224,102,8,223,223,101,6,224,224,1,223,224,223,2,218,213,224,1001,224,-4560,224,4,224,102,8,223,223,1001,224,4,224,1,223,224,223,1102,25,63,224,101,-1575,224,224,4,224,102,8,223,223,1001,224,4,224,1,223,224,223,1102,55,31,225,1101,38,15,225,1001,13,88,224,1001,224,-97,224,4,224,102,8,223,223,101,5,224,224,1,224,223,223,1002,87,88,224,101,-3344,224,224,4,224,102,8,223,223,1001,224,7,224,1,224,223,223,1102,39,10,225,1102,7,70,225,1101,19,47,224,101,-66,224,224,4,224,1002,223,8,223,1001,224,6,224,1,224,223,223,1102,49,72,225,102,77,166,224,101,-5544,224,224,4,224,102,8,223,223,1001,224,4,224,1,223,224,223,101,32,83,224,101,-87,224,224,4,224,102,8,223,223,1001,224,3,224,1,224,223,223,1101,80,5,225,1101,47,57,225,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,1008,677,226,224,1002,223,2,223,1005,224,329,1001,223,1,223,107,226,677,224,1002,223,2,223,1006,224,344,101,1,223,223,1007,677,677,224,1002,223,2,223,1006,224,359,1001,223,1,223,8,677,226,224,102,2,223,223,1005,224,374,101,1,223,223,108,226,677,224,102,2,223,223,1006,224,389,1001,223,1,223,1008,677,677,224,1002,223,2,223,1006,224,404,1001,223,1,223,1107,677,677,224,102,2,223,223,1005,224,419,1001,223,1,223,1008,226,226,224,102,2,223,223,1005,224,434,101,1,223,223,8,226,677,224,1002,223,2,223,1006,224,449,101,1,223,223,1007,677,226,224,102,2,223,223,1005,224,464,1001,223,1,223,107,677,677,224,1002,223,2,223,1005,224,479,1001,223,1,223,1107,226,677,224,1002,223,2,223,1005,224,494,1001,223,1,223,7,677,677,224,102,2,223,223,1006,224,509,101,1,223,223,1007,226,226,224,1002,223,2,223,1005,224,524,101,1,223,223,7,677,226,224,102,2,223,223,1005,224,539,101,1,223,223,8,226,226,224,1002,223,2,223,1006,224,554,101,1,223,223,7,226,677,224,102,2,223,223,1005,224,569,101,1,223,223,1108,677,226,224,1002,223,2,223,1005,224,584,101,1,223,223,108,677,677,224,1002,223,2,223,1006,224,599,101,1,223,223,107,226,226,224,1002,223,2,223,1006,224,614,101,1,223,223,1108,226,226,224,1002,223,2,223,1005,224,629,1001,223,1,223,1107,677,226,224,1002,223,2,223,1005,224,644,101,1,223,223,108,226,226,224,1002,223,2,223,1005,224,659,101,1,223,223,1108,226,677,224,1002,223,2,223,1005,224,674,1001,223,1,223,4,223,99,226];

function part1() {
  const inputs = [1];
  console.log(run([...instructions], inputs));
}

part1(); // 13787043

function part2() {
  const inputs = [5];
  console.log(run([...instructions], inputs));
}

part2(); // 3892695
