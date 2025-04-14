
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AnimationContextProps {
  animationsEnabled: boolean;
  toggleAnimations: () => void;
  getAnimationDuration: (duration: number) => number;
}

const AnimationContext = createContext<AnimationContextProps>({
  animationsEnabled: true,
  toggleAnimations: () => {},
  getAnimationDuration: (duration) => duration,
});

export const useAnimations = () => useContext(AnimationContext);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check local storage for user preference or system preference
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    const savedPreference = localStorage.getItem('animations-enabled');
    
    if (savedPreference !== null) {
      return savedPreference === 'true';
    }
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !prefersReducedMotion;
  });

  // Save preference to local storage when it changes
  useEffect(() => {
    localStorage.setItem('animations-enabled', animationsEnabled.toString());
    
    // Apply a CSS class to the document body for global animation toggling
    if (animationsEnabled) {
      document.body.classList.remove('animations-disabled');
    } else {
      document.body.classList.add('animations-disabled');
    }
  }, [animationsEnabled]);

  const toggleAnimations = () => {
    setAnimationsEnabled(prev => !prev);
  };

  // Helper function to return 0 duration when animations are disabled
  const getAnimationDuration = (duration: number) => {
    return animationsEnabled ? duration : 0;
  };

  return (
    <AnimationContext.Provider value={{ 
      animationsEnabled, 
      toggleAnimations,
      getAnimationDuration
    }}>
      {children}
    </AnimationContext.Provider>
  );
};
