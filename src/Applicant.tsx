import { Download, Eye, Flame, Heart } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

interface ApplicantData {
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
}
interface LastKey {
  id: string
  popularity: number
}

interface ApiResponse {
  items: ApplicantData[]
  lastKey: LastKey | null
}

function Applicant() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
  const [applicants, setApplicants] = useState<ApplicantData[]>([])
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantData | null>(null)
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

      setApplicants(data.items.slice(0, 9))
      setLastKey(data.lastKey)
    } catch (error) {
      console.error('Failed to fetch applicants:', error)
    }
  }, [])

  const fetchDetail = useCallback(async (id: string) => {
    try {
      const response = await fetch(`https://d3rd8muqzoyvtk.cloudfront.net/realm/${id}`)
      const data: ApplicantData = await response.json()
      setSelectedApplicant(data)
    } catch (error) {
      console.error('Failed to fetch applicant detail:', error)
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
    if (!idParam && applicants.length > 0) {
      setSearchParams({ id: applicants[0].id })
    }
  }, [applicants, searchParams, setSearchParams])

  const handleNext = () => {
    if (lastKey) {
      fetchList(lastKey)
    }
  }

  const isSelectedInList = selectedApplicant && applicants.some(a => a.id === selectedApplicant.id)

  useEffect(() => {
    if (selectedApplicant) {
      const button = document.querySelector(
        `button[data-applicant-id="${selectedApplicant.id}"]`,
      ) as HTMLButtonElement | null
      button?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [selectedApplicant])

  if (!selectedApplicant) {
    return (
      <div className="w-full max-w-[1140px] p-6">
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className={`p-5 md:p-20 grid gap-4 items-stretch transition-[grid-template-columns] duration-180 ease-out max-md:block ${!sidebarOpen ? 'grid-cols-[64px_minmax(0,1fr)]' : 'grid-cols-[260px_minmax(0,1fr)]'} ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Sidebar Trigger */}
      <button
        className="hidden max-md:flex flex-col gap-1 items-center justify-center fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#111827] text-white border-none shadow-[0_4px_12px_rgba(0,0,0,0.3)] z-2000 cursor-pointer transition-transform duration-200 active:scale-95"
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

      <aside className={`sticky top-6 h-[92vh] bg-[#020617] text-[#e5e7eb] rounded-2xl p-4 shadow-[0_22px_45px_rgba(15,23,42,0.4),0_0_0_1px_rgba(15,23,42,0.6)] flex flex-col overflow-hidden max-md:fixed max-md:top-0 max-md:left-0 max-md:bottom-0 max-md:w-[50vw] max-md:h-screen max-md:z-3000 max-md:transition-transform max-md:duration-300 max-md:ease-in-out max-md:rounded-r-2xl max-md:shadow-[0_0_24px_rgba(0,0,0,0.2)] ${!sidebarOpen ? 'max-md:-translate-x-full' : 'max-md:translate-x-0'}`}>
        <button
          className="absolute top-3 left-3 w-8 h-8 rounded-full border-none bg-[#020617] inline-flex flex-col items-center justify-center gap-1 cursor-pointer shadow-[0_8px_18px_rgba(15,23,42,0.9)] z-10"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <div className="w-4 h-0.5 rounded-full bg-[#e5e7eb]"></div>
          <div className="w-4 h-0.5 rounded-full bg-[#e5e7eb]"></div>
          <div className="w-4 h-0.5 rounded-full bg-[#e5e7eb]"></div>
        </button>

        <div className={`flex flex-col gap-3 mt-6 flex-1 min-h-0 transition-opacity duration-200 ${!sidebarOpen ? 'md:opacity-0 md:pointer-events-none' : ''}`}>
          <div className="flex justify-between items-baseline shrink-0">
            <h2 className="m-0 text-[13px] tracking-[0.14em] uppercase text-[#9ca3af]">APPLICANTS</h2>
            <span className="text-[11px] text-[#6b7280]">{applicants.length}</span>
          </div>

          <ul className="m-0 p-0 flex flex-col gap-1.5 overflow-y-auto flex-1 pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[rgba(156,163,175,0.3)] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[rgba(156,163,175,0.5)]">
            {!isSelectedInList && (
              <>
                <button
                  key={selectedApplicant.id}
                  data-applicant-id={selectedApplicant.id}
                  className={`group border-none bg-transparent rounded-[10px] p-2 flex items-center justify-between gap-2 cursor-pointer transition-all duration-120 text-[#9ca3af] hover:bg-[rgba(255,255,255,0.05)] hover:-translate-y-px hover:text-[#e5e7eb] w-full bg-[#111827]! shadow-[0_0_0_1px_rgba(248,250,252,0.14),0_10px_24px_rgba(15,23,42,0.6)] text-[#e5e7eb]!`}
                  onClick={() => {
                    setSearchParams({ id: selectedApplicant.id })
                    if (window.innerWidth <= 768) setSidebarOpen(false)
                  }}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-[13px] font-semibold text-inherit">{selectedApplicant.name}</span>
                    <span className="text-[11px] text-[#6b7280] group-hover:text-[#9ca3af]">Developer</span>
                  </div>
                  {selectedApplicant.tags && selectedApplicant.tags.length > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.03)] border border-[#4b5563] text-[#9ca3af] whitespace-nowrap transition-all duration-200 group-hover:border-[#9ca3af] group-hover:text-[#e5e7eb] bg-[#fef3c7] border-[#facc15] text-[#92400e]`}>
                      {selectedApplicant.tags[0]}
                    </span>
                  )}
                </button>
                <div className="h-px bg-[#374151] my-2 mx-2" />
              </>
            )}
            {applicants.map((applicant) => (
              <button
                key={applicant.id}
                data-applicant-id={applicant.id}
                className={`group border-none bg-transparent rounded-[10px] p-2 flex items-center justify-between gap-2 cursor-pointer transition-all duration-120 text-[#9ca3af] hover:bg-[rgba(255,255,255,0.05)] hover:-translate-y-px hover:text-[#e5e7eb] w-full ${selectedApplicant.id === applicant.id ? 'bg-[#111827]! shadow-[0_0_0_1px_rgba(248,250,252,0.14),0_10px_24px_rgba(15,23,42,0.6)] text-[#e5e7eb]!' : ''
                  }`}
                onClick={() => {
                  setSearchParams({ id: applicant.id })
                  if (window.innerWidth <= 768) setSidebarOpen(false)
                }}
              >
                <div className="flex flex-col items-start">
                  <span className="text-[13px] font-semibold text-inherit">{applicant.name}</span>
                  <span className="text-[11px] text-[#6b7280] group-hover:text-[#9ca3af]">Developer</span>
                </div>
                {applicant.tags && applicant.tags.length > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.03)] border border-[#4b5563] text-[#9ca3af] whitespace-nowrap transition-all duration-200 group-hover:border-[#9ca3af] group-hover:text-[#e5e7eb] ${selectedApplicant.id === applicant.id ? 'bg-[#fef3c7] border-[#facc15] text-[#92400e]' : ''}`}>
                    {applicant.tags[0]}
                  </span>
                )}
              </button>
            ))}
            {lastKey && (
              <button
                className="w-full py-2 text-xs text-[#6b7280] hover:text-[#e5e7eb] bg-transparent border border-[#374151] rounded-lg mt-2 cursor-pointer transition-colors"
                onClick={handleNext}
              >
                Load More
              </button>
            )}
          </ul>
        </div>
      </aside>

      <main className="relative bg-white rounded-[18px] p-8 shadow-[0_22px_45px_rgba(15,23,42,0.18),0_0_0_1px_rgba(15,23,42,0.04)] overflow-visible h-[92vh] flex flex-col max-md:p-5 max-md:h-[92vh] max-md:rounded-none max-md:overflow-y-auto max-md:overflow-x-hidden">
        <div className="pr-[120px] overflow-y-auto flex-1 pb-5 max-md:pr-0 max-md:overflow-y-visible max-md:h-auto max-md:pb-20 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[rgba(156,163,175,0.3)] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[rgba(156,163,175,0.5)]">
          <header className="flex justify-between items-end mb-6 pb-3 border-b-2 border-[#e5e7eb]">
            <div className="resume-title">
              <h1 className="m-0 text-[26px]">{selectedApplicant.name}</h1>
              <p className="mt-1 text-sm text-[#6b7280]">{selectedApplicant.status_message || 'No status message'}</p>
            </div>
            <div className="text-right text-xs text-[#6b7280]">
              {/* <div>ID: {selectedApplicant.id}</div> */}
              <div className="mt-0.5">Uploaded: {new Date(selectedApplicant.created_at * 1000).toLocaleString()}</div>
              <div className="mt-0.5">Last Updated: {new Date(selectedApplicant.updated_at * 1000).toLocaleString()}</div>
              <div className="mt-2 flex gap-3 justify-end text-[#4b5563]">
                <span className="flex items-center gap-1" title="Popularity">
                  <Flame className='w-3 h-3' /> {selectedApplicant.popularity}
                </span>
                <span className="flex items-center gap-1" title="Views">
                  <Eye className='w-3 h-3' /> {selectedApplicant.view_count}
                </span>
                <span className="flex items-center gap-1" title="Downloads">
                  <Download className='w-3 h-3' /> {selectedApplicant.download_count}
                </span>
              </div>
            </div>
          </header>

          <section className="mt-[18px]">
            <h2 className="m-0 mb-1.5 text-[15px] tracking-[0.08em] uppercase text-[#4b5563]">Basic Info</h2>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-stretch max-md:flex max-md:flex-col-reverse max-md:gap-6 max-md:items-center">
              <table className="w-full border-collapse border border-[#e5e7eb] text-[13px] m-0 max-md:border max-md:border-[#e5e7eb] max-md:rounded-lg max-md:overflow-hidden">
                <tbody>
                  <tr className="max-md:flex max-md:flex-col max-md:border-b max-md:border-[#e5e7eb]">
                    <th className="p-2 border border-[#e5e7eb] text-left bg-[#f9fafb] font-semibold whitespace-nowrap max-md:block max-md:w-full max-md:bg-[#f9fafb] max-md:text-[#6b7280] max-md:pb-1 max-md:border-none">Name</th>
                    <td className="p-2 border border-[#e5e7eb] text-left max-md:block max-md:w-full max-md:pt-1 max-md:border-none max-md:border-b max-md:border-[#f3f4f6]">{selectedApplicant.name || 'Unknown'}</td>
                    <th className="p-2 border border-[#e5e7eb] text-left bg-[#f9fafb] font-semibold whitespace-nowrap max-md:block max-md:w-full max-md:bg-[#f9fafb] max-md:text-[#6b7280] max-md:pb-1 max-md:border-none">Uploader</th>
                    <td className="p-2 border border-[#e5e7eb] text-left max-md:block max-md:w-full max-md:pt-1 max-md:border-none max-md:border-b max-md:border-[#f3f4f6]">{selectedApplicant.uploader_nickname || 'Unknown'}</td>
                  </tr>
                  <tr className="max-md:flex max-md:flex-col max-md:border-b max-md:border-[#e5e7eb]">
                    <th className="p-2 border border-[#e5e7eb] text-left bg-[#f9fafb] font-semibold whitespace-nowrap max-md:block max-md:w-full max-md:bg-[#f9fafb] max-md:text-[#6b7280] max-md:pb-1 max-md:border-none">Phone</th>
                    <td className="p-2 border border-[#e5e7eb] text-left max-md:block max-md:w-full max-md:pt-1 max-md:border-none max-md:border-b max-md:border-[#f3f4f6]">{selectedApplicant.id.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</td>
                  </tr>
                  <tr className="max-md:flex max-md:flex-col max-md:border-b max-md:border-[#e5e7eb]">
                    <th className="p-2 border border-[#e5e7eb] text-left bg-[#f9fafb] font-semibold whitespace-nowrap max-md:block max-md:w-full max-md:bg-[#f9fafb] max-md:text-[#6b7280] max-md:pb-1 max-md:border-none">Gender</th>
                    <td className="p-2 border border-[#e5e7eb] text-left max-md:block max-md:w-full max-md:pt-1 max-md:border-none max-md:border-b max-md:border-[#f3f4f6]">{selectedApplicant.gender === 0 ? 'Female' : selectedApplicant.gender === 1 ? 'Male' : 'Other'}</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex items-center max-md:w-full max-md:justify-center max-md:mb-2">
                <div className="w-[110px] h-[140px] border border-[#9ca3af] rounded-md flex flex-col items-center justify-center text-[11px] text-[#6b7280] bg-[repeating-linear-gradient(-45deg,#f9fafb,#f9fafb_6px,#f3f4f6_6px,#f3f4f6_12px)] overflow-hidden">
                  <img
                    src={`https://dt3lfi1tp9am3.cloudfront.net/${selectedApplicant.id}/${selectedApplicant.id}_thumb.webp`}
                    alt={selectedApplicant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-[18px]">
            <h2 className="m-0 mb-1.5 text-[15px] tracking-[0.08em] uppercase text-[#4b5563]">Summary</h2>
            <p className="m-1.5 text-[#4b5563] leading-relaxed">
              {selectedApplicant.summary || selectedApplicant.status_message || 'No summary available.'}
            </p>
          </section>

          <section className="mt-[18px]">
            <h2 className="m-0 mb-1.5 text-[15px] tracking-[0.08em] uppercase text-[#4b5563]">Tags</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedApplicant.tags && selectedApplicant.tags.map((tag, i) => (
                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#1d4ed8] text-[#eff6ff] text-[11px] tracking-[0.04em] lowercase cursor-default shadow-[0_6px_14px_rgba(37,99,235,0.35)]">
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-[18px]">
            <h2 className="m-0 mb-1.5 text-[15px] tracking-[0.08em] uppercase text-[#4b5563]">Experience</h2>
            <div className="m-1.5 text-[#4b5563] leading-relaxed">
              <p><strong>Senior Developer at Tech Corp</strong> (2020 - Present)</p>
              <p>Led the frontend team in rebuilding the core product using React and TypeScript.</p>
              <p><strong>Frontend Developer at StartUp Inc</strong> (2018 - 2020)</p>
              <p>Developed and maintained multiple client-facing web applications.</p>
            </div>
          </section>
        </div>

        <div className="absolute top-1/2 -right-16 -translate-y-1/2 flex flex-col gap-2.5 max-md:static max-md:transform-none max-md:flex-row max-md:mt-8 max-md:gap-2 max-md:overflow-x-auto max-md:pb-2 max-md:justify-start max-md:w-full [&::-webkit-scrollbar]:hidden">
          <div className="relative min-w-[120px] px-[18px] py-2.5 rounded-l-[10px] text-[#111827] text-[13px] font-semibold tracking-[0.08em] text-center bg-linear-to-br from-[#fef3c7] to-[#fde68a] shadow-[0_10px_20px_rgba(15,23,42,0.18),0_0_0_1px_rgba(15,23,42,0.05)] cursor-pointer transition-all duration-160 hover:-translate-x-1 hover:shadow-[0_16px_28px_rgba(15,23,42,0.2),0_0_0_1px_rgba(15,23,42,0.06)] max-md:min-w-auto max-md:flex-1 max-md:rounded-lg max-md:px-3 max-md:py-2.5 max-md:text-xs max-md:whitespace-nowrap before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(circle_at_0_50%,rgba(0,0,0,0.12),transparent_60%)] before:opacity-40 before:mix-blend-multiply before:pointer-events-none" onClick={() => {
            window.open(`https://d3rd8muqzoyvtk.cloudfront.net/realm/${selectedApplicant.id}/download`, '_blank')
          }}>
            DOWNLOAD
          </div>
          <div className="relative min-w-[120px] px-[18px] py-2.5 rounded-l-[10px] text-[#111827] text-[13px] font-semibold tracking-[0.08em] text-center bg-linear-to-br from-[#e0f2fe] to-[#bfdbfe] shadow-[0_10px_20px_rgba(15,23,42,0.18),0_0_0_1px_rgba(15,23,42,0.05)] cursor-pointer transition-all duration-160 hover:-translate-x-1 hover:shadow-[0_16px_28px_rgba(15,23,42,0.2),0_0_0_1px_rgba(15,23,42,0.06)] max-md:min-w-auto max-md:flex-1 max-md:rounded-lg max-md:px-3 max-md:py-2.5 max-md:text-xs max-md:whitespace-nowrap before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(circle_at_0_50%,rgba(0,0,0,0.12),transparent_60%)] before:opacity-40 before:mix-blend-multiply before:pointer-events-none">
            PORTFOLIO
          </div>
          <div className="relative min-w-[120px] px-[18px] py-2.5 rounded-l-[10px] text-[#111827] text-[13px] font-semibold tracking-[0.08em] text-center bg-linear-to-br from-[#fee2e2] to-[#fecaca] shadow-[0_10px_20px_rgba(15,23,42,0.18),0_0_0_1px_rgba(15,23,42,0.05)] cursor-pointer transition-all duration-160 hover:-translate-x-1 hover:shadow-[0_16px_28px_rgba(15,23,42,0.2),0_0_0_1px_rgba(15,23,42,0.06)] max-md:min-w-auto max-md:flex-1 max-md:rounded-lg max-md:px-3 max-md:py-2.5 max-md:text-xs max-md:whitespace-nowrap before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(circle_at_0_50%,rgba(0,0,0,0.12),transparent_60%)] before:opacity-40 before:mix-blend-multiply before:pointer-events-none">
            CONTACT
          </div>
        </div>
      </main>
    </div>
  )
}

export default Applicant
