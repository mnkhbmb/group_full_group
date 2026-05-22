import { Router } from "express";
import { BuildingObject } from "../models/BuildingObject.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const objects = await BuildingObject.find().sort({ name: 1 });
    res.json(objects);
  } catch {
    res.status(500).json({ error: "Алдаа гарлаа" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Нэр шаардлагатай" });
    const exists = await BuildingObject.findOne({ name: name.trim() });
    if (exists) return res.status(400).json({ error: "Энэ объект бүртгэгдсэн байна" });
    const obj = await BuildingObject.create({ name: name.trim() });
    res.status(201).json(obj);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await BuildingObject.findByIdAndDelete(req.params.id);
    res.json({ message: "Устгалаа" });
  } catch {
    res.status(500).json({ error: "Алдаа гарлаа" });
  }
});

export default router;
