# SkillScape Navigator API Documentation

## Base URL

```
http://localhost:8080/api
```

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "student|professional|mentor",
  "industry": "Technology",
  "career_goals": "Become a senior software engineer"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "professional",
    "industry": "Technology",
    "career_goals": "Become a senior software engineer",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "token": "jwt_token_here"
}
```

### POST /auth/login

Login with email and password.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "professional",
    "industry": "Technology",
    "career_goals": "Become a senior software engineer"
  },
  "token": "jwt_token_here"
}
```

### GET /auth/profile

Get current user profile with skills.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "professional",
    "industry": "Technology",
    "career_goals": "Become a senior software engineer",
    "created_at": "2024-01-15T10:30:00Z",
    "skills": [
      {
        "id": "uuid",
        "skill_name": "React",
        "skill_level": "intermediate",
        "type": "offered"
      }
    ]
  }
}
```

---

## Skills Management Endpoints

### GET /skills

Get user's skills with optional filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `type` (optional): `offered` or `needed`

**Response:**

```json
{
  "skills": {
    "offered": [
      {
        "id": "uuid",
        "skill_name": "React",
        "skill_level": "advanced",
        "type": "offered",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ],
    "needed": [
      {
        "id": "uuid",
        "skill_name": "Cloud Architecture",
        "skill_level": "beginner",
        "type": "needed",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ],
    "all": []
  },
  "total": 2
}
```

### POST /skills

Add a new skill to user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "skill_name": "Python",
  "skill_level": "intermediate",
  "type": "offered"
}
```

**Response:**

```json
{
  "message": "Skill added successfully",
  "skill": {
    "id": "uuid",
    "skill_name": "Python",
    "skill_level": "intermediate",
    "type": "offered",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### PUT /skills/:skillId

Update an existing skill.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "skill_level": "advanced"
}
```

**Response:**

```json
{
  "message": "Skill updated successfully",
  "skill": {
    "id": "uuid",
    "skill_name": "Python",
    "skill_level": "advanced",
    "type": "offered",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T11:45:00Z"
  }
}
```

### DELETE /skills/:skillId

Delete a skill from user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "message": "Skill deleted successfully"
}
```

### GET /skills/recommendations

Get personalized skill recommendations.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "recommendations": ["System Design", "Docker", "Kubernetes", "Microservices"],
  "based_on": {
    "role": "professional",
    "industry": "Technology",
    "current_skills_count": 5
  }
}
```

---

## AI Matching & Recommendations

### GET /match/mentors

Find mentors based on skill gaps.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `skill_name` (optional): Specific skill to find mentors for
- `skill_level` (optional): `beginner`, `intermediate`, `advanced`
- `limit` (optional): Number of results (default: 10, max: 50)

**Response:**

```json
{
  "mentors": [
    {
      "id": "uuid",
      "name": "Sarah Martinez",
      "email": "sarah@example.com",
      "industry": "Technology",
      "career_goals": "Help others transition into tech careers",
      "offered_skills": [
        {
          "skill_name": "Python",
          "skill_level": "advanced",
          "match_score": 2.55
        }
      ],
      "overall_match_score": 2.55,
      "skill_matches": 1
    }
  ],
  "search_criteria": {
    "skill_name": "Python",
    "skill_level": "intermediate"
  },
  "total_results": 1
}
```

### GET /recommend/nudges

Get personalized precision nudges.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "nudges": [
    {
      "content": "Master Cloud Architecture with this interactive tutorial designed for beginner level",
      "type": "tutorial",
      "priority": "high",
      "skill_related": "Cloud Architecture",
      "metadata": {
        "url": "https://tutorial.example.com/cloud-architecture",
        "estimated_time": "30-45 min",
        "difficulty": "beginner"
      }
    }
  ],
  "generated_at": "2024-01-15T10:30:00Z",
  "based_on": {
    "needed_skills_count": 3,
    "offered_skills_count": 2,
    "user_role": "professional",
    "user_industry": "Technology"
  }
}
```

### POST /match/mentorship

Create a mentorship match request.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "mentor_id": "uuid",
  "skill_id": "uuid"
}
```

**Response:**

