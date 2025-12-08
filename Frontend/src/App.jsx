import './App.jsx'
import { Outlet } from 'react-router-dom'
import Header from './screens/Header.jsx'
function App() {
  return (
    <>
    <Header/>
    <Outlet/>
    </>
  )
}

export default App
