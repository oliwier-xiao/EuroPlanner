"use client";

import React from "react";
// Omijamy statyczny routing i importujemy plik bezpośrednio!
import logoImg from "../public/icons/logo-auth.png"; 

const LogoAuth = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <img 
        // Wstawiamy wygenerowaną przez system ścieżkę:
        src={logoImg.src} 
        alt="EuroPlanner Logo" 
        className="h-24 w-auto object-contain pointer-events-auto"
      />
    </div>
  );
};

export default LogoAuth;