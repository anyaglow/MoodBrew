import React, { useState } from 'react';
import { MOOD_OPTIONS } from '../constants.ts';

interface MoodSelectorProps {
  onSubmit: (moodPrompt: string) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ onSubmit }) => {
  const [customMood, setCustomMood] = useState<string>('');
  const [selectedMoods, setSelectedMoods] = useState<Set<string>>(new Set());

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => {
      const newMoods = new Set(prev);
      if (newMoods.has(mood)) {
        newMoods.delete(mood);
      } else {
        newMoods.add(mood);
      }
      return newMoods;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedMoods = [customMood, ...Array.from(selectedMoods)].filter(Boolean).join(', ');
    onSubmit(combinedMoods);
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-light text-stone-700">How are you feeling today?</h2>
      
      <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col items-center gap-6">
        <input
          type="text"
          value={customMood}
          onChange={(e) => setCustomMood(e.target.value)}
          placeholder="Or type your own mood, vibe, or craving..."
          className="w-full px-5 py-3 text-lg border-2 border-stone-300 rounded-full focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors duration-300 outline-none"
        />

        <div className="flex flex-wrap justify-center gap-3">
          {MOOD_OPTIONS.map(mood => {
            const isSelected = selectedMoods.has(mood);
            return (
              <button
                key={mood}
                type="button"
                onClick={() => toggleMood(mood)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  isSelected 
                    ? 'bg-amber-800 text-white shadow-md' 
                    : 'bg-white text-stone-700 border border-stone-300 hover:bg-amber-100'
                }`}
              >
                {mood}
              </button>
            );
          })}
        </div>

        <button 
          type="submit"
          className="mt-4 px-10 py-4 bg-amber-900 text-white font-bold text-lg rounded-full hover:bg-black transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-400"
        >
          Brew My Mood
        </button>
      </form>
    </div>
  );
};