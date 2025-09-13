// File: src/components/Goals/GoalCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Target, Trash2, Edit3 } from 'lucide-react';

export default function GoalCard({ goal, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      default: return 'Not Started';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
            {getStatusText(goal.status)}
          </span>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/goals/edit/${goal._id}`}
            className="text-gray-400 hover:text-indigo-600 transition"
          >
            <Edit3 className="w-4 h-4" />
          </Link>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-600 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2">{goal.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{goal.description}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{goal.duration} weeks • Week {goal.current_week || 1}</span>
        </div>
        <span className="text-sm font-medium text-gray-700 capitalize">
          {goal.complexity}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${goal.progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">{goal.progress}% complete</span>
        <span className="text-sm text-gray-500">
          {goal.milestones?.filter(m => m.status === 'completed').length || 0}/
          {goal.milestones?.length || 0} milestones
        </span>
      </div>
    </div>
  );
}