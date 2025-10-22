import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Home,
  LogIn,
  UserPlus,
  User,
  FileText,
  PlusSquare,
  LogOut,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { DashboardPage } from "./components/DashboardPage";
import { ProfilePage } from "./components/ProfilePage";
import { CreatePostPage } from "./components/CreatePostPage";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import api from "./api/axios";

export default function App() {
  const routeToPage: Record<string, string> = {
    "/": "home",
    "/home": "home",
    "/login": "login",
    "/register": "register",
    "/dashboard": "dashboard",
    "/posts": "posts",
    "/profile": "profile",
    "/create-post": "create-post",
  };

  const pageToRoute: Record<string, string> = {
    home: "/",
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
    posts: "/posts",
    profile: "/profile",
    "create-post": "/create-post",
  };

  const protectedPages = new Set(["dashboard", "profile", "create-post"]);

  const getPageFromPathname = (pathname: string) =>
    routeToPage[pathname] ?? "home";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(() =>
    typeof window !== "undefined"
      ? getPageFromPathname(window.location.pathname)
      : "home"
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const syncHistory = (page: string, { replace = false } = {}) => {
    if (typeof window === "undefined") return;
    const targetPath = pageToRoute[page] ?? "/";
    const currentPath = window.location.pathname;
    const method = replace ? "replaceState" : "pushState";
    if (currentPath !== targetPath) {
      window.history[method]({}, "", targetPath);
    } else if (replace) {
      window.history.replaceState({}, "", targetPath);
    }
  };

  const navigateTo = (page: string, options?: { replace?: boolean }) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    syncHistory(page, options);
  };

  const handleNavigate = (page: string) => {
    navigateTo(page);
  };

  const handleLogin = (payload: { name: string; email: string }) => {
    setIsLoggedIn(true);
    setUserName(payload.name);
    setUserEmail(payload.email);
    navigateTo("dashboard", { replace: true });
  };

  const handleLogout = async () => {
    try {
      await api.get("/api/logout");
    } catch (error) {
      // ignore logout failure but log to console for developers
      console.warn("登出 API 呼叫失敗", error);
    } finally {
      setIsLoggedIn(false);
      setUserName("");
      setUserEmail("");
      navigateTo("home", { replace: true });
      toast.success("已成功登出系統");
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await api.get("/api/user");
        if (!active) return;
        const name = response.data?.user?.name ?? "";
        const email = response.data?.user?.email ?? "";
        if (name) {
          setIsLoggedIn(true);
          setUserName(name);
          setUserEmail(email);
          if (typeof window !== "undefined") {
            setCurrentPage(getPageFromPathname(window.location.pathname));
          }
        }
      } catch {
        if (!active) return;
        setIsLoggedIn(false);
        setUserName("");
        setUserEmail("");
        if (typeof window !== "undefined") {
          const desired = getPageFromPathname(window.location.pathname);
          if (protectedPages.has(desired)) {
            navigateTo("home", { replace: true });
          }
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === "undefined") {
        return;
      }
      const nextPage = getPageFromPathname(window.location.pathname);
      if (!isLoggedIn && protectedPages.has(nextPage)) {
        navigateTo("home", { replace: true });
        return;
      }
      setCurrentPage(nextPage);
      setMobileMenuOpen(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <Toaster richColors position="top-center" />
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/50 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => handleNavigate(isLoggedIn ? 'dashboard' : 'home')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded"></div>
              </div>
              <span className="text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Auth System
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {!isLoggedIn ? (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-gray-300 hover:text-white hover:bg-blue-500/10"
                    onClick={() => handleNavigate('home')}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    首頁
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-gray-300 hover:text-white hover:bg-blue-500/10"
                    onClick={() => handleNavigate('login')}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    會員登入
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-gray-300 hover:text-white hover:bg-blue-500/10"
                    onClick={() => handleNavigate('register')}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    會員註冊
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-gray-300 hover:text-white hover:bg-blue-500/10"
                    onClick={() => handleNavigate('posts')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    貼文
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-gray-300 hover:text-white hover:bg-blue-500/10"
                    onClick={() => handleNavigate('profile')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    個人檔案
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-gray-300 hover:text-white hover:bg-blue-500/10"
                    onClick={() => handleNavigate('create-post')}
                  >
                    <PlusSquare className="w-4 h-4 mr-2" />
                    製作新POST
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-gray-300 hover:text-white hover:bg-red-500/10 hover:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    登出系統
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-blue-500/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-blue-500/20">
              {!isLoggedIn ? (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-500/10"
                    onClick={() => handleNavigate('home')}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    首頁
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-500/10"
                    onClick={() => handleNavigate('login')}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    會員登入
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-500/10"
                    onClick={() => handleNavigate('register')}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    會員註冊
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-500/10"
                    onClick={() => handleNavigate('posts')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    貼文
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-500/10"
                    onClick={() => handleNavigate('profile')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    個人檔案
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-500/10"
                    onClick={() => handleNavigate('create-post')}
                  >
                    <PlusSquare className="w-4 h-4 mr-2" />
                    製作新POST
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-red-500/10 hover:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    登出系統
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}
      {currentPage === "login" && (
        <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
      )}
      {currentPage === "register" && (
        <RegisterPage onNavigate={handleNavigate} />
      )}
      {currentPage === "dashboard" && (
        <DashboardPage userName={userName} onNavigate={handleNavigate} />
      )}
      {currentPage === "posts" && (
        <DashboardPage userName={userName} onNavigate={handleNavigate} />
      )}
      {currentPage === "profile" && (
        <ProfilePage
          userName={userName}
          userEmail={userEmail}
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === "create-post" && (
        <CreatePostPage onNavigate={handleNavigate} />
      )}

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
