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
  const [autoRedirect, setAutoRedirect] = useState(true);
  const [isServerReady, setIsServerReady] = useState(false);
  const [checkingServer, setCheckingServer] = useState(false);

  const checkServerStatus = async () => {
    try {
      setCheckingServer(true);
      await fetch('https://sparkbrq.onrender.com/', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      setIsServerReady(true);
      return true;
    } catch (error) {
      console.log('Server not ready yet, will retry...');
      return false;
    } finally {
      setCheckingServer(false);
    }
  };

  const redirectToApp = () => {
    window.location.href = 'https://sparkbrq.onrender.com/';
  };

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
    if (loadingComplete) {
      const checkInterval = setInterval(async () => {
        const serverReady = await checkServerStatus();
        if (serverReady) {
          clearInterval(checkInterval);
          if (autoRedirect) {
            setTimeout(redirectToApp, 1000); // Small delay for user feedback
          }
        }
      }, 2000); // Check every 2 seconds

      return () => clearInterval(checkInterval);
    }
  }, [loadingComplete, autoRedirect]);

  return (
    <div>
      <div className="background-container">
        <DarkVeil />
      </div>
      <div className="content">
        <div className="auto-redirect-toggle">
          <label>
            <input
              type="checkbox"
              checked={autoRedirect}
              onChange={(e) => setAutoRedirect(e.target.checked)}
            />
            Redirection automatique
          </label>
        </div>
        
        <img src="/images/onalogos/sparkLogofullnewd.png" alt="Spark Logo" className={`logo ${loadingComplete ? 'fade-out' : ''}`} />
        <div className="welcome-text">Welcome</div>
        
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
          <div className="server-status">
            {checkingServer && (
              <p className="checking-text">Vérification du serveur...</p>
            )}
            {isServerReady && !autoRedirect && (
              <button className="go-to-spark-btn" onClick={redirectToApp}>
                Aller vers Spark
              </button>
            )}
            {isServerReady && autoRedirect && (
              <p className="redirect-text">Redirection en cours...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 