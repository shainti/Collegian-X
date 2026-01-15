import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import StudentLogin from "./components/auth/StudentLogin.jsx";
import Home from "./screens/Home.jsx";
import FacultyLogin from "./components/auth/FacultyLogin.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/Home", element: <Home /> },
      { path: "/Student/login", element: <StudentLogin />},
      { path: "Faculty/login", element: <FacultyLogin />}
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
