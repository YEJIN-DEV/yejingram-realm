import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
    tags: string[]
    tagInput: string
    onTagChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
    removeTag: (tag: string) => void
}

export default function TagInput({ tags, tagInput, onTagChange, onTagKeyDown, removeTag }: Props) {
    const { t } = useTranslation()
    return (
        <div>
            <label className="block text-sm font-medium text-(--color-text-secondary) mb-1">{t('components.tag_input.label')}</label>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <span key={index} className="bg-(--color-brand-light) text-(--color-brand-secondary) rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1 hover:bg-(--color-brand-border) transition-colors">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-(--color-brand-secondary) hover:text-(--color-brand-primary) transition-colors"
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
                    className="flex-1 px-4 py-2 bg-(--color-bg-input-primary) text-(--color-text-primary) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-brand-primary) focus:border-(--color-brand-primary) outline-none transition-all"
                    placeholder={t('components.tag_input.placeholder')}
                />
            </div>
        </div>
    )
}
