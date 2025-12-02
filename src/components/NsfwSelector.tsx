interface Props {
    is_nsfw: boolean | null
    setIsNsfw: (v: boolean) => void
}

export default function NsfwSelector({ is_nsfw, setIsNsfw }: Props) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                NSFW 여부 (명시적인 성인 묘사 포함) <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
                <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-all ${is_nsfw === true ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input
                        type="radio"
                        name="is_nsfw"
                        checked={is_nsfw === true}
                        onChange={() => setIsNsfw(true)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>예</span>
                </label>
                <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-all ${is_nsfw === false ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input
                        type="radio"
                        name="is_nsfw"
                        checked={is_nsfw === false}
                        onChange={() => setIsNsfw(false)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>아니오</span>
                </label>
            </div>
        </div>
    )
}
