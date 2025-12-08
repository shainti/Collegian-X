import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Sign_in from './components/Sign_in.jsx'
import Home from './screens/Home.jsx'

  const router = createBrowserRouter([
    {path:"/",
    element:<App/>,
    children: [
      { index: true, element: <Home /> },
      {path:"/Home",
    element:<Home/>},
    {path:"/Sign_in",
    element:<Sign_in/>},
    ]  
  },
  ])

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <RouterProvider router={router}/>
  </StrictMode>
   
)
