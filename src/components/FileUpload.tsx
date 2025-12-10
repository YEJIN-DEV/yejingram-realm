import React from 'react'
import { Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Props {
    previewUrl: string | null
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
}

export default function FileUpload({ previewUrl, onFileChange, required = false }: Props) {
    const { t } = useTranslation()
    return (
        <div>
            <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">{t('components.file_upload.label')}</label>
            <div className="w-full h-64 border-2 border-dashed border-(--color-border) rounded-xl flex items-center justify-center overflow-hidden relative bg-(--color-bg-input-primary) hover:bg-(--color-bg-secondary) transition-colors cursor-pointer group">
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                    <div className="flex flex-col items-center text-(--color-icon-secondary) group-hover:text-(--color-brand-primary) transition-colors">
                        <Upload className="w-12 h-12 mb-2" />
                        <span className="text-sm font-medium">{t('components.file_upload.upload_png')}</span>
                        <span className="text-xs text-(--color-icon-secondary) mt-1">{t('components.file_upload.instruction')}</span>
                    </div>
                )}
                <input
                    type="file"
                    accept=".png"
                    onChange={onFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required={required}
                />
            </div>
        </div>
    )
}
