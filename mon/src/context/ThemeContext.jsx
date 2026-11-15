
import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Création de l'objet Context
export const ThemeContext = createContext();

// 2. Composant Provider qui encapsule l'état
export function ThemeProvider({ children }) {

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('app_theme') || 'light';
    });

    // 3. Sauvegarder le thème dans localStorage
    useEffect(() => {
        localStorage.setItem('app_theme', theme);
    }, [theme]);

    // 4. Fonction pour changer le thème
    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// 5. Custom Hook pour utiliser le contexte
export function useTheme() {

    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            'useTheme doit être utilisé au sein d\'un ThemeProvider'
        );
    }

    return context;
}
