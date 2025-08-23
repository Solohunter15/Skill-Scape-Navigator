import { RequestHandler } from "express";
import { query } from "../config/database";

// Dashboard skills overview endpoint
export const getSkillsOverview: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user's skills with analysis
    const skillsResult = await query(`
      SELECT 
        skill_name,
        skill_level,
        type,
        created_at,
        CASE 
          WHEN skill_level = 'advanced' THEN 85 + (RANDOM() * 15)::int
          WHEN skill_level = 'intermediate' THEN 60 + (RANDOM() * 20)::int
          ELSE 25 + (RANDOM() * 30)::int
        END as proficiency_score,
        CASE 
          WHEN created_at > NOW() - INTERVAL '30 days' THEN (RANDOM() * 20 + 5)::int
          WHEN created_at > NOW() - INTERVAL '90 days' THEN (RANDOM() * 15 + 2)::int
          ELSE (RANDOM() * 10)::int
        END as growth_percentage
      FROM skills 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]);

    const skills = skillsResult.rows;

    // Categorize skills
    const offeredSkills = skills.filter(s => s.type === 'offered');
    const neededSkills = skills.filter(s => s.type === 'needed');

    // Calculate skill gaps (critical areas needing improvement)
    const skillGaps = neededSkills.map(skill => {
      let priority = 'low';
      let impact = 'Low impact on career goals';
      
      // Simulate priority calculation
      if (skill.skill_name.toLowerCase().includes('cloud') || 
          skill.skill_name.toLowerCase().includes('ai') ||
          skill.skill_name.toLowerCase().includes('machine learning')) {
        priority = 'critical';
        impact = 'High demand in current market';
      } else if (skill.skill_name.toLowerCase().includes('react') ||
                 skill.skill_name.toLowerCase().includes('python') ||
                 skill.skill_name.toLowerCase().includes('sql')) {
        priority = 'medium';
        impact = 'Essential for role advancement';
      }

      return {
        skill_name: skill.skill_name,
        current_level: skill.skill_level,
        target_level: 'advanced',
        priority,
        impact,
        estimated_learning_time: priority === 'critical' ? '2-3 months' : 
                                 priority === 'medium' ? '1-2 months' : '3-4 weeks'
      };
    });

    res.json({
      skills_summary: {
        total_skills: skills.length,
        offered_skills: offeredSkills.length,
        needed_skills: neededSkills.length,
        advanced_skills: skills.filter(s => s.skill_level === 'advanced').length
      },
      skills_by_category: {
        offered: offeredSkills.map(s => ({
          skill_name: s.skill_name,
          skill_level: s.skill_level,
          proficiency_score: s.proficiency_score,
          growth_percentage: s.growth_percentage
        })),
        needed: neededSkills.map(s => ({
          skill_name: s.skill_name,
          skill_level: s.skill_level,
          proficiency_score: s.proficiency_score,
          growth_percentage: s.growth_percentage
        }))
      },
      skill_gaps: skillGaps.sort((a, b) => {
        const priorityOrder = { critical: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - 
               priorityOrder[a.priority as keyof typeof priorityOrder];
      }),
      recommendations: [
        'Focus on cloud architecture skills for immediate career impact',
        'Your React skills are strong - consider mentoring others',
        'Data analysis skills showing good growth trajectory'
      ]
    });

  } catch (error) {
    console.error('Get skills overview error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Career progress timeline endpoint
export const getProgressTimeline: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user's activity and progress over time
    const timelineResult = await query(`
      WITH monthly_progress AS (
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as skills_added,
          'skill_development' as event_type
        FROM skills 
        WHERE user_id = $1
        GROUP BY DATE_TRUNC('month', created_at)
        
        UNION ALL
        
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as nudges_completed,
          'learning_activity' as event_type
        FROM nudges 
        WHERE user_id = $1 AND status = 'completed'
        GROUP BY DATE_TRUNC('month', created_at)
        
        UNION ALL
        
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as mentorship_matches,
          'mentorship' as event_type
        FROM mentorship_matches 
        WHERE mentee_id = $1
        GROUP BY DATE_TRUNC('month', created_at)
      )
      SELECT * FROM monthly_progress
      ORDER BY month DESC
      LIMIT 12
    `, [userId]);

    // Generate progress metrics
    const progressMetrics = {
      skills_developed: 24 + Math.floor(Math.random() * 10),
      learning_hours: 47.5 + Math.floor(Math.random() * 20),
      nudges_completion_rate: 89 + Math.floor(Math.random() * 10),
      career_score: 762 + Math.floor(Math.random() * 100),
      monthly_growth: 12 + Math.floor(Math.random() * 8)
    };

    // Generate last 7 days activity pattern
    const weeklyActivity = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < 7; i++) {
      weeklyActivity.push({
        day: days[i],
        coding_hours: 4 + Math.floor(Math.random() * 5),
        meeting_hours: 1 + Math.floor(Math.random() * 4),
        learning_hours: Math.floor(Math.random() * 3),
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }

    // Career trajectory prediction
    const careerTrajectory = {
      current_level: 'Mid-Level Engineer',
      projected_level: 'Senior Engineer',
      progression_percentage: 68,
      key_milestones: [
        {
          milestone: 'Cloud Architecture Certification',
          target_date: '2024-06-15',
          progress: 35,
          importance: 'critical'
        },
        {
          milestone: 'Lead a Major Project',
          target_date: '2024-08-30',
          progress: 20,
          importance: 'high'
        },
        {
          milestone: 'Mentor 2 Junior Developers',
          target_date: '2024-12-31',
          progress: 50,
          importance: 'medium'
        }
      ],
      estimated_promotion_timeframe: '6-8 months'
    };

    res.json({
      progress_metrics: progressMetrics,
      timeline_data: timelineResult.rows,
      weekly_activity: weeklyActivity,
      career_trajectory: careerTrajectory,
      insights: [
        'Your learning velocity has increased 23% this month',
        'Cloud skills showing fastest growth trajectory',
        'Consistent daily learning pattern observed',
        'Ready for senior-level responsibilities in Q3 2024'
      ]
    });

  } catch (error) {
    console.error('Get progress timeline error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Analytics and insights endpoint
export const getAnalytics: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { timeframe = '30d' } = req.query;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Calculate timeframe for query
    let interval;
    switch (timeframe) {
      case '7d':
        interval = '7 days';
        break;
      case '30d':
        interval = '30 days';
        break;
      case '90d':
        interval = '90 days';
        break;
      default:
        interval = '30 days';
    }

    // Get user analytics
    const analyticsResult = await query(`
      SELECT 
        action,
        COUNT(*) as count,
        DATE_TRUNC('day', timestamp) as date
      FROM analytics 
      WHERE user_id = $1 
        AND timestamp > NOW() - INTERVAL '${interval}'
      GROUP BY action, DATE_TRUNC('day', timestamp)
      ORDER BY date DESC
    `, [userId]);

    // Get engagement metrics
    const engagementResult = await query(`
      SELECT 
        COUNT(*) FILTER (WHERE action = 'nudge_viewed') as nudges_viewed,
        COUNT(*) FILTER (WHERE action = 'nudge_completed') as nudges_completed,
        COUNT(*) FILTER (WHERE action = 'skill_added') as skills_added,
        COUNT(*) FILTER (WHERE action = 'skill_updated') as skills_updated,
        COUNT(*) FILTER (WHERE action = 'mentor_search') as mentor_searches,
        COUNT(*) FILTER (WHERE action = 'user_login') as login_sessions
      FROM analytics 
      WHERE user_id = $1 
        AND timestamp > NOW() - INTERVAL '${interval}'
    `, [userId]);

    const engagement = engagementResult.rows[0];

    // Calculate completion rates and trends
    const nudgeCompletionRate = engagement.nudges_viewed > 0 ? 
      Math.round((engagement.nudges_completed / engagement.nudges_viewed) * 100) : 0;

    // Generate AI insights based on data patterns
    const insights = [];
    
    if (nudgeCompletionRate > 80) {
      insights.push({
        type: 'positive',
        title: 'Excellent Learning Engagement',
        description: `${nudgeCompletionRate}% nudge completion rate shows strong commitment to growth`,
        action: 'Continue this momentum with advanced challenges'
      });
    }

    if (engagement.skills_added > 3) {
      insights.push({
        type: 'growth',
        title: 'Active Skill Development',
        description: `Added ${engagement.skills_added} new skills in the last ${timeframe}`,
        action: 'Consider focusing on mastery of core skills'
      });
    }

    if (engagement.mentor_searches > 2) {
      insights.push({
        type: 'networking',
        title: 'Strong Mentorship Interest',
        description: 'High mentor search activity indicates growth mindset',
        action: 'Connect with 1-2 mentors for focused guidance'
      });
    }

    // Generate performance comparison (mock industry benchmarks)
    const benchmarks = {
      skill_development_rate: {
        user_value: engagement.skills_added,
        industry_average: 2.3,
        percentile: engagement.skills_added > 2.3 ? 75 : 45
      },
      learning_engagement: {
        user_value: nudgeCompletionRate,
        industry_average: 62,
        percentile: nudgeCompletionRate > 62 ? 80 : 35
      },
      platform_activity: {
        user_value: engagement.login_sessions,
        industry_average: 12,
        percentile: engagement.login_sessions > 12 ? 70 : 40
      }
    };

    res.json({
      timeframe,
      analytics_data: analyticsResult.rows,
      engagement_metrics: {
        ...engagement,
        nudge_completion_rate: nudgeCompletionRate,
        average_daily_logins: Math.round(engagement.login_sessions / (parseInt(interval) / 30))
      },
      ai_insights: insights,
      performance_benchmarks: benchmarks,
      recommendations: [
        'Your learning consistency is above average - keep it up!',
        'Consider sharing knowledge to reinforce your own learning',
        'Focus on 2-3 core skills rather than adding many new ones'
      ]
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Real-time activity feed
export const getActivityFeed: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { limit = 20 } = req.query;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get recent activity across all areas
    const activityResult = await query(`
      SELECT 
        'skill' as activity_type,
        CASE 
          WHEN metadata->>'skill' IS NOT NULL THEN 
            'Added skill: ' || (metadata->>'skill')
          ELSE 'Updated skills portfolio'
        END as description,
        timestamp,
        action,
        metadata
      FROM analytics 
      WHERE user_id = $1 
        AND action IN ('skill_added', 'skill_updated', 'skill_deleted')
      
      UNION ALL
      
      SELECT 
        'nudge' as activity_type,
        'Completed learning nudge: ' || content as description,
        updated_at as timestamp,
        status as action,
        metadata
      FROM nudges 
      WHERE user_id = $1 
        AND status = 'completed'
        AND updated_at > NOW() - INTERVAL '30 days'
      
      UNION ALL
      
      SELECT 
        'mentorship' as activity_type,
        'New mentorship match created' as description,
        created_at as timestamp,
        status as action,
        NULL as metadata
      FROM mentorship_matches 
      WHERE mentee_id = $1 
        AND created_at > NOW() - INTERVAL '30 days'
      
      ORDER BY timestamp DESC
      LIMIT $2
    `, [userId, limit]);

    res.json({
      activities: activityResult.rows,
      last_updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get activity feed error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};
