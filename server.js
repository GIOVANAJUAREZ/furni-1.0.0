const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3306;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Para servir archivos HTML, JS, CSS

// Conexión MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tienda",
    port: 3306
});

db.connect(err => {
    if (err) throw err;
    console.log("Conectado a MySQL");
});

// Obtener carrito
app.get("/api/carrito", (req, res) => {
    db.query("SELECT * FROM carrito", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Guardar carrito
app.post("/api/carrito", (req, res) => {
    const cart = req.body;

    db.query("TRUNCATE TABLE carrito", err => {
        if (err) return res.status(500).json(err);

        if (cart.length === 0) return res.json({ status: "success", message: "Carrito vacío" });

        const stmt = "INSERT INTO carrito (producto_id, nombre, precio, cantidad, imagen) VALUES ?";
        const values = cart.map(item => [item.id || item.producto_id || null, item.title || item.nombre, item.price || item.precio, item.quantity || item.cantidad, item.image || item.imagen]);

        db.query(stmt, [values], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ status: "success", message: "Carrito guardado" });
        });
    });
});

// Vaciar carrito
app.delete("/api/carrito", (req, res) => {
    db.query("TRUNCATE TABLE carrito", err => {
        if (err) return res.status(500).json(err);
        res.json({ status: "success", message: "Carrito vaciado" });
    });
});

app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
