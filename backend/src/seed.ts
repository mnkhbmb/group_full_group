import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./db.js";
import { Property } from "./models/Property.js";
import { Tenant } from "./models/Tenant.js";
import { MeterReading } from "./models/MeterReading.js";
import { User } from "./models/User.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ubgroup";

await connectDB(MONGODB_URI);

// ── Хуучин өгөгдөл цэвэрлэх ──────────────────────────────
await Property.deleteMany({});
await Tenant.deleteMany({});
await MeterReading.deleteMany({});
await User.deleteMany({});

// ── Нууц үг hash хийх ────────────────────────────────────
const SALT = 10;

const hash = (plain: string) => bcrypt.hash(plain, SALT);

// ── Хэрэглэгчид ──────────────────────────────────────────
await User.insertMany([
  { email: "munkhbymba0217@gmail.com", password: await hash("Pass123$"), name: "Bymbaa",        role: "admin" },
  { email: "admin",                    password: await hash("pass123$"),  name: "Админ",         role: "admin" },
  { email: "gm",                       password: await hash("pass123$"),  name: "Б.Энхбат",      role: "general_manager" },
  { email: "sales",                    password: await hash("pass123$"),  name: "Г.Сараа",       role: "sales_manager" },
  { email: "engineer",                 password: await hash("pass123$"),  name: "Д.Тэмүүлэн",   role: "engineer" },
  { email: "accountant",               password: await hash("pass123$"),  name: "О.Дэлгэрмаа",  role: "accountant" },
]);
console.log("✓ Хэрэглэгчид (bcrypt hash-тай) оруулав");

// ── Байрны өгөгдөл ────────────────────────────────────────
await Property.insertMany([
  { objectName: "Скай Тауэр",       floor: "12", areaId: "A-1201", areaSize: 85,  rentalAmount: 2550000, pricePerSqm: 30000, managementFeePerSqm: 5000, status: "rented" },
  { objectName: "Блү Мон Тауэр",   floor: "5",  areaId: "B-0503", areaSize: 120, rentalAmount: 4200000, pricePerSqm: 35000, managementFeePerSqm: 6000, status: "rented" },
  { objectName: "Сэнтрал Тауэр",   floor: "8",  areaId: "C-0801", areaSize: 200, rentalAmount: 7000000, pricePerSqm: 35000, managementFeePerSqm: 6000, status: "rented" },
  { objectName: "Шангри-Ла Молл",  floor: "1",  areaId: "D-0105", areaSize: 45,  rentalAmount: 2250000, pricePerSqm: 50000, managementFeePerSqm: 8000, status: "vacant" },
  { objectName: "Их Монгол Тауэр", floor: "15", areaId: "E-1502", areaSize: 150, rentalAmount: 4500000, pricePerSqm: 30000, managementFeePerSqm: 5000, status: "rented" },
]);

// ── Түрээслэгчид ──────────────────────────────────────────
await Tenant.insertMany([
  { tenantId: "T-01", name: "Бат Дорж",     propertyIds: ["A-1201"] },
  { tenantId: "T-02", name: "Болд Сүхбат",  propertyIds: ["B-0503"] },
  { tenantId: "T-03", name: "Ган Тулга",    propertyIds: ["C-0801"] },
  { tenantId: "T-04", name: "Нар Мандах",   propertyIds: ["D-0105"] },
  { tenantId: "T-05", name: "Оюун Эрдэнэ", propertyIds: ["E-1502"] },
]);

// ── Тоолуурын уншилт ──────────────────────────────────────
await MeterReading.insertMany([
  { period: "2024-05", tenantId: "T-01", hotWater: 120.0, coldWater: 200.0, heating:  80.0, electricity: 1200 },
  { period: "2024-05", tenantId: "T-02", hotWater: 180.0, coldWater: 300.0, heating: 130.0, electricity: 2000 },
  { period: "2024-05", tenantId: "T-03", hotWater: 250.0, coldWater: 400.0, heating: 200.0, electricity: 3500 },
  { period: "2024-06", tenantId: "T-01", hotWater: 124.2, coldWater: 206.5, heating:  92.0, electricity: 1520 },
  { period: "2024-06", tenantId: "T-02", hotWater: 186.0, coldWater: 309.1, heating: 148.5, electricity: 2480 },
  { period: "2024-06", tenantId: "T-03", hotWater: 259.5, coldWater: 414.2, heating: 228.0, electricity: 4220 },
  { period: "2024-07", tenantId: "T-01", hotWater: 128.8, coldWater: 213.5, heating: 104.0, electricity: 1850 },
  { period: "2024-07", tenantId: "T-02", hotWater: 192.5, coldWater: 318.9, heating: 167.5, electricity: 2980 },
  { period: "2024-07", tenantId: "T-03", hotWater: 270.0, coldWater: 429.5, heating: 256.5, electricity: 4960 },
]);

console.log("✓ Байр, түрээслэгч, тоолуур оруулав");
console.log("✓ Seed бүгд амжилттай!");
process.exit(0);
