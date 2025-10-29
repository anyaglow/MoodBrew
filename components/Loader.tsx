import React from 'react';
import { CoffeeCupIcon } from './icons/CoffeeCupIcon.tsx';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-amber-900">
      <div className="relative w-24 h-24">
        <CoffeeCupIcon className="w-full h-full animate-pulse" />
        <div className="absolute inset-0 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin"></div>
      </div>
      <p className="text-xl font-semibold animate-pulse">Brewing your perfect drink...</p>
    </div>
  );
};