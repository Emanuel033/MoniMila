import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importamos tus componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Inicio from './Inicio'; // O la ruta donde lo tengas
import Nosotros from './Nosotros'; // O la ruta donde lo tengas
// import Catalogo from './Catalogo'; (Si tienes un archivo para tu menú)

function App() {
  return (
    <Router>
      {/* Todo lo que envuelve a la página para que el footer baje al fondo */}
      <div className="flex flex-col min-h-screen">
        
        {/* 1. El Navbar va ARRIBA de las Rutas */}
        <Navbar />

        {/* 2. El contenido principal (Las páginas que cambian) */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/nosotros" element={<Nosotros />} />
            {/* <Route path="/catalogo" element={<Catalogo />} /> */}
          </Routes>
        </main>

        {/* 3. El Footer va ABAJO de las Rutas */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;

