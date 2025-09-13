// File: src/components/Goals/GoalsDashboard.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Target, Calendar, TrendingUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserGoals, deleteUserGoal } from '../../redux/goalsSlice';
import GoalCard from './GoalCard';

export default function GoalsDashboard() {
  const dispatch = useDispatch();
  const { list: goals, loading, error } = useSelector((state) => state.goals);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserGoals());
    }
  }, [dispatch, user]);

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      dispatch(deleteUserGoal(goalId));
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Learning Goals</h2>
          <p className="text-gray-600">Track your progress and manage your learning journey</p>
        </div>
        <Link
          to="/goals/create"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5" />
          Create New Goal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-8 h-8 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Total Goals</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{goals.length || 1}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">In Progress</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {goals.filter(g => g.status === 'in_progress').length || 1}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {goals.filter(g => g.status === 'completed').length || 0}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Goals Grid - Updated with sample data when empty */}
      {goals.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-100">
                  In Progress
                </span>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">Learn Python Programming</h3>
            <p className="text-gray-600 text-sm mb-4">Master Python fundamentals and build real-world applications</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>12 weeks • Week 5</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Intermediate</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">45% complete</span>
              <span className="text-sm text-gray-500">4/10 milestones</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard 
              key={goal._id} 
              goal={goal} 
              onDelete={() => handleDeleteGoal(goal._id)}
            />
          ))}
        </div>
      )}

      {/* Empty state message */}
      {goals.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center mt-8">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Create your first goal</h3>
          <p className="text-gray-600 mb-6">Start your learning journey by creating your first goal</p>
          <Link
            to="/goals/create"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Your First Goal
          </Link>
        </div>
      )}
    </div>
  );
}