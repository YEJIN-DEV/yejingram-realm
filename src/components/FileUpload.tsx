import React from 'react'
import { Upload } from 'lucide-react'

interface Props {
    previewUrl: string | null
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
}

export default function FileUpload({ previewUrl, onFileChange, required = false }: Props) {
    return (
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
                    onChange={onFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required={required}
                />
            </div>
        </div>
    )
}
