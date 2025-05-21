import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeFilters } from './RecipeFilters';
import { RecipeList } from './RecipeList';
import type { Meal } from '../types/Meal';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [area, setArea] = useState('All');
  const [category, setCategory] = useState('All');
  const [ingredient, setIngredient] = useState('All');

  useEffect(() => {
    const fetchInitialRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          'https://www.themealdb.com/api/json/v1/1/search.php?s='
        );
        const data = await res.json();
        setResults(data.meals || []);
      } catch {
        setError('Failed to fetch recipes.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialRecipes();
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  const onAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newArea = e.target.value;
    setArea(newArea);
    const areaMeals = results.filter(
      (meal) => newArea === 'All' || meal.strArea === newArea
    );
    const availableCategories = Array.from(
      new Set(areaMeals.map((meal) => meal.strCategory))
    ).filter(Boolean);
    const availableIngredients = Array.from(
      new Set(areaMeals.map((meal) => meal.strIngredient1))
    ).filter(Boolean);
    if (!availableCategories.includes(category)) setCategory('All');
    if (!availableIngredients.includes(ingredient)) setIngredient('All');
  };

  const onCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    const categoryMeals = results.filter(
      (meal) =>
        (area === 'All' || meal.strArea === area) &&
        (newCategory === 'All' || meal.strCategory === newCategory)
    );
    const availableIngredients = Array.from(
      new Set(categoryMeals.map((meal) => meal.strIngredient1))
    ).filter(Boolean);
    if (!availableIngredients.includes(ingredient)) setIngredient('All');
  };

  const onIngredientChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setIngredient(e.target.value);

  const onSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      setResults(data.meals || []);
      setArea('All');
      setCategory('All');
      setIngredient('All');
    } catch {
      setError('Failed to fetch recipes.');
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch();
  };

  const filteredResults = results.filter(
    (meal) =>
      (area === 'All' || meal.strArea === area) &&
      (category === 'All' || meal.strCategory === category) &&
      (ingredient === 'All' || meal.strIngredient1 === ingredient)
  );

  const dynamicAreas = [
    'All',
    ...Array.from(new Set(results.map((meal) => meal.strArea))).filter(Boolean),
  ];
  const dynamicCategories = [
    'All',
    ...Array.from(
      new Set(filteredResults.map((meal) => meal.strCategory))
    ).filter(Boolean),
  ];
  const dynamicIngredients = [
    'All',
    ...Array.from(
      new Set(filteredResults.map((meal) => meal.strIngredient1))
    ).filter(Boolean),
  ];

  const navigate = useNavigate();
  const handleMealClick = (mealId: string) => {
    const params = new URLSearchParams({ area, category, ingredient, query });
    navigate(`/meal/${mealId}?${params.toString()}`);
  };

  return (
    <>
      <div className="join">
        <label className="input">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            required
            placeholder="Search for a recipe..."
            value={query}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
          />
        </label>

        <button className="btn" onClick={onSearch}>
          Search
        </button>
      </div>

      <RecipeFilters
        area={area}
        category={category}
        ingredient={ingredient}
        areas={dynamicAreas}
        categories={dynamicCategories}
        ingredients={dynamicIngredients}
        onAreaChange={onAreaChange}
        onCategoryChange={onCategoryChange}
        onIngredientChange={onIngredientChange}
      />
      {loading && <div>Loading...</div>}
      {filteredResults.length === 0 && !loading && !error && (
        <div style={{ margin: '2em 0', color: '#b00', fontWeight: 'bold' }}>
          No recipes match your filters.
        </div>
      )}
      <RecipeList meals={filteredResults} onMealClick={handleMealClick} />
    </>
  );
}