```json
{
  "message": "Mentorship match created successfully",
  "match": {
    "id": "uuid",
    "mentor_name": "Sarah Martinez",
    "skill_name": "Python",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

## Dashboard Data Endpoints

### GET /dashboard/skills

Get comprehensive skills overview for dashboard.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "skills_summary": {
    "total_skills": 6,
    "offered_skills": 3,
    "needed_skills": 3,
    "advanced_skills": 1
  },
  "skills_by_category": {
    "offered": [
      {
        "skill_name": "React",
        "skill_level": "advanced",
        "proficiency_score": 92,
        "growth_percentage": 15
      }
    ],
    "needed": [
      {
        "skill_name": "Cloud Architecture",
        "skill_level": "beginner",
        "proficiency_score": 35,
        "growth_percentage": 22
      }
    ]
  },
  "skill_gaps": [
    {
      "skill_name": "Cloud Architecture",
      "current_level": "beginner",
      "target_level": "advanced",
      "priority": "critical",
      "impact": "High demand in current market",
      "estimated_learning_time": "2-3 months"
    }
  ],
  "recommendations": [
    "Focus on cloud architecture skills for immediate career impact",
    "Your React skills are strong - consider mentoring others"
  ]
}
```

### GET /dashboard/progress

Get career progress timeline and metrics.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "progress_metrics": {
    "skills_developed": 24,
    "learning_hours": 47.5,
    "nudges_completion_rate": 89,
    "career_score": 762,
    "monthly_growth": 12
  },
  "timeline_data": [
    {
      "month": "2024-01-01T00:00:00Z",
      "skills_added": 3,
      "event_type": "skill_development"
    }
  ],
  "weekly_activity": [
    {
      "day": "Mon",
      "coding_hours": 6,
      "meeting_hours": 2,
      "learning_hours": 1,
      "date": "2024-01-15"
    }
  ],
  "career_trajectory": {
    "current_level": "Mid-Level Engineer",
    "projected_level": "Senior Engineer",
    "progression_percentage": 68,
    "key_milestones": [
      {
        "milestone": "Cloud Architecture Certification",
        "target_date": "2024-06-15",
        "progress": 35,
        "importance": "critical"
      }
    ],
    "estimated_promotion_timeframe": "6-8 months"
  },
  "insights": [
    "Your learning velocity has increased 23% this month",
    "Cloud skills showing fastest growth trajectory"
  ]
}
```

### GET /dashboard/analytics

Get detailed analytics and insights.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `timeframe` (optional): `7d`, `30d`, `90d` (default: `30d`)

**Response:**

```json
{
  "timeframe": "30d",
  "analytics_data": [
    {
      "action": "skill_added",
      "count": 3,
      "date": "2024-01-15T00:00:00Z"
    }
  ],
  "engagement_metrics": {
    "nudges_viewed": 15,
    "nudges_completed": 12,
    "skills_added": 3,
    "skills_updated": 2,
    "mentor_searches": 4,
    "login_sessions": 18,
    "nudge_completion_rate": 80,
    "average_daily_logins": 18
  },
  "ai_insights": [
    {
      "type": "positive",
      "title": "Excellent Learning Engagement",
      "description": "80% nudge completion rate shows strong commitment to growth",
      "action": "Continue this momentum with advanced challenges"
    }
  ],
  "performance_benchmarks": {
    "skill_development_rate": {
      "user_value": 3,
      "industry_average": 2.3,
      "percentile": 75
    },
    "learning_engagement": {
      "user_value": 80,
      "industry_average": 62,
      "percentile": 80
    }
  },
  "recommendations": [
    "Your learning consistency is above average - keep it up!",
    "Consider sharing knowledge to reinforce your own learning"
  ]
}
```

### GET /dashboard/activity

Get recent activity feed.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `limit` (optional): Number of activities to return (default: 20)

**Response:**

```json
{
  "activities": [
    {
      "activity_type": "skill",
      "description": "Added skill: Cloud Architecture",
      "timestamp": "2024-01-15T10:30:00Z",
      "action": "skill_added",
      "metadata": {}
    },
    {
      "activity_type": "nudge",
      "description": "Completed learning nudge: Master React Hooks",
      "timestamp": "2024-01-15T09:15:00Z",
      "action": "completed",
      "metadata": {}
    }
  ],
  "last_updated": "2024-01-15T10:30:00Z"
}
```

---

## Notifications & Nudges

### GET /notifications

Get user's nudges with filtering and pagination.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `status` (optional): `pending`, `read`, `completed`, `dismissed`
- `type` (optional): `tutorial`, `video`, `article`, `mentor`, `skill_gap`, `learning_path`
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:**

```json
{
  "nudges": [
    {
      "id": "uuid",
      "content": "Master Cloud Architecture with this interactive tutorial",
      "type": "tutorial",
      "priority": "high",
      "status": "pending",
      "metadata": {
        "url": "https://tutorial.example.com/cloud-architecture",
        "estimated_time": "30-45 min"
      },
      "expires_at": null,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 1
  },
  "statistics": {
    "total": 1,
    "pending": 1,
    "completed": 0,
    "read": 0,
    "high_priority": 1,
    "completion_rate": 0
  }
}
```

### GET /notifications/:nudgeId

Get a specific nudge (marks as read if pending).

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "nudge": {
    "id": "uuid",
    "content": "Master Cloud Architecture with this interactive tutorial",
    "type": "tutorial",
    "priority": "high",
    "status": "read",
    "metadata": {
      "url": "https://tutorial.example.com/cloud-architecture",
      "estimated_time": "30-45 min"
    },
    "expires_at": null,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:32:00Z"
  }
}
```

### PATCH /notifications/:nudgeId

Update nudge status.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "status": "completed"
}
```

**Response:**

```json
{
  "message": "Nudge updated successfully",
  "nudge": {
    "id": "uuid",
    "content": "Master Cloud Architecture with this interactive tutorial",
    "type": "tutorial",
    "priority": "high",
    "status": "completed",
    "metadata": {},
    "expires_at": null,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:35:00Z"
  }
}
```

### POST /notifications

Create a new nudge (self-nudging or admin).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "content": "Practice system design interviews",
  "type": "learning_path",
  "priority": "medium",
  "metadata": {
    "duration": "2 weeks",
    "modules": 5
  },
  "expires_at": "2024-02-15T00:00:00Z"
}
```

