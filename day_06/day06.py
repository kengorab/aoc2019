from collections import defaultdict

with open('./input.txt') as file:
    lines = [line.strip().split(')') for line in file.readlines()]
    input_orbits = [(planet, satellite) for planet, satellite in lines]


class Planet:
    def __init__(self):
        self.satellites = []
        self.parent = None
        self.depth = 0


def build_graph(orbits):
    planets = defaultdict(Planet)
    for (planet, satellite) in orbits:
        p = planets[planet]
        planets[planet] = p
        s = planets[satellite]
        planets[satellite] = s

        p.satellites.append(s)
        s.parent = p

    def build_depth(n):
        for child in n.satellites:
            child.depth = n.depth + 1
            build_depth(child)

    root_node = planets['COM']
    build_depth(root_node)
    return planets


def part1():
    graph = build_graph(input_orbits)
    root = graph['COM']

    def count_orbits(n):
        return n.depth + sum(count_orbits(c) for c in n.satellites)

    return count_orbits(root)


print(part1())


def part2():
    graph = build_graph(input_orbits)
    you = graph['YOU']
    santa = graph['SAN']

    num_transfers = 0
    while you.parent and santa.parent:
        if you.parent == santa.parent:
            return num_transfers
        if you.parent.depth == santa.parent.depth:
            you = you.parent
            santa = santa.parent
            num_transfers += 2
        if you.parent.depth > santa.parent.depth:
            you = you.parent
            num_transfers += 1
        if santa.parent.depth > you.parent.depth:
            santa = santa.parent
            num_transfers += 1


print(part2())
