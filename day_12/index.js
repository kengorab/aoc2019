const _ = require('lodash');

const MOONS = [
  { pos: [-13, 14, -7], vel: [0,0,0] },
  { pos: [-18, 9, 0], vel: [0,0,0] },
  { pos: [0, -3, -3], vel: [0,0,0] },
  { pos: [-15, 3, -13], vel: [0,0,0] }
];

function adjustVelocities(moons) {
  for (let i = 0; i < moons.length; i++) {
    for (let j = i + 1; j < moons.length; j++) {
      if (i === j) continue;

      for (let c = 0; c < 3; c++) {
        if (moons[i].pos[c] > moons[j].pos[c]) {
          moons[i].vel[c]--;
          moons[j].vel[c]++;
        } else if (moons[i].pos[c] < moons[j].pos[c]) {
          moons[i].vel[c]++;
          moons[j].vel[c]--;
        }
      }
    }
  }
  return moons;
}

function applyVelocities(moons) {
  for (let i = 0; i < moons.length; i++) {
    moons[i].pos[0] += moons[i].vel[0];
    moons[i].pos[1] += moons[i].vel[1];
    moons[i].pos[2] += moons[i].vel[2];
  }
}

function step(moons) {
  adjustVelocities(moons);
  applyVelocities(moons);
}

function energy(moon) {
  const pot = Math.abs(moon.pos[0]) + Math.abs(moon.pos[1]) + Math.abs(moon.pos[2]);
  const kin = Math.abs(moon.vel[0]) + Math.abs(moon.vel[1]) + Math.abs(moon.vel[2]);
  return pot * kin;
}

function part1() {
  const moons = [...MOONS];
  _.times(1000, () => step(moons));
  return moons.reduce((acc, m) => acc + energy(m), 0);
}

console.log(part1()); // 7138

function part2() {
  const moons = [...MOONS];

  const gcd = (a, b) => (!b ? a : gcd(b, a % b));
  const lcm = (a, b) => (a * b) / gcd(a, b);
  const config = (ax, moons) => moons.map(({ pos, vel }) => `${pos[ax]},${vel[ax]}`).join(',');

  const inits = [0, 1, 2].map(ax => config(ax, moons));

  let ts = 0;
  let xt, yt, zt;
  while (!(xt && yt && zt)) {
    ts++;

    step(moons);

    const xs = config(0, moons);
    if (!xt && xs === inits[0]) {
      xt = ts;
    }

    const ys = config(1, moons);
    if (!yt && ys === inits[1]) {
      yt = ts;
    }

    const zs = config(2, moons);
    if (!zt && zs === inits[2]) {
      zt = ts;
    }
  }

  return lcm(lcm(xt, yt), zt);
}

console.log(part2()); // 572087463375796
