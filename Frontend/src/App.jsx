import './App.jsx'
import { Outlet } from 'react-router-dom'
import Header from './screens/Header.jsx'
import Footer2 from './screens/Footer2.jsx'
function App() {
  return (
    <>
    <Header/>
    <Outlet/>
    <Footer2/>
    </>
  )
}

export default App
