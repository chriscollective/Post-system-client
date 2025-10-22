import { LogIn, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-6">
          {/* Decorative Elements */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center rotate-6 shadow-2xl shadow-blue-500/50">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="inline-block pb-2 text-4xl sm:text-5xl lg:text-6xl leading-relaxed sm:leading-normal lg:leading-snug bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Google登入與本地登入系統
          </h1>

          <h2 className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            此專案的練習包括使用MongoDB、Passport.js、Authentication、OAuth(Google
            Login Setup) 。
          </h2>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            可以註冊本地帳號後，用本地帳號登入系統，也可以透過Google帳號登入系統。
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-blue-500/20 shadow-2xl shadow-blue-500/10 p-6 sm:p-8 lg:p-12">
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="grid gap-4">
              {/* Register Button */}
              <Button
                onClick={() => onNavigate("register")}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                會員註冊
              </Button>

              {/* Local Login Button */}
              <Button
                onClick={() => onNavigate("login")}
                className="w-full h-14 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white border border-blue-500/30 shadow-lg shadow-slate-500/20 transition-all hover:shadow-xl hover:shadow-slate-500/30 hover:scale-[1.02]"
              >
                <LogIn className="w-5 h-5 mr-2" />
                本地登入
              </Button>

              {/* Divider */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-blue-500/20"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">
                  或
                </span>
                <div className="flex-grow border-t border-blue-500/20"></div>
              </div>

              {/* Google Login Button */}
              <Button
                onClick={handleGoogleLogin}
                className="w-full h-14 bg-white hover:bg-gray-100 text-gray-900 shadow-lg shadow-white/10 transition-all hover:shadow-xl hover:shadow-white/20 hover:scale-[1.02]"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                透過Google登入
              </Button>
            </div>

            {/* Additional Info */}
            <div className="pt-6 border-t border-blue-500/20">
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="w-10 h-10 mx-auto bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">安全加密</p>
                </div>
                <div className="space-y-1">
                  <div className="w-10 h-10 mx-auto bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-cyan-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">快速登入</p>
                </div>
                <div className="space-y-1">
                  <div className="w-10 h-10 mx-auto bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">多重選擇</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tech Stack Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">技術堆疊</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["MongoDB", "Passport.js", "OAuth 2.0", "Node.js", "Express"].map(
              (tech) => (
                <div
                  key={tech}
                  className="px-4 py-2 bg-slate-800/50 border border-blue-500/20 rounded-full text-sm text-gray-300"
                >
                  {tech}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
