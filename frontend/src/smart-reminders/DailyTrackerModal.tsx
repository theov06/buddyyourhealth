import { useState } from 'react';
import './DailyTrackerModal.css';

interface DailyTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Meal {
  id: string;
  name: string;
  portion: string;
  calories: number;
  time: string;
  ingredients?: string;
}

interface Exercise {
  id: string;
  name: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  caloriesBurned: number;
  type?: string;
}

interface AIInsight {
  type: 'success' | 'warning' | 'info';
  message: string;
}

export default function DailyTrackerModal({ isOpen, onClose }: DailyTrackerModalProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showMealForm, setShowMealForm] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Meal form state
  const [mealName, setMealName] = useState('');
  const [mealIngredients, setMealIngredients] = useState('');
  const [mealPortion, setMealPortion] = useState('');
  const [mealTime, setMealTime] = useState('12:00');
  const [isCalculatingMeal, setIsCalculatingMeal] = useState(false);

  // Exercise form state
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState('');
  const [exerciseIntensity, setExerciseIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [isCalculatingExercise, setIsCalculatingExercise] = useState(false);

  if (!isOpen) return null;

  // AI-powered calorie estimation for meals
  const estimateMealCalories = (mealName: string, ingredients: string, portion: string): number => {
    // Simple AI estimation based on common foods and ingredients
    const foodDatabase: { [key: string]: number } = {
      // Proteins (per 100g)
      'chicken': 165, 'beef': 250, 'pork': 242, 'fish': 206, 'salmon': 208,
      'tuna': 132, 'egg': 155, 'tofu': 76, 'shrimp': 99,
      // Carbs (per 100g)
      'rice': 130, 'pasta': 131, 'bread': 265, 'potato': 77, 'quinoa': 120,
      'oats': 389, 'noodles': 138, 'tortilla': 218,
      // Vegetables (per 100g)
      'broccoli': 34, 'spinach': 23, 'carrot': 41, 'tomato': 18, 'lettuce': 15,
      'cucumber': 16, 'pepper': 31, 'onion': 40, 'mushroom': 22,
      // Fruits (per 100g)
      'apple': 52, 'banana': 89, 'orange': 47, 'strawberry': 32, 'grape': 69,
      'watermelon': 30, 'mango': 60, 'pineapple': 50,
      // Dairy (per 100g)
      'milk': 42, 'cheese': 402, 'yogurt': 59, 'butter': 717, 'cream': 345,
      // Others
      'oil': 884, 'sugar': 387, 'honey': 304, 'nuts': 607, 'avocado': 160,
      'salad': 50, 'soup': 80, 'sandwich': 250, 'burger': 540, 'pizza': 266
    };

    let totalCalories = 0;
    const searchText = `${mealName} ${ingredients}`.toLowerCase();
    
    // Extract portion size multiplier
    let portionMultiplier = 1;
    if (portion.toLowerCase().includes('small')) portionMultiplier = 0.7;
    else if (portion.toLowerCase().includes('large')) portionMultiplier = 1.5;
    else if (portion.toLowerCase().includes('medium')) portionMultiplier = 1;
    
    // Extract weight if specified (e.g., "200g", "1kg")
    const weightMatch = portion.match(/(\d+)\s*(g|kg|oz|lb)/i);
    if (weightMatch) {
      const amount = parseInt(weightMatch[1]);
      const unit = weightMatch[2].toLowerCase();
      if (unit === 'kg') portionMultiplier = amount * 10;
      else if (unit === 'g') portionMultiplier = amount / 100;
      else if (unit === 'oz') portionMultiplier = amount * 0.28;
      else if (unit === 'lb') portionMultiplier = amount * 4.54;
    }

    // Check for matches in food database
    let matchCount = 0;
    for (const [food, caloriesPer100g] of Object.entries(foodDatabase)) {
      if (searchText.includes(food)) {
        totalCalories += caloriesPer100g * portionMultiplier;
        matchCount++;
      }
    }

    // If no matches, use meal type estimation
    if (matchCount === 0) {
      if (searchText.includes('breakfast')) totalCalories = 350;
      else if (searchText.includes('lunch')) totalCalories = 550;
      else if (searchText.includes('dinner')) totalCalories = 650;
      else if (searchText.includes('snack')) totalCalories = 150;
      else totalCalories = 400; // Default meal
      
      totalCalories *= portionMultiplier;
    }

    // Add base calories for complex meals
    if (searchText.includes('salad')) totalCalories += 100;
    if (searchText.includes('fried') || searchText.includes('deep')) totalCalories *= 1.3;
    if (searchText.includes('grilled') || searchText.includes('baked')) totalCalories *= 0.9;

    return Math.round(totalCalories);
  };

  // AI-powered calorie burn estimation for exercises
  const estimateExerciseCalories = (exerciseName: string, duration: number, intensity: string): number => {
    // Calories burned per minute for different exercises (for average 70kg person)
    const exerciseDatabase: { [key: string]: { low: number; medium: number; high: number } } = {
      'running': { low: 8, medium: 11, high: 15 },
      'jogging': { low: 6, medium: 8, high: 10 },
      'walking': { low: 3, medium: 4, high: 5 },
      'cycling': { low: 6, medium: 9, high: 12 },
      'swimming': { low: 7, medium: 10, high: 13 },
      'yoga': { low: 2, medium: 3, high: 4 },
      'pilates': { low: 3, medium: 4, high: 5 },
      'weightlifting': { low: 3, medium: 5, high: 7 },
      'gym': { low: 4, medium: 6, high: 8 },
      'aerobics': { low: 5, medium: 7, high: 9 },
      'dancing': { low: 4, medium: 6, high: 8 },
      'basketball': { low: 6, medium: 8, high: 10 },
      'soccer': { low: 7, medium: 9, high: 11 },
      'tennis': { low: 6, medium: 8, high: 10 },
      'hiking': { low: 5, medium: 7, high: 9 },
      'jump rope': { low: 10, medium: 12, high: 15 },
      'rowing': { low: 6, medium: 9, high: 12 },
      'boxing': { low: 8, medium: 11, high: 14 },
      'martial arts': { low: 7, medium: 10, high: 13 },
      'climbing': { low: 7, medium: 10, high: 13 },
      'elliptical': { low: 5, medium: 7, high: 9 },
      'stairs': { low: 6, medium: 8, high: 10 },
      'stretching': { low: 2, medium: 2, high: 3 }
    };

    const searchText = exerciseName.toLowerCase();
    let caloriesPerMinute = 5; // Default

    // Find matching exercise
    for (const [exercise, rates] of Object.entries(exerciseDatabase)) {
      if (searchText.includes(exercise)) {
        caloriesPerMinute = rates[intensity as keyof typeof rates];
        break;
      }
    }

    // Adjust for common keywords
    if (searchText.includes('intense') || searchText.includes('hiit')) caloriesPerMinute *= 1.3;
    if (searchText.includes('light') || searchText.includes('easy')) caloriesPerMinute *= 0.8;
    if (searchText.includes('cardio')) caloriesPerMinute *= 1.1;

    return Math.round(caloriesPerMinute * duration);
  };

  const handleAddMeal = () => {
    if (!mealName || !mealPortion) {
      alert('Please fill in meal name and portion');
      return;
    }

    setIsCalculatingMeal(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const estimatedCalories = estimateMealCalories(mealName, mealIngredients, mealPortion);
      
      const newMeal: Meal = {
        id: `meal-${Date.now()}`,
        name: mealName,
        portion: mealPortion,
        calories: estimatedCalories,
        time: mealTime,
        ingredients: mealIngredients
      };

      setMeals([...meals, newMeal]);
      setMealName('');
      setMealIngredients('');
      setMealPortion('');
      setMealTime('12:00');
      setShowMealForm(false);
      setIsCalculatingMeal(false);
    }, 800);
  };

  const handleAddExercise = () => {
    if (!exerciseName || !exerciseDuration) {
      alert('Please fill in exercise name and duration');
      return;
    }

    setIsCalculatingExercise(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const estimatedCalories = estimateExerciseCalories(exerciseName, parseInt(exerciseDuration), exerciseIntensity);
      
      const newExercise: Exercise = {
        id: `exercise-${Date.now()}`,
        name: exerciseName,
        duration: parseInt(exerciseDuration),
        intensity: exerciseIntensity,
        caloriesBurned: estimatedCalories,
        type: exerciseName
      };

      setExercises([...exercises, newExercise]);
      setExerciseName('');
      setExerciseDuration('');
      setExerciseIntensity('medium');
      setShowExerciseForm(false);
      setIsCalculatingExercise(false);
    }, 800);
  };

  const handleDeleteMeal = (id: string) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
  };

  const handleAnalyze = () => {
    if (meals.length === 0 && exercises.length === 0) {
      alert('Please add at least one meal or exercise to analyze');
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const insights: AIInsight[] = [];
      const totalCaloriesIn = meals.reduce((sum, m) => sum + m.calories, 0);
      const totalCaloriesOut = exercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
      const netCalories = totalCaloriesIn - totalCaloriesOut;
      const totalExerciseTime = exercises.reduce((sum, e) => sum + e.duration, 0);

      // Calorie balance analysis
      if (netCalories > 500) {
        insights.push({
          type: 'warning',
          message: `⚠️ High calorie surplus of ${netCalories} calories. Consider adding more physical activity or reducing portion sizes.`
        });
      } else if (netCalories < -500) {
        insights.push({
          type: 'warning',
          message: `⚠️ Large calorie deficit of ${Math.abs(netCalories)} calories. Ensure you're eating enough to fuel your activities.`
        });
      } else {
        insights.push({
          type: 'success',
          message: `✅ Well-balanced calorie intake! Net calories: ${netCalories > 0 ? '+' : ''}${netCalories}.`
        });
      }

      // Meal frequency analysis
      if (meals.length < 3) {
        insights.push({
          type: 'info',
          message: `💡 You logged ${meals.length} meal(s). Consider eating 3-5 smaller meals throughout the day for sustained energy.`
        });
      } else if (meals.length >= 3 && meals.length <= 5) {
        insights.push({
          type: 'success',
          message: `✅ Great meal frequency! ${meals.length} meals help maintain steady energy levels.`
        });
      }

      // Exercise analysis
      if (exercises.length === 0) {
        insights.push({
          type: 'warning',
          message: `🏃‍♂️ No exercise logged today. Aim for at least 30 minutes of physical activity daily.`
        });
      } else if (totalExerciseTime < 30) {
        insights.push({
          type: 'info',
          message: `💪 Good start with ${totalExerciseTime} minutes of exercise! Try to reach 30+ minutes for optimal health benefits.`
        });
      } else {
        insights.push({
          type: 'success',
          message: `🎉 Excellent! ${totalExerciseTime} minutes of exercise exceeds the daily recommendation.`
        });
      }

      // Intensity analysis
      const highIntensityCount = exercises.filter(e => e.intensity === 'high').length;
      if (highIntensityCount > 0) {
        insights.push({
          type: 'success',
          message: `🔥 ${highIntensityCount} high-intensity workout(s) detected! Great for cardiovascular health and calorie burn.`
        });
      }

      // Meal timing analysis
      const morningMeals = meals.filter(m => {
        const hour = parseInt(m.time.split(':')[0]);
        return hour >= 5 && hour < 12;
      });
      
      if (morningMeals.length === 0) {
        insights.push({
          type: 'info',
          message: `🌅 No breakfast logged. Starting your day with a nutritious meal can boost metabolism and energy.`
        });
      }

      // Hydration reminder
      insights.push({
        type: 'info',
        message: `💧 Remember to drink 8-10 glasses of water throughout the day, especially after exercise!`
      });

      // Protein recommendation
      const estimatedProteinNeeded = Math.round(totalExerciseTime > 30 ? 80 : 60);
      insights.push({
        type: 'info',
        message: `🥩 Based on your activity level, aim for ${estimatedProteinNeeded}g of protein today to support muscle recovery.`
      });

      setAiInsights(insights);
      setIsAnalyzing(false);
    }, 2000);
  };

  const totalCaloriesIn = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalCaloriesOut = exercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
  const netCalories = totalCaloriesIn - totalCaloriesOut;

  return (
    <div className="tracker-overlay" onClick={onClose}>
      <div className="tracker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tracker-header">
          <h2>Daily Health Tracker</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="tracker-content">
          {/* Date Selector */}
          <div className="date-selector">
            <label>Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Summary Stats */}
          <div className="summary-stats">
            <div className="stat-card">
              <span className="stat-value">{totalCaloriesIn}</span>
              <span className="stat-label">Calories In</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{totalCaloriesOut}</span>
              <span className="stat-label">Calories Out</span>
            </div>
            <div className="stat-card">
              <span className="stat-value" style={{ color: netCalories > 0 ? '#fbbf24' : '#4ade80' }}>
                {netCalories > 0 ? '+' : ''}{netCalories}
              </span>
              <span className="stat-label">Net Calories</span>
            </div>
          </div>

          {/* Meals Section */}
          <div className="tracker-section">
            <div className="section-header">
              <h3>Meals</h3>
              <button className="add-btn" onClick={() => setShowMealForm(!showMealForm)}>
                {showMealForm ? 'Cancel' : 'Add Meal'}
              </button>
            </div>

            {showMealForm && (
              <div className="entry-form">
                <input
                  type="text"
                  placeholder="Meal name (e.g., Grilled Chicken Salad)"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                />
                <textarea
                  placeholder="Ingredients (optional - e.g., chicken, lettuce, tomato, olive oil)"
                  value={mealIngredients}
                  onChange={(e) => setMealIngredients(e.target.value)}
                  rows={2}
                />
                <input
                  type="text"
                  placeholder="Portion (e.g., 1 plate, 200g, small, medium, large)"
                  value={mealPortion}
                  onChange={(e) => setMealPortion(e.target.value)}
                />
                <input
                  type="time"
                  value={mealTime}
                  onChange={(e) => setMealTime(e.target.value)}
                />
                <button 
                  className="submit-btn" 
                  onClick={handleAddMeal}
                  disabled={isCalculatingMeal}
                >
                  {isCalculatingMeal ? 'Calculating Calories...' : 'Add Meal (AI will calculate calories)'}
                </button>
              </div>
            )}

            <div className="entries-list">
              {meals.length === 0 ? (
                <p className="empty-message">No meals logged yet. Click "Add Meal" to start tracking.</p>
              ) : (
                meals.map((meal) => (
                  <div key={meal.id} className="entry-item">
                    <div className="entry-info">
                      <span className="entry-name">{meal.name}</span>
                      <span className="entry-details">{meal.portion} • {meal.calories} cal • {meal.time}</span>
                    </div>
                    <button className="delete-entry-btn" onClick={() => handleDeleteMeal(meal.id)}>Delete</button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Exercises Section */}
          <div className="tracker-section">
            <div className="section-header">
              <h3>Exercises</h3>
              <button className="add-btn" onClick={() => setShowExerciseForm(!showExerciseForm)}>
                {showExerciseForm ? 'Cancel' : 'Add Exercise'}
              </button>
            </div>

            {showExerciseForm && (
              <div className="entry-form">
                <input
                  type="text"
                  placeholder="Exercise name (e.g., Running, Yoga, Swimming)"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={exerciseDuration}
                  onChange={(e) => setExerciseDuration(e.target.value)}
                  min="1"
                />
                <select
                  value={exerciseIntensity}
                  onChange={(e) => setExerciseIntensity(e.target.value as 'low' | 'medium' | 'high')}
                >
                  <option value="low">Low Intensity</option>
                  <option value="medium">Medium Intensity</option>
                  <option value="high">High Intensity</option>
                </select>
                <button 
                  className="submit-btn" 
                  onClick={handleAddExercise}
                  disabled={isCalculatingExercise}
                >
                  {isCalculatingExercise ? 'Calculating Calories...' : 'Add Exercise (AI will calculate calories)'}
                </button>
              </div>
            )}

            <div className="entries-list">
              {exercises.length === 0 ? (
                <p className="empty-message">No exercises logged yet. Click "Add Exercise" to start tracking.</p>
              ) : (
                exercises.map((exercise) => (
                  <div key={exercise.id} className="entry-item">
                    <div className="entry-info">
                      <span className="entry-name">{exercise.name}</span>
                      <span className="entry-details">
                        {exercise.duration} min • {exercise.intensity} intensity • {exercise.caloriesBurned} cal burned
                      </span>
                    </div>
                    <button className="delete-entry-btn" onClick={() => handleDeleteExercise(exercise.id)}>Delete</button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Insights */}
          {aiInsights.length > 0 && (
            <div className="insights-section">
              <h3>AI Insights & Recommendations</h3>
              <div className="insights-list">
                {aiInsights.map((insight, index) => (
                  <div key={index} className={`insight-card ${insight.type}`}>
                    <p>{insight.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="tracker-footer">
          <button 
            className="analyze-btn" 
            onClick={handleAnalyze}
            disabled={isAnalyzing || (meals.length === 0 && exercises.length === 0)}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
          </button>
        </div>
      </div>
    </div>
  );
}
