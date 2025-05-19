import { RecipeCard } from './RecipeCard';
import type { Meal } from '../types/Meal';

type RecipeListProps = {
  meals: Meal[];
  onMealClick: (id: string) => void;
};

export function RecipeList({ meals, onMealClick }: RecipeListProps) {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {meals.map((meal) => (
        <li key={meal.idMeal} style={{ margin: '1em 0' }}>
          <RecipeCard meal={meal} onClick={onMealClick} />
        </li>
      ))}
    </ul>
  );
}
