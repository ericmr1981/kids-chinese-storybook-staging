import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CreateStoryPage } from './pages/CreateStoryPage';
import { LibraryPage } from './pages/LibraryPage';
import { SettingsPage } from './pages/SettingsPage';
import { Button } from './components/Button';
import { useSettingsStore } from './store/settingsStore';

function SettingsLoader() {
  const settings = useSettingsStore();

  useEffect(() => {
    // 应用启动时自动加载服务器配置（只执行一次）
    settings.loadSettingsFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
function requirePortalAuth() {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isLocal) return;
  const hasCookie = document.cookie.split(';').some((c) => c.trim().startsWith('portal_auth='));
  if (!hasCookie) {
    // 检查是否是设置页面，如果是则允许访问（用于测试）
    const isSettingsPage = window.location.pathname === '/settings' || window.location.pathname.endsWith('/settings');
    if (!isSettingsPage) {
      window.location.href = '/login.html';
    }
  }
}

function NavBar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // 首页已经有主按钮区，导航可保留但弱化
  return (
    <nav className="px-4 sm:px-6 pt-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/70 backdrop-blur-md border border-kid-border shadow-soft rounded-full px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="text-base sm:text-lg font-extrabold text-neutral-900">
              儿童中文学习
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {!isHome && (
              <Link to="/">
                <Button variant="ghost" size="sm">
                  首页
                </Button>
              </Link>
            )}
            <Link to="/create">
              <Button variant="ghost" size="sm">
                创作
              </Button>
            </Link>
            <Link to="/library">
              <Button variant="ghost" size="sm">
                书架
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  requirePortalAuth();
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen">
        <SettingsLoader />
        <NavBar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateStoryPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
