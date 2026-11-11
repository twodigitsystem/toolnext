"use client";

import {
  AlarmClock,
  Captions,
  Circle,
  Dices,
  Hand,
  MessageCircle,
  Play,
  Pause,
  RotateCcw,
  Scissors,
  Shuffle,
  SkipForward,
  Sparkles,
  Square,
  Timer as TimerIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ToolCard } from "@/components/landing-page/quick-tools/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToolOutput } from "./tool-output";

function formatSubtitles(source: string, direction: "srt-vtt" | "vtt-srt") {
  const normalized = source.replace(/\r\n?/g, "\n").trim();
  if (!normalized) throw new Error("Paste subtitle cues to convert.");

  const blocks = normalized
    .split(/\n[ \t]*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (direction === "vtt-srt") {
    const header = blocks.shift();
    if (!header || !/^WEBVTT(?:[ \t].*)?$/.test(header.split("\n")[0])) {
      throw new Error("WebVTT input must start with a WEBVTT header.");
    }
  }

  const output: string[] = [];
  let cueNumber = 1;
  for (const block of blocks) {
    const lines = block.split("\n");
    if (/^(NOTE|STYLE|REGION)(?:\s|$)/.test(lines[0])) {
      throw new Error("NOTE, STYLE, and REGION blocks are not supported.");
    }
    const timingIndex = lines.findIndex((line) => line.includes("-->"));
    if (timingIndex < 0) {
      if (
        direction === "vtt-srt" &&
        !output.length &&
        /^WEBVTT(?:[ \t].*)?$/.test(lines[0])
      )
        continue;
      throw new Error("A cue is missing its start --> end timestamp line.");
    }
    const match = lines[timingIndex].match(
      /^(\d{2}:\d{2}:\d{2})[,.](\d{3}) --> (\d{2}:\d{2}:\d{2})[,.](\d{3})$/,
    );
    if (!match) {
      throw new Error(
        "Use simple HH:MM:SS,mmm SRT or HH:MM:SS.mmm WebVTT timestamps without cue settings.",
      );
    }
    if (Number(match[2]) > 59 || Number(match[4]) > 59) {
      throw new Error(
        "Subtitle timestamps must use valid minute and second values.",
      );
    }
    const cueText = lines.slice(timingIndex + 1);
    if (!cueText.some((line) => line.trim())) {
      throw new Error("Every subtitle cue needs text.");
    }
    const punctuation = direction === "srt-vtt" ? "." : ",";
    const timestamps = `${match[1]}${punctuation}${match[2]} --> ${match[3]}${punctuation}${match[4]}`;
    output.push(
      direction === "srt-vtt"
        ? [timestamps, ...cueText].join("\n")
        : [String(cueNumber++), timestamps, ...cueText].join("\n"),
    );
  }

  if (!output.length) throw new Error("No supported subtitle cues were found.");
  return direction === "srt-vtt"
    ? `WEBVTT\n\n${output.join("\n\n")}`
    : output.join("\n\n");
}

export function SubtitleConverter() {
  const [direction, setDirection] = useState<"srt-vtt" | "vtt-srt">("srt-vtt");
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setResult(formatSubtitles(source, direction));
      setError("");
    } catch (cause) {
      setResult("");
      setError(
        cause instanceof Error ? cause.message : "Could not convert subtitles.",
      );
    }
  };

  return (
    <ToolCard
      icon={Captions}
      title="Subtitle Converter"
      badge="Media"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!source && !result && !error}
          onClick={() => {
            setSource("");
            setResult("");
            setError("");
          }}
          aria-label="Clear subtitle text"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Clear
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          Converts simple SRT and WebVTT cue text locally. Advanced cue settings
          and metadata blocks are not supported.
        </p>
      }
    >
      <label
        htmlFor="subtitle-format"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Conversion
      </label>
      <select
        id="subtitle-format"
        value={direction}
        onChange={(event) => {
          if (
            event.target.value === "srt-vtt" ||
            event.target.value === "vtt-srt"
          ) {
            setDirection(event.target.value);
            setResult("");
            setError("");
          }
        }}
        className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-on-surface"
      >
        <option value="srt-vtt">SRT to WebVTT</option>
        <option value="vtt-srt">WebVTT to SRT</option>
      </select>
      <label
        htmlFor="subtitle-input"
        className="mb-1.5 mt-3 text-xs font-semibold text-on-surface-variant"
      >
        Subtitle text
      </label>
      <Textarea
        id="subtitle-input"
        value={source}
        onChange={(event) => {
          setSource(event.target.value);
          setResult("");
          setError("");
        }}
        placeholder={
          direction === "srt-vtt"
            ? "1\n00:00:01,000 --> 00:00:03,000\nHello!"
            : "WEBVTT\n\n00:00:01.000 --> 00:00:03.000\nHello!"
        }
        rows={6}
        spellCheck={false}
        className="resize-y bg-surface-low font-mono text-xs"
      />
      <Button type="button" className="mt-3 w-full" onClick={convert}>
        Convert subtitles
      </Button>
      {error && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          {error}
        </p>
      )}
      <div className="mt-3">
        <ToolOutput
          value={result}
          label={direction === "srt-vtt" ? "WebVTT output" : "SRT output"}
          rows={6}
        />
      </div>
    </ToolCard>
  );
}

