function run(input, args) {
  input[1] = args[0];
  input[2] = args[1];

  let idx = 0;
  let running = true;
  while (running) {
    const code = input[idx];

    switch (code) {
      case 1:
        input[input[idx + 3]] = input[input[idx + 1]] + input[input[idx + 2]];
        break;
      case 2:
        input[input[idx + 3]] = input[input[idx + 1]] * input[input[idx + 2]];
        break;
      case 99:
        running = false;
        break;
      default:
        console.error(`Unknown opcode: ${code}`);
        running = false;
    }

    idx += 4;
  }

  return input;
}

const input = [1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,13,1,19,1,10,19,23,1,6,23,27,1,5,27,31,1,10,31,35,2,10,35,39,1,39,5,43,2,43,6,47,2,9,47,51,1,51,5,55,1,5,55,59,2,10,59,63,1,5,63,67,1,67,10,71,2,6,71,75,2,6,75,79,1,5,79,83,2,6,83,87,2,13,87,91,1,91,6,95,2,13,95,99,1,99,5,103,2,103,10,107,1,9,107,111,1,111,6,115,1,115,2,119,1,119,10,0,99,2,14,0,0];

function part1() {
  const [output] = run(input, [12, 2]);
  console.log(output);
}

// part1(); // 5482655

function part2() {
  for (let i = 0; i <= 99; i++) {
    for (let j = 0; j <= 99; j++) {
      const [output] = run([...input], [i, j]);
      if (output === 19690720) {
        return [i, j]
      }
    }
  }
}

console.log(part2());
