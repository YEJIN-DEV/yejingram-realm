import { Flame } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ApplicantData {
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
    items: ApplicantData[]
    lastKey: LastKey | null
}

function SearchPage() {
    const [query, setQuery] = useState('')
    const [applicants, setApplicants] = useState<ApplicantData[]>([])
    const [lastKey, setLastKey] = useState<LastKey | null>(null)
    const [pageStack, setPageStack] = useState<(LastKey | null)[]>([null])
    const [currentPageIndex, setCurrentPageIndex] = useState(0)
    const [loading, setLoading] = useState(false)

    const fetchApplicants = async (key: LastKey | null) => {
        setLoading(true)
        try {
            let url = 'https://d3rd8muqzoyvtk.cloudfront.net/realm/list'
            if (key) {
                url += `?lk_pop=${key.popularity}&lk_id=${key.id}`
            }
            const response = await fetch(url)
            const data: ApiResponse = await response.json()

            setApplicants(data.items.slice(0, 9))
            setLastKey(data.lastKey)
        } catch (error) {
            console.error('Failed to fetch applicants:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApplicants(null)
    }, [])

    const handleNext = () => {
        if (lastKey) {
            const newStack = [...pageStack.slice(0, currentPageIndex + 1), lastKey]
            setPageStack(newStack)
            setCurrentPageIndex(currentPageIndex + 1)
            fetchApplicants(lastKey)
        }
    }

    const handlePrev = () => {
        if (currentPageIndex > 0) {
            const prevKey = pageStack[currentPageIndex - 1]
            setCurrentPageIndex(currentPageIndex - 1)
            fetchApplicants(prevKey)
        }
    }

    const filtered = applicants.filter((item) => {
        const q = query.trim().toLowerCase()
        if (!q) return true
        return (
            item.name.toLowerCase().includes(q) ||
            (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(q))) ||
            (item.summary && item.summary.toLowerCase().includes(q))
        )
    })

    return (
        <div className="w-full max-w-[90vw] mx-auto py-10 px-5 font-sans">
            <div className="text-center mb-10">
                <h1 className="text-[32px] font-extrabold text-(--color-text-primary) mb-3 tracking-[-0.5px]">캐릭터 검색</h1>
                <p className="text-base text-(--color-text-secondary) m-0">
                    Yejingram Realm에서 함께할 캐릭터를 찾아보세요!
                </p>
            </div>

            <div className="bg-white p-[30px] rounded-3xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.01)] mb-10 border border-(--color-border-secondary)">
                <div className="relative flex items-center bg-(--color-bg-input-secondary) border-2 border-(--color-border) rounded-2xl px-4 py-2 transition-all duration-200 focus-within:border-[#6366f1] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.1)]">
                    <div className="text-(--color-icon-secondary) flex items-center mr-3">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="flex-1 border-none bg-transparent text-base py-3 outline-none text-(--color-text-primary) w-full placeholder-(--color-text-informative-secondary)"
                        placeholder="이름, 기술 스택, 또는 소개글 검색..."
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

                <div className="mt-5 flex flex-wrap gap-2 items-center">
                    <span className="text-[13px] font-semibold text-(--color-text-secondary) mr-1">추천 키워드:</span>
                    {['React', 'Node.js', 'TypeScript', 'Frontend', 'Backend', 'Full Stack'].map((keyword) => (
                        <button
                            key={keyword}
                            className="bg-(--color-bg-input-primary) border border-(--color-border) px-3 py-1.5 rounded-[20px] text-[13px] text-(--color-text-tertiary) cursor-pointer transition-all duration-200 hover:bg-[#e0e7ff] hover:text-[#4f46e5] hover:border-[#c7d2fe]"
                            onClick={() => setQuery(keyword)}
                        >
                            {keyword}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-10">
                <div className="flex justify-between items-center mb-5 px-1">
                    <h2 className="text-lg font-bold text-(--color-text-primary) m-0">
                        검색 결과 <span className="text-[#6366f1]">{filtered.length}</span>건
                    </h2>
                </div>

                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((applicant) => (
                            <div
                                key={applicant.id}
                                className="bg-white rounded-2xl border border-(--color-border) p-6 cursor-pointer transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] hover:border-[#c7d2fe]"
                                onClick={() => window.location.href = `/applicant?id=${applicant.id}`}
                            >
                                <div className="flex gap-4 mb-4">
                                    <img
                                        src={`https://dt3lfi1tp9am3.cloudfront.net/${applicant.id}/${applicant.id}_thumb.webp`}
                                        alt={applicant.name}
                                        className="w-[110px] h-[140px] rounded-2xl object-cover shrink-0 shadow-[0_4px_12px_rgba(99,102,241,0.2)] bg-gray-200"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="m-0 mb-1.5 text-lg font-bold text-(--color-text-primary) flex items-center gap-2 flex-wrap">
                                            {applicant.name}
                                            <span className="flex text-xs font-medium bg-[#eff6ff] text-[#3b82f6] px-2 py-0.5 rounded-md border border-[#dbeafe]">
                                                <Flame className='w-4 h-4' /> {applicant.popularity}
                                            </span>
                                        </h3>
                                        {/* Status Message (상태 메시지 quote 스타일 */}
                                        {applicant.status_message && (
                                            <blockquote className="m-0 mb-2 pl-4 border-l-4 border-(--color-border-secondary) italic text-(--color-text-secondary) text-sm leading-relaxed overflow-hidden line-clamp-2">
                                                {applicant.status_message}
                                            </blockquote>
                                        )}
                                        {/* Summary */}
                                        <p className="m-0 text-sm text-(--color-text-secondary) leading-relaxed line-clamp-2 overflow-hidden">
                                            {applicant.summary || '소개글이 없습니다.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-(--color-border-secondary)">
                                    <div className="flex flex-wrap gap-1.5">
                                        {applicant.tags && applicant.tags.length > 0 ? (
                                            applicant.tags.map((tag, index) => (
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
                    </div>
                ) : (
                    <div className="text-center py-[60px] text-(--color-text-secondary)">
                        <p className="text-lg font-semibold mb-2">검색 결과가 없습니다</p>
                        <span>다른 키워드로 검색해보세요.</span>
                    </div>
                )}

                <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                        className="px-4 py-2 bg-white border border-(--color-border) rounded-lg text-sm font-medium text-[#374151] cursor-pointer transition-all duration-200 hover:bg-(--color-bg-secondary) hover:border-[#d1d5db] disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handlePrev}
                        disabled={currentPageIndex === 0 || loading}
                    >
                        이전 페이지
                    </button>
                    <span className="text-sm font-medium text-(--color-text-secondary)">
                        Page {currentPageIndex + 1}
                    </span>
                    <button
                        className="px-4 py-2 bg-white border border-(--color-border) rounded-lg text-sm font-medium text-[#374151] cursor-pointer transition-all duration-200 hover:bg-(--color-bg-secondary) hover:border-[#d1d5db] disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleNext}
                        disabled={!lastKey || loading}
                    >
                        다음 페이지
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchPage
