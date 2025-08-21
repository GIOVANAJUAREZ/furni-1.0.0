// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../DB/config");

const router = express.Router();

// =================== LOGIN ===================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: "error", error: "Datos incompletos" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ status: "error", error: "Usuario no encontrado" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ status: "error", error: "Contraseña incorrecta" });
    }

    res.json({
      status: "success",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
});

// =================== REGISTER ===================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: "error", error: "Datos incompletos" });
    }

    // Verificar si ya existe el usuario
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ status: "error", error: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())",
      [name, email, hashedPassword]
    );

    res.json({ status: "success", message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error en register:", err);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
});

module.exports = router;
