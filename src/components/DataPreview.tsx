import { type Character } from '../types/character'

interface Props {
    characterData: Character | null
    activeTab: 'info' | 'lore' | 'stickers'
    setActiveTab: (tab: 'info' | 'lore' | 'stickers') => void
}

export default function DataPreview({ characterData, activeTab, setActiveTab }: Props) {
    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">데이터 미리보기</label>
                {characterData && (
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('info')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'info' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            정보
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('lore')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'lore' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            로어북 ({characterData.lorebook?.length || 0})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('stickers')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'stickers' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            스티커 ({characterData.stickers?.length || 0})
                        </button>
                    </div>
                )}
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-4 overflow-auto border border-gray-200">
                {characterData ? (
                    <>
                        {activeTab === 'info' && (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">프롬프트</h4>
                                    <div className="text-sm text-gray-800 whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                                        {characterData.prompt}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <div className="text-xs text-gray-500 mb-1">반응 속도</div>
                                        <div className="font-medium">{characterData.responseTime}</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <div className="text-xs text-gray-500 mb-1">생각하는 시간</div>
                                        <div className="font-medium">{characterData.thinkingTime}</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <div className="text-xs text-gray-500 mb-1">반응성</div>
                                        <div className="font-medium">{characterData.reactivity}</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <div className="text-xs text-gray-500 mb-1">톤</div>
                                        <div className="font-medium">{characterData.tone}</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <div className="text-xs text-gray-500 mb-1">선톡 기능</div>
                                        <div className="font-medium">{characterData.proactiveEnabled ? '켜짐' : '꺼짐'}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'lore' && (
                            <div className="space-y-3">
                                {characterData.lorebook && characterData.lorebook.length > 0 ? (
                                    characterData.lorebook.map((lore, idx) => (
                                        <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-bold text-sm text-gray-900">{lore.name || '이름 없음'}</span>
                                                {lore.alwaysActive && (
                                                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">ALWAYS</span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {lore.activationKeys?.map((key, kIdx) => (
                                                    <span key={kIdx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{key}</span>
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-600 line-clamp-3">{lore.prompt}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-8">로어북 데이터가 없습니다.</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'stickers' && (
                            <div className="grid grid-cols-3 gap-3">
                                {characterData.stickers && characterData.stickers.length > 0 ? (
                                    characterData.stickers.map((sticker, idx) => (
                                        <div key={idx} className="bg-white p-2 rounded-lg border border-gray-200 flex flex-col items-center">
                                            <div className="w-full aspect-square bg-gray-50 rounded-md mb-2 overflow-hidden flex items-center justify-center">
                                                {sticker.data ? (
                                                    <img src={sticker.data} alt={sticker.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="text-xs text-gray-400">No Image</span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-600 truncate w-full text-center" title={sticker.name}>{sticker.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center text-gray-500 py-8">스티커 데이터가 없습니다.</div>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 italic">이미지를 업로드하면 데이터가 표시됩니다</div>
                )}
            </div>
        </div>
    )
}
