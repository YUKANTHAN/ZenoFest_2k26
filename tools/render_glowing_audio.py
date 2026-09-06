import math
import random
import wave

SR = 44100
DUR = 14.0
N = int(SR * DUR)
OUT = r"C:\Users\jagan\AppData\Local\Temp\opencode\ambient.wav"

rng = random.Random(7)


def mix(streams):
    out = [0.0] * N
    for s in streams:
        for i, v in enumerate(s):
            out[i] += v
    return out


def lfo_slow(t):
    return 0.5 + 0.5 * math.sin(2 * math.pi * 0.08 * t)


def drone():
    ch = [0.0] * N
    for i in range(N):
        t = i / SR
        e = 0.12 * (1 - math.exp(-t / 1.5)) * (0.5 + 0.5 * math.sin(t * 0.6)) * lfo_slow(t)
        s = math.sin(2 * math.pi * 55 * t) * 0.55 + math.sin(2 * math.pi * 82.41 * t) * 0.3
        ch[i] = s * e
    return ch


def pad():
    ch = [0.0] * N
    freqs = [110.0, 164.81, 220.0, 246.94, 277.18, 329.63]
    det = [0.15, -0.11, 0.09, -0.06, 0.12, -0.08]
    amp = [0.05, 0.05, 0.06, 0.04, 0.035, 0.04]
    for f, dt, a in zip(freqs, det, amp):
        ph = rng.random() * math.tau
        for i in range(N):
            t = i / SR
            env = math.sin(math.pi * min(1.0, t / 5.0)) * math.sin(math.pi * min(1.0, (N / SR - t) / 4.0))
            c = math.cos(2 * math.pi * (f + dt) * t + ph)
            ch[i] += c * env * a
    return ch


def riser():
    ch = [0.0] * N
    y = 0.0
    a = 0.045
    start = int(8.0 * SR)
    stop = int(11.0 * SR)
    for i in range(N):
        v = rng.uniform(-1, 1)
        y = y * (1 - a) + v * a
        if i < start or i > stop:
            ch[i] = 0.0
            continue
        t = i / SR
        p = (t - 8.0) / 3.0
        e = (p ** 1.8) * 0.30
        ch[i] = y * e * 4.0
    return ch


def impact():
    ch = [0.0] * N
    t0 = 11.0
    n0 = int(t0 * SR)
    for i in range(N):
        if i < n0:
            continue
        dt = i / SR - t0
        if dt > 1.2:
            continue
        f = 1500.0 * math.exp(-dt * 3.2) + 52.0
        env = math.exp(-dt * 6.5)
        s = math.sin(2 * math.pi * f * dt + math.sin(dt * 2.4) * 0.6)
        thump = math.sin(2 * math.pi * 58 * dt) * math.exp(-dt * 9.0) * 1.4
        ch[i] = s * env * 0.22 + thump * env * 1.1
    return ch


def shimmer():
    ch = [0.0] * N
    for _ in range(40):
        t0 = rng.uniform(3.5, 13.0)
        n0 = int(t0 * SR)
        f = rng.choice([523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5])
        a = rng.uniform(0.012, 0.03)
        dur = rng.uniform(0.25, 0.6)
        for i in range(n0, min(N, n0 + int(dur * SR))):
            dt = (i - n0) / SR
            env = math.exp(-dt * 7.0)
            tb = 0.5 + 0.5 * math.sin(2 * math.pi * 1.1 * (t0 + dt))
            ch[i] += math.sin(2 * math.pi * f * dt) * env * a * tb
    return ch


def main():
    chs = mix([drone(), pad(), riser(), impact(), shimmer()])
    peak = max(max(abs(v) for v in chs), 1e-9)
    norm = 0.62 / peak
    frames = bytearray()
    for v in chs:
        l = int(max(-1, min(1, v * norm)) * 32767)
        frames += int(l).to_bytes(2, "little", signed=True)
        frames += int(l).to_bytes(2, "little", signed=True)
    with wave.open(OUT, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(bytes(frames))
    print("WAV written:", OUT, "peak", peak, "norm", round(norm, 3))


if __name__ == "__main__":
    main()