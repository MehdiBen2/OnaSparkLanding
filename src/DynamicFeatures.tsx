import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DynamicFeatures.css';

const features = [
  "Rapports générés en secondes",
  "Recherche intelligente",
  "Consolidation automatique",
  "Travail d'heures transformé en minutes",
  "Optimisation des opérations",
  "Audit réglementaire simplifié",
  "Facilité d'utilisation",
  "Analyse prédictive avancée",
  "Tableaux de bord personnalisables",
  "Collaboration en temps réel"
];

export default function DynamicFeatures() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dynamic-features-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.5,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
          className="feature-text"
        >
          {features[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
