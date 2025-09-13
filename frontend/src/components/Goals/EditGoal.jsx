import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Target, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserGoals, updateUserGoal } from '../../redux/goalsSlice';

export default function EditGoal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: goals, loading } = useSelector((state) => state.goals);
  const [goalData, setGoalData] = useState({
    title: '',
    category: '',
    description: '',
    complexity: 'intermediate',
    duration: 12,
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

  useEffect(() => {
    if (goals.length === 0) {
      dispatch(fetchUserGoals());
    } else {
      const goal = goals.find(g => g._id === id);
      if (goal) {
        setGoalData({
          title: goal.title,
          category: goal.category,
          description: goal.description,
          complexity: goal.complexity,
          duration: goal.duration,
        });
      }
    }
  }, [id, goals, dispatch]);

  const handleInputChange = (field, value) => {
    setGoalData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(updateUserGoal({ goalId: id, data: goalData })).unwrap();
      alert('Goal updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error updating goal:', err);
      alert('Failed to update goal. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Target className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Edit Goal</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goal Title
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
            Duration (weeks)
          </label>
          <input
            type="number"
            min="1"
            max="52"
            value={goalData.duration}
            onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            required
          />
        </div>

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
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Update Goal
          </button>
        </div>
      </form>
    </div>
  );
}