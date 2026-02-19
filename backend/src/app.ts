import express from "express";
import cors from "cors";
import { postsRouter } from "./routes/posts";

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs}ms)`);
  });
  next();
});

app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

app.use("/api", postsRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
