import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "wearloop_db.json");

// Increase JSON body limit to support compressed base64 images uploaded by users
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Helper to read database safely
function readDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to read DB file:", e);
    }
  }
  return null;
}

// Helper to write database safely
function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Failed to write DB file:", e);
    return false;
  }
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Sync GET: retrieve current server state
app.get("/api/sync", (req, res) => {
  const dbData = readDB();
  if (dbData) {
    res.json({ hasData: true, data: dbData });
  } else {
    res.json({ hasData: false });
  }
});

// Sync POST: save entire state to disk
app.post("/api/sync", (req, res) => {
  const data = req.body;
  if (data && typeof data === "object") {
    const success = writeDB(data);
    res.json({ success });
  } else {
    res.status(400).json({ success: false, error: "Invalid data payload" });
  }
});

async function startServer() {
  // Vite middleware setup for Development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in Production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[WearLoop Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
