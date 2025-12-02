import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { decodeText } from './util/imageStego'
import toast from 'react-hot-toast'
import { useAuth } from 'react-oidc-context';

interface Sticker {
    id: string;
    name: string;
    data: string;
    type: string;
}

export interface Lore {
    id: string;
    name: string;
    activationKeys: string[]; // 1 or 2 keys
    order: number;
    prompt: string;
    alwaysActive: boolean;
    multiKey: boolean; // when true, require all activationKeys to match
    characterId?: number;
    roomId?: string;
}


interface Character {
    id: string | number
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
                if (mode === 'create') {
                    if (!selectedFile) throw new Error("No file selected");

                    const metadata = {
                        ...formData,
                        file_name: selectedFile.name,
                        file_type: selectedFile.type,
                        has_lore: !!(characterData?.lorebook && characterData.lorebook.length > 0),
                        has_sticker: !!(characterData?.stickers && characterData.stickers.length > 0)
                    };

                    // [Step 1] Lambda에 Presigned URL 요청 (아주 가벼운 JSON 요청)
                    const response = await fetch('https://d3rd8muqzoyvtk.cloudfront.net/realm/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${auth.user?.id_token}`
                        },
                        body: JSON.stringify(metadata) // WAF에 안 걸림!
                    });

                    if (!response.ok) throw new Error('Failed to get upload URL');

                    const data = await response.json();
                    const { upload_url } = data;

                    // [Step 2] 받은 URL로 S3에 직접 업로드
                    // 인증 헤더(Bearer) 필요 없음! URL 자체에 인증 정보가 포함됨.
                    const uploadResponse = await fetch(upload_url, {
                        method: 'PUT', // 반드시 PUT
                        headers: {
                            'Content-Type': selectedFile.type // Lambda에 보낸 타입과 정확히 일치해야 함
                        },
                        body: selectedFile // 파일 객체 그대로 전송 (Binary)
                    });

                    if (!uploadResponse.ok) throw new Error('S3 Upload Failed');
                    toast.success("썸네일과 봇카드가 반영되는 데 까지 몇 초 정도 걸릴 수 있습니다.")
                } else {
                    // Edit mode
                    if (!initialData?.id) throw new Error("Character ID is missing");

                    const updateData: any = {
                        id: initialData.id,
                    };

                    // Compare and add changed fields
                    if (formData.name !== initialData.name) updateData.name = formData.name;
                    if (formData.gender !== initialData.gender) updateData.gender = formData.gender;
                    if (formData.summary !== initialData.summary) updateData.summary = formData.summary;
                    if (formData.status_message !== initialData.status_message) updateData.status_message = formData.status_message;
                    if (formData.is_nsfw !== initialData.is_nsfw) updateData.is_nsfw = formData.is_nsfw;
                    if (formData.copyright !== initialData.copyright) updateData.copyright = formData.copyright;

                    // Tags comparison
                    const tagsChanged = JSON.stringify([...formData.tags].sort()) !== JSON.stringify([...initialData.tags].sort());
                    if (tagsChanged) updateData.tags = formData.tags;

                    if (selectedFile) {
                        updateData.file_name = selectedFile.name;
                        updateData.file_type = selectedFile.type;
                        updateData.has_lore = !!(characterData?.lorebook && characterData.lorebook.length > 0);
                        updateData.has_sticker = !!(characterData?.stickers && characterData.stickers.length > 0);
                    }

                    if (Object.keys(updateData).length <= 1) {
                        throw new Error("수정된 사항이 없어 업데이트할 수 없습니다!");
                    }

                    const response = await fetch('https://d3rd8muqzoyvtk.cloudfront.net/realm/update', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${auth.user?.id_token}`
                        },
                        body: JSON.stringify(updateData)
                    });

                    if (!response.ok) throw new Error('Failed to update character');

                    const data = await response.json();
                    if (data.upload_url && selectedFile) {
                        const uploadResponse = await fetch(data.upload_url, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': selectedFile.type
                            },
                            body: selectedFile
                        });

                        if (!uploadResponse.ok) throw new Error('S3 Upload Failed');
                        toast.success("변경된 썸네일과 봇카드가 반영되는 데 까지 몇 초 정도 걸릴 수 있습니다.")
                    }
                }
            } catch (error) {
                console.error(error);
                throw error;
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

        const deletePromise = async () => {
            const response = await fetch('https://d3rd8muqzoyvtk.cloudfront.net/realm/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.user?.id_token}`
                },
                body: JSON.stringify({ id: initialData.id })
            })

            if (!response.ok) throw new Error('Failed to delete character')
        }

        toast.promise(
            deletePromise(),
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
                const fileUrl = `https://dt3lfi1tp9am3.cloudfront.net/${initialData.id}/${encodeURIComponent(initialData.file_name)}`
                // cache: 'no-cache'를 추가하여 브라우저 캐시나 Range Request로 인한 잠재적 CORS 이슈 방지
                fetch(fileUrl, { cache: 'no-cache' })
                    .then(res => {
                        if (!res.ok) throw new Error(`Network response was not ok: ${res.statusText}`);
                        return res.blob();
                    })
                    .then(blob => {
                        console.log("Loaded initial file:", initialData.file_name, blob.type, blob.size);
                        const file = new File([blob], initialData.file_name!, { type: 'image/png' })
                        processFile(file)
                    })
                    .catch(err => {
                        console.error("Failed to load initial file:", err);
                        toast.error("이미지를 불러오는데 실패했습니다.");
                    })
            }
        }
    }, [initialData, mode])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col relative shadow-2xl">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {mode === 'create' ? "새 캐릭터 등록" : "캐릭터 수정"}
                    </h2>
                    <button
                        onClick={handleCloseModal}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 h-full">
                        {/* Left Column: Metadata Inputs */}
                        <div className="flex-1 space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">이름  <span className="text-red-500">*</span></label>
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
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">성별</label>
                                    {formData.gender !== null && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, gender: null })}
                                            className="text-xs text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                                        >
                                            선택 취소
                                        </button>
                                    )}
                                </div>
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

                            {/* NSFW */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    NSFW 여부 (명시적인 성인 묘사 포함) <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-4">
                                    <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-all ${formData.is_nsfw === true ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="is_nsfw"
                                            checked={formData.is_nsfw === true}
                                            onChange={() => setFormData({ ...formData, is_nsfw: true })}
                                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span>예</span>
                                    </label>
                                    <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-all ${formData.is_nsfw === false ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="is_nsfw"
                                            checked={formData.is_nsfw === false}
                                            onChange={() => setFormData({ ...formData, is_nsfw: false })}
                                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span>아니오</span>
                                    </label>
                                </div>
                            </div>

                            {/* Copyright */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">저작권 설정</label>
                                <div className="space-y-3">
                                    <select
                                        value={
                                            formData.copyright === 'WTFPL' ? 'WTFPL' :
                                                formData.copyright.startsWith('CC') ? 'CC' :
                                                    ''
                                        }
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '') setFormData({ ...formData, copyright: '' });
                                            else if (val === 'WTFPL') setFormData({ ...formData, copyright: 'WTFPL' });
                                            else setFormData({ ...formData, copyright: 'CC BY-NC-SA 4.0' });
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    >
                                        <option value="">미설정</option>
                                        <option value="CC">Creative Commons (CC)</option>
                                        <option value="WTFPL">WTFPL</option>
                                    </select>

                                    {formData.copyright.startsWith('CC') && (
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="cc_nc"
                                                    checked={formData.copyright.includes('NC')}
                                                    onChange={(e) => {
                                                        const isNC = e.target.checked;
                                                        const isND = formData.copyright.includes('ND');
                                                        const isSA = formData.copyright.includes('SA');

                                                        let newParts = ['BY'];
                                                        if (isNC) newParts.push('NC');
                                                        if (isND) newParts.push('ND');
                                                        else if (isSA) newParts.push('SA');

                                                        setFormData({ ...formData, copyright: 'CC ' + newParts.join('-') + ' 4.0' });
                                                    }}
                                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="cc_nc" className="text-gray-700 select-none cursor-pointer">
                                                    비영리 (NonCommercial)
                                                </label>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="text-gray-700 font-medium">변경 허락 (Modifications)</div>
                                                <div className="space-y-1 pl-1">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="cc_mod"
                                                            checked={!formData.copyright.includes('ND') && !formData.copyright.includes('SA')}
                                                            onChange={() => {
                                                                const isNC = formData.copyright.includes('NC');
                                                                let newParts = ['BY'];
                                                                if (isNC) newParts.push('NC');
                                                                setFormData({ ...formData, copyright: 'CC ' + newParts.join('-') + ' 4.0' });
                                                            }}
                                                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <span>허용</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="cc_mod"
                                                            checked={formData.copyright.includes('SA')}
                                                            onChange={() => {
                                                                const isNC = formData.copyright.includes('NC');
                                                                let newParts = ['BY'];
                                                                if (isNC) newParts.push('NC');
                                                                newParts.push('SA');
                                                                setFormData({ ...formData, copyright: 'CC ' + newParts.join('-') + ' 4.0' });
                                                            }}
                                                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <span>동일조건변경허락 (ShareAlike)</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="cc_mod"
                                                            checked={formData.copyright.includes('ND')}
                                                            onChange={() => {
                                                                const isNC = formData.copyright.includes('NC');
                                                                let newParts = ['BY'];
                                                                if (isNC) newParts.push('NC');
                                                                newParts.push('ND');
                                                                setFormData({ ...formData, copyright: 'CC ' + newParts.join('-') + ' 4.0' });
                                                            }}
                                                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <span>변경금지 (NoDerivatives)</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
                                                선택된 라이선스: <span className="font-mono font-bold text-indigo-600">{formData.copyright}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">상태 메시지  <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.status_message}
                                    onChange={e => setFormData({ ...formData, status_message: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="캐릭터의 한 줄 상태 메시지를 입력하세요. 캐릭터의 매력을 한껏 어필해보세요!"
                                    required
                                />
                            </div>

                            {/* Summary */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">캐릭터 소개  <span className="text-red-500">*</span></label>
                                <textarea
                                    value={formData.summary}
                                    onChange={e => setFormData({ ...formData, summary: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-70 resize-none transition-all"
                                    placeholder="캐릭터의 소개글을 작성해주세요. 다른 유저들이 캐릭터를 이해하는 데 도움이 됩니다."
                                />
                            </div>
                        </div>

                        {/* Right Column: File Upload & Data Preview */}
                        <div className="flex-1 flex flex-col gap-6 border-l border-gray-100 pl-8">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">캐릭터 파일</label>
                                <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden relative bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-400 group-hover:text-indigo-500 transition-colors">
                                            <Upload className="w-12 h-12 mb-2" />
                                            <span className="text-sm font-medium">PNG 파일 업로드</span>
                                            <span className="text-xs text-gray-400 mt-1">클릭하거나 드래그하여 업로드</span>
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
                            </div>

                            {/* Data Preview */}
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
                                                                        <span key={kIdx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                                                            {key}
                                                                        </span>
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
                                                                <span className="text-xs text-gray-600 truncate w-full text-center" title={sticker.name}>
                                                                    {sticker.name}
                                                                </span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="col-span-3 text-center text-gray-500 py-8">스티커 데이터가 없습니다.</div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-500 italic">
                                            이미지를 업로드하면 데이터가 표시됩니다
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                    <button
                        onClick={handleSubmit}
                        className={`${mode === 'edit' ? 'w-[90%]' : 'w-full'} bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20`}
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