**Response:**

```json
{
  "message": "Nudge created successfully",
  "nudge": {
    "id": "uuid",
    "content": "Practice system design interviews",
    "type": "learning_path",
    "priority": "medium",
    "status": "pending",
    "metadata": {
      "duration": "2 weeks",
      "modules": 5
    },
    "expires_at": "2024-02-15T00:00:00Z",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### DELETE /notifications/:nudgeId

Delete a nudge.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "message": "Nudge deleted successfully"
}
```

### GET /notifications/analytics

Get nudge performance analytics.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `timeframe` (optional): `7d`, `30d`, `90d` (default: `30d`)

**Response:**

```json
{
  "timeframe": "30d",
  "overall_metrics": {
    "total_nudges": 15,
    "completion_rate": 80,
    "high_priority_completion_rate": 90
  },
  "performance_by_type": [
    {
      "type": "tutorial",
      "total": 5,
      "completed": 4,
      "completion_rate": 80,
      "avg_completion_time_hours": 2.5
    }
  ],
  "daily_engagement": [
    {
      "date": "2024-01-15T00:00:00Z",
      "nudges_received": 2,
      "nudges_completed": 1
    }
  ],
  "insights": [
    {
      "type": "strategy",
      "message": "tutorial nudges work best for you (80% completion rate).",
      "recommendation": "Focus on more tutorial-based learning recommendations."
    }
  ],
  "recommendations": [
    "Set aside 15-20 minutes daily for nudge completion",
    "Prioritize high-impact nudges that align with your career goals"
  ]
}
```

---

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "error": "Access token required"
}
```

### 403 Forbidden

```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- Authentication endpoints: 5 requests per minute
- General endpoints: 100 requests per minute
- Heavy computation endpoints (matching, analytics): 20 requests per minute

---

## Database Security

- **Row Level Security (RLS)**: Enabled on all user data tables
- **Data Isolation**: Users can only access their own data
- **Encrypted Connections**: All database connections use SSL
- **Input Validation**: All inputs validated with Zod schemas
- **SQL Injection Protection**: Parameterized queries throughout

---

## Sample Data

The API comes pre-seeded with sample data including:

- 10 sample users (students, professionals, mentors)
- Various skills across technology domains
- Sample nudges and mentorship matches
- Analytics data for demonstration

This allows immediate testing and demonstration of all features.
