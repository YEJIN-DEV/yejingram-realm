import './App.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Applicant from './Applicant.tsx'
import SearchPage from './Search.tsx'
import { AuthProvider, useAuth } from 'react-oidc-context'

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-northeast-2.amazonaws.com/ap-northeast-2_qpXc0tRPJ",
  client_id: "3mjaiv26pdraeb0erjj5am92ve",
  redirect_uri: "http://localhost:5173",
  response_type: "code",
  scope: "email openid profile",
};

function App() {
  const auth = useAuth();

  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="top-nav">
          <Link to="/" className="top-nav-logo">
            REALM YEJINGRAM
          </Link>
          <div className="top-nav-links">
            <Link to="/" className="top-nav-link">
              검색
            </Link>
            {auth.isAuthenticated ? (
              <>
                <button
                  className="top-nav-link"
                  onClick={() => auth.removeUser()}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
                >
                  {auth.user?.profile.nickname} | 로그아웃
                </button>
              </>
            ) : (
              <button
                className="top-nav-link"
                onClick={() => auth.signinRedirect()}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
              >
                로그인
              </button>
            )}
          </div>
        </nav>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/applicant" element={<Applicant />} />
          </Routes>
        </main>
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
