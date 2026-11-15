
import React, { useState } from 'react';
import Header from './components/Header';
import Counter from './components/Counter';
import AutoTimer from './components/AutoTimer';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

export default function App() {
  const [showTimer, setShowTimer] = useState(true);

  return (
    <div className="app-container">
      <Header
        titre="Mon Super Compteur React"
        sousTitre="Maîtrise des Hooks fondamentaux useState et useEffect"
      />

      <Counter />

      <button
        className="btn btn-reset"
        onClick={() => setShowTimer(!showTimer)}
      >
        {showTimer ? 'Masquer le Chronomètre' : 'Afficher le Chronomètre'}
      </button>

      {showTimer && <AutoTimer />}

      <ThemeProvider>
            <div>
               <ThemeTest />
            </div>
        </ThemeProvider>
    </div>
  );
}
