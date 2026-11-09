"use client";

import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { ToolCard } from "@/components/landing-page/quick-tools/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PasswordStrength() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const checks = useMemo(
    () => [
      { label: "At least 12 characters", passes: password.length >= 12 },
      {
        label: "At least 16 characters (recommended)",
        passes: password.length >= 16,
      },
      {
        label: "Includes lowercase and uppercase letters",
        passes: /[a-z]/.test(password) && /[A-Z]/.test(password),
      },
      { label: "Includes a number", passes: /\d/.test(password) },
      { label: "Includes a symbol", passes: /[^\p{L}\p{N}\s]/u.test(password) },
    ],
    [password],
  );
  const passed = checks.filter((check) => check.passes).length;
  const rating =
    password.length === 0
      ? "Enter a password"
      : passed >= 4
        ? "Good foundations"
        : passed >= 2
          ? "Could be stronger"
          : "Needs improvement";

  return (
    <ToolCard
      icon={ShieldCheck}
      title="Password Strength"
      badge="Security"
      footer={
        <p className="text-xs leading-relaxed text-on-surface-variant">
          This is a basic local checklist, not a security guarantee. It does not
          check breached-password lists or account-specific risks. Never reuse
          passwords.
        </p>
      }
    >
      <label
        htmlFor="password-strength-input"
        className="mb-1.5 text-xs font-semibold text-on-surface-variant"
      >
        Password to check
      </label>
      <div className="relative">
        <Input
          id="password-strength-input"
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Your password is not saved by this tool"
          className="bg-surface-low pr-12"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
          className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </Button>
      </div>
      <div aria-live="polite" className="mt-4 rounded-xl bg-primary/5 p-4">
        <p className="text-xs font-semibold text-on-surface-variant">
          Checklist result
        </p>
        <p className="mt-1 font-heading text-lg font-bold text-primary">
          {rating}
        </p>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-high"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(passed / checks.length) * 100}%` }}
          />
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {checks.map((check) => (
          <li
            key={check.label}
            className="flex items-center gap-2 text-xs text-on-surface-variant"
          >
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${
                check.passes ? "bg-emerald-500" : "bg-outline/40"
              }`}
            />
            {check.label}
          </li>
        ))}
      </ul>
    </ToolCard>
  );
}
