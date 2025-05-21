import { RecipeCard } from './RecipeCard';
import type { Meal } from '../types/Meal';

type RecipeListProps = {
  meals: Meal[];
  onMealClick: (id: string) => void;
};

export function RecipeList({ meals, onMealClick }: RecipeListProps) {
  return (
    <ul>
      {meals.map((meal) => (
        <li key={meal.idMeal} className="mb-4">
          <RecipeCard meal={meal} onClick={onMealClick} />
        </li>
      ))}
    </ul>
  );
}
