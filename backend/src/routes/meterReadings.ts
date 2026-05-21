import { Router } from "express";
import { MeterReading } from "../models/MeterReading.js";

const router = Router();

// Бүх уншилт авах (period болон tenantId-аар шүүж болно)
router.get("/", async (req, res) => {
  try {
    const filter: Record<string, string> = {};
    if (req.query.period) filter.period = String(req.query.period);
    if (req.query.tenantId) filter.tenantId = String(req.query.tenantId);
    const readings = await MeterReading.find(filter).sort({ period: -1, tenantId: 1 });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: "Өгөгдөл татахад алдаа гарлаа" });
  }
});

// Нэг сарын бүх уншилт авах
router.get("/:period", async (req, res) => {
  try {
    const readings = await MeterReading.find({ period: req.params.period });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: "Алдаа гарлаа" });
  }
});

// Upsert — period + tenantId байвал шинэчлэх, байхгүй бол үүсгэх
router.put("/:period/:tenantId", async (req, res) => {
  try {
    const reading = await MeterReading.findOneAndUpdate(
      { period: req.params.period, tenantId: req.params.tenantId },
      { ...req.body, period: req.params.period, tenantId: req.params.tenantId },
      { upsert: true, new: true, runValidators: true }
    );
    res.json(reading);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:period/:tenantId", async (req, res) => {
  try {
    await MeterReading.findOneAndDelete({
      period: req.params.period,
      tenantId: req.params.tenantId,
    });
    res.json({ message: "Амжилттай устгалаа" });
  } catch (err) {
    res.status(500).json({ error: "Алдаа гарлаа" });
  }
});

export default router;
