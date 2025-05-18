import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router";
import { useNavigate } from "react-router-dom";
import AddLeariningPost from "./Pages/LearningSystem/AddLeariningPost";
import AllLearningPost from "./Pages/LearningSystem/AllLearningPost";
import UpdateLearningPost from "./Pages/LearningSystem/UpdateLearningPost";
import UserLogin from "./Pages/UserManagement/UserLogin";
import UserRegister from "./Pages/UserManagement/UserRegister";
import UpdateUserProfile from "./Pages/UserManagement/UpdateUserProfile";
import RecommendPost from "./Pages/LearningSystem/RecommendPost";
import AddNewPost from "./Pages/PostManagement/AddNewPost";
import AllPost from "./Pages/PostManagement/AllPost";
import UpdatePost from "./Pages/PostManagement/UpdatePost";

function ProtectedRoute({ children }) {
  const userID = localStorage.getItem("userID");
  if (!userID) {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/oauth2/success") {
      const params = new URLSearchParams(window.location.search);
      const userID = params.get("userID");
      const name = params.get("name");

      if (userID && name) {
        localStorage.setItem("userID", userID);
        alert(`Login successful! Welcome, ${name}`);
        localStorage.setItem("userType", "googale");
        navigate("/learningSystem/allLearningPost");
      } else {
        alert("Login failed. Missing user information.");
      }
    }
  }, [navigate]);

  return (
    <div>
      <React.Fragment>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />

          {/* Protected Routes */}
          <Route
            path="/learningSystem/addLeariningPost"
            element={
              <ProtectedRoute>
                <AddLeariningPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learningSystem/allLearningPost"
            element={
              <ProtectedRoute>
                <AllLearningPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learningSystem/updateLearningPost/:id"
            element={
              <ProtectedRoute>
                <UpdateLearningPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learningSystem/recommendPost"
            element={
              <ProtectedRoute>
                <RecommendPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updateUserProfile/:id"
            element={
              <ProtectedRoute>
                <UpdateUserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/addNewPost"
            element={
              <ProtectedRoute>
                <AddNewPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allPost"
            element={
              <ProtectedRoute>
                <AllPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updatePost/:id"
            element={
              <ProtectedRoute>
                <UpdatePost />
              </ProtectedRoute>
            }
          />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
