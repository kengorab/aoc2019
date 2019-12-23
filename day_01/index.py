with open('./input.txt') as lines:
    lines = [int(line.strip()) for line in lines.readlines()]


def part1():
    def get_req_fuel(mass):
        return (mass // 3) - 2

    return sum([get_req_fuel(m) for m in lines])


def part2():
    def get_req_fuel(mass):
        fuel = (mass // 3) - 2
        if fuel <= 0:
            return 0
        else:
            return fuel + get_req_fuel(fuel)

    return sum([get_req_fuel(m) for m in lines])


print(part1())
print(part2())
