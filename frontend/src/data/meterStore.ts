import { useEffect, useState } from "react";
import { initialMeterStore, type MeterStore, type MeterReading } from "@/data/meterReadings";

const STORAGE_KEY = "ub_meter_readings_v1";

/** localStorage-оос store-г уншина (эсвэл seed-ийг буцаана) */
function loadStore(): MeterStore {
  if (typeof window === "undefined") return initialMeterStore;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialMeterStore;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as MeterStore;
  } catch {
    // ignore
  }
  return initialMeterStore;
}

function saveStore(store: MeterStore) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    // Notify other tabs/components in the same tab
    window.dispatchEvent(new CustomEvent("ub:meterstore:update"));
  } catch {
    // ignore
  }
}

/** Бүх компонентууд хооронд нэгдсэн meter store-той ажиллах hook */
export function useMeterStore(): {
  store: MeterStore;
  setReading: (tenantId: string, period: string, reading: MeterReading) => void;
} {
  const [store, setStore] = useState<MeterStore>(() => loadStore());

  useEffect(() => {
    const sync = () => setStore(loadStore());
    window.addEventListener("ub:meterstore:update", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ub:meterstore:update", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setReading = (tenantId: string, period: string, reading: MeterReading) => {
    const next: MeterStore = {
      ...store,
      [period]: {
        ...(store[period] ?? {}),
        [tenantId]: reading,
      },
    };
    saveStore(next);
    setStore(next);
  };

  return { store, setReading };
}

/** React-аас гадуур (helper-уудад) одоогийн store-г шууд уншихад зориулсан */
export function getMeterStoreSnapshot(): MeterStore {
  return loadStore();
}
