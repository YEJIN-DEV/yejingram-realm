import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Applicant from './Applicant.tsx'
import SearchPage from './Search.tsx'
import { AuthProvider, useAuth } from 'react-oidc-context'
import Privacy from './Privacy.tsx'
import TOS from './TOS.tsx'
import Dashboard from './Dashboard.tsx'

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-northeast-2.amazonaws.com/ap-northeast-2_qpXc0tRPJ",
  client_id: "3mjaiv26pdraeb0erjj5am92ve",
  redirect_uri: "http://localhost:5173", // TODO: 실배포시 realm.yejingram.com 으로 변경
  response_type: "code",
  scope: "email openid profile",
};

function App() {
  const auth = useAuth();

  return (
    <BrowserRouter>
      <div className="w-full">
        <nav className="w-full max-w-[1140px] mx-auto pt-3.5 px-6 flex items-center justify-between text-xs tracking-[0.16em]">
          <Link to="/" className="font-bold text-(--color-text-primary) no-underline">
            YEJINGRAM REALM
          </Link>
          <div className="flex gap-3">
            <Link to="/" className="no-underline text-(--color-text-secondary) uppercase">
              검색
            </Link>
            {auth.isAuthenticated ? (
              <>
                <span className="text-(--color-text-secondary)">|</span>
                <Link to="/dashboard" className="no-underline text-(--color-text-secondary) uppercase">
                  마이페이지({auth.user?.profile.nickname})
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
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/applicant" element={<Applicant />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<TOS />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        {/* Footer (Copyright, Privacy Policy, Terms of Service) */}
        <footer className="w-full max-w-[1140px] mx-auto py-6 px-6 text-center text-xs text-(--color-text-secondary)">
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
