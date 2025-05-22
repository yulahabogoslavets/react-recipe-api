type RecipeCardProps = {
    meal: {
        idMeal: string
        strMeal: string
        strMealThumb: string
        strInstructions: string
    }
    onClick: (id: string) => void
}

export function RecipeCard({ meal, onClick }: RecipeCardProps) {
    return (
        <>
            <div className="card bg-base-100 image-full w-3xs shadow-sm">
                <figure>
                    <img src={meal.strMealThumb} alt={meal.strMeal} />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">{meal.strMeal}</h2>
                    <p className="line-clamp-6">{meal.strInstructions}</p>
                    <div className="card-actions justify-end">
                        <button
                            className="btn btn-primary cursor-pointer"
                            onClick={() => onClick(meal.idMeal)}
                            aria-label={`View details for ${meal.strMeal}`}
                        >
                            Show more
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
