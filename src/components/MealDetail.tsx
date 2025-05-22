import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { LoadingSkeleton } from './LoadingSkeleton'

interface Meal {
    idMeal: string
    strMeal: string
    strCategory: string
    strArea: string
    strInstructions: string
    strMealThumb: string
    strYoutube: string
    strTags: string
    strSource: string
}

export function MealDetail() {
    const { id } = useParams<{ id: string }>()
    const [meal, setMeal] = useState<Meal | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchMeal = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch(
                    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
                )
                const data = await res.json()
                setMeal(data.meals ? data.meals[0] : null)
            } catch {
                setError('Failed to fetch meal details.')
            } finally {
                setLoading(false)
            }
        }
        fetchMeal()
    }, [id])

    const [tagResults, setTagResults] = useState<Meal[] | null>(null)
    const [selectedTag, setSelectedTag] = useState<string | null>(null)

    const handleTagClick = async (tag: string) => {
        setSelectedTag(tag)
        setTagResults(null)
        // TheMealDB does not have a direct tag endpoint, so we search by tag
        const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
                tag
            )}`
        )
        const data = await res.json()
        setTagResults(data.meals || [])
    }

    if (loading) return <LoadingSkeleton />
    if (error)
        return (
            <div role="status" aria-live="polite" className="text-red-500">
                {error}
            </div>
        )
    if (!meal) return <div>Meal not found.</div>

    return (
        <>
            <div className="container mx-auto my-4 px-4">
                <div className="bg-base-200">
                    <div className="w-full px-2 pt-4">
                        <Link
                            to="/"
                            className="text-sm underline hover:text-blue-500"
                        >
                            ← Back to search
                        </Link>
                    </div>
                    <div className="flex w-full flex-col items-center justify-between gap-4 p-4 sm:flex-row">
                        <div className="flex flex-col items-center gap-2 sm:items-start md:gap-4">
                            <h2 className="text-center text-3xl font-bold text-blue-500 md:mb-2 md:text-left md:text-5xl">
                                {meal.strMeal}
                            </h2>
                            <p>
                                <strong>Category:</strong> {meal.strCategory}
                            </p>
                            <p>
                                <strong>Area:</strong> {meal.strArea}
                            </p>
                        </div>
                        <img
                            src={meal.strMealThumb}
                            alt={meal.strMeal}
                            className="w-full max-w-3xs rounded-lg shadow-2xl lg:max-w-xs"
                        />
                    </div>
                </div>

                <div className="bg-base-100 border-base-300 collapse my-2 border">
                    <input type="checkbox" className="peer" />
                    <div className="collapse-title peer-checked:bg-secondary peer-checked:text-secondary-content bg-blue-500 text-white">
                        <h3>Ingredients</h3>
                    </div>
                    <div className="collapse-content peer-checked:bg-secondary peer-checked:text-secondary-content bg-blue-500 text-white">
                        <ul>
                            {Object.keys(meal)
                                .filter(
                                    (key) =>
                                        key.startsWith('strIngredient') &&
                                        meal[key as keyof typeof meal] &&
                                        meal[key as keyof typeof meal]?.trim()
                                )
                                .map((key) => {
                                    const num = key.replace('strIngredient', '')
                                    const ingredient =
                                        meal[key as keyof typeof meal]
                                    const measure =
                                        meal[
                                            `strMeasure${num}` as keyof typeof meal
                                        ]
                                    return (
                                        <li key={key}>
                                            <strong>{ingredient}</strong>
                                            {measure && measure.trim()
                                                ? ` - ${measure}`
                                                : ''}
                                        </li>
                                    )
                                })}
                        </ul>
                    </div>
                </div>

                {meal.strInstructions && (
                    <>
                        <p className="my-2 text-justify">
                            {meal.strInstructions}
                        </p>
                    </>
                )}

                {meal.strYoutube && (
                    <a
                        href={meal.strYoutube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-4 flex items-center gap-2 text-sm hover:text-blue-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16px"
                            height="16px"
                            viewBox="0 0 512 512"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <path
                                fill="none"
                                stroke="currentColor"
                                strokeLinejoin="round"
                                strokeWidth={32}
                                d="M448 256L272 88v96C103.57 184 64 304.77 64 424c48.61-62.24 91.6-96 208-96v96Z"
                            ></path>
                        </svg>
                        <span className="underline">Watch on YouTube</span>
                    </a>
                )}

                {meal.strSource && (
                    <>
                        <a
                            href="{meal.strSource}"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mb-4 flex flex-wrap items-center gap-2 text-sm hover:text-blue-500"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16px"
                                height="16px"
                                viewBox="0 0 32 32"
                                aria-hidden="true"
                                focusable="false"
                            >
                                <path
                                    fill="currentColor"
                                    d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-.094 5c-3.324 0-6 2.676-6 6s2.676 6 6 6c2.4 0 4.45-1.44 5.406-3.47l-1.812-.843C18.855 19.058 17.506 20 15.906 20c-2.276 0-4-1.724-4-4s1.724-4 4-4c1.6 0 2.95.942 3.594 2.313l1.813-.844c-.956-2.03-3.007-3.47-5.407-3.47z"
                                ></path>
                            </svg>
                            <span className="underline">Source:</span>{' '}
                            {meal.strSource}
                        </a>
                    </>
                )}

                {meal.strTags && meal.strTags.trim() && (
                    <>
                        <ul className="flex flex-wrap gap-4">
                            {meal.strTags.split(',').map((tag: string) => (
                                <li
                                    key={tag.trim()}
                                    className="badge badge-neutral badge-dash hover:bg-blue-400 hover:text-white"
                                >
                                    <button
                                        onClick={() =>
                                            handleTagClick(tag.trim())
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === 'Enter' ||
                                                e.key === ' '
                                            )
                                                handleTagClick(tag.trim())
                                        }}
                                        className="cursor-pointer"
                                        aria-label={`Show recipes with tag ${tag.trim()}`}
                                    >
                                        {tag.trim()}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            {selectedTag && (
                <div className="mt-6">
                    <h4 className="mb-2 font-bold">
                        Recipes with tag:{' '}
                        <span className="text-blue-600">{selectedTag}</span>
                    </h4>
                    {tagResults === null ? (
                        <div>Loading...</div>
                    ) : tagResults.length === 0 ? (
                        <div>No recipes found for this tag.</div>
                    ) : (
                        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {tagResults.map((meal) => (
                                <li
                                    key={meal.idMeal}
                                    className="rounded border p-2"
                                >
                                    <Link
                                        to={`/meal/${meal.idMeal}`}
                                        className="hover:underline"
                                    >
                                        <img
                                            src={meal.strMealThumb}
                                            alt={meal.strMeal}
                                            className="mb-2 h-32 w-full rounded object-cover"
                                        />
                                        <div>{meal.strMeal}</div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </>
    )
}
