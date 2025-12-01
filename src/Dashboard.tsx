import { useState, useEffect } from 'react'
import { useAuth } from 'react-oidc-context'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Eye, Download, Plus, Flame, Loader2, ArrowUpDown } from 'lucide-react'
import CharacterManageModal from './CharacterManageModal'

interface ApiCharacterItem {
    summary: string
    created_at: number
    gsi_global_pk: number
    view_count: number
    download_count: number
    uploader_nickname: string
    name: string
    gender?: number
    status_message: string
    popularity: number
    updated_at: number
    uploader_uid: string
    file_name: string
    id: string
    tags: string[]
    is_nsfw?: boolean
    copyright?: string | null
}

interface DashboardCharacter {
    id: string
    name: string
    summary: string
    thumbnail: string
    popularity: number
    views: number
    downloads: number
    gender?: number
    status_message: string
    tags: string[]
    file_name: string
    created_at: number
    updated_at: number,
    is_nsfw: boolean,
    copyright?: string | null
}

export default function Dashboard() {
    const auth = useAuth()
    const navigate = useNavigate()
    const [myCharacters, setMyCharacters] = useState<DashboardCharacter[]>([])
    const [charCount, setCharCount] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [droppedFile, setDroppedFile] = useState<File | null>(null)
    const [editMode, setEditMode] = useState<'create' | 'edit'>('create')
    const [selectedCharacter, setSelectedCharacter] = useState<DashboardCharacter | null>(null)
    const [sortOption, setSortOption] = useState<'name' | 'popularity' | 'views' | 'downloads' | 'created_at' | 'updated_at'>('popularity')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    useEffect(() => {
        if (!auth.isLoading) {
            if (!auth.isAuthenticated) {
                toast.error("로그인이 필요한 메뉴입니다")
                if (auth.user) {
                    auth.removeUser()
                }
                navigate("/")
                return
            }
        }
    }, [auth.isLoading, auth.isAuthenticated, auth.user, navigate])

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (file) {
            setDroppedFile(file)
            setEditMode('create')
            setSelectedCharacter(null)
            setIsModalOpen(true)
        }
    }

    const fetchMyCharacters = () => {
        if (auth.user?.profile.sub) {
            setIsLoading(true)
            fetch('https://d3rd8muqzoyvtk.cloudfront.net/realm/search/uid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uploader_uid: auth.user.profile.sub }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.items) {
                        const mappedCharacters = data.items.map((item: ApiCharacterItem) => ({
                            id: item.id,
                            name: item.name,
                            summary: item.summary,
                            thumbnail: `https://dt3lfi1tp9am3.cloudfront.net/${item.id}/${item.id}_thumb.webp`,
                            popularity: item.popularity,
                            views: item.view_count,
                            downloads: item.download_count,
                            gender: item.gender,
                            status_message: item.status_message,
                            tags: item.tags,
                            file_name: item.file_name,
                            created_at: item.created_at,
                            updated_at: item.updated_at,
                            is_nsfw: item.is_nsfw ?? false,
                            copyright: item.copyright ?? null,
                        }))
                        setMyCharacters(mappedCharacters)
                        setCharCount(data.count || mappedCharacters.length)
                    }
                })
                .catch((err) => console.error('Failed to fetch characters:', err))
                .finally(() => setIsLoading(false))
        }
    }

    useEffect(() => {
        fetchMyCharacters()
    }, [auth.user?.profile.sub])

    const sortedCharacters = [...myCharacters].sort((a, b) => {
        let comparison = 0
        switch (sortOption) {
            case 'name':
                comparison = a.name.localeCompare(b.name)
                break
            case 'popularity':
                comparison = a.popularity - b.popularity
                break
            case 'views':
                comparison = a.views - b.views
                break
            case 'downloads':
                comparison = a.downloads - b.downloads
                break
            case 'created_at':
                comparison = a.created_at - b.created_at
                break
            case 'updated_at':
                comparison = a.updated_at - b.updated_at
                break
        }
        return sortOrder === 'asc' ? comparison : -comparison
    })

    return (
        <div className="w-full max-w-[1200px] mx-auto py-10 px-5 font-sans">
            <div className="mb-10">
                <h1 className="text-[32px] font-extrabold text-(--color-text-primary) mb-3 tracking-[-0.5px]">{auth.user?.profile.nickname}님의 대시보드</h1>
                <p className="text-base text-(--color-text-secondary) m-0">
                    내 캐릭터를 관리하고 통계를 확인하세요.
                </p>
            </div>

            {/* Upload Section */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-(--color-text-primary)">캐릭터 업로드</h2>
                </div>
                <div
                    onClick={() => {
                        setEditMode('create')
                        setSelectedCharacter(null)
                        setIsModalOpen(true)
                    }}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="bg-white border-2 border-dashed border-(--color-border-secondary) rounded-3xl p-10 flex flex-col items-center justify-center text-center hover:border-[#6366f1] hover:bg-[#6366f1]/5 transition-all cursor-pointer group"
                >
                    <div className="w-16 h-16 bg-(--color-bg-secondary) rounded-full flex items-center justify-center mb-4 group-hover:bg-[#6366f1]/10 transition-colors">
                        <Plus className="w-8 h-8 text-(--color-text-secondary) group-hover:text-[#6366f1]" />
                    </div>
                    <h3 className="text-lg font-semibold text-(--color-text-primary) mb-2">새로운 캐릭터 등록하기</h3>
                    <p className="text-(--color-text-secondary) max-w-md">
                        나만의 매력적인 캐릭터를 등록하고 전 세계 유저들에게 소개해보세요!
                    </p>
                    <small className="text-(--color-text-secondary) mt-4">클릭해서 업로드를 시작하거나, 예진그램 PNG 파일을 드래그 앤 드롭하세요.</small>
                </div>
            </div>

            {/* My Characters List */}
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-(--color-text-primary)">내 캐릭터 목록 ({charCount})</h2>

                    <div className="flex items-center gap-2">
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value as any)}
                            className="px-3 py-2 rounded-lg border border-(--color-border-secondary) bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                        >
                            <option value="name">이름순</option>
                            <option value="popularity">인기도순</option>
                            <option value="views">조회수순</option>
                            <option value="downloads">다운로드순</option>
                            <option value="created_at">업로드 날짜순</option>
                            <option value="updated_at">업데이트 날짜순</option>
                        </select>

                        <button
                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            className="p-2 rounded-lg border border-(--color-border-secondary) bg-white hover:bg-gray-50 transition-colors flex items-center gap-1 text-sm font-medium text-gray-600"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            {sortOrder === 'asc' ? '오름차순' : '내림차순'}
                        </button>
                    </div>
                </div>
                <div>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-10 h-10 text-[#6366f1] animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedCharacters.map((char) => (
                                <div key={char.id} className="bg-white rounded-3xl p-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.01)] border border-(--color-border-secondary) hover:-translate-y-1 transition-transform duration-300">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4 w-full">
                                            <div className="w-14 h-14 shrink-0 rounded-2xl bg-linear-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                                                <img src={char.thumbnail} alt={char.name} className="w-full h-full object-cover rounded-2xl" />
                                            </div>
                                            <div className="min-w-0 flex-1 cursor-pointer" onClick={() => window.open(`/character?id=${char.id}`, '_blank')}>
                                                <h3 className="font-bold text-lg text-(--color-text-primary) leading-tight mb-1 truncate">{char.name}</h3>
                                                <p className="text-sm text-(--color-text-secondary) font-medium leading-relaxed line-clamp-1 overflow-hidden">{char.summary}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-50 rounded-2xl p-4">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                                                <Flame className="w-3 h-3" /> 인기도
                                            </div>
                                            <div className="font-bold text-gray-900">{char.popularity.toFixed(2)}</div>
                                        </div>
                                        <div className="text-center border-l border-gray-200">
                                            <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                                                <Eye className="w-3 h-3" /> 조회수
                                            </div>
                                            <div className="font-bold text-gray-900">{char.views.toLocaleString()}</div>
                                        </div>
                                        <div className="text-center border-l border-gray-200">
                                            <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                                                <Download className="w-3 h-3" /> 다운로드
                                            </div>
                                            <div className="font-bold text-gray-900">{char.downloads.toLocaleString()}</div>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <button
                                            onClick={() => {
                                                setEditMode('edit')
                                                setSelectedCharacter(char)
                                                setIsModalOpen(true)
                                            }}
                                            className="flex-1 bg-[#6366f1] text-white py-3 rounded-xl font-semibold hover:bg-[#4f46e5] transition-colors shadow-lg shadow-indigo-500/20"
                                        >
                                            관리
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <CharacterManageModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setDroppedFile(null)
                    setSelectedCharacter(null)
                }}
                onSuccess={fetchMyCharacters}
                mode={editMode}
                initialFile={droppedFile}
                initialData={selectedCharacter ? {
                    id: selectedCharacter.id,
                    name: selectedCharacter.name,
                    gender: selectedCharacter.gender,
                    summary: selectedCharacter.summary,
                    status_message: selectedCharacter.status_message,
                    tags: selectedCharacter.tags,
                    file_name: selectedCharacter.file_name,
                    is_nsfw: selectedCharacter.is_nsfw,
                    copyright: selectedCharacter.copyright ?? null
                } : undefined}
            />
        </div >
    )
}
