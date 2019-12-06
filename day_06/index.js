const input = require('fs')
  .readFileSync('./input.txt', { encoding: 'utf-8' })
  .split('\n')
  .map(line => line.trim());

function buildGraph(input) {
  const orbits = input.map(line => line.split(')'));

  const nodesByName = {};
  for (let [src, satellite] of orbits) {
    const node = nodesByName[src] || { value: src, children: [], parent: null };

    const child = nodesByName[satellite] || { value: satellite, children: [] };
    child.parent = node;
    nodesByName[satellite] = child;

    node.children.push(child);
    nodesByName[src] = node;
  }

  return nodesByName;
}

function sumGraph(node) {
  node.numOrbits = node.numOrbits || 0;

  for (let child of node.children) {
    child.numOrbits = node.numOrbits + 1;
    sumGraph(child)
  }
}

function sum(node) {
  return node.numOrbits + node.children.reduce((acc, child) => acc + sum(child), 0)
}

function part1() {
  const { COM: root } = buildGraph(input);
  sumGraph(root, true);
  console.log(sum(root));
}

part1(); // 119831

function part2() {
  const nodes = buildGraph(input);
  sumGraph(nodes['COM']);

  function findCommonParentDist(santa, you) {
    let pathLength = 0;
    while (santa.parent && you.parent) {
      if (santa.parent.value === you.parent.value) {
        return pathLength;
      }
      if (santa.parent.numOrbits === you.parent.numOrbits) {
        santa = santa.parent;
        you = you.parent;
        pathLength += 2;
        continue
      }
      while (you.parent.numOrbits < santa.parent.numOrbits) {
        santa = santa.parent;
        pathLength += 1;
      }
      while (santa.parent.numOrbits < you.parent.numOrbits) {
        you = you.parent;
        pathLength += 1;
      }
    }
  }

  const santa = nodes['SAN'];
  const you = nodes['YOU'];
  console.log(findCommonParentDist(santa, you));
}

part2(); // 322
