// File: src/components/Goals/GoalCreator.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Calendar, BookOpen, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewGoal } from '../../redux/goalsSlice';

export default function GoalCreator() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.goals);
  const [step, setStep] = useState(1);
  const [goalData, setGoalData] = useState({
    title: '',
    category: '',
    description: '',
    complexity: 'intermediate',
    duration: 12,
    timelineType: 'ai-suggested', // or 'custom'
    milestones: []
  });

  const categories = [
    'Career Development',
    'Education & Learning',
    'Health & Fitness',
    'Financial Goals',
    'Personal Development',
    'Relationships',
    'Other'
  ];

  const complexityLevels = [
    { value: 'beginner', label: 'Beginner', color: 'text-green-600' },
    { value: 'intermediate', label: 'Intermediate', color: 'text-yellow-600' },
    { value: 'advanced', label: 'Advanced', color: 'text-red-600' }
  ];

  // AI-generated timeline suggestions based on goal type and difficulty
  const timelineSuggestions = {
    beginner: {
      'Career Development': 8,
      'Education & Learning': 6,
      'Health & Fitness': 4,
      'Financial Goals': 12,
      'Personal Development': 8,
      'Relationships': 6,
      'Other': 8
    },
    intermediate: {
      'Career Development': 12,
      'Education & Learning': 8,
      'Health & Fitness': 6,
      'Financial Goals': 24,
      'Personal Development': 12,
      'Relationships': 8,
      'Other': 12
    },
    advanced: {
      'Career Development': 24,
      'Education & Learning': 16,
      'Health & Fitness': 12,
      'Financial Goals': 52,
      'Personal Development': 24,
      'Relationships': 12,
      'Other': 16
    }
  };

  const handleInputChange = (field, value) => {
    setGoalData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-suggest timeline based on category and complexity
      if ((field === 'category' || field === 'complexity') && value && newData.category && newData.timelineType === 'ai-suggested') {
        const suggestedDuration = timelineSuggestions[newData.complexity]?.[newData.category] || 12;
        return { ...newData, duration: suggestedDuration };
      }
      
      return newData;
    });
  };

  const generateAIMilestones = () => {
    if (!goalData.title || !goalData.category) return [];
    
    const baseMilestones = [
      { week: 1, objective: 'Research and Planning', description: 'Gather resources and create a study plan', status: 'not_started' },
      { week: 2, objective: 'Foundation Building', description: 'Learn the basic concepts and fundamentals', status: 'not_started' },
      { week: 3, objective: 'Practical Application', description: 'Start applying knowledge through projects', status: 'not_started' },
      { week: 4, objective: 'Advanced Topics', description: 'Dive deeper into complex areas', status: 'not_started' },
      { week: 5, objective: 'Review and Mastery', description: 'Solidify knowledge and prepare for next steps', status: 'not_started' }
    ];
    
    // Adjust based on duration
    const totalWeeks = goalData.duration;
    const weekMultiplier = totalWeeks / 5;
    
    const adjustedMilestones = baseMilestones.map((milestone, index) => ({
      ...milestone,
      week: Math.max(1, Math.round((index + 1) * weekMultiplier))
    }));
    
    return adjustedMilestones;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (goalData.timelineType === 'ai-suggested') {
      const aiMilestones = generateAIMilestones();
      const finalGoalData = {
        ...goalData,
        milestones: aiMilestones
      };
      
      try {
        await dispatch(addNewGoal(finalGoalData)).unwrap();
        alert('Goal created successfully!');
        navigate('/dashboard');
      } catch (err) {
        console.error('Error creating goal:', err);
      }
    } else {
      // For custom timeline, go to milestone creation
      setStep(2);
    }
  };

  const addCustomMilestone = () => {
    setGoalData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { 
        week: prev.milestones.length + 1, 
        objective: '', 
        description: '', 
        status: 'not_started' 
      }]
    }));
  };

  const updateMilestone = (index, field, value) => {
    setGoalData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => 
        i === index ? { ...milestone, [field]: value } : milestone
      )
    }));
  };

  const removeMilestone = (index) => {
    setGoalData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const saveCustomGoal = async () => {
    try {
      await dispatch(addNewGoal(goalData)).unwrap();
      alert('Goal created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating goal:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Create New Goal</h2>
      </div>

      {/* Progress Steps */}
      <div className="flex mb-8">
        <div className={`flex-1 text-center py-2 ${step >= 1 ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}>
          Goal Details
        </div>
        <div className={`flex-1 text-center py-2 ${step >= 2 ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}>
          Timeline
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Step 1: Goal Details */}
      {step === 1 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What do you want to achieve?
            </label>
            <input
              type="text"
              value={goalData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              placeholder="e.g., Learn Web Development, Get Fit, Master Machine Learning"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={goalData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={goalData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              placeholder="Describe your goal in more detail..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complexity Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {complexityLevels.map(level => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handleInputChange('complexity', level.value)}
                  className={`p-3 border rounded-lg text-center transition-all ${
                    goalData.complexity === level.value
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 text-gray-600 hover:border-indigo-400'
                  }`}
                >
                  <span className={level.color}>{level.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeline Preference
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleInputChange('timelineType', 'ai-suggested')}
                className={`p-4 border rounded-lg text-center transition-all ${
                  goalData.timelineType === 'ai-suggested'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 text-gray-600 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>AI-Suggested Timeline</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">We'll create an optimal learning path for you</p>
              </button>
              
              <button
                type="button"
                onClick={() => handleInputChange('timelineType', 'custom')}
                className={`p-4 border rounded-lg text-center transition-all ${
                  goalData.timelineType === 'custom'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 text-gray-600 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Custom Timeline</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Create your own milestones and schedule</p>
              </button>
            </div>
          </div>

          {goalData.timelineType === 'ai-suggested' && goalData.category && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">AI Suggestion</span>
              </div>
              <p className="text-blue-700 text-sm mt-1">
                Based on your goal category and complexity, we recommend a {goalData.duration}-week journey
              </p>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {goalData.timelineType === 'ai-suggested' ? 'Create Goal' : 'Continue to Timeline'}
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Custom Milestone Creation */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">Custom Learning Path</h3>
            <p className="text-green-700 text-sm">
              Create your own milestones for your "{goalData.title}" goal
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-4">Create Custom Milestones</h3>
            
            {goalData.milestones.map((milestone, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700">Milestone {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Week</label>
                    <input
                      type="number"
                      min="1"
                      value={milestone.week}
                      onChange={(e) => updateMilestone(index, 'week', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={milestone.objective}
                      onChange={(e) => updateMilestone(index, 'objective', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Milestone title"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Description</label>
                  <textarea
                    value={milestone.description}
                    onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="What will you achieve in this milestone?"
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addCustomMilestone}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition mb-6"
            >
              <Plus className="w-4 h-4" />
              Add Another Milestone
            </button>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="text-gray-600 px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              onClick={saveCustomGoal}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}