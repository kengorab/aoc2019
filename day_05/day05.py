class Intcode:

    def __init__(self, instructions, input_fn):
        super().__init__()
        self.instrs = instructions.copy()
        self.ip = 0
        self.halt = False
        self.get_input = input_fn

    def opcode(self):
        return int(str(self.instrs[self.ip]).zfill(5)[-2:])

    def mode(self):
        return [int(d) for d in str(self.instrs[self.ip]).zfill(5)[:-2]][::-1]

    def read(self, ip_offset):
        return self.instrs[self.ip + ip_offset]

    def param(self, ip_offset):
        mode = self.mode()[ip_offset - 1]
        if mode == 0:
            return self.instrs[self.read(ip_offset)]
        elif mode == 1:
            return self.read(ip_offset)
        else:
            raise Exception(f'Unknown mode: {mode}')

    def store(self, slot, val):
        self.instrs[slot] = val

    def handle_instr(self):
        opcode = self.opcode()
        if opcode == 99:
            self.halt = True
            return

        if opcode == 1:
            p1, p2, p3 = self.param(1), self.param(2), self.read(3)
            self.store(p3, p1 + p2)
            self.ip += 4
        elif opcode == 2:
            p1, p2, p3 = self.param(1), self.param(2), self.read(3)
            self.store(p3, p1 * p2)
            self.ip += 4
        elif opcode == 3:
            val = self.get_input()
            p1 = self.read(1)
            self.store(p1, val)
            self.ip += 2
        elif opcode == 4:
            out = self.param(1)
            self.ip += 2
            return out
        elif opcode == 5:
            p1, p2 = self.param(1), self.param(2)
            if p1 != 0:
                self.ip = p2
            else:
                self.ip += 3
        elif opcode == 6:
            p1, p2 = self.param(1), self.param(2)
            if p1 == 0:
                self.ip = p2
            else:
                self.ip += 3
        elif opcode == 7:
            p1, p2, p3 = self.param(1), self.param(2), self.read(3)
            self.store(p3, 1 if p1 < p2 else 0)
            self.ip += 4
        elif opcode == 8:
            p1, p2, p3 = self.param(1), self.param(2), self.read(3)
            self.store(p3, 1 if p1 == p2 else 0)
            self.ip += 4
        else:
            raise Exception(f'Unknown opcode {opcode}')
        return None

    def run(self):
        while not self.halt:
            output = self.handle_instr()
            if output is not None:
                return output


with open('./input.txt') as file:
    instrs = [int(op.strip()) for op in file.readline().split(',')]


def part1():
    def get_input():
        return 1

    comp = Intcode(instrs, get_input)
    output = []
    while not comp.halt:
        output.append(comp.run())
    return output[-2]


print(part1())


def part2():
    def get_input():
        return 5

    comp = Intcode(instrs, get_input)
    output = []
    while not comp.halt:
        output.append(comp.run())
    return output[-2]


print(part2())
