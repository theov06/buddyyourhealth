import React, { useState, useRef, useEffect } from 'react';
import { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
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
  label: string;
  description: string;
  position: { x: number; y: number };
  delay: number;
  onClick: () => void;
  theme: string;
}

function FeatureButton({ label, description, position, delay, onClick, theme }: FeatureButtonProps) {
  return (
    <div
      className={`feature-button ${theme}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        animationDelay: `${delay}ms`
      }}
      onClick={(e) => {
        console.log('FeatureButton clicked:', label);
        e.stopPropagation();
        onClick();
      }}
    >
      <div className="feature-button-inner">
        <div className="feature-label">{label}</div>
        <div className="feature-description">{description}</div>
      </div>
      <div className="feature-button-glow"></div>
    </div>
  );
}

export default function InteractiveRobot() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();
  const [isActivated, setIsActivated] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  // Debug: Check localStorage for any stale auth data
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    console.log('localStorage check:', { 
      hasToken: !!token, 
      hasStoredUser: !!storedUser,
      token: token ? 'EXISTS' : 'NULL',
      storedUser: storedUser ? 'EXISTS' : 'NULL'
    });
  }, []);

  const handleRobotClick = () => {
    console.log('Robot clicked! isAuthenticated:', isAuthenticated, 'isActivated:', isActivated);
    
    // Only allow activation if user is authenticated
    if (!isAuthenticated) {
      alert('Please sign in to activate the AI assistant and access health features.');
      return;
    }
    
    if (!isActivated) {
      console.log('Activating robot...');
      setIsActivated(true);
      setTimeout(() => {
        console.log('Showing features...');
        setShowFeatures(true);
      }, 800);
    } else {
      console.log('Deactivating robot...');
      setShowFeatures(false);
      setTimeout(() => setIsActivated(false), 300);
    }
  };

  const handleCloseClick = () => {
    console.log('Close button clicked!');
    setShowFeatures(false);
    setTimeout(() => setIsActivated(false), 300);
  };

  const handleFeatureClick = (feature: string) => {
    console.log(`Feature clicked: ${feature}`);
    // Add navigation or modal logic here
    switch (feature) {
      case 'ai-staff':
        // Open AI chat interface or navigate to AI consultation page
        alert('🤖 AI Staff: Hello! I\'m here to help with your health questions. This feature will connect you to our AI health assistant.');
        break;
      case 'health-monitor':
        // Navigate to health monitoring dashboard
        alert('💓 Health Monitor: Access real-time monitoring of your vital signs, heart rate, and health metrics.');
        break;
      case 'smart-reminders':
        // Open smart reminders settings
        alert('📱 Smart Reminders: Set up personalized health reminders for medications, workouts, and wellness checks.');
        break;
    }
  };

  const features = [
    {
      label: 'Ask Our AI Staff',
      description: 'Get instant health advice',
      position: { x: 50, y: 15 }, // Top - centered
      delay: 0,
      id: 'ai-staff'
    },
    {
      label: 'Health Monitor',
      description: 'Real-time vital tracking',
      position: { x: 20, y: 50 }, // Left - moved more to the right
      delay: 100,
      id: 'health-monitor'
    },
    {
      label: 'Smart Reminders',
      description: 'Personalized health alerts',
      position: { x: 80, y: 50 }, // Right - positioned on the right side
      delay: 200,
      id: 'smart-reminders'
    }
  ];

  // Debug logging
  console.log('InteractiveRobot render:', { 
    isAuthenticated, 
    isLoading,
    isActivated, 
    showFeatures, 
    user: user ? 'User exists' : 'No user',
    userEmail: user?.email || 'No email',
    shouldShowButton: !isActivated && !isLoading && isAuthenticated
  });

  return (
    <div className="interactive-robot-container">
      {/* Robot Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{
          position: 'absolute',
          top: '50%',
          right: '50px',
          width: '500px',
          height: '500px',
          transform: 'translateY(-50%)',
          zIndex: isActivated ? 5 : 0,
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



      {/* Activation Button (positioned near the robot) - Only show when authenticated */}
      {!isActivated && !isLoading && isAuthenticated && (
        <div 
          className={`robot-activation-button ${theme}`} 
          onClick={(e) => {
            e.stopPropagation();
            console.log('Activation button clicked!');
            handleRobotClick();
          }}
          style={{ 
            cursor: 'pointer'
          }}
        >
          <div className="robot-activation-inner">
            <div className="activation-label">ACTIVATE</div>
            <div className="activation-description">Start AI Assistant</div>
          </div>
          <div className="activation-pulse"></div>
        </div>
      )}

      {/* Feature Buttons (positioned around the robot) */}
      {showFeatures && (
        <div className="robot-features-container">
          {features.map((feature) => (
            <FeatureButton
              key={feature.id}
              label={feature.label}
              description={feature.description}
              position={feature.position}
              delay={feature.delay}
              theme={theme}
              onClick={() => handleFeatureClick(feature.id)}
            />
          ))}
          
          {/* Deactivate Button */}
          <div className={`robot-deactivate-button ${theme}`} onClick={handleCloseClick}>
            <div className="robot-deactivate-inner">
              <div className="deactivate-label">CLOSE</div>
              <div className="deactivate-description">Stop AI Assistant</div>
            </div>
            <div className="deactivate-pulse"></div>
          </div>
        </div>
      )}

      {/* Compact Status Display */}
      {isActivated && (
        <div className={`robot-status-compact ${theme}`}>
          <div className="status-indicator active"></div>
          <div className="status-text">AI ONLINE</div>
        </div>
      )}
    </div>
  );
}