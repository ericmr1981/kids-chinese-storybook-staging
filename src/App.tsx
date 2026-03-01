import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CreateStoryPage } from './pages/CreateStoryPage';
import { LibraryPage } from './pages/LibraryPage';
import { SettingsPage } from './pages/SettingsPage';
import { Button } from './components/Button';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        {/* 导航栏 */}
        <nav className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span className="text-xl font-bold text-neutral-800">
                儿童中文故事
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  首页
                </Button>
              </Link>
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
              <Link to="/settings">
                <Button variant="ghost" size="sm">
                  设置
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* 路由 */}
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