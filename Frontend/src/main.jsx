import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import StudentLogin from "./auth/StudentAuth/StudentLogin.jsx";
import Home from "./screens/Home.jsx";
import SuccessLogin from './auth/StudentAuth/SuccessLogin.jsx';
import StudentRegister from './auth/StudentAuth/StudentRegister.jsx'
import StudentDashboard from "./components/StudentComponents/StudentDashboard.jsx";
import Assignments from './components/StudentComponents/Assignments.jsx';
import UpdateAssignment from './components/FacultyComponents/UpdateAssignment.jsx'
import Timetable from './components/StudentComponents/Timetable.jsx';
import Attendance from './components/StudentComponents/Attendance.jsx'
import UpdateAttendance from './components/FacultyComponents/UpdateAttendance.jsx'
import FacultyLogin from "./auth/FacultyAuth/FacultyLogin.jsx";
import FacultyDashboard from "./components/FacultyComponents/FacultyDashboard.jsx";
import MyProfile from "./screens/MyProfile.jsx";
import AIStudyPlanner from './components/StudentComponents/AIStudyPlanner.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/Home", element: <Home /> },
      { path: "/Student/login", element: <StudentLogin />},
      { path: "/Student/register", element: <StudentRegister />},
      { path: "Student/login/Success", element: <SuccessLogin />},
      { path: "/StudentDashboard", element: <StudentDashboard />},
      { path: "Faculty/login", element: <FacultyLogin />},
      { path: "/FacultyDashboard", element: <FacultyDashboard />},
      { path: "/Myprofile", element: <MyProfile />},
      { path: "/Student/Assignments", element: <Assignments />},
       { path: "/Student/Timetable", element: <Timetable />},
       { path: "/Student/Attendance", element: <Attendance />},
       { path: "/Faculty/UpdateAttendance", element: <UpdateAttendance />},
      { path: "/Faculty/UpdateAssignment", element: <UpdateAssignment />},
      { path: "/Student/AIStudyPlanner", element: <AIStudyPlanner />},
      
     
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
