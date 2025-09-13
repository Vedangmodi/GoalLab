// File: src/api/goals.js
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000/api" });

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const fetchGoals = () => API.get("/goals");
export const fetchGoal = (id) => API.get(`/goals/${id}`);
export const createGoal = (goal) => API.post("/goals", goal);
export const updateGoal = (id, data) => API.put(`/goals/${id}`, data);export const deleteGoal = (id) => API.delete(`/goals/${id}`);
export const updateMilestone = (goalId, weekNumber, data) => 
  API.put(`/goals/${goalId}/milestone/${weekNumber}`, data);
export const getGoalProgress = (goalId) => API.get(`/goals/${goalId}/progress`);
