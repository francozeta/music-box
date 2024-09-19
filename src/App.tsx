import './App.css'
import Layout from './components/layout/layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { Routes, Route } from "react-router-dom"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
