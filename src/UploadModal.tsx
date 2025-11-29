import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { decodeText } from './util/imageStego'

interface Sticker {
    id: string;
    name: string;
    data: string;
    type: string;
}

interface Lore {
    [key: string]: any
}

interface Character {
    id: number
    name: string
    prompt: string
    avatar: string | null
    responseTime: number
    thinkingTime: number
    reactivity: number
    tone: number
    proactiveEnabled: boolean
    messageCountSinceLastSummary: number
    media: string[]
    stickers: Sticker[]
    lorebook?: Lore[]
}

interface UploadModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        gender: 0,
        summary: '',
        status_message: '',
        tags: [] as string[],
    })
    const [tagInput, setTagInput] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        const inputElement = e.target

        if (file && file.type === 'image/png') {
            const reader = new FileReader()
            reader.onloadend = async () => {
                const result = reader.result as string
                try {
                    const { text } = await decodeText(result)
                    if (!text) throw new Error("No hidden data found")

                    const characterData = JSON.parse(text) as Character

                    // Validate required fields
                    const requiredFields: (keyof Character)[] = [
                        'name', 'prompt', 'responseTime', 'thinkingTime',
                        'reactivity', 'tone', 'proactiveEnabled',
                        'messageCountSinceLastSummary', 'media', 'stickers'
                    ]

                    const isValid = requiredFields.every(field => field in characterData)

                    if (!isValid) {
                        throw new Error("Invalid character data structure")
                    }

                    setSelectedFile(file)
                    setPreviewUrl(result)
                    setFormData(prev => ({
                        ...prev,
                        name: characterData.name
                    }))
                } catch (error) {
                    console.error(error)
                    alert("유효하지 않은 캐릭터 파일입니다. 올바른 형식의 PNG 파일을 업로드해주세요.")
                    inputElement.value = ''
                    setSelectedFile(null)
                    setPreviewUrl(null)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && tagInput === '' && formData.tags.length > 0) {
            setFormData(prev => ({
                ...prev,
                tags: prev.tags.slice(0, -1)
            }))
        }
    }

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value.endsWith(',')) {
            const newTag = value.slice(0, -1).trim()
            if (newTag && !formData.tags.includes(newTag)) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, newTag]
                }))
            }
            setTagInput('')
        } else {
            setTagInput(value)
        }
    }

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }))
    }

    const handleCloseModal = () => {
        if (window.confirm("작성중이던 내용이 전부 지워집니다. 정말 닫으시겠습니까?")) {
            onClose()
            setFormData({
                name: '',
                gender: 0,
                summary: '',
                status_message: '',
                tags: [],
            })
            setTagInput('')
            setSelectedFile(null)
            setPreviewUrl(null)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement submission logic
        console.log(formData, selectedFile)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl">
                <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-gray-500" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-gray-900">새 캐릭터 등록</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden relative bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400 group-hover:text-indigo-500 transition-colors">
                                    <Upload className="w-8 h-8 mb-1" />
                                    <span className="text-xs font-medium">PNG Only</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept=".png"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                required
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">캐릭터 이미지를 업로드하세요</p>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="캐릭터 이름을 입력하세요"
                            required
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
                        <div className="flex gap-4">
                            {[
                                { label: '여성', value: 0 },
                                { label: '남성', value: 1 },
                                { label: '기타', value: 2 }
                            ].map((option) => (
                                <label key={option.value} className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-all ${formData.gender === option.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked={formData.gender === option.value}
                                        onChange={() => setFormData({ ...formData, gender: option.value })}
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Status Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">한줄 소개</label>
                        <input
                            type="text"
                            value={formData.status_message}
                            onChange={e => setFormData({ ...formData, status_message: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="캐릭터를 한 문장으로 소개해주세요"
                            required
                        />
                    </div>

                    {/* Summary */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">상태 메시지</label>
                        <textarea
                            value={formData.summary}
                            onChange={e => setFormData({ ...formData, summary: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-48 resize-none transition-all"
                            placeholder="캐릭터 설명을 적어주세요"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">태그 (쉼표로 구분)</label>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                                <span key={index} className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1 hover:bg-indigo-200 transition-colors">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="text-indigo-500 hover:text-indigo-700 transition-colors"
                                    >
                                        <X className="w-4 h-4 cursor-pointer" />
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                value={tagInput}
                                onKeyDown={handleTagKeyDown}
                                onChange={handleTagChange}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="태그를 입력하고 쉼표로 구분하세요"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            등록하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
