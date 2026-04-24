"use client";

import React from "react";
// Omijamy cache tak samo jak w LogoAuth
import logoImg from "../public/icons/logo-europlanner.png"; 

const Logo = () => {
  return (
    <div className="flex items-center w-full transform-none transition-none pointer-events-none select-none">
      <img 
        // Używamy bezpiecznego, bezpośredniego importu
        src={logoImg.src} 
        alt="EuroPlanner Logo" 
        className="h-24 w-auto object-contain ml-4 transform-none transition-none" 
      />
    </div>
  );
};


export default Logo;