function parseInstr(instr) {
  const code = `${instr}`.padStart(5, '0').split('');
  const mode = code.slice(0, code.length - 2).reverse();
  const op = code.slice(code.length - 2);
  return [mode, parseInt(op.join(''), 10)];
}

module.exports.runUntilEnd = function runUntilEnd(instrs, inputs) {
  const computer = module.exports.run(instrs, inputs);
  return [...computer];
};

module.exports.run = function* run(instrs, inputs) {
  let inputIdx = 0;
  let ip = 0;
  let running = true;
  let relBase = 0;

  while (running) {
    const [mode, code] = parseInstr(instrs[ip]);

    function getParam(i) {
      const m = mode[i];
      if (m === '0') return instrs[instrs[ip + i + 1]];
      else if (m === '1') return instrs[ip + i + 1];
      else return instrs[relBase + instrs[ip + i + 1]];
    }

    function store(i, val) {
      const m = mode[i];
      if (m === '0') instrs[instrs[ip + i + 1]] = val;
      else if (m === '1') instrs[ip + i + 1] = val;
      else instrs[relBase + instrs[ip + i + 1]] = val;
    }

    const p1 = getParam(0);
    const p2 = getParam(1);

    switch (code) {
      case 1:
        store(2, p1 + p2);
        ip += 4;
        break;
      case 2:
        store(2, p1 * p2);
        ip += 4;
        break;
      case 3: {
        const val = inputs[inputIdx++];
        if (val === null || val === undefined) {
          console.error('Missing input!');
          running = false;
        }
        store(0, val);
        ip += 2;
        break;
      }
      case 4:
        if (p1 === undefined) {
          console.log('out of bounds');
          return;
        }
        const newInput = yield p1;
        inputs = inputs || newInput;
        ip += 2;
        break;
      case 5:
        if (p1 !== 0) ip = p2;
        else ip += 3;
        break;
      case 6:
        if (p1 === 0) ip = p2;
        else ip += 3;
        break;
      case 7:
        store(2, p1 < p2 ? 1 : 0);
        ip += 4;
        break;
      case 8:
        store(2, p1 === p2 ? 1 : 0);
        ip += 4;
        break;
      case 9:
        relBase += p1;
        ip += 2;
        break;
      case 99:
        running = false;
        break;
      default:
        console.error(`Unknown opcode: ${code}`);
        running = false;
    }
  }
};
