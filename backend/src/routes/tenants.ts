import { Router } from "express";
import { Tenant } from "../models/Tenant.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const tenants = await Tenant.find().sort({ createdAt: -1 });
    res.json(tenants);
  } catch {
    res.status(500).json({ error: "Өгөгдөл татахад алдаа гарлаа" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ error: "Олдсонгүй" });
    res.json(tenant);
  } catch {
    res.status(500).json({ error: "Алдаа гарлаа" });
  }
});

router.post("/", async (req, res) => {
  try {
    const tenant = new Tenant(req.body);
    await tenant.save();
    res.status(201).json(tenant);
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Энэ гэрээний дугаар аль хэдийн бүртгэгдсэн байна" });
    }
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    // Гэрээний дугаар өөрчлөгдсөн бол өөр түрээслэгчтэй давхцаж байгаа эсэхийг шалгана
    if (req.body.contractNumber) {
      const conflict = await Tenant.findOne({
        contractNumber: req.body.contractNumber,
        _id: { $ne: req.params.id },
      });
      if (conflict) {
        return res.status(400).json({ error: "Энэ гэрээний дугаар аль хэдийн бүртгэгдсэн байна" });
      }
    }
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: false,
    });
    if (!tenant) return res.status(404).json({ error: "Олдсонгүй" });
    res.json(tenant);
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Энэ гэрээний дугаар аль хэдийн бүртгэгдсэн байна" });
    }
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) return res.status(404).json({ error: "Олдсонгүй" });
    res.json({ message: "Амжилттай устгалаа" });
  } catch {
    res.status(500).json({ error: "Алдаа гарлаа" });
  }
});

export default router;
