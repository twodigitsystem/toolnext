"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  FlaskConical,
  Gauge,
  HardDrive,
  Palette,
  Ruler,
  Square,
  Waves,
  Weight,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { ToolCard } from "@/components/landing-page/quick-tools/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CssConversionContext = {
  rootFontSize: number;
  parentFontSize: number;
  viewportWidth: number;
  viewportHeight: number;
  percentageReference: number;
};

type UnitDefinition = {
  value: string;
  label: string;
  factor: number | ((context: CssConversionContext) => number);
};

type ConverterId =
  | "length-converter"
  | "weight-converter"
  | "volume-converter"
  | "area-converter"
  | "speed-converter"
  | "data-storage"
  | "energy-converter"
  | "frequency-converter"
  | "css-unit-converter";

type ConverterConfig = {
  id: ConverterId;
  title: string;
  icon: LucideIcon;
  units: readonly UnitDefinition[];
  initialFrom: string;
  initialTo: string;
  footer: string;
  needsCssContext?: boolean;
};

const lengthUnits: UnitDefinition[] = [
  { value: "mm", label: "Millimeters (mm)", factor: 0.001 },
  { value: "cm", label: "Centimeters (cm)", factor: 0.01 },
  { value: "m", label: "Meters (m)", factor: 1 },
  { value: "km", label: "Kilometers (km)", factor: 1000 },
  { value: "in", label: "Inches (in)", factor: 0.0254 },
  { value: "ft", label: "Feet (ft)", factor: 0.3048 },
  { value: "yd", label: "Yards (yd)", factor: 0.9144 },
  { value: "mi", label: "Miles (mi)", factor: 1609.344 },
];

const weightUnits: UnitDefinition[] = [
  { value: "mg", label: "Milligrams (mg)", factor: 0.000001 },
  { value: "g", label: "Grams (g)", factor: 0.001 },
  { value: "kg", label: "Kilograms (kg)", factor: 1 },
  { value: "t", label: "Metric tonnes (t)", factor: 1000 },
  { value: "oz", label: "Ounces (oz)", factor: 0.028349523125 },
  { value: "lb", label: "Pounds (lb)", factor: 0.45359237 },
  { value: "st", label: "Stone (st)", factor: 6.35029318 },
  { value: "us-ton", label: "US short tons", factor: 907.18474 },
];

const volumeUnits: UnitDefinition[] = [
  { value: "ml", label: "Milliliters (mL)", factor: 0.001 },
  { value: "l", label: "Liters (L)", factor: 1 },
  { value: "m3", label: "Cubic meters (m³)", factor: 1000 },
  { value: "tsp", label: "US teaspoons (tsp)", factor: 0.00492892159375 },
  { value: "tbsp", label: "US tablespoons (tbsp)", factor: 0.01478676478125 },
  { value: "cup", label: "US cups", factor: 0.2365882365 },
  { value: "pt", label: "US pints (pt)", factor: 0.473176473 },
  { value: "qt", label: "US quarts (qt)", factor: 0.946352946 },
  { value: "gal", label: "US gallons (gal)", factor: 3.785411784 },
  { value: "imp-gal", label: "Imperial gallons", factor: 4.54609 },
];

const areaUnits: UnitDefinition[] = [
  { value: "mm2", label: "Square millimeters (mm²)", factor: 0.000001 },
  { value: "cm2", label: "Square centimeters (cm²)", factor: 0.0001 },
  { value: "m2", label: "Square meters (m²)", factor: 1 },
  { value: "km2", label: "Square kilometers (km²)", factor: 1_000_000 },
  { value: "in2", label: "Square inches (in²)", factor: 0.00064516 },
  { value: "ft2", label: "Square feet (ft²)", factor: 0.09290304 },
  { value: "yd2", label: "Square yards (yd²)", factor: 0.83612736 },
  { value: "acre", label: "Acres", factor: 4046.8564224 },
  { value: "ha", label: "Hectares (ha)", factor: 10_000 },
];

