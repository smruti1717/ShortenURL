const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function loadData() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({}), "utf8");
    }
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

function generateCode() {
    return Math.random().toString(36).substring(2, 8);
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/shorten", (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({ error: "URL is required" });
    }

    const data = loadData();
    const code = generateCode();

    data[code] = longUrl;
    saveData(data);

    const baseUrl = req.protocol + "://" + req.get("host");

    res.json({
        shortUrl: `${baseUrl}/${code}`
    });
});

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