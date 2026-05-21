export interface PropertyRecord {
  id: string;
  objectName: string;
  floor: string;
  areaId: string;
  areaSize: number;
  rentalAmount: number;
  pricePerSqm: number;
  /** Менежментийн төлбөр (₮/м²) */
  managementFeePerSqm: number;
  status: "rented" | "vacant";
  createdAt: string;
}

export const mainObjects = [
  "Скай Тауэр",
  "Блү Мон Тауэр",
  "Сэнтрал Тауэр",
  "Шангри-Ла Молл",
  "Их Монгол Тауэр",
];

export const propertyData: PropertyRecord[] = [
  {
    id: "1",
    objectName: "Скай Тауэр",
    floor: "12",
    areaId: "A-1201",
    areaSize: 85,
    rentalAmount: 2550000,
    pricePerSqm: 30000,
    managementFeePerSqm: 5000,
    status: "rented",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    objectName: "Блү Мон Тауэр",
    floor: "5",
    areaId: "B-0503",
    areaSize: 120,
    rentalAmount: 4200000,
    pricePerSqm: 35000,
    managementFeePerSqm: 6000,
    status: "rented",
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    objectName: "Сэнтрал Тауэр",
    floor: "8",
    areaId: "C-0801",
    areaSize: 200,
    rentalAmount: 7000000,
    pricePerSqm: 35000,
    managementFeePerSqm: 6000,
    status: "rented",
    createdAt: "2024-02-20",
  },
  {
    id: "4",
    objectName: "Шангри-Ла Молл",
    floor: "1",
    areaId: "D-0105",
    areaSize: 45,
    rentalAmount: 2250000,
    pricePerSqm: 50000,
    managementFeePerSqm: 8000,
    status: "vacant",
    createdAt: "2024-03-10",
  },
  {
    id: "5",
    objectName: "Их Монгол Тауэр",
    floor: "15",
    areaId: "E-1502",
    areaSize: 150,
    rentalAmount: 4500000,
    pricePerSqm: 30000,
    managementFeePerSqm: 5000,
    status: "rented",
    createdAt: "2024-03-25",
  },
];

// =============== Тарифын тохиргоо ===============
/** Нэгж хэрэглээний тариф (₮) */
export const utilityRates = {
  /** ₮ / м³ */
  hotWater: 3200,
  /** ₮ / м³ */
  coldWater: 1800,
  /** ₮ / м³ */
  heating: 2400,
  /** ₮ / kWh */
  electricity: 280,
};

export interface UtilityUsage {
  hotWater: number;
  coldWater: number;
  heating: number;
  electricity: number;
}

/** Хэрэглээний дүнг (зөрүү) тариф ашиглан мөнгөн дүн болгоно */
export function calcUtilityCost(usage: UtilityUsage): number {
  return (
    usage.hotWater * utilityRates.hotWater +
    usage.coldWater * utilityRates.coldWater +
    usage.heating * utilityRates.heating +
    usage.electricity * utilityRates.electricity
  );
}
