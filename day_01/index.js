const fs = require('fs')

const input = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const lines = input.split('\n')

function part1(lines) {
  function requiredFuel(mass) {
    return Math.floor(mass / 3) - 2
  }

  return lines.map(line => parseInt(line, 10))
    .map(requiredFuel)
    .reduce((acc, fuel) => acc + fuel, 0)
}

console.log(part1(lines))

function part2(lines) {
  function requiredFuel(mass) {
    if (mass < 0) return 0
    const fuelMass = Math.floor(mass / 3) - 2
    if (fuelMass < 0) return 0
    return fuelMass + requiredFuel(fuelMass)
  }

  return lines.map(line => parseInt(line, 10))
    .map(requiredFuel)
    .reduce((acc, fuel) => acc + fuel, 0)
}

console.log(part2(lines))
