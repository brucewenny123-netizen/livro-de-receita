import React, { useState, useEffect } from 'react';
import type { Category } from '../types';
import { ChefIcon, DrinkIcon, JuiceIcon, SearchIcon } from './icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  category: Category;
  setCategory: (category: Category) => void;
  initialQuery?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, category, setCategory, initialQuery }) => {
  const [query, setQuery] = useState(initialQuery || '');

  useEffect(() => {
    if (initialQuery !== undefined) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  const categories: { name: Category; icon: React.ReactNode }[] = [
    { name: 'Refeições', icon: <ChefIcon className="w-5 h-5 mr-2" /> },
    { name: 'Drinks', icon: <DrinkIcon className="w-5 h-5 mr-2" /> },
    { name: 'Sucos', icon: <JuiceIcon className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/20">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: Frango com limão, Caipirinha de morango..."
            className="w-full h-14 pl-12 pr-4 bg-white/50 dark:bg-gray-700/50 border-2 border-transparent focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 rounded-xl outline-none transition-all duration-300 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isLoading}
            />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto h-14 px-8 bg-teal-600 text-white font-semibold rounded-xl shadow-md hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-400 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
        >
          {isLoading ? 'Gerando...' : 'Buscar Receita'}
        </button>
      </form>
      <div className="flex justify-center items-center gap-2 md:gap-4 mt-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setCategory(cat.name)}
            disabled={isLoading}
            className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              category === cat.name
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};
