import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

const router = Router();

// Бүх хэрэглэгч (нууц үггүйгээр)
router.get("/", async (_req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json(users);
  } catch {
    res.status(500).json({ error: "Алдаа гарлаа" });
  }
});

// Шинэ хэрэглэгч үүсгэх
router.post("/", async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Энэ email аль хэдийн бүртгэлтэй байна" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name, role });
    res.status(201).json({ _id: user._id, email: user.email, name: user.name, role: user.role });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Хэрэглэгч засах
router.put("/:id", async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const update: any = { ...rest };
    if (password) update.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, select: "-password" });
    if (!user) return res.status(404).json({ error: "Олдсонгүй" });
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Хэрэглэгч устгах
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Устгалаа" });
  } catch {
    res.status(500).json({ error: "Алдаа гарлаа" });
  }
});

// Нууц үг солих (өөрийнхөө)
router.post("/change-password", async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(401).json({ error: "Одоогийн нууц үг буруу байна" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Нууц үг амжилттай солигдлоо" });
  } catch {
    res.status(500).json({ error: "Алдаа гарлаа" });
  }
});

export default router;
