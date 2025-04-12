
import React, { useEffect } from 'react';

interface WelcomeAnimationProps {
  name: string;
  onClose: () => void;
}

const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ name, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg p-6 text-center animate-scale-in">
        <h2 className="text-2xl font-bold mb-4">Hey {name.split(' ')[0]}, welcome to Haan!</h2>
        <div className="confetti-animation relative h-24">
          {/* Simple confetti animation */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full animate-fall"
              style={{
                top: `${Math.random() * -10}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 75%)`,
                animationDuration: `${Math.random() * 2 + 1}s`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
        <p className="text-gray-600 mt-2">Your personal schedule assistant</p>
      </div>
    </div>
  );
};

export default WelcomeAnimation;
