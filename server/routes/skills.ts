import { RequestHandler } from "express";
import { query } from "../config/database";
import { z } from "zod";

// Validation schemas
const skillSchema = z.object({
  skill_name: z.string().min(1, "Skill name is required"),
  skill_level: z.enum(["beginner", "intermediate", "advanced"]),
  type: z.enum(["offered", "needed"]),
});

const updateSkillSchema = z.object({
  skill_name: z.string().min(1, "Skill name is required").optional(),
  skill_level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  type: z.enum(["offered", "needed"]).optional(),
});

// Get all skills for a user
export const getUserSkills: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { type } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let queryText = `
      SELECT id, skill_name, skill_level, type, created_at, updated_at
      FROM skills 
      WHERE user_id = $1
    `;

    const params: any[] = [userId];

    if (type && (type === "offered" || type === "needed")) {
      queryText += " AND type = $2";
      params.push(type);
    }

    queryText += " ORDER BY created_at DESC";

    const result = await query(queryText, params);

    // Group skills by type for better organization
    const skillsGrouped = {
      offered: result.rows.filter((skill) => skill.type === "offered"),
      needed: result.rows.filter((skill) => skill.type === "needed"),
      all: result.rows,
    };

    res.json({
      skills: type ? result.rows : skillsGrouped,
      total: result.rows.length,
    });
  } catch (error) {
    console.error("Get user skills error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Add a new skill
export const addSkill: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const validatedData = skillSchema.parse(req.body);

    // Check if skill already exists for this user
    const existingSkill = await query(
      "SELECT id FROM skills WHERE user_id = $1 AND skill_name = $2 AND type = $3",
      [userId, validatedData.skill_name, validatedData.type],
    );

    if (existingSkill.rows.length > 0) {
      return res.status(400).json({
        error: "This skill already exists in your profile",
      });
    }

    // Insert new skill
    const result = await query(
      `
      INSERT INTO skills (user_id, skill_name, skill_level, type)
      VALUES ($1, $2, $3, $4)
      RETURNING id, skill_name, skill_level, type, created_at, updated_at
    `,
      [
        userId,
        validatedData.skill_name,
        validatedData.skill_level,
        validatedData.type,
      ],
    );

    const skill = result.rows[0];

    // Log analytics event
    await query(
      "INSERT INTO analytics (user_id, action, metadata) VALUES ($1, $2, $3)",
      [
        userId,
        "skill_added",
        {
          skill_name: skill.skill_name,
          skill_level: skill.skill_level,
          type: skill.type,
        },
      ],
    );

    res.status(201).json({
      message: "Skill added successfully",
      skill,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    console.error("Add skill error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Update a skill
export const updateSkill: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { skillId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const validatedData = updateSkillSchema.parse(req.body);

    // Check if skill exists and belongs to user
    const existingSkill = await query(
      "SELECT * FROM skills WHERE id = $1 AND user_id = $2",
      [skillId, userId],
    );

    if (existingSkill.rows.length === 0) {
      return res.status(404).json({
        error: "Skill not found",
      });
    }

    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramCount = 1;

    if (validatedData.skill_name) {
      updateFields.push(`skill_name = $${paramCount}`);
      updateValues.push(validatedData.skill_name);
      paramCount++;
    }

    if (validatedData.skill_level) {
      updateFields.push(`skill_level = $${paramCount}`);
      updateValues.push(validatedData.skill_level);
      paramCount++;
    }

    if (validatedData.type) {
      updateFields.push(`type = $${paramCount}`);
      updateValues.push(validatedData.type);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: "No fields to update",
      });
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(skillId, userId);

    const updateQuery = `
      UPDATE skills 
      SET ${updateFields.join(", ")}
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING id, skill_name, skill_level, type, created_at, updated_at
    `;

    const result = await query(updateQuery, updateValues);
    const updatedSkill = result.rows[0];

    // Log analytics event
    await query(
      "INSERT INTO analytics (user_id, action, metadata) VALUES ($1, $2, $3)",
      [
        userId,
        "skill_updated",
        {
          skill_id: skillId,
          changes: validatedData,
        },
      ],
    );

    res.json({
      message: "Skill updated successfully",
      skill: updatedSkill,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    console.error("Update skill error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Delete a skill
export const deleteSkill: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { skillId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if skill exists and belongs to user
    const existingSkill = await query(
      "SELECT * FROM skills WHERE id = $1 AND user_id = $2",
      [skillId, userId],
    );

    if (existingSkill.rows.length === 0) {
      return res.status(404).json({
        error: "Skill not found",
      });
    }

    // Delete the skill
    await query("DELETE FROM skills WHERE id = $1 AND user_id = $2", [
      skillId,
      userId,
    ]);

    // Log analytics event
    await query(
      "INSERT INTO analytics (user_id, action, metadata) VALUES ($1, $2, $3)",
      [
        userId,
        "skill_deleted",
        {
          skill_id: skillId,
          skill_name: existingSkill.rows[0].skill_name,
        },
      ],
    );

    res.json({
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Delete skill error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Get skill recommendations based on industry/role
export const getSkillRecommendations: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get user's current skills and profile
    const userProfile = await query(
      `
      SELECT u.role, u.industry, array_agg(s.skill_name) as current_skills
      FROM users u
      LEFT JOIN skills s ON u.id = s.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.role, u.industry
    `,
      [userId],
    );

    if (userProfile.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userProfile.rows[0];

    // Mock skill recommendations based on role and industry
    // In a real implementation, this would use ML/AI algorithms
    const recommendations = {
      technology: {
        student: ["React", "Node.js", "Python", "SQL", "Git", "HTML/CSS"],
        professional: [
          "System Design",
          "Cloud Architecture",
          "Docker",
          "Kubernetes",
          "Microservices",
        ],
        mentor: [
          "Leadership",
          "Technical Writing",
          "Project Management",
          "Code Review",
        ],
      },
      marketing: {
        student: [
          "Digital Marketing",
          "SEO",
          "Google Analytics",
          "Social Media Marketing",
        ],
        professional: [
          "Marketing Strategy",
          "Data Analysis",
          "A/B Testing",
          "Customer Segmentation",
        ],
        mentor: ["Team Leadership", "Strategic Planning", "Budget Management"],
      },
    };

    const industryKey = user.industry?.toLowerCase() || "technology";
    const roleKey = user.role || "student";

    const suggestedSkills =
      recommendations[industryKey as keyof typeof recommendations]?.[
        roleKey as keyof typeof recommendations.technology
      ] || recommendations.technology.student;

    // Filter out skills user already has
    const currentSkills = user.current_skills || [];
    const newRecommendations = suggestedSkills.filter(
      (skill) => !currentSkills.includes(skill),
    );

    res.json({
      recommendations: newRecommendations.slice(0, 10), // Limit to 10 recommendations
      based_on: {
        role: user.role,
        industry: user.industry,
        current_skills_count: currentSkills.length,
      },
    });
  } catch (error) {
    console.error("Get skill recommendations error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
