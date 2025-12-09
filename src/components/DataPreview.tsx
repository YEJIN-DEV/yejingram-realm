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
                <label className="block text-sm font-medium text-(--color-text-secondary)">데이터 미리보기</label>
                {characterData && (
                    <div className="flex bg-(--color-bg-input-primary) rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('info')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'info' ? 'bg-(--color-bg-primary) text-(--color-brand-primary) shadow-sm' : 'text-(--color-text-tertiary) hover:text-(--color-text-secondary)'}`}
                        >
                            정보
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('lore')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'lore' ? 'bg-(--color-bg-primary) text-(--color-brand-primary) shadow-sm' : 'text-(--color-text-tertiary) hover:text-(--color-text-secondary)'}`}
                        >
                            로어북 ({characterData.lorebook?.length || 0})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('stickers')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'stickers' ? 'bg-(--color-bg-primary) text-(--color-brand-primary) shadow-sm' : 'text-(--color-text-tertiary) hover:text-(--color-text-secondary)'}`}
                        >
                            스티커 ({characterData.stickers?.length || 0})
                        </button>
                    </div>
                )}
            </div>
            <div className="flex-1 bg-(--color-bg-secondary) rounded-xl p-4 overflow-auto border border-(--color-border)">
                {characterData ? (
                    <>
                        {activeTab === 'info' && (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold text-(--color-text-tertiary) uppercase mb-1">프롬프트</h4>
                                    <div className="text-sm text-(--color-text-primary) whitespace-pre-wrap bg-(--color-bg-primary) p-3 rounded-lg border border-(--color-border) max-h-60 overflow-y-auto">
                                        {characterData.prompt}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-(--color-bg-primary) p-3 rounded-lg border border-(--color-border)">
                                        <div className="text-xs text-(--color-text-secondary) mb-1">반응 속도</div>
                                        <div className="font-medium text-(--color-text-primary)">{characterData.responseTime}</div>
                                    </div>
                                    <div className="bg-(--color-bg-primary) p-3 rounded-lg border border-(--color-border)">
                                        <div className="text-xs text-(--color-text-secondary) mb-1">생각하는 시간</div>
                                        <div className="font-medium text-(--color-text-primary)">{characterData.thinkingTime}</div>
                                    </div>
                                    <div className="bg-(--color-bg-primary) p-3 rounded-lg border border-(--color-border)">
                                        <div className="text-xs text-(--color-text-secondary) mb-1">반응성</div>
                                        <div className="font-medium text-(--color-text-primary)">{characterData.reactivity}</div>
                                    </div>
                                    <div className="bg-(--color-bg-primary) p-3 rounded-lg border border-(--color-border)">
                                        <div className="text-xs text-(--color-text-secondary) mb-1">톤</div>
                                        <div className="font-medium text-(--color-text-primary)">{characterData.tone}</div>
                                    </div>
                                    <div className="bg-(--color-bg-primary) p-3 rounded-lg border border-(--color-border)">
                                        <div className="text-xs text-(--color-text-secondary) mb-1">선톡 기능</div>
                                        <div className="font-medium text-(--color-text-primary)">{characterData.proactiveEnabled ? '켜짐' : '꺼짐'}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'lore' && (
                            <div className="space-y-3">
                                {characterData.lorebook && characterData.lorebook.length > 0 ? (
                                    characterData.lorebook.map((lore, idx) => (
                                        <div key={idx} className="bg-(--color-bg-primary) p-3 rounded-lg border border-(--color-border)">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-bold text-sm text-(--color-text-primary)">{lore.name || '이름 없음'}</span>
                                                {lore.alwaysActive && (
                                                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">ALWAYS</span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {lore.activationKeys?.map((key, kIdx) => (
                                                    <span key={kIdx} className="px-2 py-0.5 bg-(--color-bg-input-primary) text-(--color-text-tertiary) text-xs rounded">{key}</span>
                                                ))}
                                            </div>
                                            <p className="text-xs text-(--color-text-tertiary) line-clamp-3">{lore.prompt}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-(--color-text-secondary) py-8">로어북 데이터가 없습니다.</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'stickers' && (
                            <div className="grid grid-cols-3 gap-3">
                                {characterData.stickers && characterData.stickers.length > 0 ? (
                                    characterData.stickers.map((sticker, idx) => (
                                        <div key={idx} className="bg-(--color-bg-primary) p-2 rounded-lg border border-(--color-border) flex flex-col items-center">
                                            <div className="w-full aspect-square bg-(--color-bg-secondary) rounded-md mb-2 overflow-hidden flex items-center justify-center">
                                                {sticker.data ? (
                                                    <img src={sticker.data} alt={sticker.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="text-xs text-(--color-icon-secondary)">No Image</span>
                                                )}
                                            </div>
                                            <span className="text-xs text-(--color-text-tertiary) truncate w-full text-center" title={sticker.name}>{sticker.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center text-(--color-text-secondary) py-8">스티커 데이터가 없습니다.</div>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-(--color-text-secondary) italic">이미지를 업로드하면 데이터가 표시됩니다</div>
                )}
            </div>
        </div>
    )
}
