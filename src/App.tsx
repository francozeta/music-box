import './App.css'
import LoginPage from './pages/LoginPage'
import { Routes, Route } from "react-router-dom"

function App() {

  return (
    <Routes>
      <Route path="/" element={ <h1>Inicio</h1> } />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
