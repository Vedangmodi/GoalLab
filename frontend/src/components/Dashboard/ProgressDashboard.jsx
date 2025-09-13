// File: src/components/Dashboard/ProgressDashboard.jsx
import React, { useState } from 'react';
import { useGoals } from '../../context/GoalsContext';
import GoalCard from '../Goals/GoalCard';
import GoalCreator from '../Goals/GoalCreator';

const ProgressDashboard = () => {
  const { goals, loading } = useGoals();
  const [showGoalCreator, setShowGoalCreator] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Learning Goals</h1>
        <button
          onClick={() => setShowGoalCreator(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create New Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="space-y-6">
        {goals.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No goals yet</h2>
            <p className="text-gray-500">Create your first learning goal to get started!</p>
          </div>
        ) : (
          goals.map(goal => (
            <GoalCard key={goal._id} goal={goal} />
          ))
        )}
      </div>

      {/* Goal Creator Modal */}
      {showGoalCreator && (
        <GoalCreator onClose={() => setShowGoalCreator(false)} />
      )}
    </div>
  );
};

export default ProgressDashboard;