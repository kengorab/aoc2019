def manhattan(p1, p2):
    x1, y1 = p1
    x2, y2 = p2
    return abs(x2 - x1) + abs(y2 - y1)


origin = (1, 1)


def get_line_points(line):
    segments = [(seg[0], int(seg[1:])) for seg in line.split(',')]

    deltas = {
        'U': (0, 1),
        'D': (0, -1),
        'R': (1, 0),
        'L': (-1, 0),
    }

    points = [origin]
    for (d, amt) in segments:
        sx, sy = points[-1]
        dx, dy = deltas[d]

        for i in range(1, amt + 1):
            points.append((sx + dx * i, sy + dy * i))

    return points


def get_intersections(lines):
    sets = [set(get_line_points(line)) for line in lines]
    intersections = sets[0]
    intersections.remove(origin)
    for s in sets:
        intersections = s.intersection(intersections)
    return intersections


def closest_intersection(lines):
    intersections = get_intersections(lines)
    points = sorted(intersections, key=lambda p: manhattan(p, origin))
    return points[0]


with open('./input.txt') as file:
    input_lines = [line.strip() for line in file.readlines()]


def part1():
    p = closest_intersection(input_lines)
    return manhattan(p, origin)


print(part1())


def part2():
    lines = [get_line_points(line) for line in input_lines]
    intersections = get_intersections(input_lines)

    min_steps = len(lines[0])
    for point in intersections:
        steps = sum([points.index(point) for points in lines])
        if steps < min_steps:
            min_steps = steps
    return min_steps


print(part2())
