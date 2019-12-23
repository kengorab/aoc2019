module.exports.Intcode = class Intcode {
  constructor(instrs, inFn) {
    this.instrs = instrs;
    this.inFn = inFn;

    this.ip = 0;
    this.running = true;
    this.relBase = 0;
  }

  parseInstr(instr) {
    const code = `${instr}`.padStart(5, '0').split('');
    const mode = code.slice(0, code.length - 2).reverse();
    const op = code.slice(code.length - 2);
    return [mode, parseInt(op.join(''), 10)];
  };

  getParam(mode, i) {
    const m = mode[i];
    const { instrs, ip, relBase } = this;
    if (m === '0') return instrs[instrs[ip + i + 1]];
    else if (m === '1') return instrs[ip + i + 1];
    else return instrs[relBase + instrs[ip + i + 1]];
  }

  store(mode, i, val) {
    const m = mode[i];
    const { instrs, ip, relBase } = this;
    if (m === '0') instrs[instrs[ip + i + 1]] = val;
    else if (m === '1') instrs[ip + i + 1] = val;
    else instrs[relBase + instrs[ip + i + 1]] = val;
  }

  run(timeout = 0) {
    let t = 0;
    while (this.running) {
      if (timeout && t >= timeout) break;

      const [mode, code] = this.parseInstr(this.instrs[this.ip]);

      const p1 = this.getParam(mode, 0);
      const p2 = this.getParam(mode, 1);

      switch (code) {
        case 1:
          this.store(mode, 2, p1 + p2);
          this.ip += 4;
          break;
        case 2:
          this.store(mode, 2, p1 * p2);
          this.ip += 4;
          break;
        case 3: {
          const input = this.inFn();
          if (input === null || input === undefined) {
            console.error('Missing input!');
            this.running = false;
          } else {
            this.store(mode, 0, input);
            this.ip += 2;
          }
          break;
        }
        case 4:
          if (p1 === undefined) {
            console.log('out of bounds');
            return;
          }
          this.ip += 2;
          return p1;
        case 5:
          if (p1 !== 0) this.ip = p2;
          else this.ip += 3;
          break;
        case 6:
          if (p1 === 0) this.ip = p2;
          else this.ip += 3;
          break;
        case 7:
          this.store(mode, 2, p1 < p2 ? 1 : 0);
          this.ip += 4;
          break;
        case 8:
          this.store(mode, 2, p1 === p2 ? 1 : 0);
          this.ip += 4;
          break;
        case 9:
          this.relBase += p1;
          this.ip += 2;
          break;
        case 99:
          this.running = false;
          break;
        default:
          console.error(`Unknown opcode: ${code}`);
          this.running = false;
      }

      t++;
    }
  }
};
