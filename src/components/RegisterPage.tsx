import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { UserPlus, Check, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import api from "../api/axios";

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const getStrengthLabel = (strength: number) => {
    if (strength === 0) return { label: "", color: "" };
    if (strength <= 2) return { label: "弱", color: "text-red-400" };
    if (strength <= 3) return { label: "中等", color: "text-yellow-400" };
    return { label: "強", color: "text-green-400" };
  };

  const getStrengthBarColor = (strength: number) => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Validation checks
  const validations = {
    name: formData.name.trim().length >= 2,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
    password: formData.password.length >= 8,
    confirmPassword:
      formData.password === formData.confirmPassword &&
      formData.confirmPassword !== "",
  };

  const passwordRequirements = [
    { label: "至少8個字元", met: formData.password.length >= 8 },
    {
      label: "包含大小寫字母",
      met: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password),
    },
    { label: "包含數字", met: /[0-9]/.test(formData.password) },
    { label: "包含特殊字元", met: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    if (!validations.name) {
      toast.error("姓名至少需要2個字元");
      return;
    }

    if (!validations.email) {
      toast.error("請輸入有效的信箱地址");
      return;
    }

    if (!validations.password) {
      toast.error("密碼至少需要8個字元");
      return;
    }

    if (!validations.confirmPassword) {
      toast.error("兩次輸入的密碼不相符");
      return;
    }

    setIsSubmitting(true);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);

    try {
      await api.post(
        "/api/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        { signal: controller.signal }
      );

      toast.success("註冊成功！", {
        description: "歡迎加入我們，即將跳轉至登入頁面...",
      });

      window.setTimeout(() => {
        onNavigate("login");
      }, 1500);
    } catch (error) {
      console.error("註冊錯誤詳情：", error);

      if ((error as any).response) {
        console.error("Response data:", (error as any).response.data);
        console.error("Response status:", (error as any).response.status);
        console.error("Response headers:", (error as any).response.headers);
      } else if ((error as any).request) {
        console.error(
          "Request made but no response received:",
          (error as any).request
        );
      } else {
        console.error("Error message:", (error as any).message);
      }

      const message =
        (error as any)?.response?.data?.message ??
        (error instanceof DOMException && error.name === "AbortError"
          ? "註冊逾時，請確認後端伺服器是否啟動"
          : "註冊失敗，請稍後再試或聯繫客服人員");
      toast.error("註冊失敗", {
        description: message,
      });
    } finally {
      window.clearTimeout(timeout);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Register Form Card */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-blue-500/20 shadow-2xl shadow-blue-500/10 p-6 sm:p-8 lg:p-10">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                建立新帳戶
              </h2>
              <p className="text-gray-400 text-sm">填寫以下資訊完成註冊</p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  姓名：
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="請輸入您的姓名"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={`h-12 bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 ${
                    touched.name && !validations.name ? "border-red-500/50" : ""
                  }`}
                  required
                />
                {touched.name && !validations.name && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    姓名至少需要2個字元
                  </p>
                )}
              </div>

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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">密碼強度：</span>
                      <span
                        className={`text-sm ${
                          getStrengthLabel(passwordStrength).color
                        }`}
                      >
                        {getStrengthLabel(passwordStrength).label}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthBarColor(
                          passwordStrength
                        )}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                {formData.password && (
                  <div className="space-y-1 mt-3 p-3 bg-slate-800/30 rounded-lg border border-blue-500/10">
                    <p className="text-sm text-gray-400 mb-2">密碼要求：</p>
                    {passwordRequirements.map((req, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        {req.met ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <X className="w-4 h-4 text-gray-500" />
                        )}
                        <span
                          className={
                            req.met ? "text-green-400" : "text-gray-500"
                          }
                        >
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  確認密碼：
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="請再次輸入密碼"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  onBlur={() => handleBlur("confirmPassword")}
                  className={`h-12 bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 ${
                    touched.confirmPassword && !validations.confirmPassword
                      ? "border-red-500/50"
                      : ""
                  } ${
                    touched.confirmPassword && validations.confirmPassword
                      ? "border-green-500/50"
                      : ""
                  }`}
                  required
                />
                {touched.confirmPassword &&
                  formData.confirmPassword &&
                  (validations.confirmPassword ? (
                    <p className="text-green-400 text-sm flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      密碼相符
                    </p>
                  ) : (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      兩次輸入的密碼不相符
                    </p>
                  ))}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    註冊中...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    註冊用戶
                  </>
                )}
              </Button>
            </form>

            {/* Additional Links */}
            <div className="pt-4 text-center space-y-2 border-t border-blue-500/20">
              <p className="text-gray-400 text-sm">
                已經有帳戶？{" "}
                <button
                  onClick={() => onNavigate("login")}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  立即登入
                </button>
              </p>
            </div>
          </div>
        </Card>

        {/* Security Features */}
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
            <p className="text-sm text-gray-400">密碼加密儲存</p>
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-400">信箱認證保護</p>
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-400">資料安全保障</p>
          </div>
        </div>
      </div>
    </main>
  );
}
