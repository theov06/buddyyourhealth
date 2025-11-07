import { useEffect } from 'react';
import './AnalysisModal.css';

interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  category: 'medication' | 'exercise' | 'checkup' | 'wellness' | 'nutrition';
  isActive: boolean;
  nextReminder: Date;
  aiGenerated: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: Reminder[];
}

interface AnalysisResult {
  adherenceScore: number;
  coverageAnalysis: {
    category: string;
    count: number;
    recommendation: string;
  }[];
  timingAnalysis: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
    recommendation: string;
  };
  priorityDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  insights: string[];
  recommendations: string[];
}

export default function AnalysisModal({ isOpen, onClose, reminders }: AnalysisModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const analyzeReminders = (): AnalysisResult => {
    // Category coverage analysis
    const categoryCount: Record<string, number> = {
      medication: 0,
      exercise: 0,
      checkup: 0,
      wellness: 0,
      nutrition: 0
    };

    reminders.forEach(r => {
      categoryCount[r.category]++;
    });

    const coverageAnalysis = Object.entries(categoryCount).map(([category, count]) => {
      let recommendation = '';
      if (count === 0) {
        recommendation = `Consider adding ${category} reminders for comprehensive health tracking`;
      } else if (count === 1) {
        recommendation = `Good start! Consider adding more ${category} reminders`;
      } else if (count >= 2 && count <= 3) {
        recommendation = `Well balanced ${category} coverage`;
      } else {
        recommendation = `Excellent ${category} tracking`;
      }
      return { category, count, recommendation };
    });

    // Timing analysis
    const timingCount = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    reminders.forEach(r => {
      const hour = parseInt(r.time.split(':')[0]);
      if (hour >= 5 && hour < 12) timingCount.morning++;
      else if (hour >= 12 && hour < 17) timingCount.afternoon++;
      else if (hour >= 17 && hour < 21) timingCount.evening++;
      else timingCount.night++;
    });

    let timingRecommendation = '';
    if (timingCount.morning === 0) {
      timingRecommendation = 'Add morning reminders to start your day with healthy habits';
    } else if (timingCount.evening === 0) {
      timingRecommendation = 'Consider evening reminders for end-of-day wellness routines';
    } else {
      timingRecommendation = 'Your reminders are well-distributed throughout the day';
    }

    // Priority distribution
    const priorityDistribution = {
      critical: reminders.filter(r => r.priority === 'critical').length,
      high: reminders.filter(r => r.priority === 'high').length,
      medium: reminders.filter(r => r.priority === 'medium').length,
      low: reminders.filter(r => r.priority === 'low').length
    };

    // Generate insights
    const insights: string[] = [];
    const totalReminders = reminders.length;
    const activeReminders = reminders.filter(r => r.isActive).length;
    const aiGenerated = reminders.filter(r => r.aiGenerated).length;

    insights.push(`You have ${totalReminders} total reminders, ${activeReminders} are currently active`);
    insights.push(`${aiGenerated} reminders were AI-generated, ${totalReminders - aiGenerated} are custom`);
    
    if (priorityDistribution.critical > 0) {
      insights.push(`${priorityDistribution.critical} critical priority reminders require immediate attention`);
    }

    const mostCommonCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
    if (mostCommonCategory[1] > 0) {
      insights.push(`Your primary focus area is ${mostCommonCategory[0]} with ${mostCommonCategory[1]} reminders`);
    }

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (categoryCount.medication === 0) {
      recommendations.push('💊 Add medication reminders to track prescriptions and supplements');
    }
    if (categoryCount.exercise < 2) {
      recommendations.push('🏃‍♂️ Increase exercise reminders to maintain consistent physical activity');
    }
    if (categoryCount.nutrition < 2) {
      recommendations.push('🥗 Add nutrition reminders for meal planning and hydration tracking');
    }
    if (timingCount.morning < 2) {
      recommendations.push('🌅 Morning reminders help establish positive daily routines');
    }
    if (priorityDistribution.high + priorityDistribution.critical > totalReminders * 0.7) {
      recommendations.push('⚖️ Consider balancing priorities to avoid reminder fatigue');
    }
    if (totalReminders < 5) {
      recommendations.push('📈 Add more reminders for comprehensive health management');
    }

    // Calculate adherence score (simulated based on reminder quality)
    let adherenceScore = 50;
    adherenceScore += Math.min(totalReminders * 5, 25); // More reminders = better
    adherenceScore += Object.values(categoryCount).filter(c => c > 0).length * 5; // Category diversity
    adherenceScore = Math.min(adherenceScore, 95);

    return {
      adherenceScore,
      coverageAnalysis,
      timingAnalysis: { ...timingCount, recommendation: timingRecommendation },
      priorityDistribution,
      insights,
      recommendations
    };
  };

  const analysis = analyzeReminders();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication': return '💊';
      case 'exercise': return '🏃‍♂️';
      case 'checkup': return '🩺';
      case 'wellness': return '🧘‍♀️';
      case 'nutrition': return '🥗';
      default: return '⚡';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4ade80';
    if (score >= 60) return '#fbbf24';
    if (score >= 40) return '#fb923c';
    return '#f87171';
  };

  return (
    <div className="analysis-overlay" onClick={onClose}>
      <div className="analysis-modal" onClick={(e) => e.stopPropagation()}>
        <div className="analysis-header">
          <h2>🧠 AI Deep Analysis</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="analysis-content">
          {/* Adherence Score */}
          <div className="analysis-section score-section">
            <h3>Health Adherence Score</h3>
            <div className="score-display">
              <div className="score-circle" style={{ borderColor: getScoreColor(analysis.adherenceScore) }}>
                <span className="score-value" style={{ color: getScoreColor(analysis.adherenceScore) }}>
                  {analysis.adherenceScore}%
                </span>
              </div>
              <p className="score-description">
                {analysis.adherenceScore >= 80 ? 'Excellent health tracking!' :
                 analysis.adherenceScore >= 60 ? 'Good progress, keep it up!' :
                 analysis.adherenceScore >= 40 ? 'Room for improvement' :
                 'Let\'s build better habits together'}
              </p>
            </div>
          </div>

          {/* Category Coverage */}
          <div className="analysis-section">
            <h3>📊 Category Coverage</h3>
            <div className="coverage-grid">
              {analysis.coverageAnalysis.map((item) => (
                <div key={item.category} className="coverage-item">
                  <div className="coverage-header">
                    <span className="coverage-icon">{getCategoryIcon(item.category)}</span>
                    <span className="coverage-name">{item.category}</span>
                    <span className="coverage-count">{item.count}</span>
                  </div>
                  <div className="coverage-bar">
                    <div 
                      className="coverage-fill" 
                      style={{ width: `${Math.min(item.count * 25, 100)}%` }}
                    ></div>
                  </div>
                  <p className="coverage-recommendation">{item.recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timing Distribution */}
          <div className="analysis-section">
            <h3>⏰ Timing Distribution</h3>
            <div className="timing-grid">
              <div className="timing-item">
                <span className="timing-icon">🌅</span>
                <span className="timing-label">Morning</span>
                <span className="timing-count">{analysis.timingAnalysis.morning}</span>
              </div>
              <div className="timing-item">
                <span className="timing-icon">☀️</span>
                <span className="timing-label">Afternoon</span>
                <span className="timing-count">{analysis.timingAnalysis.afternoon}</span>
              </div>
              <div className="timing-item">
                <span className="timing-icon">🌆</span>
                <span className="timing-label">Evening</span>
                <span className="timing-count">{analysis.timingAnalysis.evening}</span>
              </div>
              <div className="timing-item">
                <span className="timing-icon">🌙</span>
                <span className="timing-label">Night</span>
                <span className="timing-count">{analysis.timingAnalysis.night}</span>
              </div>
            </div>
            <p className="timing-recommendation">{analysis.timingAnalysis.recommendation}</p>
          </div>

          {/* Priority Distribution */}
          <div className="analysis-section">
            <h3>🎯 Priority Distribution</h3>
            <div className="priority-bars">
              <div className="priority-bar-item">
                <span className="priority-label">Critical</span>
                <div className="priority-bar">
                  <div 
                    className="priority-fill critical" 
                    style={{ width: `${(analysis.priorityDistribution.critical / reminders.length) * 100}%` }}
                  ></div>
                </div>
                <span className="priority-count">{analysis.priorityDistribution.critical}</span>
              </div>
              <div className="priority-bar-item">
                <span className="priority-label">High</span>
                <div className="priority-bar">
                  <div 
                    className="priority-fill high" 
                    style={{ width: `${(analysis.priorityDistribution.high / reminders.length) * 100}%` }}
                  ></div>
                </div>
                <span className="priority-count">{analysis.priorityDistribution.high}</span>
              </div>
              <div className="priority-bar-item">
                <span className="priority-label">Medium</span>
                <div className="priority-bar">
                  <div 
                    className="priority-fill medium" 
                    style={{ width: `${(analysis.priorityDistribution.medium / reminders.length) * 100}%` }}
                  ></div>
                </div>
                <span className="priority-count">{analysis.priorityDistribution.medium}</span>
              </div>
              <div className="priority-bar-item">
                <span className="priority-label">Low</span>
                <div className="priority-bar">
                  <div 
                    className="priority-fill low" 
                    style={{ width: `${(analysis.priorityDistribution.low / reminders.length) * 100}%` }}
                  ></div>
                </div>
                <span className="priority-count">{analysis.priorityDistribution.low}</span>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="analysis-section">
            <h3>💡 Key Insights</h3>
            <div className="insights-list">
              {analysis.insights.map((insight, index) => (
                <div key={index} className="insight-item">
                  <span className="insight-bullet">▸</span>
                  <span className="insight-text">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div className="analysis-section recommendations-section">
              <h3>🎯 AI Recommendations</h3>
              <div className="recommendations-list">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    <span className="recommendation-text">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="analysis-footer">
          <button className="close-analysis-btn" onClick={onClose}>
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
