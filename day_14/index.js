const input = require('fs')
  .readFileSync('./input.txt', { encoding: 'utf-8' })
  .split('\n')
  .map(line => line.trim())
  .filter(x => !!x);

class Vertex {
  constructor(name) {
    this.name = name;
    this.productionAmt = 0;
    this.required = 0;
    this.edges = {};
    this.revEdges = {};
  }
}

function buildGraph(input) {
  const vertices = {};
  const lines = input.map(line => line.split(' => '));
  for (let [ins, out] of lines) {
    const [outAmt, outName] = out.split(' ');
    const vertex = vertices[outName] || (vertices[outName] = new Vertex(outName));
    vertex.productionAmt = parseInt(outAmt, 10);

    for (let i of ins.split(', ')) {
      const [_amt, name] = i.split(' ');
      const amt = parseInt(_amt, 10);
      const component = vertices[name] || (vertices[name] = new Vertex(name));

      vertex.edges[name] = amt;
      component.revEdges[outName] = amt;
    }
  }

  return vertices
}

function revTopologicalSort(graph, start) {
  const order = [];
  const visited = new Set();

  function topSortDfs(vertex, name) {
    if (Object.keys(vertex.revEdges).length === 0) {
      order.push(name);
      return;
    }

    for (let neighborName in vertex.revEdges) {
      if (visited.has(neighborName)) {
        continue;
      }
      visited.add(neighborName);
      topSortDfs(graph[neighborName], neighborName);
    }
    order.push(name);
  }

  topSortDfs(graph[start], start);
  return order;
}

function part1(reqFuel = 1) {
  const graph = buildGraph(input);
  graph['FUEL'].required = reqFuel;
  graph['ORE'].productionAmt = 1;
  const order = revTopologicalSort(graph, 'ORE');

  for (let vertexName of order) {
    const vertex = graph[vertexName];
    const factor = Math.max(1, Math.ceil(vertex.required / vertex.productionAmt))

    for (let [componentName, cost] of Object.entries(vertex.edges)) {
      graph[componentName].required += factor * cost;
    }
  }
  return graph['ORE'].required
}

console.log(part1()); // 301997

function part2() {
  let best = 0;
  let oreLimit = 1000000000000;
  let right = 1000000000000;
  let left = 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const requiredOre = part1(mid);
    if (requiredOre < oreLimit) {
      best = Math.max(best, mid);
      left = mid + 1;
    } else if (requiredOre > oreLimit) {
      right = mid - 1;
    } else {
      return mid;
    }
  }
  return best;
}

console.log(part2());
