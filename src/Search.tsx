import { Flame, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import BetaBadge from './components/BetaBadge'

interface CharacterData {
    summary: string
    gsi_global_pk: number
    id: string
    name: string
    status_message: string
    tags: string[]
    popularity: number
}

interface LastKey {
    id: string
    popularity: number
}

interface ApiResponse {
    items: CharacterData[]
    totalCount?: number
    lastKey?: LastKey | null
    lastEvaluatedKey?: any
}

function SearchPage() {
    const { t } = useTranslation()
    const [query, setQuery] = useState('')
    const [characters, setCharacters] = useState<CharacterData[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [lastKey, setLastKey] = useState<any | null>(null)
    const [pageStack, setPageStack] = useState<(any | null)[]>([null])
    const [currentPageIndex, setCurrentPageIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const [displayCount, setDisplayCount] = useState(0)

    useEffect(() => {
        if (totalCount === 0) return

        let startTimestamp: number | null = null
        const duration = 1500
        const targetString = String(totalCount).padStart(3, '0')
        const length = targetString.length

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = (timestamp - startTimestamp) / duration

            if (progress < 1) {
                let currentString = ''
                for (let i = 0; i < length; i++) {
                    const threshold = 0.5 + (i / length) * 0.4
                    if (progress >= threshold) {
                        currentString += targetString[i]
                    } else {
                        currentString += Math.floor(Math.random() * 10)
                    }
                }
                setDisplayCount(parseInt(currentString, 10))
                window.requestAnimationFrame(step)
            } else {
                setDisplayCount(totalCount)
            }
        }

        window.requestAnimationFrame(step)
    }, [totalCount])

    const fetchCharacters = async (key: any | null, searchQuery: string) => {
        setLoading(true)
        try {
            let url = ''
            const isSearch = !!searchQuery.trim()

            if (isSearch) {
                url = `https://d3rd8muqzoyvtk.cloudfront.net/realm/search?q=${encodeURIComponent(searchQuery.trim())}`
            } else {
                url = 'https://d3rd8muqzoyvtk.cloudfront.net/realm/list'
                if (key) {
                    url += `?lk_pop=${key.popularity}&lk_id=${key.id}`
                }
            }

            const response = await fetch(url)
            const data: ApiResponse = await response.json()

            if (isSearch) {
                setCharacters(data.items)
                setLastKey(data.lastEvaluatedKey || null)
            } else {
                setCharacters(data.items.slice(0, 9))
                setTotalCount((prev) => (prev === 0 ? data.totalCount || 0 : prev))
                setLastKey(data.lastKey || null)
            }
        } catch (error) {
            console.error('Failed to fetch characters:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setPageStack([null])
            setCurrentPageIndex(0)
            fetchCharacters(null, query)
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    const handleNext = () => {
        if (lastKey) {
            const newStack = [...pageStack.slice(0, currentPageIndex + 1), lastKey]
            setPageStack(newStack)
            setCurrentPageIndex(currentPageIndex + 1)
            fetchCharacters(lastKey, query)
        }
    }

    const handlePrev = () => {
        if (currentPageIndex > 0) {
            const prevKey = pageStack[currentPageIndex - 1]
            setCurrentPageIndex(currentPageIndex - 1)
            fetchCharacters(prevKey, query)
        }
    }

    return (
        <div className="w-full max-w-[90vw] mx-auto py-10 px-5 font-sans">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-(--color-text-primary) mb-3 tracking-tight flex items-center justify-center">
                    YejinRealm
                    <BetaBadge />
                </h1>
                <h2 className="text-lg text-(--color-text-primary) m-0">
                    <span className="text-(--color-brand-primary) font-bold">{String(displayCount).padStart(3, '0')}</span>{t('search.subtitle')}
                </h2>
            </div>

            <div className="bg-(--color-bg-primary) p-7.5 rounded-3xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.01)] mb-10 border border-(--color-border-secondary)">
                <div className="relative flex items-center bg-(--color-bg-input-secondary) border-2 border-(--color-border) rounded-2xl px-4 py-2 transition-all duration-200 focus-within:border-(--color-brand-primary) focus-within:bg-(--color-bg-primary) focus-within:shadow-[0_0_0_4px_var(--color-brand-shadow)]">
                    <div className="text-(--color-icon-secondary) flex items-center mr-3">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="flex-1 border-none bg-transparent text-base py-3 outline-none text-(--color-text-primary) w-full placeholder-(--color-text-informative-secondary)"
                        placeholder={t('search.placeholder')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button
                            className="bg-none border-none text-(--color-icon-secondary) cursor-pointer p-1 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-(--color-bg-secondary-accent) hover:text-(--color-text-tertiary)"
                            onClick={() => setQuery('')}
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* <div className="mt-5 flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-semibold text-(--color-text-secondary) mr-1">{t('search.recommended_keywords')}</span>
                    {['React', 'Node.js', 'TypeScript', 'Frontend', 'Backend', 'Full Stack'].map((keyword) => (
                        <button
                            key={keyword}
                            className="bg-(--color-bg-input-primary) border border-(--color-border) px-3 py-1.5 rounded-full text-xs text-(--color-text-tertiary) cursor-pointer transition-all duration-200 hover:bg-(--color-brand-light) hover:text-(--color-brand-secondary) hover:border-(--color-brand-border)"
                            onClick={() => setQuery(keyword)}
                        >
                            {keyword}
                        </button>
                    ))}
                </div> */}
            </div>

            <div className="mt-10">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 text-(--color-brand-primary) animate-spin" />
                    </div>
                ) : characters.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {characters.map((character) => (
                            <div
                                key={character.id}
                                className="bg-(--color-bg-primary) rounded-2xl border border-(--color-border) p-6 cursor-pointer transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] hover:border-(--color-brand-border)"
                                onClick={() => window.location.href = `/character?id=${character.id}`}
                            >
                                <div className="flex gap-4 mb-4">
                                    <img
                                        src={`https://dt3lfi1tp9am3.cloudfront.net/${character.id}/${character.id}_thumb.webp`}
                                        alt={character.name}
                                        className="w-28 h-35 rounded-2xl object-cover shrink-0 shadow-[0_4px_12px_rgba(99,102,241,0.2)] bg-gray-200"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="m-0 mb-1.5 text-xl font-bold text-(--color-text-primary) flex items-center gap-2 flex-wrap">
                                            {character.name}
                                            <span className="flex text-xs font-medium bg-(--color-tag-bg) text-(--color-tag-text) px-2 py-0.5 rounded-md border border-(--color-tag-border)">
                                                <Flame className='w-4 h-4' /> {character.popularity.toFixed(2)}
                                            </span>
                                        </h3>
                                        {/* Status Message (상태 메시지 quote 스타일 */}
                                        {character.status_message && (
                                            <blockquote className="m-0 mb-2 pl-4 border-l-4 border-(--color-border-secondary) italic text-(--color-text-secondary) text-sm leading-relaxed overflow-hidden line-clamp-2">
                                                {character.status_message}
                                            </blockquote>
                                        )}
                                        {/* Summary */}
                                        <p className="m-0 text-sm text-(--color-text-secondary) leading-relaxed line-clamp-2 overflow-hidden">
                                            {character.summary || t('search.no_summary')}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-(--color-border-secondary)">
                                    <div className="flex flex-wrap gap-1.5">
                                        {character.tags && character.tags.length > 0 ? (
                                            character.tags.map((tag, index) => (
                                                <span key={index} className="text-xs text-(--color-text-tertiary) bg-(--color-bg-input-primary) px-2.5 py-1 rounded-full">
                                                    #{tag}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-(--color-text-tertiary) bg-(--color-bg-input-primary) px-2.5 py-1 rounded-full">#NoTags</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {characters.length % 2 !== 0 && (
                            <div className="hidden md:flex lg:hidden items-end justify-end p-6 select-none pointer-events-none opacity-20">
                                <h3 className="text-3xl font-black text-right text-(--color-text-primary) tracking-widest leading-relaxed">
                                    YEJINGRAM<br />REALM
                                </h3>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-15 text-(--color-text-secondary)">
                        <p className="text-lg font-semibold mb-2">{t('search.no_results')}</p>
                        <span>{t('search.try_other_keywords')}</span>
                    </div>
                )}

                <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                        className="px-4 py-2 bg-(--color-bg-primary) border border-(--color-border) rounded-lg text-sm font-medium text-(--color-text-interface) cursor-pointer transition-all duration-200 hover:bg-(--color-bg-secondary) hover:border-(--color-button-disabled) disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handlePrev}
                        disabled={currentPageIndex === 0 || loading}
                    >
                        {t('search.pagination.prev')}
                    </button>
                    <span className="text-sm font-medium text-(--color-text-secondary)">
                        Page {currentPageIndex + 1}
                    </span>
                    <button
                        className="px-4 py-2 bg-(--color-bg-primary) border border-(--color-border) rounded-lg text-sm font-medium text-(--color-text-interface) cursor-pointer transition-all duration-200 hover:bg-(--color-bg-secondary) hover:border-(--color-button-disabled) disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleNext}
                        disabled={!lastKey || loading}
                    >
                        {t('search.pagination.next')}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchPage
