import { RequestHandler } from "express";
import { query } from "../config/database";
import { z } from "zod";

// Validation schemas
const updateNudgeSchema = z.object({
  status: z.enum(["pending", "read", "completed", "dismissed"]).optional(),
});

const createNudgeSchema = z.object({
  content: z.string().min(1, "Content is required"),
  type: z.enum([
    "tutorial",
    "video",
    "article",
    "mentor",
    "skill_gap",
    "learning_path",
  ]),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  metadata: z.object({}).passthrough().optional(),
  expires_at: z.string().datetime().optional(),
});

// Get all nudges for the authenticated user
export const getUserNudges: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { status, type, limit = 50, offset = 0 } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Build query with filters
    let whereClause = "WHERE user_id = $1";
    const queryParams: any[] = [userId];
    let paramCount = 2;

    if (status) {
      whereClause += ` AND status = $${paramCount}`;
      queryParams.push(status);
      paramCount++;
    }

    if (type) {
      whereClause += ` AND type = $${paramCount}`;
      queryParams.push(type);
      paramCount++;
    }

    // Add expiration filter (only show non-expired nudges)
    whereClause += ` AND (expires_at IS NULL OR expires_at > NOW())`;

    const nudgesResult = await query(
      `
      SELECT 
        id, content, type, priority, status, metadata, 
        expires_at, created_at, updated_at
      FROM nudges 
      ${whereClause}
      ORDER BY 
        CASE priority 
          WHEN 'high' THEN 3 
          WHEN 'medium' THEN 2 
          WHEN 'low' THEN 1 
        END DESC,
        created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `,
      [...queryParams, limit, offset],
    );

    // Get summary statistics
    const statsResult = await query(
      `
      SELECT 
        COUNT(*) as total_nudges,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_nudges,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_nudges,
        COUNT(*) FILTER (WHERE status = 'read') as read_nudges,
        COUNT(*) FILTER (WHERE priority = 'high') as high_priority_nudges
      FROM nudges 
      WHERE user_id = $1 
        AND (expires_at IS NULL OR expires_at > NOW())
    `,
      [userId],
    );

    const stats = statsResult.rows[0];

    res.json({
      nudges: nudgesResult.rows,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: parseInt(stats.total_nudges),
      },
      statistics: {
        total: parseInt(stats.total_nudges),
        pending: parseInt(stats.pending_nudges),
        completed: parseInt(stats.completed_nudges),
        read: parseInt(stats.read_nudges),
        high_priority: parseInt(stats.high_priority_nudges),
        completion_rate:
          stats.total_nudges > 0
            ? Math.round((stats.completed_nudges / stats.total_nudges) * 100)
            : 0,
      },
    });
  } catch (error) {
    console.error("Get user nudges error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Get a specific nudge by ID
export const getNudgeById: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { nudgeId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await query(
      `
      SELECT 
        id, content, type, priority, status, metadata, 
        expires_at, created_at, updated_at
      FROM nudges 
      WHERE id = $1 AND user_id = $2
    `,
      [nudgeId, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Nudge not found",
      });
    }

    const nudge = result.rows[0];

    // Mark as read if it was pending
    if (nudge.status === "pending") {
      await query(
        "UPDATE nudges SET status = $1, updated_at = NOW() WHERE id = $2",
        ["read", nudgeId],
      );

      nudge.status = "read";

      // Log analytics
      await query(
        "INSERT INTO analytics (user_id, action, metadata) VALUES ($1, $2, $3)",
        [userId, "nudge_viewed", { nudge_id: nudgeId, type: nudge.type }],
      );
    }

    res.json({
      nudge,
    });
  } catch (error) {
    console.error("Get nudge by ID error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Update nudge status
export const updateNudgeStatus: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { nudgeId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const validatedData = updateNudgeSchema.parse(req.body);

    // Check if nudge exists and belongs to user
    const existingNudge = await query(
      "SELECT * FROM nudges WHERE id = $1 AND user_id = $2",
      [nudgeId, userId],
    );

    if (existingNudge.rows.length === 0) {
      return res.status(404).json({
        error: "Nudge not found",
      });
    }

    const oldStatus = existingNudge.rows[0].status;

    // Update nudge status
    const result = await query(
      `
      UPDATE nudges 
      SET status = $1, updated_at = NOW()
      WHERE id = $2 AND user_id = $3
      RETURNING id, content, type, priority, status, metadata, 
               expires_at, created_at, updated_at
    `,
      [validatedData.status, nudgeId, userId],
    );

    const updatedNudge = result.rows[0];

    // Log analytics for status changes
    if (validatedData.status && validatedData.status !== oldStatus) {
      let analyticsAction = "nudge_status_changed";

      if (validatedData.status === "completed") {
        analyticsAction = "nudge_completed";
      } else if (validatedData.status === "dismissed") {
        analyticsAction = "nudge_dismissed";
      }

      await query(
        "INSERT INTO analytics (user_id, action, metadata) VALUES ($1, $2, $3)",
        [
          userId,
          analyticsAction,
          {
            nudge_id: nudgeId,
            old_status: oldStatus,
            new_status: validatedData.status,
            nudge_type: updatedNudge.type,
          },
        ],
      );
    }

    res.json({
      message: "Nudge updated successfully",
      nudge: updatedNudge,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    console.error("Update nudge status error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Create a custom nudge (admin function, but could be used for self-nudges)
export const createNudge: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { target_user_id } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const validatedData = createNudgeSchema.parse(req.body);
    const targetUserId = target_user_id || userId; // Default to self if no target specified

    // Create the nudge
    const result = await query(
      `
      INSERT INTO nudges (user_id, content, type, priority, status, metadata, expires_at)
      VALUES ($1, $2, $3, $4, 'pending', $5, $6)
      RETURNING id, content, type, priority, status, metadata, 
               expires_at, created_at, updated_at
    `,
      [
        targetUserId,
        validatedData.content,
        validatedData.type,
        validatedData.priority,
        JSON.stringify(validatedData.metadata || {}),
        validatedData.expires_at || null,
      ],
    );

    const nudge = result.rows[0];

    // Log analytics
    await query(
      "INSERT INTO analytics (user_id, action, metadata) VALUES ($1, $2, $3)",
      [
        userId,
        "nudge_created",
        {
          nudge_id: nudge.id,
          target_user_id: targetUserId,
          nudge_type: nudge.type,
          created_by_self: targetUserId === userId,
        },
      ],
    );

    res.status(201).json({
      message: "Nudge created successfully",
      nudge,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    console.error("Create nudge error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Delete a nudge
export const deleteNudge: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { nudgeId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if nudge exists and belongs to user
    const existingNudge = await query(
      "SELECT * FROM nudges WHERE id = $1 AND user_id = $2",
      [nudgeId, userId],
    );

    if (existingNudge.rows.length === 0) {
      return res.status(404).json({
        error: "Nudge not found",
      });
    }

    // Delete the nudge
    await query("DELETE FROM nudges WHERE id = $1 AND user_id = $2", [
      nudgeId,
      userId,
    ]);

    // Log analytics
    await query(
      "INSERT INTO analytics (user_id, action, metadata) VALUES ($1, $2, $3)",
      [
        userId,
        "nudge_deleted",
        {
          nudge_id: nudgeId,
          nudge_type: existingNudge.rows[0].type,
        },
      ],
    );

    res.json({
      message: "Nudge deleted successfully",
    });
  } catch (error) {
    console.error("Delete nudge error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Get nudge analytics and insights
export const getNudgeAnalytics: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { timeframe = "30d" } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let interval;
    switch (timeframe) {
      case "7d":
        interval = "7 days";
        break;
      case "30d":
        interval = "30 days";
        break;
      case "90d":
        interval = "90 days";
        break;
      default:
        interval = "30 days";
    }

    // Get nudge performance metrics
    const metricsResult = await query(
      `
      SELECT 
        type,
        COUNT(*) as total_nudges,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_nudges,
        COUNT(*) FILTER (WHERE status = 'dismissed') as dismissed_nudges,
        COUNT(*) FILTER (WHERE status = 'read') as read_nudges,
        AVG(
          CASE 
            WHEN status = 'completed' THEN EXTRACT(EPOCH FROM (updated_at - created_at))/3600
            ELSE NULL 
          END
        ) as avg_completion_time_hours
      FROM nudges 
      WHERE user_id = $1 
        AND created_at > NOW() - INTERVAL '${interval}'
      GROUP BY type
    `,
      [userId],
    );

    // Get daily engagement pattern
    const engagementResult = await query(
      `
      SELECT 
        DATE_TRUNC('day', created_at) as date,
        COUNT(*) as nudges_received,
        COUNT(*) FILTER (WHERE status = 'completed') as nudges_completed
      FROM nudges 
      WHERE user_id = $1 
        AND created_at > NOW() - INTERVAL '${interval}'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date DESC
    `,
      [userId],
    );

    // Calculate overall completion rate
    const overallResult = await query(
      `
      SELECT 
        COUNT(*) as total_nudges,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_nudges,
        COUNT(*) FILTER (WHERE priority = 'high' AND status = 'completed') as high_priority_completed
      FROM nudges 
      WHERE user_id = $1 
        AND created_at > NOW() - INTERVAL '${interval}'
    `,
      [userId],
    );

    const overall = overallResult.rows[0];
    const completionRate =
      overall.total_nudges > 0
        ? Math.round((overall.completed_nudges / overall.total_nudges) * 100)
        : 0;

    // Generate insights
    const insights = [];

    if (completionRate > 80) {
      insights.push({
        type: "positive",
        message:
          "Excellent nudge engagement! You're actively growing your skills.",
        recommendation:
          "Consider increasing nudge frequency for accelerated learning.",
      });
    } else if (completionRate < 50) {
      insights.push({
        type: "improvement",
        message: "Lower nudge completion rate detected.",
        recommendation:
          "Try focusing on fewer, high-impact nudges to build momentum.",
      });
    }

    // Find most effective nudge types
    const bestPerformingType = metricsResult.rows.reduce((best, current) => {
      const currentRate = current.completed_nudges / current.total_nudges;
      const bestRate = best.completed_nudges / best.total_nudges;
      return currentRate > bestRate ? current : best;
    }, metricsResult.rows[0]);

    if (bestPerformingType) {
      insights.push({
        type: "strategy",
        message: `${bestPerformingType.type} nudges work best for you (${Math.round((bestPerformingType.completed_nudges / bestPerformingType.total_nudges) * 100)}% completion rate).`,
        recommendation: `Focus on more ${bestPerformingType.type}-based learning recommendations.`,
      });
    }

    res.json({
      timeframe,
      overall_metrics: {
        total_nudges: parseInt(overall.total_nudges),
        completion_rate: completionRate,
        high_priority_completion_rate:
          overall.high_priority_completed > 0
            ? Math.round(
                (overall.high_priority_completed / overall.total_nudges) * 100,
              )
            : 0,
      },
      performance_by_type: metricsResult.rows.map((row) => ({
        type: row.type,
        total: parseInt(row.total_nudges),
        completed: parseInt(row.completed_nudges),
        completion_rate: Math.round(
          (row.completed_nudges / row.total_nudges) * 100,
        ),
        avg_completion_time_hours: row.avg_completion_time_hours
          ? Math.round(parseFloat(row.avg_completion_time_hours) * 10) / 10
          : null,
      })),
      daily_engagement: engagementResult.rows,
      insights,
      recommendations: [
        "Set aside 15-20 minutes daily for nudge completion",
        "Prioritize high-impact nudges that align with your career goals",
        "Track which types of nudges lead to the most learning progress",
      ],
    });
  } catch (error) {
    console.error("Get nudge analytics error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
