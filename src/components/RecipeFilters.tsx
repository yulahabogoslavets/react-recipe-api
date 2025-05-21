import React, { useState, useRef, useEffect } from 'react';

type RecipeFiltersProps = {
  area: string;
  category: string;
  ingredient: string;
  areas: string[];
  categories: string[];
  ingredients: string[];
  onAreaChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onIngredientChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function RecipeFilters({
  area,
  category,
  ingredient,
  areas,
  categories,
  ingredients,
  onAreaChange,
  onCategoryChange,
  onIngredientChange,
}: RecipeFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => {
    if (filterRef.current) {
      setMaxHeight(showFilters ? `${filterRef.current.scrollHeight}px` : '0px');
    }
  }, [showFilters, areas, categories, ingredients]);

  return (
    <>
      {/* Show button only on mobile */}
      <button
        className="btn btn-outline flex md:hidden"
        aria-controls="filters-panel"
        aria-expanded={showFilters}
        onClick={() => setShowFilters((v) => !v)}
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
      <div
        id="filters-panel"
        ref={filterRef}
        className={`transition-all duration-500 ease-in-out overflow-hidden flex gap-4 my-2 flex-col md:flex-row md:!opacity-100 md:!max-h-full`}
        style={{
          maxHeight: showFilters ? maxHeight : '0px',
          opacity: showFilters ? 1 : 0,
        }}
      >
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Country</legend>
          <select
            className="select"
            value={area}
            onChange={onAreaChange}
            aria-label="Filter by country"
          >
            <option disabled={true}>Pick a country</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <span className="label">Optional</span>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Category</legend>
          <select
            className="select"
            value={category}
            onChange={onCategoryChange}
            aria-label="Filter by category"
          >
            <option disabled={true}>Pick a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className="label">Optional</span>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Ingredients</legend>
          <select
            className="select"
            value={ingredient}
            onChange={onIngredientChange}
            aria-label="Filter by ingrediets"
          >
            <option disabled={true}>Pick a ingrediet</option>
            {ingredients.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <span className="label">Optional</span>
        </fieldset>
      </div>
    </>
  );
}
