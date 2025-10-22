import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LogIn, AlertCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import api from "../api/axios";

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLogin: (payload: { name: string; email: string }) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation checks
  const validations = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
    password: formData.password.length >= 6,
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleGoogleLogin = () => {
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
    console.log("apiBase", apiBase);
    window.location.href = `${apiBase}/api/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    // Validate all fields
    if (!validations.email) {
      toast.error("請輸入有效的信箱地址");
      return;
    }

    if (!validations.password) {
      toast.error("密碼長度不足");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/api/login", {
        email: formData.email,
        password: formData.password,
      });

      const userName = response.data?.user?.name ?? "";
      const userEmail =
        response.data?.user?.email ?? formData.email.toLowerCase();

      toast.success("登入成功！", {
        description: "歡迎回來，即將進入系統...",
        duration: 1500,
      });

      onLogin({ name: userName, email: userEmail });
    } catch (error) {
      const message =
        (error as any)?.response?.data?.message ?? "信箱或密碼錯誤，請重新輸入";
      toast.error("登入失敗", {
        description: message,
        duration: 1500,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Login Form Card */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-blue-500/20 shadow-2xl shadow-blue-500/10 p-6 sm:p-8 lg:p-10">
          <div className="space-y-8">
            {/* Local Login Section */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                已經註冊過一個帳戶？您可以在此登錄：
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    信箱地址：
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="請輸入您的信箱"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={`h-12 bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 ${
                      touched.email && !validations.email
                        ? "border-red-500/50"
                        : ""
                    }`}
                    required
                  />
                  {touched.email && !validations.email ? (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      請輸入有效的信箱地址
                    </p>
                  ) : (
                    <small className="text-gray-500 text-sm">
                      我們不會與其他人分享你的信箱。
                    </small>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">
                    密碼：
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="請輸入您的密碼"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    onBlur={() => handleBlur("password")}
                    className={`h-12 bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 ${
                      touched.password && !validations.password
                        ? "border-red-500/50"
                        : ""
                    }`}
                    required
                  />
                  {touched.password && !validations.password && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      密碼至少需要6個字元
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      登入中...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      會員登入
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-blue-500/20"></div>
              <span className="flex-shrink mx-4 text-gray-500">或</span>
              <div className="flex-grow border-t border-blue-500/20"></div>
            </div>

            {/* Google Login Section */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                已有Google帳戶
              </h2>

              <Button
                onClick={handleGoogleLogin}
                className="w-full h-12 bg-white hover:bg-gray-100 text-gray-900 shadow-lg shadow-white/10 transition-all hover:shadow-xl hover:shadow-white/20 hover:scale-[1.02]"
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

            {/* Additional Links */}
            <div className="pt-4 text-center space-y-2">
              <p className="text-gray-400 text-sm">
                還沒有帳戶？{" "}
                <button
                  onClick={() => onNavigate("register")}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  立即註冊
                </button>
              </p>
            </div>
          </div>
        </Card>

        {/* Security Info */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-blue-500/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-400"
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
            <p className="text-sm text-gray-400">SSL 加密傳輸</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-cyan-400"
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
            <p className="text-sm text-gray-400">安全認證</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-blue-500/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-400">隱私保護</p>
          </div>
        </div>
      </div>
    </main>
  );
}
