import { useTranslation, Trans } from 'react-i18next';

const Privacy = () => {
    const { t } = useTranslation();
    const LAST_UPDATED_DATE = '2025-12-25';

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-16 sm:px-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>

                    <div className="relative z-10">
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                            {t('privacy.title')}
                        </h1>
                        <p className="text-xl text-gray-300 font-light mb-6">
                            {t('privacy.subtitle')}
                        </p>
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-gray-200">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {t('privacy.last_updated', { date: new Date(LAST_UPDATED_DATE).toLocaleDateString() })}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-8 py-12 sm:px-12 space-y-12">
                    {/* Article 1 */}
                    <section className="group">
                        <div className="flex items-center mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">1</span>
                            <h2 className="text-2xl font-bold text-gray-900">{t('privacy.articles.article1.title')}</h2>
                        </div>
                        <div className="pl-14">
                            <p className="text-gray-600 mb-6 text-lg">
                                {t('privacy.articles.article1.content')}
                            </p>
                            <div className="grid grid-cols-1 gap-4">
                                {(t('privacy.articles.article1.items', { returnObjects: true }) as any[]).map((item, idx) => (
                                    <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-semibold text-indigo-600">{t('privacy.collect.labels.items', 'Items')}:</span> {item.collect}</p>
                                            <p><span className="font-semibold text-indigo-600">{t('privacy.collect.labels.purpose', 'Purpose')}:</span> {item.purpose}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Article 2 */}
                    <section className="group">
                        <div className="flex items-center mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">2</span>
                            <h2 className="text-2xl font-bold text-gray-900">{t('privacy.articles.article2.title')}</h2>
                        </div>
                        <div className="pl-14">
                            <p className="text-gray-600 mb-6 text-lg">
                                {t('privacy.articles.article2.content')}
                            </p>
                            <div className="space-y-4">
                                {(t('privacy.articles.article2.items', { returnObjects: true }) as any[]).map((item, idx) => (
                                    <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                                        <p className="text-gray-600">{item.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Article 3 */}
                    <section className="group">
                        <div className="flex items-center mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">3</span>
                            <h2 className="text-2xl font-bold text-gray-900">{t('privacy.articles.article3.title')}</h2>
                        </div>
                        <div className="pl-14">
                            <p className="text-gray-600 mb-6 text-lg">
                                {t('privacy.articles.article3.content')}
                            </p>
                            <div className="overflow-x-auto mb-6">
                                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {(t('privacy.articles.article3.table.headers', { returnObjects: true }) as string[]).map((header, idx) => (
                                                <th key={idx} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {(t('privacy.articles.article3.table.rows', { returnObjects: true }) as any[]).map((row, idx) => (
                                            <tr key={idx}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.company}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{row.items}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{row.task}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{row.period}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                                {(t('privacy.articles.article3.transfer_info', { returnObjects: true }) as any[]).map((info, idx) => (
                                    <p key={idx} className="text-sm text-gray-600">
                                        <span className="font-bold text-gray-800 mr-2">{info.label}:</span>
                                        {info.value}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Article 4 */}
                    <section className="group">
                        <div className="flex items-center mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">4</span>
                            <h2 className="text-2xl font-bold text-gray-900">{t('privacy.articles.article4.title')}</h2>
                        </div>
                        <div className="pl-14 space-y-4">
                            {(t('privacy.articles.article4.items', { returnObjects: true }) as any[]).map((item, idx) => (
                                <div key={idx} className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <h3 className="font-bold text-blue-900 mb-1">{item.title}</h3>
                                    <p className="text-blue-800 text-sm">{item.content}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Article 5 */}
                    <section className="group">
                        <div className="flex items-center mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">5</span>
                            <h2 className="text-2xl font-bold text-gray-900">{t('privacy.articles.article5.title')}</h2>
                        </div>
                        <div className="pl-14">
                            <p className="text-gray-600 mb-6 text-lg">
                                {t('privacy.articles.article5.content')}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {(t('privacy.articles.article5.items', { returnObjects: true }) as any[]).map((item, idx) => (
                                    <div key={idx} className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                        <h3 className="font-bold text-indigo-900 mb-2">{item.title}</h3>
                                        <p className="text-indigo-700 text-sm">{item.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Article 6 */}
                    <section className="group">
                        <div className="flex items-center mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">6</span>
                            <h2 className="text-2xl font-bold text-gray-900">{t('privacy.articles.article6.title')}</h2>
                        </div>
                        <div className="pl-14">
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {t('privacy.articles.article6.content')}
                            </p>
                        </div>
                    </section>

                    {/* Article 7 */}
                    <section className="group">
                        <div className="flex items-center mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">7</span>
                            <h2 className="text-2xl font-bold text-gray-900">{t('privacy.articles.article7.title')}</h2>
                        </div>
                        <div className="pl-14 space-y-4">
                            {(t('privacy.articles.article7.items', { returnObjects: true }) as any[]).map((item, idx) => (
                                <div key={idx} className={`p-6 rounded-r-xl border-l-4 ${idx === 0 ? 'bg-orange-50 border-orange-500' : idx === 1 ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-500'}`}>
                                    <h3 className={`text-lg font-bold mb-2 ${idx === 0 ? 'text-orange-800' : idx === 1 ? 'text-red-800' : 'text-gray-800'}`}>{item.title}</h3>
                                    <p className={`${idx === 0 ? 'text-orange-700' : idx === 1 ? 'text-red-700' : 'text-gray-700'}`}>
                                        {item.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Article 8 */}
                    <section className="group">
                        <div className="flex items-center mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">8</span>
                            <h2 className="text-2xl font-bold text-gray-900">{t('privacy.articles.article8.title')}</h2>
                        </div>
                        <div className="pl-14">
                            <p className="text-gray-600 leading-relaxed text-lg mb-4">
                                {t('privacy.articles.article8.content')}
                            </p>
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <p className="text-gray-800 font-medium">{t('privacy.articles.article8.contact.name')}</p>
                                <p className="text-gray-800 font-medium">
                                    <Trans i18nKey="privacy.articles.article8.contact.email">
                                        Email: <a href="mailto:support@yejingram.com" className="text-indigo-600 hover:underline">support@yejingram.com</a>
                                    </Trans>
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-8 py-8 border-t border-gray-200 text-center">
                    <p className="text-gray-500 font-medium">
                        &copy; {new Date().getFullYear()} Yejingram Realm. {t('footer.all_rights_reserved')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;