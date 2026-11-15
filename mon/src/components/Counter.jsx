
import React, { useState, useEffect } from 'react';

export default function Counter() {
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('Aucun clic pour le moment');
    const [totalClics, setTotalClics] = useState(0);

    // 1. Initialize counter at 0
    const [count, setCount] = useState(0);

    // 2. Restore history from localStorage
    const [historique, setHistorique] = useState(() => {
        const sauvegarde = localStorage.getItem('mon_compteur_historique');

        return sauvegarde ? JSON.parse(sauvegarde) : [];
    });

    // 3. Synchronize browser tab title
    useEffect(() => {
        document.title = 'Counter: ' + count;
    }, [count]);

    // 4. Save counter value in localStorage
    useEffect(() => {
        localStorage.setItem('mon_compteur_valeur', count.toString());
    }, [count]);

    // 5. Save history in localStorage
    useEffect(() => {
        localStorage.setItem(
            'mon_compteur_historique',
            JSON.stringify(historique)
        );
    }, [historique]);

    // 6. Increment counter
    const handleIncrement = () => {
        const nouveauCompte = count + step;

        if (nouveauCompte > 50) {
            alert("Seuil maximal de 50 atteint !");
            setMessage("Seuil maximal de 50 atteint !");
            return;
        }

        setCount(nouveauCompte);
        setMessage('Ajout de ' + step);
        setTotalClics(prev => prev + 1);

        setHistorique([...historique, '+' + step]);
    };

    // 7. Decrement counter
    const handleDecrement = () => {
        const nouveauCompte = count - step;

        if (nouveauCompte < -50) {
            alert("Seuil minimal de -50 atteint !");
            setMessage("Seuil minimal de -50 atteint !");
            return;
        }

        setCount(nouveauCompte);
        setMessage('Retrait de ' + step);
        setTotalClics(prev => prev + 1);

        setHistorique([...historique, '-' + step]);
    };

    // 8. Reset counter
    const handleReset = () => {
        setCount(0);
        setMessage('Remise à zéro');
        setTotalClics(prev => prev + 1);
        setHistorique([]);
    };

    // 9. Keyboard controls with useEffect
    useEffect(() => {

        const handleKeyDown = (e) => {

            if (e.key === 'ArrowUp') {
                const nouveauCompte = count + step;

                if (nouveauCompte > 50) {
                    alert("Seuil maximal de 50 atteint !");
                    setMessage("Seuil maximal de 50 atteint !");
                    return;
                }

                setCount(nouveauCompte);
                setMessage('Ajout de ' + step);
                setTotalClics(prev => prev + 1);
                setHistorique([...historique, '+' + step]);
            }

            if (e.key === 'ArrowDown') {
                const nouveauCompte = count - step;

                if (nouveauCompte < -50) {
                    alert("Seuil minimal de -50 atteint !");
                    setMessage("Seuil minimal de -50 atteint !");
                    return;
                }

                setCount(nouveauCompte);
                setMessage('Retrait de ' + step);
                setTotalClics(prev => prev + 1);
                setHistorique([...historique, '-' + step]);
            }
        };

        // Attach keyboard listener
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup: remove keyboard listener
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    }, [count, step, historique]);

    // 10. Dynamic color
    const getStyleClass = () => {
        if (count > 0) return 'counter-display positive';
        if (count < 0) return 'counter-display negative';

        return 'counter-display zero';
    };

    return (
        <div className="counter-card">

            {/* Counter display */}
            <div className={getStyleClass()}>
                {count}
            </div>

            {/* Buttons */}
            <div className="btn-group">

                <button
                    className="btn btn-dec"
                    onClick={handleDecrement}
                >
                    -{step}
                </button>

                <button
                    className="btn btn-reset"
                    onClick={handleReset}
                >
                    Reset
                </button>

                <button
                    className="btn btn-inc"
                    onClick={handleIncrement}
                >
                    +{step}
                </button>

            </div>

            {/* Step selection */}
            <div className="step-control">
                <label>Pas d'incrémentation :</label>

                <select
                    value={step}
                    onChange={(e) => setStep(parseInt(e.target.value, 10))}
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                </select>
            </div>

            {/* History */}
            <div className="history-card">

                <p>
                    <strong>Dernière action :</strong> {message}
                </p>

                <p>
                    <strong>Total des clics :</strong> {totalClics}
                </p>

                {historique.length > 0 && (
                    <p>
                        <strong>Historique :</strong>
                        {historique.join(', ')}
                    </p>
                )}

            </div>

        </div>
    );
}
