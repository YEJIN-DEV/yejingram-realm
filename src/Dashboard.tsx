import { useState } from 'react'
import { APPLICANTS } from './applicants'
import { Edit, Eye, Download, Heart, Plus } from 'lucide-react'

export default function Dashboard() {
    // Mock stats for the applicants
    const [myCharacters] = useState(() => APPLICANTS.map(app => ({
        ...app,
        views: Math.floor(Math.random() * 10000),
        downloads: Math.floor(Math.random() * 5000),
        popularity: Math.floor(Math.random() * 100)
    })))

    return (
        <div className="w-full max-w-[1200px] mx-auto py-10 px-5 font-sans">
            <div className="mb-10">
                <h1 className="text-[32px] font-extrabold text-(--color-text-primary) mb-3 tracking-[-0.5px]">대시보드</h1>
                <p className="text-base text-(--color-text-secondary) m-0">
                    내 캐릭터를 관리하고 통계를 확인하세요.
                </p>
            </div>

            {/* Upload Section */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-(--color-text-primary)">캐릭터 업로드</h2>
                </div>
                <div className="bg-white border-2 border-dashed border-(--color-border-secondary) rounded-3xl p-10 flex flex-col items-center justify-center text-center hover:border-[#6366f1] hover:bg-[#6366f1]/5 transition-all cursor-pointer group">
                    <div className="w-16 h-16 bg-(--color-bg-secondary) rounded-full flex items-center justify-center mb-4 group-hover:bg-[#6366f1]/10 transition-colors">
                        <Plus className="w-8 h-8 text-(--color-text-secondary) group-hover:text-[#6366f1]" />
                    </div>
                    <h3 className="text-lg font-semibold text-(--color-text-primary) mb-2">새로운 캐릭터 등록하기</h3>
                    <p className="text-(--color-text-secondary) max-w-md">
                        나만의 매력적인 캐릭터를 등록하고 전 세계 유저들에게 소개해보세요!
                    </p>
                </div>
            </div>

            {/* My Characters List */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-(--color-text-primary)">내 캐릭터 목록</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myCharacters.map((char) => (
                        <div key={char.id} className="bg-white rounded-3xl p-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.01)] border border-(--color-border-secondary) hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                                        {char.photoInitial}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-(--color-text-primary) leading-tight mb-1">{char.name}</h3>
                                        <p className="text-sm text-(--color-text-secondary) font-medium">{char.role}</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-[#6366f1]">
                                    <Edit className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-50 rounded-2xl p-4">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                                        <Heart className="w-3 h-3" /> 인기도
                                    </div>
                                    <div className="font-bold text-gray-900">{char.popularity}</div>
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

                            <div className="flex gap-2">
                                <button className="flex-1 bg-[#6366f1] text-white py-3 rounded-xl font-semibold hover:bg-[#4f46e5] transition-colors shadow-lg shadow-indigo-500/20">
                                    업데이트
                                </button>
                                <button className="px-4 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                                    관리
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
