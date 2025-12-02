import type { Character } from '../types/character'

const API_BASE_URL = 'https://d3rd8muqzoyvtk.cloudfront.net'
const CDN_BASE_URL = 'https://dt3lfi1tp9am3.cloudfront.net'

interface CharacterMetadata {
    name: string
    gender: number | null
    summary: string
    status_message: string
    tags: string[]
    is_nsfw: boolean | null
    copyright: string
    file_name: string
    file_type: string
    has_lore: boolean
    has_sticker: boolean
}

interface UpdateCharacterData {
    id: string | number
    name?: string
    gender?: number | null
    summary?: string
    status_message?: string
    tags?: string[]
    is_nsfw?: boolean | null
    copyright?: string | null
    file_name?: string
    file_type?: string
    has_lore?: boolean
    has_sticker?: boolean
}

interface CreateCharacterResponse {
    upload_url: string
}

interface UpdateCharacterResponse {
    upload_url?: string
}

/**
 * 캐릭터 생성을 위한 Presigned URL 요청
 */
export async function requestCreateCharacter(
    metadata: CharacterMetadata,
    idToken: string
): Promise<CreateCharacterResponse> {
    const response = await fetch(`${API_BASE_URL}/realm/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(metadata)
    })

    if (!response.ok) {
        throw new Error('Failed to get upload URL')
    }

    return response.json()
}

/**
 * S3에 파일 업로드
 */
export async function uploadFileToS3(
    uploadUrl: string,
    file: File
): Promise<void> {
    const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type
        },
        body: file
    })

    if (!response.ok) {
        throw new Error('S3 Upload Failed')
    }
}

/**
 * 캐릭터 정보 업데이트
 */
export async function updateCharacter(
    updateData: UpdateCharacterData,
    idToken: string
): Promise<UpdateCharacterResponse> {
    const response = await fetch(`${API_BASE_URL}/realm/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(updateData)
    })

    if (!response.ok) {
        throw new Error('Failed to update character')
    }

    return response.json()
}

/**
 * 캐릭터 삭제
 */
export async function deleteCharacter(
    id: string | number,
    idToken: string
): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/realm/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ id })
    })

    if (!response.ok) {
        throw new Error('Failed to delete character')
    }
}

/**
 * CDN에서 캐릭터 파일 로드
 */
export async function loadCharacterFile(
    characterId: string | number,
    fileName: string
): Promise<File> {
    const fileUrl = `${CDN_BASE_URL}/${characterId}/${encodeURIComponent(fileName)}`

    const response = await fetch(fileUrl, { cache: 'no-cache' })

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`)
    }

    const blob = await response.blob()
    return new File([blob], fileName, { type: 'image/png' })
}

/**
 * 캐릭터 생성 메타데이터 생성
 */
export function buildCreateMetadata(
    formData: {
        name: string
        gender: number | null
        summary: string
        status_message: string
        tags: string[]
        is_nsfw: boolean | null
        copyright: string
    },
    file: File,
    characterData: Character | null
): CharacterMetadata {
    return {
        ...formData,
        file_name: file.name,
        file_type: file.type,
        has_lore: !!(characterData?.lorebook && characterData.lorebook.length > 0),
        has_sticker: !!(characterData?.stickers && characterData.stickers.length > 0)
    }
}

/**
 * 캐릭터 업데이트 데이터 생성 (변경된 필드만 포함)
 */
export function buildUpdateData(
    formData: {
        name: string
        gender: number | null
        summary: string
        status_message: string
        tags: string[]
        is_nsfw: boolean | null
        copyright: string
    },
    initialData: {
        id?: string | number
        name: string
        gender?: number | null
        summary: string
        status_message: string
        tags: string[]
        is_nsfw: boolean
        copyright?: string | null
    },
    file: File | null,
    characterData: Character | null
): UpdateCharacterData {
    const updateData: UpdateCharacterData = {
        id: initialData.id!,
    }

    // Compare and add changed fields
    if (formData.name !== initialData.name) updateData.name = formData.name
    if (formData.gender !== initialData.gender) updateData.gender = formData.gender
    if (formData.summary !== initialData.summary) updateData.summary = formData.summary
    if (formData.status_message !== initialData.status_message) updateData.status_message = formData.status_message
    if (formData.is_nsfw !== initialData.is_nsfw) updateData.is_nsfw = formData.is_nsfw
    if (formData.copyright !== initialData.copyright) updateData.copyright = formData.copyright

    // Tags comparison
    const tagsChanged = JSON.stringify([...formData.tags].sort()) !== JSON.stringify([...initialData.tags].sort())
    if (tagsChanged) updateData.tags = formData.tags

    if (file) {
        updateData.file_name = file.name
        updateData.file_type = file.type
        updateData.has_lore = !!(characterData?.lorebook && characterData.lorebook.length > 0)
        updateData.has_sticker = !!(characterData?.stickers && characterData.stickers.length > 0)
    }

    return updateData
}

/**
 * 업데이트 데이터에 변경사항이 있는지 확인
 */
export function hasChanges(updateData: UpdateCharacterData): boolean {
    return Object.keys(updateData).length > 1
}
