import React, { useState, useCallback } from 'react';
import { MoodSelector } from './components/MoodSelector.tsx';
import { RecommendationCard } from './components/RecommendationCard.tsx';
import { Loader } from './components/Loader.tsx';
import { getDrinkRecommendation, generateDrinkImage } from './services/geminiService.ts';
import type { DrinkRecommendation } from './types.ts';
import { CoffeeCupIcon } from './components/icons/CoffeeCupIcon.tsx';
import { GithubIcon } from './components/icons/GithubIcon.tsx';

const App: React.FC = () => {
  const [moodPrompt, setMoodPrompt] = useState<string>('');
  const [recommendation, setRecommendation] = useState<DrinkRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleBrewRequest = useCallback(async (currentMoodPrompt: string) => {
    if (!currentMoodPrompt.trim()) {
      setError('Please select or type a mood to begin!');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const drinkData = await getDrinkRecommendation(currentMoodPrompt);
      if (drinkData && drinkData.drinkName) {
        const imageData = await generateDrinkImage(drinkData.drinkName);
        setRecommendation({
          ...drinkData,
          imageUrl: `data:image/jpeg;base64,${imageData}`,
        });
      } else {
        throw new Error('Could not generate a drink recommendation.');
      }
    } catch (err) {
      console.error(err);
      setError('Oops! The brew master is busy. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = useCallback((currentMoodPrompt: string) => {
    setMoodPrompt(currentMoodPrompt);
    handleBrewRequest(currentMoodPrompt);
  }, [handleBrewRequest]);

  const handleRemix = useCallback(() => {
    if (moodPrompt) {
      handleBrewRequest(moodPrompt);
    }
  }, [moodPrompt, handleBrewRequest]);

  const handleReset = () => {
    setRecommendation(null);
    setError(null);
    setMoodPrompt('');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col items-center justify-between p-4 selection:bg-amber-300 selection:text-amber-900">
      <header className="w-full max-w-4xl mx-auto flex justify-center items-center p-4">
        <h1 className="text-4xl md:text-5xl font-brand text-amber-900 flex items-center gap-3">
          <CoffeeCupIcon className="w-10 h-10" />
          MoodBrew
        </h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 text-center">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-amber-800 text-white rounded-full hover:bg-amber-900 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        ) : recommendation ? (
          <RecommendationCard 
            recommendation={recommendation} 
            onRemix={handleRemix}
            onReset={handleReset}
          />
        ) : (
          <MoodSelector onSubmit={handleSubmit} />
        )}
      </main>

      <footer className="w-full max-w-4xl mx-auto p-4 text-center text-stone-500 text-sm">
        <div className="flex justify-center items-center gap-4">
            <p>Crafted with AI by a Senior Frontend React Engineer.</p>
            <a href="https://github.com/google/genai-js" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-amber-900 transition-colors">
                <GithubIcon className="w-6 h-6" />
            </a>
        </div>
      </footer>
    </div>
  );
};

export default App;