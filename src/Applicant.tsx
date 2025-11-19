import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { APPLICANTS } from './applicants'

function Applicant() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
  const [selectedId, setSelectedId] = useState<number>(APPLICANTS[0]?.id ?? 1)
  const [searchParams] = useSearchParams()

  const selected = APPLICANTS.find((a) => a.id === selectedId) ?? APPLICANTS[0]

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSidebarOpen(!e.matches)
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const idParam = Number(searchParams.get('id') ?? '')
    if (!Number.isNaN(idParam) && APPLICANTS.some((a) => a.id === idParam)) {
      setSelectedId(idParam)

      const button = document.querySelector(
        `.sidebar-item[data-applicant-id="${idParam}"]`,
      ) as HTMLButtonElement | null
      button?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [searchParams])

  return (
    <div className="page">
      <button
        type="button"
        className="mobile-sidebar-trigger"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sidebar-toggle-bar" />
        <span className="sidebar-toggle-bar" />
        <span className="sidebar-toggle-bar" />
      </button>

      <div className={sidebarOpen ? 'layout-with-sidebar sidebar-open' : 'layout-with-sidebar sidebar-closed'}>
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        <aside className="sidebar">
          <div className="sidebar-inner">
            <div className="sidebar-header">
              <h2>지원자 목록</h2>
              <span className="sidebar-count">{APPLICANTS.length}명</span>
            </div>
            <div className="sidebar-list">
              {APPLICANTS.map((applicant) => (
                <button
                  key={applicant.id}
                  type="button"
                  className={
                    selectedId === applicant.id
                      ? 'sidebar-item sidebar-item-active'
                      : 'sidebar-item'
                  }
                  onClick={() => {
                    setSelectedId(applicant.id)
                    const button = document.querySelector(
                      `.sidebar-item[data-applicant-id="${applicant.id}"]`,
                    ) as HTMLButtonElement | null
                    button?.scrollIntoView({ block: 'center', behavior: 'smooth' })
                  }}
                  data-applicant-id={applicant.id}
                >
                  <div className="sidebar-item-main">
                    <span className="sidebar-item-name">{applicant.name}</span>
                    <span className="sidebar-item-role">{applicant.role}</span>
                  </div>
                  <span className="sidebar-item-tag">{applicant.tags[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="document-container">
          <div className="document-main">
            <header className="resume-header">
              <div className="resume-title">
                <h1>{selected.name}</h1>
                <p className="resume-position">{selected.role}</p>
              </div>
              <div className="resume-meta">
                <p>이력서</p>
                <p className="resume-date">2025. 11. 16 기준</p>
              </div>
            </header>

            <section className="resume-section">
              <h2>기본 정보</h2>
              <div className="basic-info-row">
                <table className="resume-table basic-info-table">
                  <tbody>
                    <tr>
                      <th>이름</th>
                      <td>{selected.name}</td>
                      <th>생년월일</th>
                      <td>1998. 05. 21</td>
                    </tr>
                    <tr>
                      <th>연락처</th>
                      <td>010-0000-0000</td>
                      <th>업로더</th>
                      <td>치킨</td>
                    </tr>
                  </tbody>
                </table>
                <div className="photo-slot">
                  <div className="photo-box">
                    <span>PHOTO</span>
                    <small>3×4cm</small>
                  </div>
                </div>
              </div>
            </section>

            <section className="resume-section">
              <h2>소개 글</h2>
              <table className="resume-table">
                <tbody>
                  <tr>
                    <th>한 줄 소개</th>
                    <td>
                      {selected.summary}
                    </td>
                  </tr>
                  <tr>
                    <th>설명 글</th>
                    <td>
                      데이터 구조와 동작 원리를 먼저 파악하고 나서 화면을 그립니다.
                      눈에 보이는 애니메이션보다, 사용자가 덜 클릭하고 덜 기다리는 경험을
                      만드는 것에 더 큰 가치를 둡니다.
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section className="resume-section">
              <h2>태그</h2>
              <div className="tag-row">
                <span className="tag-pill">#female</span>
                <span className="tag-pill">#pirate</span>
                <span className="tag-pill">#frontend</span>
                <span className="tag-pill">#realm_yejingram</span>
              </div>
            </section>
          </div>
          <div className="document-tabs">
            <div className="tab tab-1">INFO</div>
            <div className="tab tab-2">NOTE</div>
            <div className="tab tab-3">LOG</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Applicant
