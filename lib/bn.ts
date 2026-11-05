import type { Product } from "./types";

const nf = new Intl.NumberFormat("bn-BD");
const nf1 = new Intl.NumberFormat("bn-BD", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const toBn = (n: number) => nf.format(Math.round(n));
export const toBn1 = (n: number) => nf1.format(n);

export function parseBn(value: string | number): number {
  if (typeof value === "number") return value;
  const digits = "০১২৩৪৫৬৭৮৯";
  return Number(
    value.replace(/[০-৯]/g, (d) => String(digits.indexOf(d))).replace(/[,\s]/g, "")
  );
}

export function unitLabel(unit: string): string {
  const u = unit.toLowerCase();
  if (["kg", "কেজি"].includes(u)) return "প্রতি কেজি";
  if (["litre", "liter", "l", "লিটার"].includes(u)) return "প্রতি লিটার";
  if (["dozen", "doz", "ডজন"].includes(u)) return "প্রতি ডজন";
  if (["piece", "pc", "pcs", "পিস"].includes(u)) return "প্রতি পিস";
  if (["hali", "হালি"].includes(u)) return "প্রতি হালি";
  return `প্রতি ${unit}`;
}

export function getChange(p: Product): { dir: "up" | "down" | "flat"; pct: number } {
  if (p.change) return { dir: p.change.dir, pct: Math.abs(p.change.pct) };
  if (!p.yesterday) return { dir: "flat", pct: 0 };
  const pct = Math.round(((p.today - p.yesterday) / p.yesterday) * 1000) / 10;
  return { dir: pct > 0 ? "up" : pct < 0 ? "down" : "flat", pct: Math.abs(pct) };
}

export function bnToday(): string {
  return new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
