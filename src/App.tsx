import { useState, useEffect } from 'react';
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
  const [serverStatus, setServerStatus] = useState('pending'); // 'pending', 'online', 'offline'

  const checkServerStatus = async () => {
    try {
      await fetch('https://sparkbrq.onrender.com/', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      setServerStatus('online');
      return true;
    } catch (error) {
      console.log('Server not ready yet, will retry...');
      setServerStatus('offline');
      return false;
    }
  };

  const redirectToApp = () => {
    window.location.href = 'https://sparkbrq.onrender.com/';
  };

  useEffect(() => {
    checkServerStatus();
  }, []);

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

  useEffect(() => {
    if (loadingComplete && serverStatus === 'online') {
      setTimeout(redirectToApp, 3000); // Redirect after 3 seconds
    }
  }, [loadingComplete, serverStatus]);

  return (
    <div>
      <div className="background-container">
        <DarkVeil />
      </div>
      <div className="status-capsule">
        <div className={`status-indicator ${serverStatus}`}></div>
        <span>OnaSpark Status: {serverStatus}</span>
      </div>
      {serverStatus === 'online' && (
        <button className="access-spark-btn" onClick={redirectToApp}>
          Accéder à Spark
        </button>
      )}
      
      {loadingComplete && serverStatus === 'online' && (
        <h1 className="welcome-message-spark">
          Bienvenue sur Spark
        </h1>
      )}

      <div className="content">
        <img src="/images/onalogos/sparkLogofullnewd.png" alt="Spark Logo" className={`logo ${loadingComplete ? 'fade-out' : ''}`} />
        
        {loadingComplete && serverStatus === 'offline' && (
          <p className="server-offline-text">Le serveur est actuellement indisponible. Veuillez réessayer plus tard.</p>
        )}
        
        <div className={`loading-details ${loadingComplete ? 'fade-out' : ''}`}>
          <p className="loading-text">
            Spark nécessite quelques secondes pour charger<span className="animated-dots"></span>
          </p>
          <p className="dynamic-phrase">{phrases[currentPhraseIndex]}</p>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 