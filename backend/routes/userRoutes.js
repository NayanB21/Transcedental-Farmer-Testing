const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

const jwt =
require("jsonwebtoken");

router.post("/signup", async(req,res)=>{
  console.log("[SIGNUP] Request received:", req.body);
  try{
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      console.log("[SIGNUP] Missing fields");
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({phone});
    if(existing){
      console.log("[SIGNUP] User already exists:", phone);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, phone, password: hashed });
    console.log("[SIGNUP] User created successfully:", user._id);
    res.status(201).json(user);

  } catch(err){
    console.error("[SIGNUP] ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});


router.post("/login", async (req, res) => {
  console.log("[LOGIN] Request received:", req.body?.phone);
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      console.log("[LOGIN] User not found:", phone);
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("[LOGIN] Wrong password for:", phone);
      return res.status(400).json({ message: "Wrong Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log("[LOGIN] Login successful:", user._id);
    res.json({ token, user: { _id: user._id, name: user.name, phone: user.phone } });

  } catch (err) {
    console.error("[LOGIN] ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;