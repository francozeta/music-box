import './App.css'
import { ThemeProvider } from '../context/theme-provider'
import LoginPage from './pages/LoginPage'
import { Routes, Route } from "react-router-dom"
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <Routes>
        <Route path="/" element={
          <LandingPage />
        }/>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
