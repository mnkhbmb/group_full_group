import type { UtilityUsage } from "@/data/properties";

/**
 * Тоон хэмжүүрийн уншилт — нийт хуримтлагдсан утга (cumulative reading).
 * Сар бүрийн зарцуулалт = (тухайн сарын уншилт) − (өмнөх сарын уншилт).
 */
export interface MeterReading extends UtilityUsage {}

/** tenantId → "YYYY-MM" → уншилт */
export type MeterStore = Record<string, Record<string, MeterReading>>;

/** Эхлэлийн жишээ өгөгдөл (cumulative readings) */
export const initialMeterStore: MeterStore = {
  "T-01": {
    "2024-05": { hotWater: 120.0, coldWater: 200.0, heating: 80.0, electricity: 1200 },
    "2024-06": { hotWater: 124.2, coldWater: 206.5, heating: 92.0, electricity: 1520 },
  },
  "T-02": {
    "2024-05": { hotWater: 180.0, coldWater: 300.0, heating: 130.0, electricity: 2000 },
    "2024-06": { hotWater: 186.0, coldWater: 309.1, heating: 148.5, electricity: 2480 },
  },
  "T-03": {
    "2024-05": { hotWater: 250.0, coldWater: 400.0, heating: 200.0, electricity: 3500 },
    "2024-06": { hotWater: 259.5, coldWater: 414.2, heating: 228.0, electricity: 4220 },
  },
};

/** Сарны өмнөх сарыг буцаана: "2024-07" → "2024-06" */
export function previousMonth(period: string): string {
  const [y, m] = period.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Тухайн сарын зарцуулалтыг (өмнөх сартай харьцуулан) тооцоолно.
 * Хэрэв өмнөх сарын уншилт байхгүй бол одоогийн уншилтыг буцаана.
 */
export function calcConsumption(
  current: MeterReading | undefined,
  previous: MeterReading | undefined,
): UtilityUsage {
  if (!current) return { hotWater: 0, coldWater: 0, heating: 0, electricity: 0 };
  if (!previous) {
    return {
      hotWater: current.hotWater,
      coldWater: current.coldWater,
      heating: current.heating,
      electricity: current.electricity,
    };
  }
  return {
    hotWater: Math.max(0, current.hotWater - previous.hotWater),
    coldWater: Math.max(0, current.coldWater - previous.coldWater),
    heating: Math.max(0, current.heating - previous.heating),
    electricity: Math.max(0, current.electricity - previous.electricity),
  };
}
