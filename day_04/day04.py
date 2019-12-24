pw_min, pw_max = 193651, 649729


def part1():
    def is_valid(n):
        digits = [int(d) for d in str(n)]
        if str(n) != ''.join(str(d) for d in sorted(digits)):
            return False
        for i in range(len(digits) - 1):
            if digits[i] == digits[i + 1]:
                return True
        return False

    count = 0
    for i in range(pw_min, pw_max + 1):
        if is_valid(i):
            count += 1
    return count


print(part1())


def part2():
    def is_valid(n):
        digits = [int(d) for d in str(n)]
        if str(n) != ''.join(str(d) for d in sorted(digits)):
            return False
        digit_count = {digits.count(d) for d in digits}

        return 2 in digit_count

    count = 0
    for i in range(pw_min, pw_max + 1):
        if is_valid(i):
            count += 1
    return count


print(part2())
