import './App.css'
import Layout from './components/layout/layout'
import InicioPage from './pages/InicioPage'
import LoginPage from './pages/LoginPage'
import { Routes, Route } from "react-router-dom"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout><InicioPage /></Layout>} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
