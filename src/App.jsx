import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importamos las nuevas vistas de MoniMila Bakery (Tendremos que crear estas carpetas)
import Inicio from './pages/Inicio/Inicio';
import Catalogo from './pages/Catalogo/Catalogo';
import Nosotros from './pages/Nosotros/Nosotros'; // Aquí irá la Historia, Misión, Visión y Valores

// Aquí agregaremos el Navbar y el Footer más adelante para que salgan en todas las vistas
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      
      <Routes>
        {/* La página principal o Landing Page */}
        <Route path="/" element={<Inicio />} />
        
        {/* El catálogo con el carrito de compras a WhatsApp */}
        <Route path="/catalogo" element={<Catalogo />} />
        
        {/* La sección de identidad de la marca */}
        <Route path="/nosotros" element={<Nosotros />} />
        
      </Routes>

      {/* <Footer /> */}
    </Router>
  );
}

export default App;
