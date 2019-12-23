class Intcode:

    def __init__(self, instructions):
        super().__init__()
        self.instrs = instructions
        self.ip = 0
        self.halt = False

    def read(self, idx):
        return self.instrs[self.ip + idx]

    def read_val(self, idx):
        return self.instrs[self.read(idx)]

    def store(self, slot, val):
        self.instrs[slot] = val

    def handle_instr(self):
        opcode = self.instrs[self.ip]
        if opcode == 99:
            self.halt = True
            return

        p1 = self.read_val(1)
        p2 = self.read_val(2)
        p3 = self.read(3)

        if opcode == 1:
            self.store(p3, p1 + p2)
            self.ip += 4
        elif opcode == 2:
            self.store(p3, p1 * p2)
            self.ip += 4
        else:
            raise Exception(f'Unknown opcode {opcode}')

    def run(self):
        while not self.halt and self.ip < len(self.instrs):
            self.handle_instr()


with open('./input.txt') as file:
    instrs = [int(op.strip()) for op in file.readline().split(',')]


def get_output(inputs):
    i = instrs.copy()
    i[1] = inputs[0]
    i[2] = inputs[1]
    comp = Intcode(i)
    comp.run()
    return i[0]


def part1():
    return get_output([12, 2])


print(part1())


def part2():
    for a in range(99):
        for b in range(99):
            if get_output([a, b]) == 19690720:
                return 100 * a + b


print(part2())
