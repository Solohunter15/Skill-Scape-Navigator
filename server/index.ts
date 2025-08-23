import "dotenv/config";
import express from "express";
import cors from "cors";
import { testConnection } from "./config/database";
import { handleDemo } from "./routes/demo";

// Auth routes
import { register, login, getProfile, oauthCallback } from "./routes/auth";
import { authenticateToken } from "./middleware/auth";

// Skills routes
import {
  getUserSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getSkillRecommendations
} from "./routes/skills";

// Matching routes
import {
  findMentors,
  getPrecisionNudges,
  createMentorshipMatch
} from "./routes/matching";

// Dashboard routes
import {
  getSkillsOverview,
  getProgressTimeline,
  getAnalytics,
  getActivityFeed
} from "./routes/dashboard";

// Notification routes
import {
  getUserNudges,
  getNudgeById,
  updateNudgeStatus,
  createNudge,
  deleteNudge,
  getNudgeAnalytics
} from "./routes/notifications";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Test database connection on startup
  testConnection();

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ message: ping });
  });

  // Legacy demo route
  app.get("/api/demo", handleDemo);

  // =============================================================================
  // AUTHENTICATION ROUTES
  // =============================================================================
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.get("/api/auth/profile", authenticateToken, getProfile);
  app.post("/api/auth/oauth/callback", oauthCallback);

  // =============================================================================
  // SKILLS MANAGEMENT ROUTES
  // =============================================================================
  app.get("/api/skills", authenticateToken, getUserSkills);
  app.post("/api/skills", authenticateToken, addSkill);
  app.put("/api/skills/:skillId", authenticateToken, updateSkill);
  app.delete("/api/skills/:skillId", authenticateToken, deleteSkill);
  app.get("/api/skills/recommendations", authenticateToken, getSkillRecommendations);

  // =============================================================================
  // AI MATCHING & RECOMMENDATION ROUTES
  // =============================================================================
  app.get("/api/match/mentors", authenticateToken, findMentors);
  app.get("/api/recommend/nudges", authenticateToken, getPrecisionNudges);
  app.post("/api/match/mentorship", authenticateToken, createMentorshipMatch);

  // =============================================================================
  // DASHBOARD DATA ROUTES
  // =============================================================================
  app.get("/api/dashboard/skills", authenticateToken, getSkillsOverview);
  app.get("/api/dashboard/progress", authenticateToken, getProgressTimeline);
  app.get("/api/dashboard/analytics", authenticateToken, getAnalytics);
  app.get("/api/dashboard/activity", authenticateToken, getActivityFeed);

  // =============================================================================
  // NOTIFICATIONS & NUDGES ROUTES
  // =============================================================================
  app.get("/api/notifications", authenticateToken, getUserNudges);
  app.get("/api/notifications/:nudgeId", authenticateToken, getNudgeById);
  app.patch("/api/notifications/:nudgeId", authenticateToken, updateNudgeStatus);
  app.post("/api/notifications", authenticateToken, createNudge);
  app.delete("/api/notifications/:nudgeId", authenticateToken, deleteNudge);
  app.get("/api/notifications/analytics", authenticateToken, getNudgeAnalytics);

  // =============================================================================
  // ERROR HANDLING
  // =============================================================================

  // 404 handler for API routes
  app.use("/api/*", (_req, res) => {
    res.status(404).json({
      error: "API endpoint not found",
      message: "Please check the API documentation for available endpoints"
    });
  });

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);

    res.status(err.status || 500).json({
      error: process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
  });

  return app;
}
