import { useState, useEffect, useDeferredValue, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { RecipeFilters } from './RecipeFilters'
import { RecipeList } from './RecipeList'
import type { Meal } from '../types/Meal'
import { LoadingSkeleton } from './LoadingSkeleton'

export function SearchInput() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Meal[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [area, setArea] = useState('All')
    const [category, setCategory] = useState('All')
    const [ingredient, setIngredient] = useState('All')
    const deferredQuery = useDeferredValue(query)

    useEffect(() => {
        const fetchInitialRecipes = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch(
                    'https://www.themealdb.com/api/json/v1/1/search.php?s='
                )
                const data = await res.json()
                setResults(data.meals || [])
            } catch {
                setError('Failed to fetch recipes.')
            } finally {
                setLoading(false)
            }
        }
        fetchInitialRecipes()
    }, [])

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setQuery(e.target.value)

    const onAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newArea = e.target.value
        setArea(newArea)
        const areaMeals = results.filter(
            (meal) => newArea === 'All' || meal.strArea === newArea
        )
        const availableCategories = Array.from(
            new Set(areaMeals.map((meal) => meal.strCategory))
        ).filter(Boolean)
        const availableIngredients = Array.from(
            new Set(areaMeals.map((meal) => meal.strIngredient1))
        ).filter(Boolean)
        if (!availableCategories.includes(category)) setCategory('All')
        if (!availableIngredients.includes(ingredient)) setIngredient('All')
    }

    const onCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value
        setCategory(newCategory)
        const categoryMeals = results.filter(
            (meal) =>
                (area === 'All' || meal.strArea === area) &&
                (newCategory === 'All' || meal.strCategory === newCategory)
        )
        const availableIngredients = Array.from(
            new Set(categoryMeals.map((meal) => meal.strIngredient1))
        ).filter(Boolean)
        if (!availableIngredients.includes(ingredient)) setIngredient('All')
    }

    const onIngredientChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
        setIngredient(e.target.value)

    const onSearch = async () => {
        if (!query) return
        setLoading(true)
        setError(null)
        setResults([])
        try {
            const res = await fetch(
                `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
                    query
                )}`
            )
            const data = await res.json()
            setResults(data.meals || [])
            setArea('All')
            setCategory('All')
            setIngredient('All')
        } catch {
            setError('Failed to fetch recipes.')
        } finally {
            setLoading(false)
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') onSearch()
    }

    const filteredResults = useMemo(() => {
        return results.filter(
            (meal) =>
                (area === 'All' || meal.strArea === area) &&
                (category === 'All' || meal.strCategory === category) &&
                (ingredient === 'All' || meal.strIngredient1 === ingredient) &&
                (!deferredQuery ||
                    meal.strMeal
                        .toLowerCase()
                        .includes(deferredQuery.toLowerCase()))
        )
    }, [results, area, category, ingredient, deferredQuery])

    const dynamicAreas = useMemo(
        () => [
            'All',
            ...Array.from(new Set(results.map((meal) => meal.strArea))).filter(
                Boolean
            ),
        ],
        [results]
    )
    const dynamicCategories = useMemo(
        () => [
            'All',
            ...Array.from(
                new Set(filteredResults.map((meal) => meal.strCategory))
            ).filter(Boolean),
        ],
        [filteredResults]
    )
    const dynamicIngredients = useMemo(
        () => [
            'All',
            ...Array.from(
                new Set(filteredResults.map((meal) => meal.strIngredient1))
            ).filter(Boolean),
        ],
        [filteredResults]
    )

    const navigate = useNavigate()
    const handleMealClick = (mealId: string) => {
        const params = new URLSearchParams({
            area,
            category,
            ingredient,
            query,
        })
        navigate(`/meal/${mealId}?${params.toString()}`)
    }

    return (
        <>
            <div className="join">
                <label className="input">
                    <svg
                        className="h-[1em] opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
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
                        aria-label="Search for a recipe"
                    />
                </label>

                <button
                    className="btn"
                    onClick={onSearch}
                    aria-label="Start search"
                >
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
            {loading && <LoadingSkeleton />}
            {filteredResults.length === 0 && !loading && !error && (
                <div role="status" aria-live="polite">
                    <h2 className="text-red-950">
                        No recipes match your filters.
                    </h2>
                </div>
            )}

            {filteredResults.length >= 1 && (
                <div aria-live="polite" className="mb-2">
                    <p className="underline decoration-blue-500">
                        Results:{' '}
                        <span className="font-semibold" role="status">
                            {filteredResults.length}
                        </span>
                    </p>
                </div>
            )}

            <RecipeList meals={filteredResults} onMealClick={handleMealClick} />
        </>
    )
}