export function WhatsAppLink() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const digits = phone.replace(/\D/g, "");
  const validPhone = digits.length >= 7 && digits.length <= 15;
  const result = validPhone
    ? `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`
    : "";

  return (
    <ToolCard
      icon={MessageCircle}
      title="WhatsApp Link"
      badge="Social"
      footer={
        <p className="text-xs text-on-surface-variant">
          Use an international number with country code. This creates a link; it
          does not send a message.
        </p>
      }
    >
      <label
        htmlFor="whatsapp-phone"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Phone number
      </label>
      <Input
        id="whatsapp-phone"
        type="tel"
        autoComplete="tel"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder="+1 555 123 4567"
        className="bg-surface-low"
      />
      <p className="mt-1 text-[11px] text-outline">
        Enter 7–15 digits, including your country code.
      </p>
      <label
        htmlFor="whatsapp-message"
        className="mb-1.5 mt-3 text-xs font-semibold text-on-surface-variant"
      >
        Optional message
      </label>
      <Textarea
        id="whatsapp-message"
        value={message}
        maxLength={1000}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Hi! I wanted to get in touch."
        rows={3}
        className="resize-y bg-surface-low"
      />
      {!!phone && !validPhone && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          Enter a valid international phone number with 7–15 digits.
        </p>
      )}
      <div className="mt-3">
        <ToolOutput value={result} label="WhatsApp link" rows={2} />
      </div>
    </ToolCard>
  );
}

