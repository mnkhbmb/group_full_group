import { useEffect, useState } from "react";
import { initialMeterStore, type MeterStore, type MeterReading } from "@/data/meterReadings";

/**
 * In-memory meter store.
 * localStorage ашиглахгүй — page refresh хийхэд initial seed-руу буцна.
 * Production-д MongoDB API (meterReadingsApi)-г ашиглана.
 */
let memoryStore: MeterStore = { ...initialMeterStore };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export function useMeterStore(): {
  store: MeterStore;
  setReading: (tenantId: string, period: string, reading: MeterReading) => void;
} {
  const [, setTick] = useState(0);

  useEffect(() => {
    const sync = () => setTick((t) => t + 1);
    listeners.add(sync);
    return () => { listeners.delete(sync); };
  }, []);

  const setReading = (tenantId: string, period: string, reading: MeterReading) => {
    memoryStore = {
      ...memoryStore,
      [period]: {
        ...(memoryStore[period] ?? {}),
        [tenantId]: reading,
      },
    };
    notify();
  };

  return { store: memoryStore, setReading };
}

export function getMeterStoreSnapshot(): MeterStore {
  return memoryStore;
}
