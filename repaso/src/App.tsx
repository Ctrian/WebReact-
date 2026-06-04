import { Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import SideNav from './components/SideNav'
import { Box } from '@mui/material'

function App() {
  return (
    <Box sx={{ display: "flex" }}>
      <SideNav />
      <Box sx={{ flexGrow: 1, ml: "240px" }}>
        <NavBar />
        <Box sx={{ mt: 8, p: 3 }}>
          <Routes>
            <Route path="/" element={<div>Contenido Inicio</div>} />
            <Route path="/alarmas" element={<div>Contenido Alarmas</div>} />
            <Route path="/tableros" element={<div>Contenido Tableros</div>} />
          </Routes>
        </Box>
      </Box>
    </Box>
  )
}

export default App
