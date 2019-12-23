num_cards = 119315717514047

offset_diff, increment_mul = 0, 1

with open('./input.txt') as lines:
    lines = lines.read().strip()
    for cmd in lines.split("\n"):
        if cmd.startswith('deal with increment'):
            n = int(cmd.replace('deal with increment ', ''))
            increment_mul *= pow(n, num_cards - 2, num_cards)
        elif cmd.startswith('cut'):
            n = int(cmd.replace('cut ', ''))
            offset_diff += n * increment_mul
        elif cmd == 'deal into new stack':
            increment_mul *= -1
            offset_diff += increment_mul

increment_mul %= num_cards
offset_diff %= num_cards

num_rounds = 101741582076661
increment = pow(increment_mul, num_rounds, num_cards)
offset = offset_diff * (1 - increment) * pow((1 - increment_mul) % num_cards, num_cards - 2, num_cards)
offset %= num_cards

print((offset + 2020 * increment) % num_cards)  # 63069809831158
