import { RequestHandler } from "express";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateToken: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access token required'
      });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            error: 'Token expired'
          });
        }
        return res.status(403).json({
          error: 'Invalid token'
        });
      }

      req.user = user as JWTPayload;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Optional auth middleware (doesn't fail if no token)
export const optionalAuth: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user as JWTPayload;
      }
      next();
    });
  } catch (error) {
    // Continue without auth
    next();
  }
};

// Role-based access control
export const requireRole = (roles: string[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};
