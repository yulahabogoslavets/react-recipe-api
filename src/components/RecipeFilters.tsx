import React from 'react';

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
  return (
    <div style={{ display: 'flex', gap: '1em', margin: '1em 0' }}>
      <select value={area} onChange={onAreaChange}>
        {areas.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
      <select value={category} onChange={onCategoryChange}>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select value={ingredient} onChange={onIngredientChange}>
        {ingredients.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
    </div>
  );
}
