import React from 'react';
import { useTranslation } from 'react-i18next';

const TOS = () => {
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
                            {t('tos.title')}
                        </h1>
                        <p className="text-xl text-gray-300 font-light mb-6">
                            {t('tos.subtitle')}
                        </p>
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-gray-200">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {t('tos.last_updated', { date: new Date(LAST_UPDATED_DATE).toLocaleDateString() })}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-8 py-12 sm:px-12 space-y-12">
                    {/* Article 1 */}
                    <section className="group">
                        <div className="flex items-center mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">1</span>
                            <h2 className="text-2xl font-bold text-gray-900">{t('tos.articles.article1.title')}</h2>
                        </div>
                        <div className="pl-14">
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {t('tos.articles.article1.content')}
                            </p>
                        </div>
                    </section>

                    {/* Article 2 */}
                    <section className="group">
                        <div className="flex items-center mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">2</span>
                            <h2 className="text-2xl font-bold text-gray-900">{t('tos.articles.article2.title')}</h2>
                        </div>
                        <div className="pl-14 space-y-2">
                            {(t('tos.articles.article2.content', { returnObjects: true }) as string[]).map((item, idx) => (
                                <div key={idx} className="flex items-start text-gray-600 leading-relaxed text-lg">
                                    <span className="mr-2 font-bold">{idx + 1}.</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Article 3 */}
                    <section className="group">
                        <div className="flex items-center mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">3</span>
                            <h2 className="text-2xl font-bold text-gray-900">{t('tos.articles.article3.title')}</h2>
                        </div>
                        <div className="pl-14 space-y-2">
                            {(t('tos.articles.article3.content', { returnObjects: true }) as string[]).map((item, idx) => (
                                <div key={idx} className="flex items-start text-gray-600 leading-relaxed text-lg">
                                    <span className="mr-2 font-bold">{idx + 1}.</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Article 4 */}
                    <section className="group">
                        <div className="flex items-center mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">4</span>
                            <h2 className="text-2xl font-bold text-gray-900">{t('tos.articles.article4.title')}</h2>
                        </div>
                        <div className="pl-14">
                            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3 space-y-2">
                                        {(t('tos.articles.article4.content', { returnObjects: true }) as string[]).map((item, idx) => (
                                            <div key={idx} className="flex items-start text-red-700 text-lg">
                                                <span className="mr-2 font-bold">{idx + 1}.</span>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Article 5 */}
                    <section className="group">
                        <div className="flex items-center mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">5</span>
                            <h2 className="text-2xl font-bold text-gray-900">{t('tos.articles.article5.title')}</h2>
                        </div>
                        <div className="pl-14 space-y-6">
                            {(t('tos.articles.article5.subsections', { returnObjects: true }) as any[]).map((sub: any, idx: number) => (
                                <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <h3 className="text-gray-800 font-bold text-lg mb-2">{idx + 1}. {sub.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{sub.content}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Article 6 */}
                    <section className="group">
                        <div className="flex items-center mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">6</span>
                            <h2 className="text-2xl font-bold text-gray-900">{t('tos.articles.article6.title')}</h2>
                        </div>
                        <div className="pl-14 space-y-2">
                            {(t('tos.articles.article6.content', { returnObjects: true }) as string[]).map((item, idx) => (
                                <div key={idx} className="flex items-start text-gray-600 leading-relaxed text-lg">
                                    <span className="mr-2 font-bold">{idx + 1}.</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Article 7 */}
                    <section className="group">
                        <div className="flex items-center mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">7</span>
                            <h2 className="text-2xl font-bold text-gray-900">{t('tos.articles.article7.title')}</h2>
                        </div>
                        <div className="pl-14 space-y-6">
                            {(t('tos.articles.article7.subsections', { returnObjects: true }) as any[]).map((sub: any, idx: number) => (
                                <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <h3 className="text-gray-800 font-bold text-lg mb-2">{idx + 1}. {sub.title}</h3>
                                    <p className="text-gray-600 leading-relaxed mb-2">{sub.content}</p>
                                    {sub.list && (
                                        <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600">
                                            {sub.list.map((item: string, listIdx: number) => (
                                                <li key={listIdx}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-8 py-8 border-t border-gray-200 text-center">
                    <p className="text-gray-600 text-sm mb-4 max-w-2xl mx-auto">
                        {t('tos.disclaimer')}
                    </p>
                    <p className="text-gray-500 font-medium">
                        &copy; {new Date().getFullYear()} Yejingram Realm. {t('footer.all_rights_reserved')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TOS;