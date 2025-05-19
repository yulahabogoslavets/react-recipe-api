type RecipeCardProps = {
  meal: {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strInstructions: string;
  };
  onClick: (id: string) => void;
};

export function RecipeCard({ meal, onClick }: RecipeCardProps) {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '1em',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        maxWidth: '500px',
      }}
      onClick={() => onClick(meal.idMeal)}
    >
      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        style={{
          width: '100px',
          height: '100px',
          objectFit: 'cover',
          borderRadius: '8px',
          marginRight: '1em',
        }}
      />
      <div>
        <h3 style={{ margin: 0 }}>{meal.strMeal}</h3>
        <p
          style={{
            margin: '0.5em 0 0 0',
            fontSize: '0.9em',
            color: '#555',
          }}
        >
          {meal.strInstructions
            ? meal.strInstructions.slice(0, 100) + '...'
            : ''}
        </p>
      </div>
    </div>
  );
}
