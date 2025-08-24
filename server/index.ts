import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ message: ping });
  });

  // Demo route
  app.get("/api/demo", handleDemo);

  // 404 handler for API routes
  app.use("/api/*", (_req, res) => {
    res.status(404).json({
      error: "API endpoint not found",
      message: "Please check the API documentation for available endpoints",
    });
  });

  // Global error handler
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("Unhandled error:", err);

      res.status(err.status || 500).json({
        error:
          process.env.NODE_ENV === "production"
            ? "Internal server error"
            : err.message,
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
      });
    },
  );

  return app;
}
