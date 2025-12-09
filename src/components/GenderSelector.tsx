interface Props {
    gender: number | null
    setGender: (g: number | null) => void
}

export default function GenderSelector({ gender, setGender }: Props) {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-(--color-text-secondary)">성별</label>
                {gender !== null && (
                    <button
                        type="button"
                        onClick={() => setGender(null)}
                        className="text-xs text-(--color-text-tertiary) hover:text-red-500 transition-colors cursor-pointer"
                    >
                        선택 취소
                    </button>
                )}
            </div>
            <div className="flex gap-4">
                {[{ label: '여성', value: 0 }, { label: '남성', value: 1 }, { label: '기타', value: 2 }].map(option => (
                    <label key={option.value} className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-all ${gender === option.value ? 'border-(--color-brand-primary) bg-(--color-brand-faint) text-(--color-brand-secondary)' : 'border-(--color-border) hover:bg-(--color-bg-secondary)'}`}>
                        <input
                            type="radio"
                            name="gender"
                            checked={gender === option.value}
                            onChange={() => setGender(option.value)}
                            className="w-4 h-4 text-(--color-brand-primary) focus:ring-(--color-brand-primary)"
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}
