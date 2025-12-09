import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Character from './Character.tsx'
import SearchPage from './Search.tsx'
import { AuthProvider, useAuth } from 'react-oidc-context'
import Privacy from './Privacy.tsx'
import TOS from './TOS.tsx'
import Dashboard from './Dashboard.tsx'
import { Toaster } from 'react-hot-toast'

window.addEventListener('message', (event) => {
  if (event.data.type === 'CSS_VARIABLES') {
    const variables = event.data.variables;
    // :root에 변수 적용
    for (const [key, value] of Object.entries(variables)) {
      document.documentElement.style.setProperty(key, value as string);
    }
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
  const isInIframe = window.self !== window.top;

  return (
    <BrowserRouter>
      <Toaster toastOptions={{ duration: 5000 }} />
      <div className="w-full">
        {!isInIframe && (
          <nav className="w-full max-w-7xl mx-auto pt-3.5 px-6 flex items-center justify-between text-xs tracking-wider">
            <Link to="/" className="font-bold text-(--color-text-primary) no-underline">
              YEJINGRAM<br />REALM
            </Link>
            <div className="flex gap-3">
              <Link to="/" className="no-underline text-(--color-text-secondary) uppercase">
                검색
              </Link>
              {auth.isAuthenticated ? (
                <>
                  <span className="text-(--color-text-secondary)">|</span>
                  <Link to="/dashboard" className="no-underline text-(--color-text-secondary) uppercase">
                    마이페이지
                  </Link>
                  <span className="text-(--color-text-secondary)">|</span>
                  <button
                    className="no-underline text-(--color-text-secondary) uppercase bg-transparent border-none cursor-pointer p-0 font-inherit"
                    onClick={() => auth.removeUser()}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <button
                  className="no-underline text-(--color-text-secondary) uppercase bg-transparent border-none cursor-pointer p-0 font-inherit"
                  onClick={() => auth.signinRedirect()}
                >
                  로그인
                </button>
              )}
            </div>
          </nav>
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
          &copy; {new Date().getFullYear()} Yejingram Realm. All rights reserved.&nbsp;|&nbsp;
          Email: <a href="mailto:support@yejingram.com" className="text-(--color-text-secondary) underline">support@yejingram.com</a>&nbsp;|&nbsp;
          <a href="/privacy" className="text-(--color-text-secondary) underline">Privacy Policy</a>&nbsp;|&nbsp;
          <a href="/terms" className="text-(--color-text-secondary) underline">Terms of Service</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode >
)
