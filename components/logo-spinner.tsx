"use client";
import { useState } from 'react';

export function LogoSpinner() {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleLogoClick = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      setTimeout(() => setIsSpinning(false), 600);
    }
  };

  return (
    <img 
      src="/logo.png" 
      alt="gRust Panel" 
      width={50} 
      height={50} 
      className={`cursor-pointer transition-transform duration-600 ease-in-out ${isSpinning ? 'animate-spin-left' : ''}`}
      onClick={handleLogoClick}
    />
  );
}
