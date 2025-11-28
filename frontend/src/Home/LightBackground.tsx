import React from 'react';
import './LightBackground.css';

const LightBackground: React.FC = () => {
  return (
    <div className="light-background">
      {/* Floating Health Icons */}
      <div className="health-icons">
        <div className="health-icon icon-1">💊</div>
        <div className="health-icon icon-2">🫀</div>
        <div className="health-icon icon-3">🧬</div>
        <div className="health-icon icon-4">⚕️</div>
        <div className="health-icon icon-5">🩺</div>
        <div className="health-icon icon-6">💚</div>
      </div>
      
      {/* Geometric Health Patterns */}
      <div className="geometric-patterns">
        <div className="pattern-circle circle-1"></div>
        <div className="pattern-circle circle-2"></div>
        <div className="pattern-circle circle-3"></div>
        <div className="pattern-hexagon hex-1"></div>
        <div className="pattern-hexagon hex-2"></div>
      </div>
      
      {/* Pulse Waves */}
      <div className="pulse-waves">
        <div className="pulse-wave wave-1"></div>
        <div className="pulse-wave wave-2"></div>
        <div className="pulse-wave wave-3"></div>
      </div>
      
      {/* DNA Helix Pattern */}
      <div className="dna-helix">
        <div className="helix-strand strand-1"></div>
        <div className="helix-strand strand-2"></div>
      </div>
    </div>
  );
};

export default LightBackground;