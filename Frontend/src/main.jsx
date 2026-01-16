import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import StudentLogin from "./components/auth/StudentAuth/StudentLogin.jsx";
import Home from "./screens/Home.jsx";
import FacultyLogin from "./components/auth/FacultyAuth/FacultyLogin.jsx";
import SuccessLogin from './components/auth/StudentAuth/SuccessLogin.jsx';
import StudentRegister from './components/auth/StudentAuth/StudentRegister.jsx'

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
      { path: "Faculty/login", element: <FacultyLogin />},
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
