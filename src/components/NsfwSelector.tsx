interface Props {
    is_nsfw: boolean | null
    setIsNsfw: (v: boolean) => void
}

export default function NsfwSelector({ is_nsfw, setIsNsfw }: Props) {
    return (
        <div>
            <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
                NSFW 여부 (명시적인 성인 묘사 포함) <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
                <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-all ${is_nsfw === true ? 'border-(--color-brand-primary) bg-(--color-brand-faint) text-(--color-brand-secondary)' : 'border-(--color-border) hover:bg-(--color-bg-secondary)'}`}>
                    <input
                        type="radio"
                        name="is_nsfw"
                        checked={is_nsfw === true}
                        onChange={() => setIsNsfw(true)}
                        className="w-4 h-4 text-(--color-brand-primary) focus:ring-(--color-brand-primary)"
                    />
                    <span>예</span>
                </label>
                <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-all ${is_nsfw === false ? 'border-(--color-brand-primary) bg-(--color-brand-faint) text-(--color-brand-secondary)' : 'border-(--color-border) hover:bg-(--color-bg-secondary)'}`}>
                    <input
                        type="radio"
                        name="is_nsfw"
                        checked={is_nsfw === false}
                        onChange={() => setIsNsfw(false)}
                        className="w-4 h-4 text-(--color-brand-primary) focus:ring-(--color-brand-primary)"
                    />
                    <span>아니오</span>
                </label>
            </div>
        </div>
    )
}
