import { query } from "../config/database";

/**
 * Set the current user context for Row Level Security
 * This should be called before any database operations that need RLS
 */
export async function setUserContext(userId: string) {
  try {
    await query("SELECT set_config($1, $2, true)", [
      "app.current_user_id",
      userId,
    ]);
  } catch (error) {
    console.error("Failed to set user context for RLS:", error);
    throw new Error("Database security context setup failed");
  }
}

/**
 * Execute a database query with user context set for RLS
 * This ensures Row Level Security policies are enforced
 */
export async function queryWithUserContext(
  userId: string,
  queryText: string,
  params?: any[],
) {
  try {
    // Set user context for RLS
    await setUserContext(userId);

    // Execute the actual query
    const result = await query(queryText, params);

    return result;
  } catch (error) {
    console.error("Query with user context failed:", error);
    throw error;
  }
}

/**
 * Middleware to automatically set user context from JWT token
 * Use this after authentication middleware
 */
export function withUserContext() {
  return async (req: any, res: any, next: any) => {
    try {
      if (req.user && req.user.userId) {
        await setUserContext(req.user.userId);
      }
      next();
    } catch (error) {
      console.error("User context middleware error:", error);
      res.status(500).json({
        error: "Database security setup failed",
      });
    }
  };
}
