import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ThemeTest from './ThemeTest';

function App() {
    return (
        <ThemeProvider>
            <ThemeTest />
        </ThemeProvider>
    );
}

export default App;