const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = "data.json";

// Load saved URLs
function loadData() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({}));
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
}

// Save URLs
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Generate short code
function generateCode() {
    return Math.random().toString(36).substring(2, 8);
}

// API to shorten URL
app.post("/shorten", (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({ error: "URL is required" });
    }

    const data = loadData();
    const code = generateCode();

    data[code] = longUrl;
    saveData(data);

    res.json({
        shortUrl: `http://localhost:${PORT}/${code}`
    });
});

// Redirect route
app.get("/:code", (req, res) => {
    const data = loadData();
    const longUrl = data[req.params.code];

    if (longUrl) {
        res.redirect(longUrl);
    } else {
        res.status(404).send("Short URL not found");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});