const speedUnits: UnitDefinition[] = [
  { value: "m/s", label: "Meters per second (m/s)", factor: 1 },
  { value: "km/h", label: "Kilometers per hour (km/h)", factor: 1 / 3.6 },
  { value: "mph", label: "Miles per hour (mph)", factor: 0.44704 },
  { value: "knot", label: "Knots (kn)", factor: 0.514444 },
  { value: "ft/s", label: "Feet per second (ft/s)", factor: 0.3048 },
];

const dataUnits: UnitDefinition[] = [
  { value: "bit", label: "Bits (b)", factor: 0.125 },
  { value: "B", label: "Bytes (B)", factor: 1 },
  { value: "KB", label: "Kilobytes (KB, decimal)", factor: 1000 },
  { value: "MB", label: "Megabytes (MB, decimal)", factor: 1_000_000 },
  { value: "GB", label: "Gigabytes (GB, decimal)", factor: 1_000_000_000 },
  { value: "TB", label: "Terabytes (TB, decimal)", factor: 1_000_000_000_000 },
  { value: "KiB", label: "Kibibytes (KiB)", factor: 1024 },
  { value: "MiB", label: "Mebibytes (MiB)", factor: 1_048_576 },
  { value: "GiB", label: "Gibibytes (GiB)", factor: 1_073_741_824 },
  { value: "TiB", label: "Tebibytes (TiB)", factor: 1_099_511_627_776 },
];

const energyUnits: UnitDefinition[] = [
  { value: "J", label: "Joules (J)", factor: 1 },
  { value: "kJ", label: "Kilojoules (kJ)", factor: 1000 },
  { value: "cal", label: "Calories (cal)", factor: 4.184 },
  { value: "kcal", label: "Kilocalories (kcal)", factor: 4184 },
  { value: "Wh", label: "Watt-hours (Wh)", factor: 3600 },
  { value: "kWh", label: "Kilowatt-hours (kWh)", factor: 3_600_000 },
  { value: "eV", label: "Electronvolts (eV)", factor: 1.602176634e-19 },
  { value: "BTU", label: "British thermal units (BTU)", factor: 1055.05585262 },
  { value: "ft-lb", label: "Foot-pounds (ft⋅lb)", factor: 1.3558179483 },
];

const frequencyUnits: UnitDefinition[] = [
  { value: "mHz", label: "Millihertz (mHz)", factor: 0.001 },
  { value: "Hz", label: "Hertz (Hz)", factor: 1 },
  { value: "kHz", label: "Kilohertz (kHz)", factor: 1000 },
  { value: "MHz", label: "Megahertz (MHz)", factor: 1_000_000 },
  { value: "GHz", label: "Gigahertz (GHz)", factor: 1_000_000_000 },
  { value: "rpm", label: "Revolutions per minute (rpm)", factor: 1 / 60 },
];

const cssUnits: UnitDefinition[] = [
  { value: "px", label: "Pixels (px)", factor: 1 },
  {
    value: "em",
    label: "Ems (em, parent font size)",
    factor: (context) => context.parentFontSize,
  },
  {
    value: "rem",
    label: "Root ems (rem, root font size)",
    factor: (context) => context.rootFontSize,
  },
  {
    value: "vw",
    label: "Viewport width (vw)",
    factor: (context) => context.viewportWidth / 100,
  },
  {
    value: "vh",
    label: "Viewport height (vh)",
    factor: (context) => context.viewportHeight / 100,
  },
  {
    value: "%",
    label: "Percent (%)",
    factor: (context) => context.percentageReference / 100,
  },
];

