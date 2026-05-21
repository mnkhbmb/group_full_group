import { Router } from "express";
import { Property } from "../models/Property.js";

const router = Router();

// Бүх байр авах
router.get("/", async (_req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: "Өгөгдөл татахад алдаа гарлаа" });
  }
});

// Нэг байр авах
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "Олдсонгүй" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: "Алдаа гарлаа" });
  }
});

// Байр нэмэх
router.post("/", async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Байр шинэчлэх
router.put("/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!property) return res.status(404).json({ error: "Олдсонгүй" });
    res.json(property);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Байр устгах
router.delete("/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ error: "Олдсонгүй" });
    res.json({ message: "Амжилттай устгалаа" });
  } catch (err) {
    res.status(500).json({ error: "Алдаа гарлаа" });
  }
});

export default router;
