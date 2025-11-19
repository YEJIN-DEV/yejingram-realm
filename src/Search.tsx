import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import './App.css'
import { APPLICANTS, type Applicant } from './applicants'

function SearchPage() {
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const [searchParams] = useSearchParams()
    const pageSize = 9

    const filtered: Applicant[] = APPLICANTS.filter((item) => {
        const q = query.trim().toLowerCase()
        if (!q) return true
        return (
            item.name.toLowerCase().includes(q) ||
            item.role.toLowerCase().includes(q) ||
            item.tags.some((tag) => tag.toLowerCase().includes(q))
        )
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const currentPage = Math.min(page, totalPages)
    const startIndex = (currentPage - 1) * pageSize
    const paged = filtered.slice(startIndex, startIndex + pageSize)

    // URL 쿼리에서 page, id 읽어서 내부 상태 맞추기
    useEffect(() => {
        const pageParam = Number(searchParams.get('page') ?? '1')
        if (!Number.isNaN(pageParam) && pageParam >= 1) {
            setPage(pageParam)
        }
    }, [searchParams])
    return (
        <div className="page resume-search-page">
            <div className="resume-header-section">
                <h1 className="resume-page-title">인재 검색</h1>
                <p className="resume-page-desc">
                    Realm Yejingram의 인재 풀에서 프로젝트를 성공으로 이끌 최고의 동료를 찾아보세요.
                </p>
            </div>

            <div className="resume-search-container">
                <div className="resume-search-box">
                    <div className="search-icon-wrapper">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="resume-search-input"
                        placeholder="이름, 포지션, 보유 기술로 검색해보세요 (예: React, 프론트엔드)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button className="search-clear-btn" onClick={() => setQuery('')}>
                            ✕
                        </button>
                    )}
                </div>

                <div className="resume-keywords">
                    <span className="keyword-label">추천 검색어:</span>
                    {['Frontend', 'Backend', 'UX/UI', 'Fullstack', 'TypeScript'].map((tag) => (
                        <button
                            key={tag}
                            className="keyword-chip"
                            onClick={() => setQuery(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <section className="resume-results-section">
                <div className="results-header">
                    <h2>검색 결과 <span className="highlight-count">{filtered.length}</span>건</h2>
                </div>

                {filtered.length === 0 ? (
                    <div className="no-results">
                        <p>검색 결과가 없습니다.</p>
                        <small>다른 키워드로 검색해보세요.</small>
                    </div>
                ) : (
                    <div className="resume-card-grid">
                        {paged.map((item) => (
                            <article
                                key={item.id}
                                className="resume-card"
                                onClick={() => {
                                    const indexInAll = APPLICANTS.findIndex((a) => a.id === item.id)
                                    const pageForApplicant = Math.floor(indexInAll / pageSize) + 1
                                    window.location.href = `applicant/?id=${item.id}&page=${pageForApplicant}`
                                }}
                            >
                                <div className="resume-card-top">
                                    <div className="resume-avatar">
                                        {item.photoInitial}
                                    </div>
                                    <div className="resume-info">
                                        <h3 className="resume-name">
                                            {item.name}
                                            <span className="resume-role-badge">{item.role}</span>
                                        </h3>
                                        <p className="resume-summary">{item.summary}</p>
                                    </div>
                                </div>
                                <div className="resume-card-bottom">
                                    <div className="resume-tags">
                                        {item.tags.map((tag) => (
                                            <span key={tag} className="resume-tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="resume-pagination">
                        <button
                            type="button"
                            className="pagination-btn"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            &lt; 이전
                        </button>
                        <span className="pagination-info">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            type="button"
                            className="pagination-btn"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            다음 &gt;
                        </button>
                    </div>
                )}
            </section>
        </div>
    )
}

export default SearchPage
