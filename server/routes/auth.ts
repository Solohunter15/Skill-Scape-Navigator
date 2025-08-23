import { RequestHandler } from "express";
import { query } from "../config/database";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = '7d';

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'professional', 'mentor']),
  industry: z.string().optional(),
  career_goals: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Helper function to generate JWT token
function generateToken(userId: string, email: string, role: string) {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Register endpoint
export const register: RequestHandler = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [validatedData.email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: 'User already exists with this email'
      });
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);
    
    // Insert new user
    const result = await query(`
      INSERT INTO users (name, email, password_hash, role, industry, career_goals, auth_provider)
      VALUES ($1, $2, $3, $4, $5, $6, 'email')
      RETURNING id, name, email, role, industry, career_goals, created_at
    `, [
      validatedData.name,
      validatedData.email,
      hashedPassword,
      validatedData.role,
      validatedData.industry || null,
      validatedData.career_goals || null
    ]);
    
    const user = result.rows[0];
    
    // Generate JWT token
    const token = generateToken(user.id, user.email, user.role);
    
    // Log registration event
    await query(
      'INSERT INTO analytics (user_id, action, metadata) VALUES ($1, $2, $3)',
      [user.id, 'user_registered', { auth_provider: 'email', role: user.role }]
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        industry: user.industry,
        career_goals: user.career_goals,
        created_at: user.created_at
      },
      token
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error during registration'
    });
  }
};

// Login endpoint
export const login: RequestHandler = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    
    // Find user by email
    const result = await query(
      'SELECT id, name, email, password_hash, role, industry, career_goals FROM users WHERE email = $1',
      [validatedData.email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }
    
    const user = result.rows[0];
    
    // Check password
    const isValidPassword = await bcrypt.compare(validatedData.password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }
    
    // Generate JWT token
    const token = generateToken(user.id, user.email, user.role);
    
    // Log login event
    await query(
      'INSERT INTO analytics (user_id, action, metadata) VALUES ($1, $2, $3)',
      [user.id, 'user_login', { auth_provider: 'email' }]
    );
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        industry: user.industry,
        career_goals: user.career_goals
      },
      token
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error during login'
    });
  }
};

// Get current user profile
export const getProfile: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const result = await query(`
      SELECT 
        u.id, u.name, u.email, u.role, u.industry, u.career_goals, u.created_at,
        array_agg(
          CASE WHEN s.id IS NOT NULL THEN 
            json_build_object(
              'id', s.id,
              'skill_name', s.skill_name,
              'skill_level', s.skill_level,
              'type', s.type
            )
          END
        ) FILTER (WHERE s.id IS NOT NULL) as skills
      FROM users u
      LEFT JOIN skills s ON u.id = s.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.name, u.email, u.role, u.industry, u.career_goals, u.created_at
    `, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        industry: user.industry,
        career_goals: user.career_goals,
        created_at: user.created_at,
        skills: user.skills || []
      }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// OAuth callback placeholder (for Google/LinkedIn integration)
export const oauthCallback: RequestHandler = async (req, res) => {
  try {
    // This would integrate with OAuth providers
    // For now, return a placeholder response
    res.json({
      message: 'OAuth integration coming soon',
      supportedProviders: ['google', 'linkedin']
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({
      error: 'OAuth authentication failed'
    });
  }
};
