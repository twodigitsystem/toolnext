"use client";

import { Calculator, Calendar, RotateCcw, Scale } from "lucide-react";
import { useState } from "react";
import { ToolCard } from "@/components/landing-page/quick-tools/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ──────────────────────────────────────────────────────────────────────────────
 * Age Calculator
 * ──────────────────────────────────────────────────────────────────────────── */

function computeAge(birthDate: Date, targetDate: Date) {
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.round(
    (targetDate.getTime() - birthDate.getTime()) / 86400000,
  );
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = Math.round((targetDate.getTime() - birthDate.getTime()) / 3600000);

  return { years, months, days, totalDays, totalWeeks, totalHours };
}

export function AgeCalculator() {
  const [birth, setBirth] = useState("");
  const [target, setTarget] = useState(() => new Date().toISOString().slice(0, 10));
  const [result, setResult] = useState<ReturnType<typeof computeAge> | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    if (!birth || !target) {
      setError("Select both a birth date and a target date.");
      return;
    }
    const birthDate = new Date(birth);
    const targetDate = new Date(target);
    if (!Number.isFinite(birthDate.getTime()) || !Number.isFinite(targetDate.getTime())) {
      setError("Enter valid dates.");
      return;
    }
    if (birthDate > targetDate) {
      setError("Birth date must be before the target date.");
      return;
    }
    setResult(computeAge(birthDate, targetDate));
    setError("");
  };

  return (
    <ToolCard
      icon={Calendar}
      title="Age Calculator"
      badge="Calculate"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setBirth("");
            setResult(null);
            setError("");
          }}
          disabled={!birth}
          aria-label="Clear"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Clear
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          All calculations are done locally. No data is sent anywhere.
        </p>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="age-birth" className="text-xs font-semibold text-on-surface-variant">
            Date of birth
          </label>
          <Input
            id="age-birth"
            type="date"
            value={birth}
            onChange={(e) => { setBirth(e.target.value); setError(""); }}
            className="bg-surface-low"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="age-target" className="text-xs font-semibold text-on-surface-variant">
            Target date
          </label>
          <Input
            id="age-target"
            type="date"
            value={target}
            onChange={(e) => { setTarget(e.target.value); setError(""); }}
            className="bg-surface-low"
          />
        </div>
      </div>
      <Button type="button" className="mt-3 w-full" onClick={calculate}>
        Calculate age
      </Button>
      {error && <p role="alert" className="mt-2 text-xs text-destructive">{error}</p>}
      {result && (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-primary/5 p-4 text-center">
            <p className="text-xs font-semibold text-on-surface-variant">Exact age</p>
            <p className="mt-1 font-heading text-2xl font-bold text-primary">
              {result.years} years, {result.months} months, {result.days} days
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Total days", result.totalDays],
              ["Total weeks", result.totalWeeks],
              ["Total hours", result.totalHours],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-surface-low p-3 text-center">
                <p className="font-heading text-lg font-bold text-primary">{value?.toLocaleString()}</p>
                <p className="mt-0.5 text-[11px] text-on-surface-variant">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * BMI Calculator
 * ──────────────────────────────────────────────────────────────────────────── */

function computeBmi(weightKg: number, heightCm: number) {
  const bmi = weightKg / ((heightCm / 100) * (heightCm / 100));
  let category: string;
  let color: string;

  if (bmi < 18.5) {
    category = "Underweight";
    color = "text-blue-600";
  } else if (bmi < 25) {
    category = "Normal";
    color = "text-green-600";
  } else if (bmi < 30) {
    category = "Overweight";
    color = "text-orange-600";
  } else {
    category = "Obese";
    color = "text-destructive";
  }

  return { bmi: Math.round(bmi * 10) / 10, category, color };
}

export function BmiCalculator() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [result, setResult] = useState<ReturnType<typeof computeBmi> | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    const w = Number(weight);
    const h = Number(height);
    if (!weight.trim() || !height.trim() || !Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
      setError("Enter positive numbers for both weight and height.");
      setResult(null);
      return;
    }
    if (w > 1000 || h > 300) {
      setError("Enter weight in kg (max 1000) and height in cm (max 300).");
      setResult(null);
      return;
    }
    setResult(computeBmi(w, h));
    setError("");
  };

  return (
    <ToolCard
      icon={Scale}
      title="BMI Calculator"
      badge="Calculate"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => { setResult(null); setError(""); }}
          disabled={!result}
          aria-label="Clear"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Clear
        </Button>
      }
      footer={
        <p className="text-xs text-on-surface-variant">
          BMI is a screening measure; it does not diagnose body fat or health.
        </p>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="bmi-weight" className="text-xs font-semibold text-on-surface-variant">
            Weight (kg)
          </label>
          <Input
            id="bmi-weight"
            type="number"
            min="1"
            max="1000"
            step="0.1"
            value={weight}
            onChange={(e) => { setWeight(e.target.value); setError(""); }}
            className="bg-surface-low"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="bmi-height" className="text-xs font-semibold text-on-surface-variant">
            Height (cm)
          </label>
          <Input
            id="bmi-height"
            type="number"
            min="1"
            max="300"
            step="0.1"
            value={height}
            onChange={(e) => { setHeight(e.target.value); setError(""); }}
            className="bg-surface-low"
          />
        </div>
      </div>
      <Button type="button" className="mt-3 w-full" onClick={calculate}>
        Calculate BMI
      </Button>
      {error && <p role="alert" className="mt-2 text-xs text-destructive">{error}</p>}
      {result && (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-primary/5 p-4 text-center">
            <p className="text-xs font-semibold text-on-surface-variant">Your BMI</p>
            <p className="mt-1 font-heading text-3xl font-bold text-primary">{result.bmi}</p>
          </div>
          <div className={`rounded-xl p-3 text-center text-sm font-semibold ${result.color}`}>
            {result.category}
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-low">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min((result.bmi / 40) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </ToolCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Basic Calculator
 * ──────────────────────────────────────────────────────────────────────────── */

type CalcOp = "+" | "-" | "×" | "÷";

export function BasicCalculator() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<CalcOp | null>(null);
  const [reset, setReset] = useState(false);

  const inputDigit = (d: string) => {
    setDisplay((prevDisplay) => {
      if (reset || prevDisplay === "0") { setReset(false); return d; }
      return prevDisplay.length < 16 ? prevDisplay + d : prevDisplay;
    });
  };

  const inputDot = () => {
    if (reset) { setDisplay("0."); setReset(false); return; }
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const handleOp = (nextOp: CalcOp) => {
    const num = Number(display);
    if (prev !== null && op !== null && !reset) {
      const result = calcOp(prev, num, op);
      setDisplay(String(result));
      setPrev(result);
    } else {
      setPrev(num);
    }
    setOp(nextOp);
    setReset(true);
  };

  const equals = () => {
    const num = Number(display);
    if (prev === null || op === null) return;
    const result = calcOp(prev, num, op);
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
    setReset(true);
  };

  const clear = () => { setDisplay("0"); setPrev(null); setOp(null); setReset(false); };

  const calcOp = (a: number, b: number, operation: CalcOp) => {
    switch (operation) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : NaN;
    }
  };

  const btn = (label: string, onClick: () => void, className = "") => (
    <button type="button" onClick={onClick} className={`h-12 rounded-xl border border-input bg-surface-low text-sm font-semibold text-on-surface hover:bg-primary/10 transition-colors ${className}`}>
      {label}
    </button>
  );

  return (
    <ToolCard
      icon={Calculator}
      title="Basic Calculator"
      badge="Calculate"
      footer={<p className="text-xs text-on-surface-variant">Simple arithmetic. Use buttons or your keyboard.</p>}
    >
      <div className="rounded-xl bg-surface-low p-3 text-right">
        <p className="font-heading text-2xl font-bold text-primary tabular-nums truncate">
          {display}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {btn("C", clear, "bg-destructive/10 text-destructive")}
        {btn("÷", () => handleOp("÷"))}
        {btn("×", () => handleOp("×"))}
        {btn("←", () => setDisplay((d) => d.length > 1 ? d.slice(0, -1) : "0"))}

        {btn("7", () => inputDigit("7"))}
        {btn("8", () => inputDigit("8"))}
        {btn("9", () => inputDigit("9"))}
        {btn("-", () => handleOp("-"))}

        {btn("4", () => inputDigit("4"))}
        {btn("5", () => inputDigit("5"))}
        {btn("6", () => inputDigit("6"))}
        {btn("+", () => handleOp("+"))}

        {btn("1", () => inputDigit("1"))}
        {btn("2", () => inputDigit("2"))}
        {btn("3", () => inputDigit("3"))}
        {btn("=", equals, "bg-primary text-primary-foreground row-span-2")}

        {btn("0", () => inputDigit("0"), "col-span-2")}
        {btn(".", inputDot)}
      </div>
    </ToolCard>
  );
}
