import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import path from "path";
import fs from "fs";
import { startTCPServer } from "./tcpserver.js";

const PORT = 3000;
const UPLOADS_DIR = "./uploads/";
const TINYURL_API_KEY = "Ca5ttdBHh9d1EmtdTw9gLGGKYZ9pREMEctWl0Sk17OIvRBFkcyyCn";

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// Setup Express
const app = express();
app.use(express.static("public"));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// Serve UI
app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Upload & Generate TinyURL
app.post("/upload", upload.single("file"), async (req, res) => {
    const fileUrl = `http://localhost:${PORT}/download/${req.file.filename}`;
    const tinyUrl = await shortenUrl(fileUrl);
    res.json({ url: tinyUrl });
});

// Serve downloads
app.get("/download/:filename", (req, res) => {
    const filePath = path.join(UPLOADS_DIR, req.params.filename);
    res.download(filePath);
});

// TinyURL API function
async function shortenUrl(url) {
    try {
        const response = await fetch("https://api.tinyurl.com/create", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${TINYURL_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
        });

        const data = await response.json();
        return data.data.tiny_url || url;
    } catch (error) {
        console.error("TinyURL Error:", error);
        return url;
    }
}

// Start TCP Server (file sharing)
startTCPServer();

// Start HTTP Server
app.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}`);
});
