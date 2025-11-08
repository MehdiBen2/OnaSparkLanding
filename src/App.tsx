import { useState, useEffect } from 'react';
import './App.css';
import DynamicFeatures from './DynamicFeatures';

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
  const [showDelayMessage, setShowDelayMessage] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Handle resize if needed
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (progress >= 100 && serverStatus !== 'online') {
      const delayTimer = setTimeout(() => {
        setShowDelayMessage(true);
      }, 2000);
      return () => clearTimeout(delayTimer);
    }
  }, [progress, serverStatus]);

  useEffect(() => {
    if (loadingComplete && serverStatus === 'online') {
      setTimeout(redirectToApp, 3000);
    }
  }, [loadingComplete, serverStatus]);

  return (
    <div className="app-container">
      <div className="gradient-background"></div>
      <div className="status-capsule">
        <div className={`status-indicator ${serverStatus}`}></div>
        <span>OnaSpark Status: {serverStatus}</span>
      </div>
      {!loadingComplete && (
        <button 
          className={`access-spark-btn ${serverStatus === 'online' ? 'enabled' : 'disabled'}`} 
          onClick={redirectToApp}
          disabled={serverStatus !== 'online'}
        >
          Accéder à Spark
        </button>
      )}
      
      {loadingComplete && serverStatus === 'online' && (
        <h1 className="welcome-message-spark">
          Bienvenue sur Spark
        </h1>
      )}

      <div className={`content ${loadingComplete ? 'fade-out' : ''}`}>
        <div className={`loading-details ${loadingComplete ? 'fade-out' : ''}`}>
          <h1 className="loading-title">Chargement</h1>
          <p className="loading-text">
            Spark nécessite quelques secondes pour charger<span className="animated-dots"></span>
          </p>
          <p className="dynamic-phrase">{phrases[currentPhraseIndex]}</p>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          {showDelayMessage && (
            <p className="delay-message">
              Spark prend plus de temps que prévu, veuillez patienter !
            </p>
          )}
        </div>
        
<<<<<<< HEAD
        <img src="/images/onalogos/sparkLogofullnewd.png" alt="Spark Logo" className="logo" />
=======
        <div className="logo-section">
          <img src="/images/onalogos/sparkLogofullnewd.png" alt="Spark Logo" className="logo" />
          <DynamicFeatures />
        </div>
>>>>>>> 8f711dd3057f19a28f7d37ff051bbd8a12754f30
        
        {loadingComplete && serverStatus === 'offline' && (
          <p className="server-offline-text">Le serveur est actuellement indisponible. Veuillez réessayer plus tard.</p>
        )}
      </div>
    </div>
  );
}

export default App;