const converterConfigs: Record<ConverterId, ConverterConfig> = {
  "length-converter": {
    id: "length-converter",
    title: "Length Converter",
    icon: Ruler,
    units: lengthUnits,
    initialFrom: "m",
    initialTo: "ft",
    footer: "Conversions use exact or standard international unit definitions.",
  },
  "weight-converter": {
    id: "weight-converter",
    title: "Weight Converter",
    icon: Weight,
    units: weightUnits,
    initialFrom: "kg",
    initialTo: "lb",
    footer: "Mass units use the kilogram as the common reference.",
  },
  "volume-converter": {
    id: "volume-converter",
    title: "Volume Converter",
    icon: FlaskConical,
    units: volumeUnits,
    initialFrom: "l",
    initialTo: "gal",
    footer: "US customary and Imperial gallons are different units.",
  },
  "area-converter": {
    id: "area-converter",
    title: "Area Converter",
    icon: Square,
    units: areaUnits,
    initialFrom: "m2",
    initialTo: "ft2",
    footer: "Area conversions use square meters as the common reference.",
  },
  "speed-converter": {
    id: "speed-converter",
    title: "Speed Converter",
    icon: Gauge,
    units: speedUnits,
    initialFrom: "km/h",
    initialTo: "mph",
    footer: "Speed conversions use meters per second as the common reference.",
  },
  "data-storage": {
    id: "data-storage",
    title: "Data Storage Converter",
    icon: HardDrive,
    units: dataUnits,
    initialFrom: "GB",
    initialTo: "GiB",
    footer:
      "KB, MB, GB, and TB use decimal multiples; KiB, MiB, GiB, and TiB use binary multiples.",
  },
  "energy-converter": {
    id: "energy-converter",
    title: "Energy Converter",
    icon: Zap,
    units: energyUnits,
    initialFrom: "kWh",
    initialTo: "J",
    footer:
      "Food Calories are kilocalories (kcal); small calories (cal) differ.",
  },
  "frequency-converter": {
    id: "frequency-converter",
    title: "Frequency Converter",
    icon: Waves,
    units: frequencyUnits,
    initialFrom: "Hz",
    initialTo: "rpm",
    footer: "RPM converts rotations per minute to cycles per second (Hz).",
  },
  "css-unit-converter": {
    id: "css-unit-converter",
    title: "CSS Unit Converter",
    icon: Palette,
    units: cssUnits,
    initialFrom: "px",
    initialTo: "rem",
    footer:
      "Relative-unit results depend on the font, viewport, and percentage reference sizes entered above.",
    needsCssContext: true,
  },
};

const cssContextFields = [
  { key: "rootFontSize", label: "Root font size (px)", initialValue: "16" },
  { key: "parentFontSize", label: "Parent font size (px)", initialValue: "16" },
  { key: "viewportWidth", label: "Viewport width (px)", initialValue: "1440" },
  { key: "viewportHeight", label: "Viewport height (px)", initialValue: "900" },
  {
    key: "percentageReference",
    label: "Percentage reference (px)",
    initialValue: "100",
  },
] as const;

type CssContextField = (typeof cssContextFields)[number]["key"];
type CssContextValues = Record<CssContextField, string>;

const initialCssContext: CssContextValues = {
  rootFontSize: "16",
  parentFontSize: "16",
  viewportWidth: "1440",
  viewportHeight: "900",
  percentageReference: "100",
};

function getUnitFactor(
  unit: UnitDefinition,
  context: CssConversionContext,
): number {
  return typeof unit.factor === "number" ? unit.factor : unit.factor(context);
}

