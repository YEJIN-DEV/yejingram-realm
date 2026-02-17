import { useTranslation } from 'react-i18next'

interface Props {
    copyright: string
    setCopyright: (s: string) => void
}

export default function CopyrightSelector({ copyright, setCopyright }: Props) {
    const { t } = useTranslation()
    return (
        <div>
            <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">{t('components.copyright.title')}</label>
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
                    className="w-full px-4 py-2 bg-(--color-bg-input-primary) text-(--color-text-primary) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-brand-primary) focus:border-(--color-brand-primary) outline-none transition-all"
                >
                    <option value="">{t('components.copyright.not_set')}</option>
                    <option value="CC">Creative Commons (CC)</option>
                    <option value="WTFPL">WTFPL</option>
                </select>

                {copyright.startsWith('CC') && (
                    <div className="bg-(--color-bg-secondary) p-4 rounded-lg border border-(--color-border) space-y-3 text-sm">
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
                                className="w-4 h-4 text-(--color-brand-primary) focus:ring-(--color-brand-primary) border-(--color-border) rounded"
                            />
                            <label htmlFor="cc_nc" className="text-(--color-text-secondary) select-none cursor-pointer">{t('components.copyright.cc_nc')}</label>
                        </div>

                        <div className="space-y-2">
                            <div className="text-(--color-text-secondary) font-medium">{t('components.copyright.cc_mod')}</div >
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
                                        className="w-4 h-4 text-(--color-brand-primary) focus:ring-(--color-brand-primary)"
                                    />
                                    <span className="text-(--color-text-primary)">{t('components.copyright.allow')}</span>
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
                                        className="w-4 h-4 text-(--color-brand-primary) focus:ring-(--color-brand-primary)"
                                    />
                                    <span className="text-(--color-text-primary)">{t('components.copyright.cc_sa')}</span>
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
                                        className="w-4 h-4 text-(--color-brand-primary) focus:ring-(--color-brand-primary)"
                                    />
                                    <span className="text-(--color-text-primary)">{t('components.copyright.cc_nd')}</span>
                                </label>
                            </div>
                        </div>
                        <div className="pt-2 border-t border-(--color-border) text-xs text-(--color-text-secondary)">
                            {t('components.copyright.selected')} <span className="font-mono font-bold text-(--color-brand-primary)">{copyright}</span>
                        </div>
                    </div>
                )}

                {copyright === 'WTFPL' && (
                    <div className="bg-(--color-bg-secondary) p-4 rounded-lg border border-(--color-border) text-sm text-(--color-text-secondary)">
                        {t('components.copyright.wtfpl_desc')} <a href="http://www.wtfpl.net/" target="_blank" rel="noopener noreferrer" className="text-(--color-brand-primary) hover:underline">{t('components.copyright.wtfpl_link')}</a>
                    </div>
                )}
            </div>
        </div>
    )
}
