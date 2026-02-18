import { StrictMode, useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Moon, Sun, Languages } from 'lucide-react'
import Character from './Character.tsx'
import SearchPage from './Search.tsx'
import { AuthProvider, useAuth } from 'react-oidc-context'
import Privacy from './Privacy.tsx'
import TOS from './TOS.tsx'
import Dashboard from './Dashboard.tsx'
import { Toaster } from 'react-hot-toast'
import i18n from './i18n/i18n'
import { useTranslation } from 'react-i18next'

// Shared setter so the module-level message handler can update React state
let __setThemeFromParent: ((t: string) => void) | null = null;

window.addEventListener('message', (event) => {
  if (event.data.type === 'CSS_VARIABLES') {
    const { variables, theme, locale } = event.data;
    document.documentElement.classList.add('disable-transitions');
    // :root에 변수 적용
    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        document.documentElement.style.setProperty(key, value as string);
      }
    }
    // 테마 클래스(light/dark) 적용
    if (theme) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      // Sync React state so the App useEffect doesn't overwrite the class
      __setThemeFromParent?.(theme);
    }
    // 언어 설정
    if (locale) {
      i18n.changeLanguage(locale);
    }
    // 트랜지션 비활성화 클래스 제거
    setTimeout(() => {
      document.documentElement.classList.remove('disable-transitions');
    }, 0);
  }
});

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-northeast-2.amazonaws.com/ap-northeast-2_qpXc0tRPJ",
  client_id: "3mjaiv26pdraeb0erjj5am92ve",
  redirect_uri: import.meta.env.DEV ? "http://localhost:5173" : import.meta.env.VITE_COGNITO_REDIRECT_URI,
  response_type: "code",
  scope: "email openid profile",
};

function App() {
  const auth = useAuth();
  const { t, i18n } = useTranslation();
  const isInIframe = window.self !== window.top;

  const [theme, setTheme] = useState(() => {
    // When embedded in an iframe, don't read localStorage — the parent will
    // push the correct theme via postMessage(CSS_VARIABLES).
    if (isInIframe) return 'light';
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  // Register the setter so the module-level message handler can sync state
  useEffect(() => {
    __setThemeFromParent = setTheme;
    return () => { __setThemeFromParent = null; };
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('disable-transitions');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Only persist to localStorage when not in iframe
    if (!isInIframe) {
      localStorage.setItem('theme', theme);
    }

    const timer = setTimeout(() => {
      root.classList.remove('disable-transitions');
    }, 0);

    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <BrowserRouter>
      <Toaster toastOptions={{ duration: 5000 }} />
      <div className="w-full">
        {!isInIframe && (
          <nav className="w-full max-w-7xl mx-auto pt-3.5 px-6 flex items-center justify-between text-xs tracking-wider">
            <Link to="/" className="font-bold text-(--color-text-primary) no-underline">
              YEJINGRAM<br />REALM
            </Link>
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-1">
                <Languages className="w-4 h-4 text-(--color-text-secondary)" />
                <select
                  value={i18n.resolvedLanguage}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="bg-transparent text-(--color-text-secondary) text-xs border-none outline-none cursor-pointer uppercase"
                >
                  <option value="ko">KO</option>
                  <option value="ja">JA</option>
                  <option value="en">EN</option>
                </select>
              </div>

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="bg-transparent border-none cursor-pointer p-0 text-(--color-text-secondary) flex items-center"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              {auth.isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="no-underline text-(--color-text-secondary) uppercase">
                    {t('header.my_page')}
                  </Link>
                  <span className="text-(--color-text-secondary)">|</span>
                  <button
                    className="no-underline text-(--color-text-secondary) uppercase bg-transparent border-none cursor-pointer p-0 font-inherit"
                    onClick={() => auth.removeUser()}
                  >
                    {t('header.logout')}
                  </button>
                </>
              ) : (
                <button
                  className="no-underline text-(--color-text-secondary) uppercase bg-transparent border-none cursor-pointer p-0 font-inherit"
                  onClick={() => auth.signinRedirect()}
                >
                  {t('header.login')}
                </button>
              )}
            </div>
          </nav >
        )}
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/character" element={<Character />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<TOS />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        {/* Footer (Copyright, Privacy Policy, Terms of Service) */}
        <footer className="w-full max-w-7xl mx-auto py-6 px-6 text-center text-xs text-(--color-text-secondary)">
          &copy; {new Date().getFullYear()} Yejingram Realm. {t('footer.all_rights_reserved')}&nbsp;|&nbsp;
          Email: <a href="mailto:support@yejingram.com" className="text-(--color-text-secondary) underline">support@yejingram.com</a>&nbsp;|&nbsp;
          <a href="/privacy" className="text-(--color-text-secondary) underline">{t('footer.privacy_policy')}</a>&nbsp;|&nbsp;
          <a href="/terms" className="text-(--color-text-secondary) underline">{t('footer.terms_of_service')}</a>
        </footer>
      </div >
    </BrowserRouter >
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
      <SpeedInsights />
      <Analytics />
    </AuthProvider>
  </StrictMode >
)
