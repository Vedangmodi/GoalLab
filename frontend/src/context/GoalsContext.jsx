// File: src/context/GoalsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as goalsAPI from '../api/goals';

const GoalsContext = createContext();

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};

export const GoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await goalsAPI.getGoals();
      setGoals(response.goals || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch goals');
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData) => {
    try {
      const response = await goalsAPI.createGoal(goalData);
      setGoals(prev => [...prev, response.goal]);
      return response;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  };

  const updateGoal = async (goalId, updateData) => {
    try {
      const response = await goalsAPI.updateGoal(goalId, updateData);
      setGoals(prev => prev.map(goal => 
        goal._id === goalId ? response.goal : goal
      ));
      return response;
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await goalsAPI.deleteGoal(goalId);
      setGoals(prev => prev.filter(goal => goal._id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const value = {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refreshGoals: fetchGoals
  };

  return (
    <GoalsContext.Provider value={value}>
      {children}
    </GoalsContext.Provider>
  );
};