function UnitConverter({ config }: { config: ConverterConfig }) {
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState(config.initialFrom);
  const [to, setTo] = useState(config.initialTo);
  const [cssContextValues, setCssContextValues] =
    useState<CssContextValues>(initialCssContext);

  const context = {
    rootFontSize: Number(cssContextValues.rootFontSize),
    parentFontSize: Number(cssContextValues.parentFontSize),
    viewportWidth: Number(cssContextValues.viewportWidth),
    viewportHeight: Number(cssContextValues.viewportHeight),
    percentageReference: Number(cssContextValues.percentageReference),
  };
  const contextIsValid =
    !config.needsCssContext ||
    Object.values(context).every(
      (dimension) => Number.isFinite(dimension) && dimension > 0,
    );
  const numericValue = Number(value);
  const fromUnit = config.units.find((unit) => unit.value === from);
  const toUnit = config.units.find((unit) => unit.value === to);
  const sourceFactor = fromUnit ? getUnitFactor(fromUnit, context) : 0;
  const targetFactor = toUnit ? getUnitFactor(toUnit, context) : 0;
  const convertedValue =
    value.trim() !== "" &&
    Number.isFinite(numericValue) &&
    contextIsValid &&
    sourceFactor > 0 &&
    targetFactor > 0
      ? (numericValue * sourceFactor) / targetFactor
      : null;
  const result =
    convertedValue !== null && Number.isFinite(convertedValue)
      ? new Intl.NumberFormat(undefined, {
          maximumSignificantDigits: 10,
        }).format(convertedValue)
      : "—";

  const changeUnit = (key: "from" | "to", nextValue: string) => {
    if (!config.units.some((unit) => unit.value === nextValue)) return;
    if (key === "from") setFrom(nextValue);
    else setTo(nextValue);
  };

  const swapUnits = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <ToolCard
      icon={config.icon}
      title={config.title}
      badge="Convert"
      footer={
        <p className="text-xs text-on-surface-variant">{config.footer}</p>
      }
    >
      <label
        htmlFor={`${config.id}-value`}
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Value
      </label>
      <Input
        id={`${config.id}-value`}
        type="number"
        step="any"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="bg-surface-low"
      />

      {config.needsCssContext && (
        <fieldset className="mt-4">
          <legend className="mb-2 text-xs font-semibold text-on-surface-variant">
            Relative unit context
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {cssContextFields.map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <label
                  htmlFor={`${config.id}-${key}`}
                  className="text-xs text-on-surface-variant"
                >
                  {label}
                </label>
                <Input
                  id={`${config.id}-${key}`}
                  type="number"
                  min="0"
                  step="any"
                  value={cssContextValues[key]}
                  onChange={(event) =>
                    setCssContextValues((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                  className="bg-surface-low"
                />
              </div>
            ))}
          </div>
          {!contextIsValid && (
            <p role="alert" className="mt-2 text-xs text-destructive">
              Context dimensions must be greater than zero.
            </p>
          )}
        </fieldset>
      )}

      <div className="mt-3 grid grid-cols-[1fr_auto] items-end gap-2">
        <div className="space-y-1.5">
          <label
            htmlFor={`${config.id}-from`}
            className="text-xs font-semibold text-on-surface-variant"
          >
            From
          </label>
          <Select
            value={from}
            onValueChange={(next) => changeUnit("from", next)}
          >
            <SelectTrigger id={`${config.id}-from`} className="bg-surface-low">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {config.units.map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={swapUnits}
          aria-label="Swap units"
          className="mb-0.5"
        >
          <ArrowLeftRight className="size-4" />
        </Button>
        <div className="col-span-2 space-y-1.5">
          <label
            htmlFor={`${config.id}-to`}
            className="text-xs font-semibold text-on-surface-variant"
          >
            To
          </label>
          <Select value={to} onValueChange={(next) => changeUnit("to", next)}>
            <SelectTrigger id={`${config.id}-to`} className="bg-surface-low">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {config.units.map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <output
        aria-live="polite"
        className="mt-4 block rounded-xl bg-primary/5 p-4"
      >
        <span className="text-xs font-semibold text-on-surface-variant">
          Converted value
        </span>
        <span className="mt-1 block break-all font-heading text-2xl font-bold text-primary">
          {result}
          {result !== "—" && toUnit ? ` ${toUnit.value}` : ""}
        </span>
      </output>
    </ToolCard>
  );
}

export function LengthConverter() {
  return <UnitConverter config={converterConfigs["length-converter"]} />;
}

export function WeightConverter() {
  return <UnitConverter config={converterConfigs["weight-converter"]} />;
}

export function VolumeConverter() {
  return <UnitConverter config={converterConfigs["volume-converter"]} />;
}

export function AreaConverter() {
  return <UnitConverter config={converterConfigs["area-converter"]} />;
}

export function SpeedConverter() {
  return <UnitConverter config={converterConfigs["speed-converter"]} />;
}

export function DataStorageConverter() {
  return <UnitConverter config={converterConfigs["data-storage"]} />;
}

export function EnergyConverter() {
  return <UnitConverter config={converterConfigs["energy-converter"]} />;
}

export function FrequencyConverter() {
  return <UnitConverter config={converterConfigs["frequency-converter"]} />;
}

export function CssUnitConverter() {
  return <UnitConverter config={converterConfigs["css-unit-converter"]} />;
}
