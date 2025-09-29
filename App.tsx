import React, { useState, useCallback, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { RecipeCard } from './components/RecipeCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateRecipeAndImage, generateSuggestionsForCategory } from './services/geminiService';
import type { Recipe, Category, Suggestions } from './types';
import { SuggestionsDisplay } from './components/SuggestionsDisplay';

const App: React.FC = () => {
  const [category, setCategory] = useState<Category>('Refeições');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(true);
  const [initialQuery, setInitialQuery] = useState('');

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsSuggestionsLoading(true);
      try {
        const categories: Category[] = ['Refeições', 'Drinks', 'Sucos'];
        const suggestionsPromises = categories.map(cat => generateSuggestionsForCategory(cat));
        const results = await Promise.all(suggestionsPromises);
        
        const newSuggestions: Suggestions = {
          'Refeições': results[0],
          'Drinks': results[1],
          'Sucos': results[2],
        };
        setSuggestions(newSuggestions);
      } catch (err) {
        console.error("Failed to load suggestions", err);
        setError('Não foi possível carregar as sugestões. Tente recarregar a página.');
      } finally {
        setIsSuggestionsLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      setError('Por favor, insira o que você gostaria de cozinhar.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setRecipeImage(null);
    setInitialQuery(query);

    try {
      const result = await generateRecipeAndImage(query, category);
      if (result) {
        setRecipe(result.recipe);
        setRecipeImage(result.imageUrl);
      } else {
        setError('Não foi possível gerar a receita. Tente novamente.');
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao buscar a receita. Verifique o console para mais detalhes.');
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  const handleSuggestionClick = useCallback((suggestion: string, cat: Category) => {
    setCategory(cat);
    handleSearch(suggestion);
  }, [handleSearch]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div 
        className="absolute inset-0 h-1/2 bg-cover bg-center" 
        style={{ backgroundImage: 'url(https://picsum.photos/1920/1080?grayscale&blur=2)' }}
      ></div>
      <div className="absolute inset-0 h-1/2 bg-gradient-to-b from-black/30 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-100 dark:from-gray-900 via-transparent to-transparent"></div>
      
      <main className="relative container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Explorador de Culinária Global
          </h1>
          <p className="text-lg text-white/90 mt-2 drop-shadow-md">Sua inspiração culinária com um toque de IA</p>
        </header>
        
        <SearchBar 
          onSearch={handleSearch} 
          isLoading={isLoading} 
          category={category}
          setCategory={setCategory}
          initialQuery={initialQuery}
        />
        
        {error && <p className="text-center text-red-500 mt-6 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>}
        
        <div className="mt-12">
          {isLoading && <LoadingSpinner />}
          {!isLoading && !recipe && (
            <SuggestionsDisplay 
              suggestions={suggestions}
              isLoading={isSuggestionsLoading}
              onSuggestionClick={handleSuggestionClick}
            />
          )}
          {recipe && recipeImage && (
            <RecipeCard recipe={recipe} imageUrl={recipeImage} />
          )}
        </div>
      </main>
      <footer className="relative text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
        <p>Criado com React, Tailwind CSS e Gemini AI.</p>
      </footer>
    </div>
  );
};

export default App;