export function CoinFlip() {
  const [result, setResult] = useState<"Heads" | "Tails" | null>(null);
  const [flips, setFlips] = useState({ heads: 0, tails: 0 });
  const [error, setError] = useState("");

  const flip = () => {
    try {
      const buffer = new Uint32Array(1);
      crypto.getRandomValues(buffer);
      const outcome = buffer[0] % 2 === 0 ? "Heads" : "Tails";
      setResult(outcome);
      setFlips((previous) => ({
        heads: previous.heads + Number(outcome === "Heads"),
        tails: previous.tails + Number(outcome === "Tails"),
      }));
      setError("");
    } catch {
      setError("Your browser could not generate a random result.");
    }
  };

  const reset = () => {
    setResult(null);
    setFlips({ heads: 0, tails: 0 });
    setError("");
  };

  return (
    <ToolCard
      icon={Circle}
      title="Coin Flip"
      badge="Utility"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={reset}
          disabled={!result}
          aria-label="Reset coin flip"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Reset
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          Random result generated on this device. Not intended for cryptographic
          or high-stakes use.
        </p>
      }
    >
      <div
        aria-live="polite"
        className="flex min-h-40 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10"
      >
        <div className="flex size-20 items-center justify-center rounded-full border border-primary/20 bg-card shadow-sm">
          <span className="font-heading text-center text-sm font-bold text-primary">
            {result ?? "Ready?"}
          </span>
        </div>
        <p className="mt-3 text-sm font-semibold text-on-surface">
          {result ?? "Flip the coin"}
        </p>
      </div>
      <Button type="button" className="mt-4 w-full" onClick={flip}>
        <Shuffle className="size-4" aria-hidden="true" />
        Flip coin
      </Button>
      <div className="mt-3 flex justify-center gap-6 text-xs text-on-surface-variant">
        <span>Heads: {flips.heads}</span>
        <span>Tails: {flips.tails}</span>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-center text-xs text-destructive">
          {error}
        </p>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Pomodoro Timer
 * ──────────────────────────────────────────────────────────────────────────── */

type PomodoroPhase = "work" | "break" | "long-break";

export function Pomodoro() {
  const [phase, setPhase] = useState<PomodoroPhase>("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const workDuration = 25 * 60;
  const breakDuration = 5 * 60;
  const longBreakDuration = 15 * 60;

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    clearTimer();
    setRunning(false);
    setPhase("work");
    setTimeLeft(workDuration);
    setCycle(1);
  };

  const skip = () => {
    clearTimer();
    setRunning(false);
    if (phase === "work") {
      if (cycle % 4 === 0) {
        setPhase("long-break");
        setTimeLeft(longBreakDuration);
      } else {
        setPhase("break");
        setTimeLeft(breakDuration);
      }
    } else {
      setPhase("work");
      setTimeLeft(workDuration);
      setCycle((c) => c + 1);
    }
  };

  const toggle = () => {
    if (running) {
      clearTimer();
      setRunning(false);
    } else {
      setRunning(true);
    }
  };

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setRunning(false);
          if (phase === "work") {
            if (cycle % 4 === 0) {
              setPhase("long-break");
              return longBreakDuration;
            }
            setPhase("break");
            return breakDuration;
          }
          setPhase("work");
          setCycle((c) => c + 1);
          return workDuration;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [running, phase, cycle, workDuration, breakDuration, longBreakDuration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const progress =
    phase === "work"
      ? 1 - timeLeft / workDuration
      : phase === "break"
        ? 1 - timeLeft / breakDuration
        : 1 - timeLeft / longBreakDuration;

  const phaseLabel =
    phase === "work" ? "Focus" : phase === "break" ? "Short break" : "Long break";

  return (
    <ToolCard
      icon={AlarmClock}
      title="Pomodoro Timer"
      badge="Utility"
      action={
        <Button type="button" variant="ghost" size="sm" onClick={skip} disabled={!running && timeLeft === workDuration} aria-label="Skip phase">
          <SkipForward className="size-3.5" aria-hidden="true" />
          Skip
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          Cycle {cycle} — every 4th break is a long 15-minute break. Timer runs in this browser.
        </p>
      }
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex size-44 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-surface-low"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={2 * Math.PI * 45 * (1 - progress)}
              className="text-primary transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="text-center">
            <p className="font-heading text-4xl font-bold text-on-surface tabular-nums">
              {display}
            </p>
            <p className="mt-1 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              {phaseLabel}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="button" className="min-w-28" onClick={toggle}>
            {running ? <Pause className="size-4 mr-1" /> : <Play className="size-4 mr-1" />}
            {running ? "Pause" : "Start"}
          </Button>
          <Button type="button" variant="outline" onClick={reset}>
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </div>
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Dice Roller
 * ──────────────────────────────────────────────────────────────────────────── */

export function DiceRoller() {
  const [count, setCount] = useState("2");
  const [sides, setSides] = useState("6");
  const [results, setResults] = useState<number[]>([]);

  const roll = () => {
    const n = Number(count);
    const s = Number(sides);
    if (!Number.isInteger(n) || !Number.isInteger(s) || n < 1 || n > 100 || s < 2 || s > 1000) return;
    const arr = new Uint32Array(n);
    crypto.getRandomValues(arr);
    setResults(Array.from(arr, (v) => (v % s) + 1));
  };

  const sum = results.reduce((a, b) => a + b, 0);

  return (
    <ToolCard
      icon={Dices}
      title="Dice Roller"
      badge="Utility"
      footer={<p className="text-xs text-on-surface-variant">{results.length > 0 ? `${results.length}d${sides} = ${sum}` : "Configure and roll."}</p>}
    >
      <div className="flex gap-3">
        <div className="flex-1 space-y-1.5">
          <label htmlFor="dice-count" className="text-xs font-semibold text-on-surface-variant">Number of dice</label>
          <input id="dice-count" type="number" min="1" max="100" value={count} onChange={(e) => setCount(e.target.value)} className="h-9 w-full rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface" />
        </div>
        <div className="flex-1 space-y-1.5">
          <label htmlFor="dice-sides" className="text-xs font-semibold text-on-surface-variant">Sides per die</label>
          <input id="dice-sides" type="number" min="2" max="1000" value={sides} onChange={(e) => setSides(e.target.value)} className="h-9 w-full rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface" />
        </div>
      </div>
      <Button type="button" className="mt-3 w-full" onClick={roll}>Roll dice</Button>
      {results.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {results.map((r, i) => (
            <span key={i} className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 font-heading text-lg font-bold text-primary">{r}</span>
          ))}
        </div>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Rock Paper Scissors
 * ──────────────────────────────────────────────────────────────────────────── */

type RpsChoice = "rock" | "paper" | "scissors";

function rpsWinner(player: RpsChoice, computer: RpsChoice): "win" | "lose" | "tie" {
  if (player === computer) return "tie";
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) return "win";
  return "lose";
}

const rpsEmoji: Record<RpsChoice, string> = { rock: "🪨", paper: "📄", scissors: "✂️" };

export function RpsGame() {
  const [player, setPlayer] = useState<RpsChoice | null>(null);
  const [computer, setComputer] = useState<RpsChoice | null>(null);
  const [result, setResult] = useState<"win" | "lose" | "tie" | null>(null);
  const [score, setScore] = useState({ player: 0, computer: 0, tie: 0 });

  const play = (choice: RpsChoice) => {
    const choices: RpsChoice[] = ["rock", "paper", "scissors"];
    const compChoice = choices[Math.floor(Math.random() * 3)];
    const outcome = rpsWinner(choice, compChoice);
    setPlayer(choice);
    setComputer(compChoice);
    setResult(outcome);
    setScore((s) => ({
      player: s.player + (outcome === "win" ? 1 : 0),
      computer: s.computer + (outcome === "lose" ? 1 : 0),
      tie: s.tie + (outcome === "tie" ? 1 : 0),
    }));
  };

  const resultLabel = result === "win" ? "You win!" : result === "lose" ? "Computer wins!" : "Tie!";
  const resultColor = result === "win" ? "text-green-600" : result === "lose" ? "text-destructive" : "text-on-surface-variant";

  return (
    <ToolCard
      icon={Hand}
      title="Rock Paper Scissors"
      badge="Utility"
      footer={<p className="text-xs text-on-surface-variant">W: {score.player} · L: {score.computer} · T: {score.tie}</p>}
    >
      <div className="flex justify-center gap-3">
        {(["rock", "paper", "scissors"] as const).map((choice) => (
          <Button key={choice} type="button" variant={player === choice ? "default" : "outline"} onClick={() => play(choice)} className="flex-col gap-1 h-auto py-3 min-w-20">
            <span className="text-2xl">{rpsEmoji[choice]}</span>
            <span className="text-[10px] capitalize">{choice}</span>
          </Button>
        ))}
      </div>
      {result && (
        <div className="mt-4 text-center">
          <div className="flex justify-center gap-8 text-3xl">
            <span>{rpsEmoji[player!]}</span>
            <span className="text-xl text-on-surface-variant">vs</span>
            <span>{rpsEmoji[computer!]}</span>
          </div>
          <p className={`mt-2 text-lg font-bold ${resultColor}`}>{resultLabel}</p>
        </div>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Timer (countdown)
 * ──────────────────────────────────────────────────────────────────────────── */

export function Timer() {
  const [minutes, setMinutes] = useState("5");
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const start = () => {
    const m = Number(minutes);
    if (!Number.isFinite(m) || m < 0.1 || m > 999) return;
    clearTimer();
    setTimeLeft(Math.round(m * 60));
    setRunning(true);
  };

  const stop = () => { clearTimer(); setRunning(false); };
  const reset = () => { clearTimer(); setRunning(false); setTimeLeft(0); };

  useEffect(() => {
    if (!running || timeLeft <= 0) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearTimer(); setRunning(false); return 0; }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [running, timeLeft]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const display = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    <ToolCard
      icon={TimerIcon}
      title="Timer"
      badge="Utility"
      footer={<p className="text-xs text-on-surface-variant">{running ? "Running…" : timeLeft > 0 ? "Paused" : "Set time and start."}</p>}
    >
      {timeLeft === 0 && !running ? (
        <div className="space-y-1.5">
          <label htmlFor="timer-minutes" className="text-xs font-semibold text-on-surface-variant">Minutes</label>
          <div className="flex gap-2">
            <input id="timer-minutes" type="number" min="0.1" max="999" step="0.1" value={minutes} onChange={(e) => setMinutes(e.target.value)} className="h-9 flex-1 rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface" />
            <Button type="button" onClick={start}>Start</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="font-heading text-5xl font-bold text-primary tabular-nums">{display}</p>
          <div className="flex gap-3">
            {running ? (
              <Button type="button" variant="outline" onClick={stop}>Pause</Button>
            ) : (
              <Button type="button" onClick={start} disabled={timeLeft <= 0}>Resume</Button>
            )}
            <Button type="button" variant="outline" onClick={reset}>Reset</Button>
          </div>
        </div>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Number to Words
 * ──────────────────────────────────────────────────────────────────────────── */

const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function numberToEnglish(n: number): string {
  if (n === 0) return "zero";
  if (n < 0) return `minus ${numberToEnglish(-n)}`;
  if (n < 20) return ONES[n];
  if (n < 100) return `${TENS[Math.floor(n / 10)]}${n % 10 ? `-${ONES[n % 10]}` : ""}`;
  if (n < 1000) return `${ONES[Math.floor(n / 100)]} hundred${n % 100 ? ` and ${numberToEnglish(n % 100)}` : ""}`;
  if (n < 1_000_000) return `${numberToEnglish(Math.floor(n / 1000))} thousand${n % 1000 ? ` ${numberToEnglish(n % 1000)}` : ""}`;
  if (n < 1_000_000_000) return `${numberToEnglish(Math.floor(n / 1_000_000))} million${n % 1_000_000 ? ` ${numberToEnglish(n % 1_000_000)}` : ""}`;
  if (n < 1_000_000_000_000) return `${numberToEnglish(Math.floor(n / 1_000_000_000))} billion${n % 1_000_000_000 ? ` ${numberToEnglish(n % 1_000_000_000)}` : ""}`;
  return `${numberToEnglish(Math.floor(n / 1_000_000_000_000))} trillion${n % 1_000_000_000_000 ? ` ${numberToEnglish(n % 1_000_000_000_000)}` : ""}`;
}

export function NumberToWords() {
  const [number, setNumber] = useState("1234");
  const n = Number(number);
  const valid = number.trim() !== "" && Number.isFinite(n) && Number.isSafeInteger(n) && n >= -999_999_999_999_999 && n <= 999_999_999_999_999;
  const result = valid ? numberToEnglish(n) : "";

  return (
    <ToolCard
      icon={Sparkles}
      title="Number to Words"
      badge="Utility"
      footer={<p className="text-xs text-on-surface-variant">Converts whole numbers up to 999 trillion.</p>}
    >
      <label htmlFor="ntw-input" className="mb-1.5 text-xs font-semibold text-on-surface-variant">Number</label>
      <input id="ntw-input" type="number" value={number} onChange={(e) => setNumber(e.target.value)} className="h-9 w-full rounded-lg border border-input bg-surface-low px-3 text-sm text-on-surface" />
      {!valid && number.trim() && <p className="mt-1 text-xs text-destructive">Enter a whole number between -999 trillion and 999 trillion.</p>}
      <div className="mt-3"><ToolOutput value={result} label="In English" rows={3} /></div>
    </ToolCard>
  );
}
