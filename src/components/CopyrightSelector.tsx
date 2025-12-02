interface Props {
    copyright: string
    setCopyright: (s: string) => void
}

export default function CopyrightSelector({ copyright, setCopyright }: Props) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">저작권 설정</label>
            <div className="space-y-3">
                <select
                    value={
                        copyright === 'WTFPL' ? 'WTFPL' :
                            copyright.startsWith('CC') ? 'CC' :
                                ''
                    }
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') setCopyright('');
                        else if (val === 'WTFPL') setCopyright('WTFPL');
                        else setCopyright('CC BY-NC-SA 4.0');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                >
                    <option value="">미설정</option>
                    <option value="CC">Creative Commons (CC)</option>
                    <option value="WTFPL">WTFPL</option>
                </select>

                {copyright.startsWith('CC') && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="cc_nc"
                                checked={copyright.includes('NC')}
                                onChange={(e) => {
                                    const isNC = e.target.checked;
                                    const isND = copyright.includes('ND');
                                    const isSA = copyright.includes('SA');

                                    let newParts = ['BY'];
                                    if (isNC) newParts.push('NC');
                                    if (isND) newParts.push('ND');
                                    else if (isSA) newParts.push('SA');

                                    setCopyright('CC ' + newParts.join('-') + ' 4.0');
                                }}
                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="cc_nc" className="text-gray-700 select-none cursor-pointer">비영리 (NonCommercial)</label>
                        </div>

                        <div className="space-y-2">
                            <div className="text-gray-700 font-medium">변경 허락 (Modifications)</div>
                            <div className="space-y-1 pl-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="cc_mod"
                                        checked={!copyright.includes('ND') && !copyright.includes('SA')}
                                        onChange={() => {
                                            const isNC = copyright.includes('NC');
                                            let newParts = ['BY'];
                                            if (isNC) newParts.push('NC');
                                            setCopyright('CC ' + newParts.join('-') + ' 4.0');
                                        }}
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>허용</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="cc_mod"
                                        checked={copyright.includes('SA')}
                                        onChange={() => {
                                            const isNC = copyright.includes('NC');
                                            let newParts = ['BY'];
                                            if (isNC) newParts.push('NC');
                                            newParts.push('SA');
                                            setCopyright('CC ' + newParts.join('-') + ' 4.0');
                                        }}
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>동일조건변경허락 (ShareAlike)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="cc_mod"
                                        checked={copyright.includes('ND')}
                                        onChange={() => {
                                            const isNC = copyright.includes('NC');
                                            let newParts = ['BY'];
                                            if (isNC) newParts.push('NC');
                                            newParts.push('ND');
                                            setCopyright('CC ' + newParts.join('-') + ' 4.0');
                                        }}
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>변경금지 (NoDerivatives)</span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
                            선택된 라이선스: <span className="font-mono font-bold text-indigo-600">{copyright}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
