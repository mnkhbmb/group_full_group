export interface PropertyRecord {
  id: string;
  objectName: string;
  floor: string;
  areaId: string;
  areaSize: number;
  rentalAmount: number;
  pricePerSqm: number;
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
    status: "rented",
    createdAt: "2024-03-25",
  },
];
