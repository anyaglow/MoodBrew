import React from 'react';
import type { DrinkRecommendation } from '../types.ts';
import { RemixIcon } from './icons/RemixIcon.tsx';
import { BackIcon } from './icons/BackIcon.tsx';

interface RecommendationCardProps {
  recommendation: DrinkRecommendation;
  onRemix: () => void;
  onReset: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onRemix, onReset }) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md flex flex-col items-center gap-6 animate-fade-in-up transform transition-all duration-500">
      <div className="w-full aspect-square rounded-xl overflow-hidden shadow-lg">
        <img 
          src={recommendation.imageUrl} 
          alt={recommendation.drinkName} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-amber-900">{recommendation.drinkName}</h2>
        <p className="mt-4 text-lg text-stone-600 italic">"{recommendation.quote}"</p>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2 text-stone-700 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors duration-300"
        >
          <BackIcon className="w-5 h-5" />
          Start Over
        </button>
        <button
          onClick={onRemix}
          className="flex items-center gap-2 px-6 py-3 bg-amber-800 text-white font-semibold rounded-full hover:bg-amber-900 transition-colors duration-300 shadow-md transform hover:scale-105"
        >
          <RemixIcon className="w-5 h-5" />
          Remix
        </button>
      </div>
    </div>
  );
};