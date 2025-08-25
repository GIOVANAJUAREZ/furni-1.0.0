const express = require("express");
require("dotenv").config();
const db = require("./DB/config.js");
const auth = require("./routes/auth.js");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.WEBPORT;
        this.WEBHOST = process.env.HOST;
        this.db = db;
        this.middlewares();
        this.routes();
    }  
    middlewares() {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(express.static(__dirname)); // Para servir archivos HTML, JS, CSS
    } 

    routes() {
        //Vistas de paginas
        this.app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "index.html"));
        });
        this.app.get("/about", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "about.html"));
        });
        this.app.get("/blog", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "blog.html"));
        });
        this.app.get("/shop", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "shop.html"));
        });
        this.app.get("/services", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "services.html"));
        });
        this.app.get("/contact", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "contact.html"));
        });
        this.app.get("/cart", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "cart.html"));
        });
        this.app.get("/thanks", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "thankyou.html"));
        });
        this.app.get("/checkout", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "checkout.html"));
        });
        this.app.get("/client", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "login-register.html"));
        });
        this.app.get("/preview", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "preview.html"));
        });
       /* this.app.use((req, res) => {
             res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
        });     */

        //login
        this.app.use("/auth", auth);
         
        // Obtener carrito
        this.app.get("/api/carrito", (req, res) => {
            db.query("SELECT * FROM carrito", (err, results) => {
                if (err) return res.status(500).json(err);
                res.json(results);
            });
        });

        // Guardar carrito
        this.app.post("/api/carrito", (req, res) => {
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
        this.app.delete("/api/carrito", (req, res) => {
            db.query("TRUNCATE TABLE carrito", err => {
                if (err) return res.status(500).json(err);
                res.json({ status: "success", message: "Carrito vaciado" });
            });
        });
        
    }
    listen() {
            this.app.listen(this.port, () => {
                console.log(`Server running on http://${this.WEBHOST}:${this.port}`);
            });
    }
}


const server = new Server();
server.listen();