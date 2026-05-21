import { Router } from "express";
import { Tenant } from "../models/Tenant.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const tenants = await Tenant.find().sort({ tenantId: 1 });
    res.json(tenants);
  } catch (err) {
    res.status(500).json({ error: "Өгөгдөл татахад алдаа гарлаа" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ tenantId: req.params.id });
    if (!tenant) return res.status(404).json({ error: "Олдсонгүй" });
    res.json(tenant);
  } catch (err) {
    res.status(500).json({ error: "Алдаа гарлаа" });
  }
});

router.post("/", async (req, res) => {
  try {
    const tenant = new Tenant(req.body);
    await tenant.save();
    res.status(201).json(tenant);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const tenant = await Tenant.findOneAndUpdate(
      { tenantId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!tenant) return res.status(404).json({ error: "Олдсонгүй" });
    res.json(tenant);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const tenant = await Tenant.findOneAndDelete({ tenantId: req.params.id });
    if (!tenant) return res.status(404).json({ error: "Олдсонгүй" });
    res.json({ message: "Амжилттай устгалаа" });
  } catch (err) {
    res.status(500).json({ error: "Алдаа гарлаа" });
  }
});

export default router;
