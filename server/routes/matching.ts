import { RequestHandler } from "express";
import { query } from "../config/database";
import { z } from 'zod';

// Validation schemas
const matchRequestSchema = z.object({
  skill_name: z.string().optional(),
  skill_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  limit: z.number().min(1).max(50).default(10)
});

// AI-driven mentor matching endpoint
export const findMentors: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { skill_name, skill_level, limit = 10 } = matchRequestSchema.parse(req.query);

    // Get user's needed skills if no specific skill provided
    let userNeededSkills;
    if (!skill_name) {
      const neededSkillsResult = await query(`
        SELECT skill_name, skill_level 
        FROM skills 
        WHERE user_id = $1 AND type = 'needed'
        ORDER BY created_at DESC
      `, [userId]);
      
      userNeededSkills = neededSkillsResult.rows;
      
      if (userNeededSkills.length === 0) {
        return res.json({
          mentors: [],
          message: 'No skill gaps identified. Add some skills you want to learn!'
        });
      }
    }

    // Build matching query
    let matchQuery;
    let queryParams;

    if (skill_name) {
      // Match specific skill
      matchQuery = `
        WITH mentor_skills AS (
          SELECT 
            u.id, u.name, u.email, u.industry, u.career_goals,
            s.skill_name, s.skill_level, s.id as skill_id,
            CASE 
              WHEN s.skill_level = 'advanced' THEN 3
              WHEN s.skill_level = 'intermediate' THEN 2
              ELSE 1
            END as skill_score,
            CASE 
              WHEN u.role = 'mentor' THEN 1.5
              WHEN u.role = 'professional' THEN 1.2
              ELSE 1.0
            END as role_multiplier
          FROM users u
          JOIN skills s ON u.id = s.user_id
          WHERE u.id != $1 
            AND s.type = 'offered'
            AND s.skill_name ILIKE $2
            AND u.role IN ('mentor', 'professional')
        ),
        mentor_match_scores AS (
          SELECT 
            id, name, email, industry, career_goals, skill_name, skill_level, skill_id,
            (skill_score * role_multiplier) as match_score
          FROM mentor_skills
        )
        SELECT 
          id, name, email, industry, career_goals, skill_name, skill_level, skill_id,
          ROUND(match_score::numeric, 2) as match_score
        FROM mentor_match_scores
        ORDER BY match_score DESC, name
        LIMIT $3
      `;
      queryParams = [userId, `%${skill_name}%`, limit];
    } else {
      // Match based on user's needed skills
      const skillNames = userNeededSkills.map(skill => skill.skill_name);
      const skillPlaceholders = skillNames.map((_, index) => `$${index + 2}`).join(',');
      
      matchQuery = `
        WITH mentor_skills AS (
          SELECT 
            u.id, u.name, u.email, u.industry, u.career_goals,
            s.skill_name, s.skill_level, s.id as skill_id,
            CASE 
              WHEN s.skill_level = 'advanced' THEN 3
              WHEN s.skill_level = 'intermediate' THEN 2
              ELSE 1
            END as skill_score,
            CASE 
              WHEN u.role = 'mentor' THEN 1.5
              WHEN u.role = 'professional' THEN 1.2
              ELSE 1.0
            END as role_multiplier
          FROM users u
          JOIN skills s ON u.id = s.user_id
          WHERE u.id != $1 
            AND s.type = 'offered'
            AND s.skill_name = ANY(ARRAY[${skillPlaceholders}])
            AND u.role IN ('mentor', 'professional')
        ),
        mentor_match_scores AS (
          SELECT 
            id, name, email, industry, career_goals, skill_name, skill_level, skill_id,
            (skill_score * role_multiplier) as match_score
          FROM mentor_skills
        )
        SELECT 
          id, name, email, industry, career_goals, skill_name, skill_level, skill_id,
          ROUND(match_score::numeric, 2) as match_score,
          COUNT(*) OVER (PARTITION BY id) as skill_match_count
        FROM mentor_match_scores
        ORDER BY skill_match_count DESC, match_score DESC, name
        LIMIT $${skillNames.length + 2}
      `;
      queryParams = [userId, ...skillNames, limit];
    }

    const result = await query(matchQuery, queryParams);

    // Group mentors and their skills
    const mentorMap = new Map();
    
    result.rows.forEach(row => {
      if (!mentorMap.has(row.id)) {
        mentorMap.set(row.id, {
          id: row.id,
          name: row.name,
          email: row.email,
          industry: row.industry,
          career_goals: row.career_goals,
          offered_skills: [],
          overall_match_score: 0,
          skill_matches: 0
        });
      }
      
      const mentor = mentorMap.get(row.id);
      mentor.offered_skills.push({
        skill_name: row.skill_name,
        skill_level: row.skill_level,
        match_score: row.match_score
      });
      mentor.overall_match_score += row.match_score;
      mentor.skill_matches++;
    });

    // Convert to array and calculate final scores
    const mentors = Array.from(mentorMap.values())
      .map(mentor => ({
        ...mentor,
        overall_match_score: Math.round((mentor.overall_match_score / mentor.skill_matches) * 100) / 100
      }))
      .sort((a, b) => b.overall_match_score - a.overall_match_score);

    // Log analytics
    await query(
      'INSERT INTO analytics (user_id, action, metadata) VALUES ($1, $2, $3)',
      [userId, 'mentor_search', { 
        search_criteria: { skill_name, skill_level },
        results_count: mentors.length
      }]
    );

    res.json({
      mentors,
      search_criteria: {
        skill_name: skill_name || 'auto-detected from profile',
        skill_level,
        based_on_skills: !skill_name ? userNeededSkills.map(s => s.skill_name) : undefined
      },
      total_results: mentors.length
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Find mentors error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Precision nudges recommendation endpoint
export const getPrecisionNudges: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user profile and skills
    const userProfile = await query(`
      SELECT 
        u.name, u.role, u.industry, u.career_goals,
        array_agg(
          CASE WHEN s.type = 'needed' THEN 
            json_build_object(
              'skill_name', s.skill_name,
              'skill_level', s.skill_level
            )
          END
        ) FILTER (WHERE s.type = 'needed') as needed_skills,
        array_agg(
          CASE WHEN s.type = 'offered' THEN 
            json_build_object(
              'skill_name', s.skill_name,
              'skill_level', s.skill_level
            )
          END
        ) FILTER (WHERE s.type = 'offered') as offered_skills
      FROM users u
      LEFT JOIN skills s ON u.id = s.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.name, u.role, u.industry, u.career_goals
    `, [userId]);

    if (userProfile.rows.length === 0) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const user = userProfile.rows[0];
    const neededSkills = user.needed_skills || [];
    const offeredSkills = user.offered_skills || [];

    // Generate AI-driven nudges based on user context
    const nudges = [];

    // 1. Skill gap nudges
    for (const skill of neededSkills.slice(0, 3)) { // Top 3 needed skills
      const nudgeTypes = ['tutorial', 'video', 'article', 'learning_path'];
      const randomType = nudgeTypes[Math.floor(Math.random() * nudgeTypes.length)];
      
      let content = '';
      let metadata = {};

      switch (randomType) {
        case 'tutorial':
          content = `Master ${skill.skill_name} with this interactive tutorial designed for ${skill.skill_level} level`;
          metadata = {
            url: `https://tutorial.example.com/${skill.skill_name.toLowerCase().replace(/\s+/g, '-')}`,
            estimated_time: '30-45 min',
            difficulty: skill.skill_level
          };
          break;
        case 'video':
          content = `Watch: "${skill.skill_name} Fundamentals" - Perfect for your ${skill.skill_level} level`;
          metadata = {
            url: `https://video.example.com/${skill.skill_name.toLowerCase().replace(/\s+/g, '-')}`,
            duration: '15 min',
            provider: 'SkillTube'
          };
          break;
        case 'article':
          content = `Read: "Advanced ${skill.skill_name} Techniques" to level up your skills`;
          metadata = {
            url: `https://blog.example.com/${skill.skill_name.toLowerCase().replace(/\s+/g, '-')}`,
            read_time: '8 min',
            author: 'Industry Expert'
          };
          break;
        case 'learning_path':
          content = `Follow the ${skill.skill_name} learning path tailored for ${user.role}s in ${user.industry}`;
          metadata = {
            path_duration: '2-3 weeks',
            modules: 5,
            certification: true
          };
          break;
      }

      nudges.push({
        content,
        type: randomType,
        priority: skill === neededSkills[0] ? 'high' : 'medium',
        skill_related: skill.skill_name,
        metadata
      });
    }

    // 2. Mentorship nudges
    if (neededSkills.length > 0) {
      const topNeededSkill = neededSkills[0];
      nudges.push({
        content: `Connect with ${topNeededSkill.skill_name} experts in your network for personalized guidance`,
        type: 'mentor',
        priority: 'medium',
        skill_related: topNeededSkill.skill_name,
        metadata: {
          suggested_action: 'find_mentor',
          skill_focus: topNeededSkill.skill_name
        }
      });
    }

    // 3. Strength-building nudges
    if (offeredSkills.length > 0) {
      const strongSkill = offeredSkills.find(s => s.skill_level === 'advanced') || offeredSkills[0];
      if (strongSkill) {
        nudges.push({
          content: `Share your ${strongSkill.skill_name} expertise by mentoring others or writing about it`,
          type: 'skill_gap',
          priority: 'low',
          skill_related: strongSkill.skill_name,
          metadata: {
            action_type: 'knowledge_sharing',
            skill: strongSkill.skill_name
          }
        });
      }
    }

    // 4. Industry-specific nudges
    if (user.industry) {
      nudges.push({
        content: `Stay updated with latest ${user.industry} trends affecting your role as ${user.role}`,
        type: 'article',
        priority: 'low',
        skill_related: 'Industry Knowledge',
        metadata: {
          url: `https://industry-news.example.com/${user.industry.toLowerCase()}`,
          update_frequency: 'weekly'
        }
      });
    }

    // Store nudges in database for tracking
    for (const nudge of nudges.slice(0, 5)) { // Store top 5 nudges
      await query(`
        INSERT INTO nudges (user_id, content, type, priority, status, metadata)
        VALUES ($1, $2, $3, $4, 'pending', $5)
      `, [userId, nudge.content, nudge.type, nudge.priority, JSON.stringify(nudge.metadata)]);
    }

    // Log analytics
    await query(
      'INSERT INTO analytics (user_id, action, metadata) VALUES ($1, $2, $3)',
      [userId, 'nudges_generated', { 
        nudges_count: nudges.length,
        categories: nudges.map(n => n.type)
      }]
    );

    res.json({
      nudges: nudges.slice(0, 5), // Return top 5 nudges
      generated_at: new Date().toISOString(),
      based_on: {
        needed_skills_count: neededSkills.length,
        offered_skills_count: offeredSkills.length,
        user_role: user.role,
        user_industry: user.industry
      }
    });

  } catch (error) {
    console.error('Get precision nudges error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Create a mentorship match
export const createMentorshipMatch: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId; // mentee
    const { mentor_id, skill_id } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!mentor_id || !skill_id) {
      return res.status(400).json({
        error: 'Mentor ID and Skill ID are required'
      });
    }

    // Verify mentor exists and has the offered skill
    const mentorCheck = await query(`
      SELECT u.name, s.skill_name 
      FROM users u
      JOIN skills s ON u.id = s.user_id
      WHERE u.id = $1 AND s.id = $2 AND s.type = 'offered'
    `, [mentor_id, skill_id]);

    if (mentorCheck.rows.length === 0) {
      return res.status(400).json({
        error: 'Invalid mentor or skill combination'
      });
    }

    // Check if match already exists
    const existingMatch = await query(
      'SELECT id FROM mentorship_matches WHERE mentor_id = $1 AND mentee_id = $2 AND skill_id = $3',
      [mentor_id, userId, skill_id]
    );

    if (existingMatch.rows.length > 0) {
      return res.status(400).json({
        error: 'Mentorship match already exists'
      });
    }

    // Create the match
    const result = await query(`
      INSERT INTO mentorship_matches (mentor_id, mentee_id, skill_id, status, match_score)
      VALUES ($1, $2, $3, 'pending', $4)
      RETURNING id, created_at
    `, [mentor_id, userId, skill_id, 0.85]); // Default match score

    const match = result.rows[0];

    // Log analytics
    await query(
      'INSERT INTO analytics (user_id, action, metadata) VALUES ($1, $2, $3)',
      [userId, 'mentorship_match_created', { 
        mentor_id,
        skill_id,
        match_id: match.id
      }]
    );

    res.status(201).json({
      message: 'Mentorship match created successfully',
      match: {
        id: match.id,
        mentor_name: mentorCheck.rows[0].name,
        skill_name: mentorCheck.rows[0].skill_name,
        status: 'pending',
        created_at: match.created_at
      }
    });

  } catch (error) {
    console.error('Create mentorship match error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};
