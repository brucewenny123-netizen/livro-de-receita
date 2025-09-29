import React from 'react';
import type { Suggestions, Category } from '../types';
import { ChefIcon, DrinkIcon, JuiceIcon } from './icons';

interface SuggestionsDisplayProps {
  suggestions: Suggestions | null;
  isLoading: boolean;
  onSuggestionClick: (suggestion: string, category: Category) => void;
}

const categoryIcons: Record<Category, React.ReactNode> = {
  'Refeições': <ChefIcon className="w-7 h-7 mr-3 text-teal-500" />,
  'Drinks': <DrinkIcon className="w-7 h-7 mr-3 text-rose-500" />,
  'Sucos': <JuiceIcon className="w-7 h-7 mr-3 text-amber-500" />,
};

const SkeletonLoader: React.FC = () => (
    <div className="animate-pulse">
        <div className="h-8 w-1/3 bg-gray-300 dark:bg-gray-700 rounded-md mb-4"></div>
        <div className="h-48 w-full bg-gray-300 dark:bg-gray-700 rounded-xl mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            ))}
        </div>
    </div>
);


export const SuggestionsDisplay: React.FC<SuggestionsDisplayProps> = ({ suggestions, isLoading, onSuggestionClick }) => {
  if (isLoading) {
    return (
        <div className="space-y-12">
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
        </div>
    );
  }
  
  if (!suggestions) {
    return <p className="text-center">Não foi possível carregar as sugestões.</p>;
  }

  const categories: Category[] = ['Refeições', 'Drinks', 'Sucos'];

  return (
    <div className="space-y-16 animate-fade-in">
      {categories.map((category) => {
        const categorySuggestions = suggestions[category];
        if (!categorySuggestions) return null;

        return (
          <section key={category}>
            <h2 className="flex items-center text-3xl font-bold text-gray-800 dark:text-white mb-5">
              {categoryIcons[category]}
              Sugestões de {category}
            </h2>
            <div className="relative rounded-xl overflow-hidden mb-6 shadow-lg transform transition-transform duration-300 hover:scale-105">
                <img src={categorySuggestions.imageUrl} alt={`Ilustração para ${category}`} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categorySuggestions.list.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion, category)}
                  className="text-left p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 hover:text-teal-800 dark:hover:text-teal-200 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
