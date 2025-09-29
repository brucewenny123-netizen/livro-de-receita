
import React from 'react';
import type { Recipe } from '../types';
// FIX: Removed import for 'ChefHatIcon' as it is not exported from './icons' and was not used in this component.
import { ListIcon, StepForwardIcon } from './icons';

interface RecipeCardProps {
  recipe: Recipe;
  imageUrl: string;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, imageUrl }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
      <div className="relative">
        <img src={imageUrl} alt={recipe.recipeName} className="w-full h-64 md:h-80 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <span className="px-3 py-1 bg-teal-500 text-white text-sm font-semibold rounded-full mb-2 inline-block">{recipe.category}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white shadow-text">{recipe.recipeName}</h2>
        </div>
      </div>
      
      <div className="p-6 md:p-8">
        <p className="text-gray-600 dark:text-gray-300 mb-8 italic">{recipe.description}</p>
        
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <h3 className="flex items-center text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              <ListIcon className="w-6 h-6 mr-3 text-teal-500" />
              Ingredientes
            </h3>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 h-2 w-2 bg-teal-500 rounded-full"></span>
                  <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h3 className="flex items-center text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                <StepForwardIcon className="w-6 h-6 mr-3 text-teal-500" />
                Passo a Passo
            </h3>
            <ol className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 mr-4 h-8 w-8 bg-teal-500 text-white font-bold text-sm rounded-full flex items-center justify-center">{index + 1}</span>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

const keyframes = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

const style = document.createElement('style');
style.textContent = `
  ${keyframes}
  .animate-fade-in {
    animation: fadeIn 0.7s ease-out forwards;
  }
  .shadow-text {
    text-shadow: 1px 1px 3px rgba(0,0,0,0.7);
  }
`;
document.head.append(style);