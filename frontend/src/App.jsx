import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/Header";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import GoalCreator from "./components/Goals/GoalCreator";
import EditGoal from "./components/Goals/EditGoal";
import GoalsDashboard from "./components/Goals/GoalsDashboard";
import ProgressDashboard from "./components/Dashboard/ProgressDashboard";
import TutorChat from "./components/Tutor/TutorChat";
import CheckinForm from "./components/Checkin/CheckinForm";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100">
      {user && <Header />}
      <main className={user ? "container p-6" : ""}>
        <Routes>
          <Route 
            path="/" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } 
          />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
          
          {/* Protected Routes */}
          <Route 
            path="/goals/create" 
            element={
              <ProtectedRoute>
                <GoalCreator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/goals/edit/:id" 
            element={
              <ProtectedRoute>
                <EditGoal />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <GoalsDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tutor" 
            element={
              <ProtectedRoute>
                <TutorChat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkin" 
            element={
              <ProtectedRoute>
                <CheckinForm />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 fallback */}
          <Route path="*" element={<div className="p-6 bg-white rounded shadow">Page not found</div>} />
        </Routes>
      </main>
    </div>
  );
}
// --------------------------------------------------------------------------------------------------------------------

// File: src/App.jsx
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
// import GoalCreator from "./components/Goals/GoalCreator";
// import ProgressDashboard from "./components/Dashboard/ProgressDashboard";
// import TutorChat from "./components/Tutor/TutorChat";
// import CheckinForm from "./components/Checkin/CheckinForm";

// export default function App() {
//   // Bypass authentication for testing - show all components
//   const user = { name: "Test User", email: "test@example.com" };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />
//       <main className="container p-6">
//         <Routes>
//           <Route path="/" element={<ProgressDashboard />} />
//           <Route path="/login" element={<ProgressDashboard />} />
//           <Route path="/register" element={<ProgressDashboard />} />
//           <Route path="/goals/create" element={<GoalCreator />} />
//           <Route path="/dashboard" element={<ProgressDashboard />} />
//           <Route path="/tutor" element={<TutorChat />} />
//           <Route path="/checkin" element={<CheckinForm />} />
//           {/* 404 fallback */}
//           <Route path="*" element={<ProgressDashboard />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }