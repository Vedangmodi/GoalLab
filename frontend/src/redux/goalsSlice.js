import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGoals, createGoal, updateGoal, deleteGoal, updateMilestone, getGoalProgress } from '../api/goals';

// Async thunks
export const fetchUserGoals = createAsyncThunk(
  'goals/fetchGoals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchGoals();
      return response.data.goals;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch goals'
      );
    }
  }
);

export const addNewGoal = createAsyncThunk(
  'goals/createGoal',
  async (goalData, { rejectWithValue }) => {
    try {
      const response = await createGoal(goalData);
      return response.data.goal;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to create goal'
      );
    }
  }
);

export const updateUserGoal = createAsyncThunk(
  'goals/updateGoal',
  async ({ goalId, data }, { rejectWithValue }) => {
    try {
      const response = await updateGoal(goalId, data);
      return response.data.goal;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to update goal'
      );
    }
  }
);

export const deleteUserGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (goalId, { rejectWithValue }) => {
    try {
      await deleteGoal(goalId);
      return goalId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to delete goal'
      );
    }
  }
);

export const updateGoalMilestone = createAsyncThunk(
  'goals/updateMilestone',
  async ({ goalId, weekNumber, data }, { rejectWithValue }) => {
    try {
      const response = await updateMilestone(goalId, weekNumber, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to update milestone'
      );
    }
  }
);

const goalsSlice = createSlice({
  name: 'goals',
  initialState: {
    list: [],
    loading: false,
    error: null,
    currentGoal: null,
  },
  reducers: {
    clearGoalsError: (state) => {
      state.error = null;
    },
    setCurrentGoal: (state, action) => {
      state.currentGoal = action.payload;
    },
    clearCurrentGoal: (state) => {
      state.currentGoal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch goals
      .addCase(fetchUserGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchUserGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create goal
      .addCase(addNewGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
        state.error = null;
      })
      .addCase(addNewGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update goal
      .addCase(updateUserGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserGoal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(goal => goal._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUserGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete goal
      .addCase(deleteUserGoal.fulfilled, (state, action) => {
        state.list = state.list.filter(goal => goal._id !== action.payload);
      })
      // Update milestone
      .addCase(updateGoalMilestone.fulfilled, (state, action) => {
        // Find the goal and update its progress
        const goal = state.list.find(g => g._id === action.meta.arg.goalId);
        if (goal) {
          // You might want to update the goal's progress here based on the response
        }
      });
  },
});

export const { clearGoalsError, setCurrentGoal, clearCurrentGoal } = goalsSlice.actions;
export default goalsSlice.reducer;