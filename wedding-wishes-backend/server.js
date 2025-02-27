const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "wedding_wishes"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

app.get("/wishes", (req, res) => {
    db.query("SELECT * FROM wishes", (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

app.post("/wishes", (req, res) => {
    const { name, message } = req.body;
    if (!name || !message) {
        return res.status(400).json({ error: "Name and message are required" });
    }

    db.query("INSERT INTO wishes (name, message) VALUES (?, ?)", [name, message], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: result.insertId, name, message });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
