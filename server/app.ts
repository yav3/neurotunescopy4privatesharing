import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import streamRouter from "./routes/stream.js";
import tracksRouter from "./routes/tracks.js";

const app = express();

const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (corsOrigins.length === 0 || corsOrigins.some(o => origin.endsWith(o) || origin === o)) {
        return cb(null, true);
      }
      return cb(new Error(`CORS blocked: ${origin}`), false);
    },
    methods: ["GET", "HEAD", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Range"],
    maxAge: 86400,
  })
);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
app.use(morgan("tiny"));
app.set("trust proxy", true);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    ts: new Date().toISOString(),
    stream_backend: process.env.STREAM_BACKEND || "HTTP",
  });
});

// Streaming (Range-aware)
app.use("/api/stream", streamRouter);

// Track search
app.use("/api/tracks", tracksRouter);

export default app;