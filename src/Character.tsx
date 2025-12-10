import { Download, Eye, Flame, Book, Smile } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

interface CharacterData {
  summary: string
  gsi_global_pk: number
  id: string
  name: string
  gender?: number
  status_message: string
  tags?: string[]
  popularity: number
  uploader_nickname: string
  uploader_uid: string
  view_count: number
  download_count: number
  created_at: number
  updated_at: number
  file_name: string
  copyright?: string
  is_nsfw?: boolean
  has_lore?: boolean
  has_sticker?: boolean
}
interface LastKey {
  id: string
  popularity: number
}

interface ApiResponse {
  items: CharacterData[]
  lastKey: LastKey | null
}

function Character() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
  const [characters, setCharacters] = useState<CharacterData[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterData | null>(null)
  const [lastKey, setLastKey] = useState<LastKey | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const fetchList = useCallback(async (key?: LastKey | null) => {
    try {
      let url = 'https://d3rd8muqzoyvtk.cloudfront.net/realm/list'
      if (key) {
        url += `?lk_pop=${key.popularity}&lk_id=${key.id}`
      }
      const response = await fetch(url)
      const data: ApiResponse = await response.json()

      setCharacters(data.items.slice(0, 9))
      setLastKey(data.lastKey)
    } catch (error) {
      console.error('Failed to fetch characters:', error)
    }
  }, [])

  const fetchDetail = useCallback(async (id: string) => {
    try {
      const response = await fetch(`https://d3rd8muqzoyvtk.cloudfront.net/realm/${id}`)
      const data: CharacterData = await response.json()
      setSelectedCharacter(data)
    } catch (error) {
      console.error('Failed to fetch character detail:', error)
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSidebarOpen(!e.matches)
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  useEffect(() => {
    const idParam = searchParams.get('id')
    if (idParam) {
      fetchDetail(idParam)
    }
  }, [searchParams, fetchDetail])

  useEffect(() => {
    const idParam = searchParams.get('id')
    if (!idParam && characters.length > 0) {
      setSearchParams({ id: characters[0].id })
    }
  }, [characters, searchParams, setSearchParams])

  const getLicenseInfo = (copyright: string) => {
    if (copyright === 'WTFPL') {
      return {
        url: 'http://www.wtfpl.net/',
        image: 'http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-4.png',
        summary: '제약 없이 자유롭게 이용 가능합니다.',
        isCC: false
      }
    }

    if (copyright.startsWith('CC')) {
      const parts = copyright.split(' ')
      const code = parts[1]?.toLowerCase()
      const version = parts[2] || '4.0'

      if (!code) return null

      const url = `https://creativecommons.org/licenses/${code}/${version}/`
      const image = `https://licensebuttons.net/l/${code}/${version}/88x31.png`

      const summaryParts = []
      if (code.includes('by')) summaryParts.push('저작자 표시')
      if (code.includes('nc')) summaryParts.push('비영리')
      if (code.includes('nd')) summaryParts.push('변경 금지')
      if (code.includes('sa')) summaryParts.push('동일조건변경허락')

      const summary = `${summaryParts.join(', ')} 조건 하에 이용 가능합니다.`

      return {
        url,
        image,
        summary,
        isCC: true
      }
    }

    return null
  }

  const handleNext = () => {
    if (lastKey) {
      fetchList(lastKey)
    }
  }

  const isSelectedInList = selectedCharacter && characters.some(a => a.id === selectedCharacter.id)

  useEffect(() => {
    if (selectedCharacter) {
      const button = document.querySelector(
        `button[data-character-id="${selectedCharacter.id}"]`,
      ) as HTMLButtonElement | null
      button?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [selectedCharacter])

  if (!selectedCharacter) {
    return (
      <div className="w-full max-w-7xl p-6">
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className={`p-5 md:p-20 md:pt-5 grid gap-4 items-stretch transition-[grid-template-columns] duration-180 ease-out max-md:block ${!sidebarOpen ? 'grid-cols-[64px_minmax(0,1fr)]' : 'grid-cols-[260px_minmax(0,1fr)]'} ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Sidebar Trigger */}
      <button
        className="hidden max-md:flex flex-col gap-1 items-center justify-center fixed bottom-6 right-6 w-14 h-14 rounded-full bg-(--color-sidebar-item-bg) text-white border-none shadow-[0_4px_12px_rgba(0,0,0,0.3)] z-2000 cursor-pointer transition-transform duration-200 active:scale-95"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <div className="w-5 h-0.5 rounded-full bg-white"></div>
        <div className="w-5 h-0.5 rounded-full bg-white"></div>
        <div className="w-5 h-0.5 rounded-full bg-white"></div>
      </button>

      {/* Sidebar Backdrop */}
      <div
        className={`hidden max-md:block fixed inset-0 bg-black/50 z-2500 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside className={`sticky top-6 h-[60dvh] bg-(--color-sidebar-bg) text-(--color-sidebar-text) rounded-2xl p-4 shadow-[0_22px_45px_rgba(15,23,42,0.4),0_0_0_1px_rgba(15,23,42,0.6)] flex flex-col overflow-hidden max-md:fixed max-md:top-0 max-md:left-0 max-md:bottom-0 max-md:w-[50vw] max-md:h-screen max-md:z-3000 max-md:transition-transform max-md:duration-300 max-md:ease-in-out max-md:rounded-r-2xl max-md:shadow-[0_0_24px_rgba(0,0,0,0.2)] ${!sidebarOpen ? 'max-md:-translate-x-full' : 'max-md:translate-x-0'}`}>
        <button
          className="top-3 left-3 w-8 h-8 rounded-full border-none bg-(--color-sidebar-bg) inline-flex flex-col items-center justify-center gap-1 cursor-pointer shadow-[0_8px_18px_rgba(15,23,42,0.9)] z-10"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <div className="w-4 h-0.5 rounded-full bg-(--color-sidebar-text)"></div>
          <div className="w-4 h-0.5 rounded-full bg-(--color-sidebar-text)"></div>
          <div className="w-4 h-0.5 rounded-full bg-(--color-sidebar-text)"></div>
        </button>

        <div className={`flex flex-col gap-3 mt-6 flex-1 min-h-0 transition-opacity duration-200 ${!sidebarOpen ? 'md:opacity-0 md:pointer-events-none' : ''}`}>
          <div className="flex justify-between items-baseline shrink-0">
            <h2 className="m-0 text-xs tracking-widest uppercase text-(--color-sidebar-text-muted)">CHARACTERS</h2>
            <span className="text-xs text-(--color-sidebar-text-dim)">{characters.length}</span>
          </div>

          <ul className="m-0 p-0 flex flex-col gap-1.5 overflow-y-auto flex-1 pr-1">
            {(() => {
              const displayCharacters = isSelectedInList ? characters : [selectedCharacter, ...characters]
              return displayCharacters.map((character) => (
                <button
                  key={character.id}
                  data-character-id={character.id}
                  className={`group border-none bg-transparent rounded-xl p-2 flex items-center justify-between gap-2 cursor-pointer transition-all duration-120 text-(--color-sidebar-text-muted) hover:bg-[rgba(255,255,255,0.05)] hover:-translate-y-px hover:text-(--color-sidebar-text) w-full ${selectedCharacter.id === character.id ? 'bg-(--color-sidebar-item-bg)! shadow-[0_0_0_1px_rgba(248,250,252,0.14),0_10px_24px_rgba(15,23,42,0.6)] text-(--color-sidebar-text)!' : ''
                    }`}
                  onClick={() => {
                    setSearchParams({ id: character.id })
                    if (window.innerWidth <= 768) setSidebarOpen(false)
                  }}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold text-inherit">{character.name}</span>
                    <span className="text-xs text-(--color-sidebar-text-dim) group-hover:text-(--color-sidebar-text-muted)">{character.status_message}</span>
                  </div>
                  {character.tags && character.tags.length > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.03)] border border-(--color-sidebar-border) text-(--color-sidebar-text-muted) whitespace-nowrap transition-all duration-200 group-hover:border-(--color-sidebar-text-muted) group-hover:text-(--color-sidebar-text) ${selectedCharacter.id === character.id ? 'bg-(--color-tag-highlight-bg) border-(--color-tag-highlight-border) text-(--color-tag-highlight-text)' : ''}`}>
                      {character.tags[0]}
                    </span>
                  )}
                </button>
              ))
            })()}
            {lastKey && (
              <button
                className="w-full py-2 text-xs text-(--color-sidebar-text-dim) hover:text-(--color-sidebar-text) bg-transparent border border-(--color-sidebar-border) rounded-lg mt-2 cursor-pointer transition-colors"
                onClick={handleNext}
              >
                Load More
              </button>
            )}
          </ul>
        </div>
      </aside>

      <main className="relative bg-(--color-bg-primary) rounded-2xl p-8 shadow-[0_22px_45px_rgba(15,23,42,0.18),0_0_0_1px_rgba(15,23,42,0.04)] overflow-visible  flex flex-col max-md:p-5 max-md: max-md:rounded-none max-md:overflow-y-auto max-md:overflow-x-hidden">
        <div className="pr-23 overflow-y-auto pb-5 max-md:pr-0 max-md:overflow-y-visible max-md:h-auto">
          <header className="flex justify-between items-end mb-6 pb-3 border-b-2 border-(--color-border)">
            <div className="resume-title">
              <h1 className="m-0 text-2xl">{selectedCharacter.name}</h1>
              <p className="mt-1 text-sm text-(--color-text-secondary)">{selectedCharacter.status_message || 'No status message'}</p>
            </div>
            <div className="text-right text-xs text-(--color-text-secondary)">
              {/* <div>ID: {selectedCharacter.id}</div> */}
              <div className="mt-0.5">Uploaded: {new Date(selectedCharacter.created_at * 1000).toLocaleString()}</div>
              <div className="mt-0.5">Last Updated: {new Date(selectedCharacter.updated_at * 1000).toLocaleString()}</div>
              <div className="mt-2 flex gap-3 justify-end text-(--color-text-tertiary)">
                <span className="flex items-center gap-1" title="Popularity">
                  <Flame className='w-3 h-3' /> {selectedCharacter.popularity.toFixed(2)}
                </span>
                <span className="flex items-center gap-1" title="Views">
                  <Eye className='w-3 h-3' /> {selectedCharacter.view_count}
                </span>
                <span className="flex items-center gap-1" title="Downloads">
                  <Download className='w-3 h-3' /> {selectedCharacter.download_count}
                </span>
              </div>
            </div>
          </header>

          <section className="mt-4.5">
            <h2 className="m-0 mb-1.5 text-sm tracking-wide uppercase text-(--color-text-tertiary)">Basic Info</h2>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-stretch max-md:flex max-md:flex-col-reverse max-md:gap-6 max-md:items-center">
              <table className="w-full border-collapse border border-(--color-border) text-xs m-0 max-md:border max-md:border-(--color-border) max-md:rounded-lg max-md:overflow-hidden">
                <tbody>
                  <tr className="max-md:flex max-md:flex-col max-md:border-b max-md:border-(--color-border)">
                    <th className="p-2 border border-(--color-border) text-left bg-(--color-bg-secondary) font-semibold whitespace-nowrap max-md:block max-md:w-full max-md:bg-(--color-bg-secondary) max-md:text-(--color-text-secondary) max-md:pb-1 max-md:border-none">Name</th>
                    <td className="p-2 border border-(--color-border) text-left max-md:block max-md:w-full max-md:pt-1 max-md:border-none max-md:border-b max-md:border-(--color-border-secondary)">{selectedCharacter.name || 'Unknown'}</td>
                    <th className="p-2 border border-(--color-border) text-left bg-(--color-bg-secondary) font-semibold whitespace-nowrap max-md:block max-md:w-full max-md:bg-(--color-bg-secondary) max-md:text-(--color-text-secondary) max-md:pb-1 max-md:border-none">Uploader</th>
                    <td className="p-2 border border-(--color-border) text-left max-md:block max-md:w-full max-md:pt-1 max-md:border-none max-md:border-b max-md:border-(--color-border-secondary)">{selectedCharacter.uploader_nickname || 'Anonymous'}</td>
                  </tr>
                  <tr className="max-md:flex max-md:flex-col max-md:border-b max-md:border-(--color-border)">
                    <th className="p-2 border border-(--color-border) text-left bg-(--color-bg-secondary) font-semibold whitespace-nowrap max-md:block max-md:w-full max-md:bg-(--color-bg-secondary) max-md:text-(--color-text-secondary) max-md:pb-1 max-md:border-none">Gender</th>
                    <td className="p-2 border border-(--color-border) text-left max-md:block max-md:w-full max-md:pt-1 max-md:border-none max-md:border-b max-md:border-(--color-border-secondary)">{selectedCharacter.gender === 0 ? 'Female' : selectedCharacter.gender === 1 ? 'Male' : selectedCharacter.gender === 2 ? 'Other' : 'Not Specified'}</td>
                    <th className="p-2 border border-(--color-border) text-left bg-(--color-bg-secondary) font-semibold whitespace-nowrap max-md:block max-md:w-full max-md:bg-(--color-bg-secondary) max-md:text-(--color-text-secondary) max-md:pb-1 max-md:border-none">NSFW</th>
                    <td className="p-2 border border-(--color-border) text-left max-md:block max-md:w-full max-md:pt-1 max-md:border-none max-md:border-b max-md:border-(--color-border-secondary)">{selectedCharacter.is_nsfw ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr className="max-md:flex max-md:flex-col max-md:border-b max-md:border-(--color-border)">
                    <th className="p-2 border border-(--color-border) text-left bg-(--color-bg-secondary) font-semibold whitespace-nowrap max-md:block max-md:w-full max-md:bg-(--color-bg-secondary) max-md:text-(--color-text-secondary) max-md:pb-1 max-md:border-none">Phone</th>
                    <td className="p-2 border border-(--color-border) text-left max-md:block max-md:w-full max-md:pt-1 max-md:border-none max-md:border-b max-md:border-(--color-border-secondary)">{selectedCharacter.id.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</td>
                    <td colSpan={2} className="p-2 border border-(--color-border) text-left max-md:block max-md:w-full max-md:pt-1 max-md:border-none max-md:border-b max-md:border-(--color-border-secondary)">
                      <div className="flex gap-3 items-center">
                        {selectedCharacter.has_lore && (
                          <div className="flex items-center gap-1">
                            <Book className="w-4 h-4 text-blue-500" />
                            <span>로어북 포함됨</span>
                          </div>
                        )}
                        {selectedCharacter.has_sticker && (
                          <div className="flex items-center gap-1">
                            <Smile className="w-4 h-4 text-yellow-500" />
                            <span>스티커 포함됨</span>
                          </div>
                        )}
                        {!selectedCharacter.has_lore && !selectedCharacter.has_sticker && '-'}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex items-center max-md:w-full max-md:justify-center max-md:mb-2">
                <div className="w-28 h-35 border border-(--color-icon-secondary) rounded-md flex flex-col items-center justify-center text-xs text-(--color-text-secondary) bg-[repeating-linear-gradient(-45deg,var(--color-bg-secondary),var(--color-bg-secondary)_6px,var(--color-bg-input-primary)_6px,var(--color-bg-input-primary)_12px)] overflow-hidden">
                  <img
                    src={`https://dt3lfi1tp9am3.cloudfront.net/${selectedCharacter.id}/${selectedCharacter.id}_thumb.webp`}
                    alt={selectedCharacter.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-4.5">
            <h2 className="m-0 mb-1.5 text-sm tracking-wide uppercase text-(--color-text-tertiary)">Summary</h2>
            <p className="m-1.5 text-(--color-text-tertiary) leading-relaxed">
              {selectedCharacter.summary || selectedCharacter.status_message || 'No summary available.'}
            </p>
          </section>

          <section className="mt-4.5">
            <h2 className="m-0 mb-1.5 text-sm tracking-wide uppercase text-(--color-text-tertiary)">Tags</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCharacter.tags && selectedCharacter.tags.map((tag, i) => (
                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full bg-(--color-brand-secondary) text-(--color-text-accent) text-xs tracking-tight lowercase cursor-default shadow-[0_6px_14px_var(--color-brand-shadow)]">
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {selectedCharacter.copyright && (() => {
            const license = getLicenseInfo(selectedCharacter.copyright)
            if (!license) return null
            return (
              <div className="mt-8 flex flex-col items-end gap-2">
                <a
                  href={license.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <img src={license.image} alt={selectedCharacter.copyright} />
                </a>
                <span className="text-xs text-(--color-text-secondary)">{license.summary}</span>
              </div>
            )
          })()}
        </div>

        <div className="absolute top-1/2 -right-16 -translate-y-1/2 flex flex-col gap-2.5 max-md:static max-md:transform-none max-md:flex-row max-md:mt-8 max-md:gap-2 max-md:overflow-x-auto max-md:pb-2 max-md:justify-start max-md:w-full">
          <div className="relative min-w-30 px-4.5 py-2.5 rounded-l-xl text-(--color-text-primary) text-xs font-semibold tracking-wide text-center bg-linear-to-br from-(--color-btn-amber-from) to-(--color-btn-amber-to) shadow-[0_10px_20px_rgba(15,23,42,0.18),0_0_0_1px_rgba(15,23,42,0.05)] cursor-pointer transition-all duration-150 hover:-translate-x-1 hover:shadow-[0_16px_28px_rgba(15,23,42,0.2),0_0_0_1px_rgba(15,23,42,0.06)] max-md:min-w-0 max-md:flex-1 max-md:rounded-lg max-md:px-3 max-md:py-2.5 max-md:text-xs max-md:whitespace-nowrap max-md:hover:translate-x-0 max-md:shadow-none max-md:hover:shadow-none" onClick={() => {
            window.open(`https://d3rd8muqzoyvtk.cloudfront.net/realm/${selectedCharacter.id}/download`, '_blank')
          }}>
            DOWNLOAD
          </div>
          <div className="relative min-w-30 px-4.5 py-2.5 rounded-l-xl text-(--color-text-primary) text-xs font-semibold tracking-wide text-center bg-linear-to-br from-(--color-btn-sky-from) to-(--color-btn-sky-to) shadow-[0_10px_20px_rgba(15,23,42,0.18),0_0_0_1px_rgba(15,23,42,0.05)] cursor-pointer transition-all duration-150 hover:-translate-x-1 hover:shadow-[0_16px_28px_rgba(15,23,42,0.2),0_0_0_1px_rgba(15,23,42,0.06)] max-md:min-w-0 max-md:flex-1 max-md:rounded-lg max-md:px-3 max-md:py-2.5 max-md:text-xs max-md:whitespace-nowrap max-md:hover:translate-x-0 max-md:shadow-none max-md:hover:shadow-none" onClick={() => {
            window.open(`${import.meta.env.DEV ? "https://dev.yejingram.com" : import.meta.env.VITE_YEJINGRAM_URL}/?realmId=${selectedCharacter.id}`, '_blank')
          }}>
            YEJINGRAM에서 열기
          </div>
          <div className="relative min-w-30 px-4.5 py-2.5 rounded-l-xl text-(--color-text-primary) text-xs font-semibold tracking-wide text-center bg-linear-to-br from-(--color-btn-red-from) to-(--color-btn-red-to) shadow-[0_10px_20px_rgba(15,23,42,0.18),0_0_0_1px_rgba(15,23,42,0.05)] cursor-pointer transition-all duration-150 hover:-translate-x-1 hover:shadow-[0_16px_28px_rgba(15,23,42,0.2),0_0_0_1px_rgba(15,23,42,0.06)] max-md:min-w-0 max-md:flex-1 max-md:rounded-lg max-md:px-3 max-md:py-2.5 max-md:text-xs max-md:whitespace-nowrap max-md:hover:translate-x-0 max-md:shadow-none max-md:hover:shadow-none">
            CONTACT
          </div>
        </div>
      </main >
    </div >
  )
}

export default Character
