import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { decodeText } from './util/imageStego'
import toast from 'react-hot-toast'
import { useAuth } from 'react-oidc-context';
import type { Character } from './types/character'

import TagInput from './components/TagInput'
import FileUpload from './components/FileUpload'
import GenderSelector from './components/GenderSelector'
import NsfwSelector from './components/NsfwSelector'
import CopyrightSelector from './components/CopyrightSelector'
import DataPreview from './components/DataPreview'

import {
    requestCreateCharacter,
    uploadFileToS3,
    updateCharacter,
    deleteCharacter,
    loadCharacterFile,
    buildCreateMetadata,
    buildUpdateData,
    hasChanges
} from './api/character'

interface CharacterManageModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
    mode?: 'create' | 'edit'
    initialFile?: File | null
    initialData?: {
        id?: string | number
        name: string
        gender?: number | null
        summary: string
        status_message: string
        tags: string[]
        file_name?: string
        is_nsfw: boolean
        copyright?: string | null
    }
}

export default function CharacterManageModal({
    isOpen,
    onClose,
    onSuccess,
    mode = 'create',
    initialFile,
    initialData
}: CharacterManageModalProps) {
    const auth = useAuth()
    const [formData, setFormData] = useState({
        name: '',
        gender: null as number | null,
        summary: '',
        status_message: '',
        tags: [] as string[],
        is_nsfw: null as boolean | null,
        copyright: '',
    })
    const [tagInput, setTagInput] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const [characterData, setCharacterData] = useState<Character | null>(null)

    const [activeTab, setActiveTab] = useState<'info' | 'lore' | 'stickers'>('info')

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

    const processFile = (file: File) => {
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const reader = new FileReader()
            reader.onloadend = async () => {
                const result = reader.result as string
                try {
                    const { text } = await decodeText(result)
                    if (!text) throw new Error("No hidden data found")

                    const parsedData = JSON.parse(text) as Character

                    // Validate required fields
                    const requiredFields: (keyof Character)[] = [
                        'name', 'prompt', 'responseTime', 'thinkingTime',
                        'reactivity', 'tone', 'proactiveEnabled',
                        'messageCountSinceLastSummary', 'media', 'stickers'
                    ]

                    const isValid = requiredFields.every(field => field in parsedData)

                    if (!isValid) {
                        throw new Error("Invalid character data structure")
                    }

                    setSelectedFile(file)
                    setPreviewUrl(result)
                    setCharacterData(parsedData)
                    setFormData(prev => ({
                        ...prev,
                        name: parsedData.name
                    }))
                } catch (error) {
                    console.error(error)
                    alert("유효하지 않은 캐릭터 파일입니다. 올바른 형식의 PNG 파일을 업로드해주세요.")
                    setSelectedFile(null)
                    setPreviewUrl(null)
                    setCharacterData(null)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        if (initialFile && isOpen) {
            processFile(initialFile)
        }
    }, [initialFile, isOpen])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        const inputElement = e.target

        if (file) {
            processFile(file)
            inputElement.value = ''
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
                gender: null,
                summary: '',
                status_message: '',
                tags: [],
                is_nsfw: null,
                copyright: '',
            })
            setTagInput('')
            setSelectedFile(null)
            setPreviewUrl(null)
            setCharacterData(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (mode === 'create' && !selectedFile) {
            toast.error("캐릭터 파일을 업로드해주세요.")
            return
        }

        if (!formData.name?.trim()) {
            toast.error("이름을 입력해주세요.")
            return
        }

        if (!formData.status_message?.trim()) {
            toast.error("상태메시지를 입력해주세요.")
            return
        }

        if (!formData.summary?.trim()) {
            toast.error("캐릭터 소개를 입력해주세요.")
            return
        }

        if (formData.is_nsfw === null) {
            toast.error("NSFW 여부를 선택해주세요.")
            return
        }

        const uploadPromise = async () => {
            try {
                const idToken = auth.user?.id_token
                if (!idToken) throw new Error("Authentication required")

                if (mode === 'create') {
                    if (!selectedFile) throw new Error("No file selected")

                    const metadata = buildCreateMetadata(formData, selectedFile, characterData)
                    const { upload_url } = await requestCreateCharacter(metadata, idToken)
                    await uploadFileToS3(upload_url, selectedFile)

                    toast.success("썸네일과 봇카드가 반영되는 데 까지 몇 초 정도 걸릴 수 있습니다.")
                } else {
                    // Edit mode
                    if (!initialData?.id) throw new Error("Character ID is missing")

                    const updateData = buildUpdateData(formData, initialData, selectedFile, characterData)

                    if (!hasChanges(updateData)) {
                        throw new Error("수정된 사항이 없어 업데이트할 수 없습니다!")
                    }

                    const data = await updateCharacter(updateData, idToken)

                    if (data.upload_url && selectedFile) {
                        await uploadFileToS3(data.upload_url, selectedFile)
                        toast.success("변경된 썸네일과 봇카드가 반영되는 데 까지 몇 초 정도 걸릴 수 있습니다.")
                    }
                }
            } catch (error) {
                console.error(error)
                throw error
            }
        }

        toast.promise(
            uploadPromise(),
            {
                loading: mode === 'create' ? '캐릭터를 등록하는 중입니다...' : '캐릭터를 수정하는 중입니다...',
                success: () => {
                    onClose()
                    if (onSuccess) onSuccess()
                    setFormData({
                        name: '',
                        gender: null,
                        summary: '',
                        status_message: '',
                        tags: [],
                        is_nsfw: null,
                        copyright: '',
                    })
                    setTagInput('')
                    setSelectedFile(null)
                    setPreviewUrl(null)
                    setCharacterData(null)
                    return mode === 'create' ? '성공적으로 등록되었습니다!' : '성공적으로 수정되었습니다!'
                },
                error: (err) => {
                    if (err instanceof Error && err.message === "수정된 사항이 없어 업데이트할 수 없습니다!") {
                        return err.message
                    }
                    return mode === 'create' ? '등록에 실패했습니다.' : '수정에 실패했습니다.'
                },
            }
        )
    }

    const handleDelete = async () => {
        if (mode !== 'edit') return // Safeguard
        if (!initialData?.id) {
            toast.error("삭제할 캐릭터 ID가 없습니다.")
            return
        }

        if (!window.confirm("정말로 이 캐릭터를 삭제하시겠습니까? 삭제된 캐릭터는 복구할 수 없습니다.")) {
            return
        }

        // 한 번 더 확인
        if (!window.confirm("정말로, 정말로 이 캐릭터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            return
        }

        const idToken = auth.user?.id_token
        if (!idToken) {
            toast.error("인증이 필요합니다.")
            return
        }

        toast.promise(
            deleteCharacter(initialData.id, idToken),
            {
                loading: '캐릭터를 삭제하는 중입니다...',
                success: () => {
                    onClose()
                    if (onSuccess) onSuccess()
                    setFormData({
                        name: '',
                        gender: null,
                        summary: '',
                        status_message: '',
                        tags: [],
                        is_nsfw: null,
                        copyright: '',
                    })
                    setTagInput('')
                    setSelectedFile(null)
                    setPreviewUrl(null)
                    setCharacterData(null)
                    return '성공적으로 삭제되었습니다!'
                },
                error: '삭제에 실패했습니다.',
            }
        )
    }

    useEffect(() => {
        if (initialData && mode === 'edit') {
            setFormData({
                name: initialData.name,
                gender: initialData.gender ?? null,
                summary: initialData.summary,
                status_message: initialData.status_message,
                tags: initialData.tags,
                is_nsfw: initialData.is_nsfw ?? null,
                copyright: initialData.copyright ?? '',
            })

            if (initialData.id && initialData.file_name) {
                loadCharacterFile(initialData.id, initialData.file_name)
                    .then(file => {
                        console.log("Loaded initial file:", file.name, file.type, file.size)
                        processFile(file)
                    })
                    .catch(err => {
                        console.error("Failed to load initial file:", err)
                        toast.error("이미지를 불러오는데 실패했습니다.")
                    })
            }
        }
    }, [initialData, mode])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-(--color-bg-primary) rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col relative shadow-2xl">
                <div className="p-6 border-b border-(--color-border-secondary) flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-(--color-text-primary)">
                        {mode === 'create' ? "새 캐릭터 등록" : "캐릭터 수정"}
                    </h2>
                    <button
                        onClick={handleCloseModal}
                        className="p-2 hover:bg-(--color-bg-secondary) rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-(--color-icon-secondary)" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 h-full">
                        {/* Left Column: Metadata Inputs */}
                        <div className="flex-1 space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-(--color-text-secondary) mb-1">이름  <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-(--color-bg-input-primary) text-(--color-text-primary) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-brand-primary) focus:border-(--color-brand-primary) outline-none transition-all"
                                    placeholder="캐릭터 이름을 입력하세요"
                                    required
                                />
                            </div>

                            {/* Gender */}
                            <GenderSelector gender={formData.gender} setGender={(g) => setFormData({ ...formData, gender: g })} />
                            {/* Tags */}
                            <TagInput
                                tags={formData.tags}
                                tagInput={tagInput}
                                onTagChange={handleTagChange}
                                onTagKeyDown={handleTagKeyDown}
                                removeTag={removeTag}
                            />
                            {/* NSFW */}
                            <NsfwSelector is_nsfw={formData.is_nsfw} setIsNsfw={(v) => setFormData({ ...formData, is_nsfw: v })} />
                            {/* Copyright */}
                            <CopyrightSelector copyright={formData.copyright} setCopyright={(s) => setFormData({ ...formData, copyright: s })} />
                            {/* Status Message */}
                            <div>
                                <label className="block text-sm font-medium text-(--color-text-secondary) mb-1">상태 메시지  <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.status_message}
                                    onChange={e => setFormData({ ...formData, status_message: e.target.value })}
                                    className="w-full px-4 py-2 bg-(--color-bg-input-primary) text-(--color-text-primary) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-brand-primary) focus:border-(--color-brand-primary) outline-none transition-all"
                                    placeholder="캐릭터의 한 줄 상태 메시지를 입력하세요. 캐릭터의 매력을 한껏 어필해보세요!"
                                    required
                                />
                            </div>

                            {/* Summary */}
                            <div>
                                <label className="block text-sm font-medium text-(--color-text-secondary) mb-1">캐릭터 소개  <span className="text-red-500">*</span></label>
                                <textarea
                                    value={formData.summary}
                                    onChange={e => setFormData({ ...formData, summary: e.target.value })}
                                    className="w-full px-4 py-2 bg-(--color-bg-input-primary) text-(--color-text-primary) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-brand-primary) focus:border-(--color-brand-primary) outline-none h-70 resize-none transition-all"
                                    placeholder="캐릭터의 소개글을 작성해주세요. 다른 유저들이 캐릭터를 이해하는 데 도움이 됩니다."
                                />
                            </div>
                        </div>

                        {/* Right Column: File Upload & Data Preview */}
                        <div className="flex-1 flex flex-col gap-6 border-l border-(--color-border-secondary) pl-8">
                            {/* Image Upload */}
                            <FileUpload previewUrl={previewUrl} onFileChange={handleFileChange} required={mode === 'create'} />

                            {/* Data Preview */}
                            <DataPreview characterData={characterData} activeTab={activeTab} setActiveTab={setActiveTab} />
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-(--color-border-secondary) bg-(--color-bg-secondary) flex gap-3">
                    <button
                        onClick={handleSubmit}
                        className={`${mode === 'edit' ? 'w-[90%]' : 'w-full'} bg-(--color-brand-primary) text-white py-3 rounded-xl font-semibold hover:bg-(--color-brand-secondary) transition-colors shadow-lg shadow-indigo-500/20`}
                    >
                        {mode === 'create' ? "등록하기" : "수정하기"}
                    </button>
                    {mode === 'edit' && (
                        <button
                            onClick={handleDelete}
                            className="w-[10%] bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                        >
                            삭제하기
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
