import React, { useState, useEffect } from 'react';
import DarkVeil from './components/backgrounds/DarkVeil/DarkVeil';
import './components/backgrounds/DarkVeil/DarkVeil.css';
import './App.css';

const phrases = [
  "Initialisation des modules...",
  "Connexion au serveur...",
  "Chargement des données...",
  "Préparation de l'interface..."
];

function App() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      if (!loadingComplete) {
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
      }
    }, 3000);

    return () => clearInterval(phraseInterval);
  }, [loadingComplete]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress >= 100) {
          clearInterval(progressInterval);
          setLoadingComplete(true);
          return 100;
        }
        return oldProgress + 2;
      });
    }, 1000);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div>
      <div className="background-container">
        <DarkVeil />
      </div>
      <div className="content">
        <img src="/images/onalogos/sparkLogofullnewd.png" alt="Spark Logo" className={`logo ${loadingComplete ? 'fade-out' : ''}`} />
        <div className={`loading-details ${loadingComplete ? 'fade-out' : ''}`}>
          <p className="loading-text">
            Spark nécessite quelques secondes pour charger<span className="animated-dots"></span>
          </p>
          <p className="dynamic-phrase">{phrases[currentPhraseIndex]}</p>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        {loadingComplete && (
          <div className="welcome-message">
            <h1>Welcome!</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 