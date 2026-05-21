import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email болон нууц үг шаардлагатай" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Email эсвэл нууц үг буруу байна" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Email эсвэл нууц үг буруу байна" });
    }

    res.json({
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone || "",
    });
  } catch (err) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

export default router;
