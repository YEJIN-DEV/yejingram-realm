interface Props {
    gender: number | null
    setGender: (g: number | null) => void
}

export default function GenderSelector({ gender, setGender }: Props) {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">성별</label>
                {gender !== null && (
                    <button
                        type="button"
                        onClick={() => setGender(null)}
                        className="text-xs text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                    >
                        선택 취소
                    </button>
                )}
            </div>
            <div className="flex gap-4">
                {[{ label: '여성', value: 0 }, { label: '남성', value: 1 }, { label: '기타', value: 2 }].map(option => (
                    <label key={option.value} className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-all ${gender === option.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <input
                            type="radio"
                            name="gender"
                            checked={gender === option.value}
                            onChange={() => setGender(option.value)}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}
