import React, { useState, useRef, useEffect } from 'react';
import { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useAuth } from '../contexts/AuthContext';
import './InteractiveRobot.css';

interface RobotProps {
  isActivated: boolean;
  onClick: () => void;
}

function RobotModel({ isActivated, onClick }: RobotProps) {
  const { scene } = useGLTF('/models/model.glb');
  const ref = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (ref.current) {
      // Different rotation speeds based on activation state
      const rotationSpeed = isActivated ? 0.8 : 0.3;
      ref.current.rotation.y += delta * rotationSpeed;
      
      // Floating animation when activated
      if (isActivated) {
        ref.current.position.y = Math.sin(Date.now() * 0.002) * 0.2;
      }
      
      // Hover effect
      if (hovered && !isActivated) {
        ref.current.scale.setScalar(2.1 + Math.sin(Date.now() * 0.005) * 0.05);
      } else {
        ref.current.scale.setScalar(isActivated ? 2.2 : 2);
      }
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={2}
      position={[0, 0, 0]}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    />
  );
}

interface FeatureButtonProps {
  icon: string;
  label: string;
  description: string;
  position: { x: number; y: number };
  delay: number;
  onClick: () => void;
}

function FeatureButton({ icon, label, description, position, delay, onClick }: FeatureButtonProps) {
  return (
    <div
      className="feature-button"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        animationDelay: `${delay}ms`
      }}
      onClick={onClick}
    >
      <div className="feature-button-inner">
        <div className="feature-icon">{icon}</div>
        <div className="feature-label">{label}</div>
        <div className="feature-description">{description}</div>
      </div>
      <div className="feature-button-glow"></div>
    </div>
  );
}

export default function InteractiveRobot() {
  const { user, isAuthenticated } = useAuth();
  const [isActivated, setIsActivated] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  const handleRobotClick = () => {
    if (!isAuthenticated) return;
    
    if (!isActivated) {
      setIsActivated(true);
      setTimeout(() => setShowFeatures(true), 800);
    } else {
      setShowFeatures(false);
      setTimeout(() => setIsActivated(false), 300);
    }
  };

  const handleFeatureClick = (feature: string) => {
    console.log(`Feature clicked: ${feature}`);
    // Add navigation or modal logic here
    switch (feature) {
      case 'health-scan':
        // Navigate to health dashboard
        break;
      case 'ai-insights':
        // Open AI insights modal
        break;
      case 'workout-plan':
        // Navigate to workout planner
        break;
      case 'nutrition':
        // Open nutrition tracker
        break;
      case 'progress':
        // Show progress analytics
        break;
      case 'reminders':
        // Open reminder settings
        break;
    }
  };

  const features = [
    {
      icon: '🔬',
      label: 'Health Scan',
      description: 'AI-powered health analysis',
      position: { x: 15, y: 20 },
      delay: 0,
      id: 'health-scan'
    },
    {
      icon: '🧠',
      label: 'AI Insights',
      description: 'Personalized recommendations',
      position: { x: 85, y: 25 },
      delay: 100,
      id: 'ai-insights'
    },
    {
      icon: '💪',
      label: 'Workout Plan',
      description: 'Custom fitness routines',
      position: { x: 20, y: 75 },
      delay: 200,
      id: 'workout-plan'
    },
    {
      icon: '🥗',
      label: 'Nutrition',
      description: 'Smart meal planning',
      position: { x: 80, y: 70 },
      delay: 300,
      id: 'nutrition'
    },
    {
      icon: '📊',
      label: 'Progress',
      description: 'Track your journey',
      position: { x: 10, y: 50 },
      delay: 400,
      id: 'progress'
    },
    {
      icon: '⏰',
      label: 'Reminders',
      description: 'Never miss a goal',
      position: { x: 90, y: 50 },
      delay: 500,
      id: 'reminders'
    }
  ];

  return (
    <div className="interactive-robot-container">
      {/* Robot Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{
          position: 'absolute',
          top: '50%',
          right: '5%',
          width: '500px',
          height: '500px',
          transform: 'translateY(-50%)',
          zIndex: isActivated ? 10 : 0,
          filter: isActivated ? 'drop-shadow(0 0 30px #00ffff)' : 'none',
          transition: 'all 0.5s ease'
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={isActivated ? 0.6 : 0.4} />
          <directionalLight position={[5, 5, 5]} intensity={isActivated ? 1.5 : 1} />
          <pointLight 
            position={[0, 1.5, 0]} 
            intensity={isActivated ? 3 : 2} 
            color={isActivated ? 0x00FFFF : 0xFFFFFF} 
          />
          {isActivated && (
            <>
              <pointLight position={[2, 0, 2]} intensity={1} color={0x00FF88} />
              <pointLight position={[-2, 0, 2]} intensity={1} color={0xFF4444} />
            </>
          )}
          
          <RobotModel isActivated={isActivated} onClick={handleRobotClick} />
        </Suspense>
      </Canvas>

      {/* Activation Button (positioned near the robot) */}
      {isAuthenticated && !isActivated && (
        <div className="robot-activation-button" onClick={handleRobotClick}>
          <div className="robot-activation-inner">
            <div className="activation-icon">⚡</div>
            <div className="activation-text">ACTIVATE</div>
          </div>
          <div className="activation-pulse"></div>
        </div>
      )}

      {/* Feature Buttons (positioned around the robot) */}
      {showFeatures && (
        <div className="robot-features-container">
          {features.map((feature, index) => (
            <FeatureButton
              key={feature.id}
              icon={feature.icon}
              label={feature.label}
              description={feature.description}
              position={feature.position}
              delay={feature.delay}
              onClick={() => handleFeatureClick(feature.id)}
            />
          ))}
          
          {/* Deactivate Button */}
          <div className="robot-deactivate-button" onClick={handleRobotClick}>
            <div className="deactivate-icon">❌</div>
            <div className="deactivate-text">CLOSE</div>
          </div>
        </div>
      )}

      {/* Compact Status Display */}
      {isAuthenticated && isActivated && (
        <div className="robot-status-compact">
          <div className="status-indicator active"></div>
          <div className="status-text">AI ONLINE</div>
        </div>
      )}
    </div>
  );
}