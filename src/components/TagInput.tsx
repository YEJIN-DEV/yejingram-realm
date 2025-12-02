import React from 'react'

interface Props {
    tags: string[]
    tagInput: string
    onTagChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
    removeTag: (tag: string) => void
}

export default function TagInput({ tags, tagInput, onTagChange, onTagKeyDown, removeTag }: Props) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">태그 (쉼표로 구분)</label>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <span key={index} className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1 hover:bg-indigo-200 transition-colors">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-indigo-500 hover:text-indigo-700 transition-colors"
                        >
                            ×
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={tagInput}
                    onKeyDown={onTagKeyDown}
                    onChange={onTagChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="태그를 입력하고 쉼표로 구분하세요"
                />
            </div>
        </div>
    )
}
