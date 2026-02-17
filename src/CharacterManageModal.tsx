import { useState, useEffect } from 'react'
import { X, Eye, Edit2 } from 'lucide-react'
import { decodeText } from './util/imageStego'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { useAuth } from 'react-oidc-context';
import type { Character } from './types/character'
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation()
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
    const [showSummaryPreview, setShowSummaryPreview] = useState(false)

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
                    }))
                } catch (error) {
                    console.error(error)
                    alert(t('character_modal.error.invalid_file'))
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
        if (window.confirm(t('character_modal.confirm_close'))) {
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
            toast.error(t('character_modal.error.upload_file'))
            return
        }

        if (!formData.name?.trim()) {
            toast.error(t('character_modal.error.enter_name'))
            return
        }

        if (!formData.status_message?.trim()) {
            toast.error(t('character_modal.error.enter_status'))
            return
        }

        if (!formData.summary?.trim()) {
            toast.error(t('character_modal.error.enter_summary'))
            return
        }

        if (formData.is_nsfw === null) {
            toast.error(t('character_modal.error.select_nsfw'))
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

                    toast.success(t('character_modal.notice.thumbnail_update_notice'))
                } else {
                    // Edit mode
                    if (!initialData?.id) throw new Error("Character ID is missing")

                    const updateData = buildUpdateData(formData, initialData, selectedFile, characterData)

                    if (!hasChanges(updateData)) {
                        throw new Error(t('character_modal.error.no_changes'))
                    }

                    const data = await updateCharacter(updateData, idToken)

                    if (data.upload_url && selectedFile) {
                        await uploadFileToS3(data.upload_url, selectedFile)
                        toast.success(t('character_modal.notice.thumbnail_update_edit'))
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
                loading: mode === 'create' ? t('character_modal.status.registering') : t('character_modal.status.updating'),
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
                    return mode === 'create' ? t('character_modal.success.register') : t('character_modal.success.update')
                },
                error: (err) => {
                    if (err instanceof Error && err.message === t('character_modal.error.no_changes')) {
                        return err.message
                    }
                    return mode === 'create' ? t('character_modal.error.register_fail') : t('character_modal.error.update_fail')
                },
            }
        )
    }

    const handleDelete = async () => {
        if (mode !== 'edit') return // Safeguard
        if (!initialData?.id) {
            toast.error(t('character_modal.error.no_character_id'))
            return
        }

        if (!window.confirm(t('character_modal.confirm_delete'))) {
            return
        }

        // 한 번 더 확인
        if (!window.confirm(t('character_modal.confirm_delete_final'))) {
            return
        }

        const idToken = auth.user?.id_token
        if (!idToken) {
            toast.error(t('character_modal.error.auth_required'))
            return
        }

        toast.promise(
            deleteCharacter(initialData.id, idToken),
            {
                loading: t('character_modal.status.deleting'),
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
                    return t('character_modal.success.delete')
                },
                error: t('character_modal.error.delete_fail'),
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
                        toast.error(t('character_modal.error.load_image_fail'))
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
                        {mode === 'create' ? t('character_modal.title.register') : t('character_modal.title.edit')}
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
                                <label className="block text-sm font-medium text-(--color-text-secondary) mb-1">{t('common.name')}  <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-(--color-bg-input-primary) text-(--color-text-primary) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-brand-primary) focus:border-(--color-brand-primary) outline-none transition-all"
                                    placeholder={t('character_modal.placeholder.name')}
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
                                <label className="block text-sm font-medium text-(--color-text-secondary) mb-1">{t('character_modal.label.status_message')}  <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.status_message}
                                    onChange={e => setFormData({ ...formData, status_message: e.target.value })}
                                    className="w-full px-4 py-2 bg-(--color-bg-input-primary) text-(--color-text-primary) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-brand-primary) focus:border-(--color-brand-primary) outline-none transition-all"
                                    placeholder={t('character_modal.placeholder.status_message')}
                                    required
                                />
                            </div>

                            {/* Summary */}
                            <div className="relative">
                                <div className="flex justify-between items-end mb-1">
                                    <label className="block text-sm font-medium text-(--color-text-secondary)">
                                        {t('character_modal.label.summary')} <span className="text-red-500">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowSummaryPreview(!showSummaryPreview)}
                                        className="text-xs flex items-center gap-1 text-(--color-text-tertiary) hover:text-(--color-text-primary) transition-colors pb-1"
                                    >
                                        {showSummaryPreview ? (
                                            <>
                                                <Edit2 className="w-3 h-3" />
                                                {t('common.edit', '편집')}
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="w-3 h-3" />
                                                {t('common.preview', '미리보기')}
                                            </>
                                        )}
                                    </button>
                                </div>

                                {showSummaryPreview ? (
                                    <div className="w-full px-4 py-2 bg-(--color-bg-input-primary) text-(--color-text-primary) border border-(--color-border) rounded-lg h-70 overflow-y-auto text-sm [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_a]:text-blue-400 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-gray-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:bg-gray-800 [&_code]:px-1 [&_code]:rounded [&_pre]:bg-gray-800 [&_pre]:p-2 [&_pre]:rounded [&_pre]:overflow-x-auto">
                                        <ReactMarkdown>
                                            {formData.summary || t('character_detail.no_summary')}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <textarea
                                        value={formData.summary}
                                        onChange={e => setFormData({ ...formData, summary: e.target.value })}
                                        className="w-full px-4 py-2 bg-(--color-bg-input-primary) text-(--color-text-primary) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-brand-primary) focus:border-(--color-brand-primary) outline-none h-70 resize-none transition-all font-mono text-sm leading-relaxed"
                                        placeholder={t('character_modal.placeholder.summary')}
                                    />
                                )}
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
                        {mode === 'create' ? t('character_modal.button.register') : t('character_modal.button.update')}
                    </button>
                    {mode === 'edit' && (
                        <button
                            onClick={handleDelete}
                            className="w-[10%] bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                        >
                            {t('character_modal.button.delete')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
