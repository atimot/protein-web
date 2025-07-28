import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";

interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "メールアドレスは必須です";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "パスワードは必須です";
    } else if (formData.password.length < 8) {
      newErrors.password = "パスワードは8文字以上で入力してください";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "パスワードは大文字、小文字、数字を含む必要があります";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "パスワードの確認は必須です";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "パスワードが一致しません";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Register user
      const registerResponse = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (registerResponse.ok) {
        // Step 2: Auto-login after successful registration
        const loginResponse = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          
          // Use AuthContext to login (which also stores to localStorage)
          login(loginData.token, loginData.user);
          
          // Navigate to home page or dashboard
          navigate("/", { 
            state: { message: "アカウントが作成されました。ようこそ！" } 
          });
        } else {
          // Registration succeeded but login failed - redirect to login page
          navigate("/login", { 
            state: { message: "アカウントが作成されました。ログインしてください。" } 
          });
        }
      } else {
        const errorData = await registerResponse.json();
        setErrors({ submit: errorData.error || "登録に失敗しました" });
      }
    } catch (error) {
      setErrors({ submit: "ネットワークエラーが発生しました" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] md:p-4">
        <div className="w-full md:max-w-md">
          {/* Card wrapper */}
          <div className="bg-white dark:bg-gray-800 shadow-sm md:border md:border-gray-200 md:dark:border-gray-700 md:rounded-none">
            {/* Card Header */}
            <div className="p-6 md:px-6 md:pt-6 md:pb-4">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  アカウント作成
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  proteInternet で新しいアカウントを作成しましょう
                </p>
              </div>
            </div>
          
            {/* Card Content */}
            <div className="p-6 md:px-6 md:pt-0 md:pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  メールアドレス
                </Label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your-email@example.com"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  パスワード
                </Label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="パスワードを入力"
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
                <p className="text-xs text-gray-500">
                  大文字、小文字、数字を含む8文字以上
                </p>
              </div>

              {/* Confirm Password field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  パスワード（確認）
                </Label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="パスワードを再度入力"
                    className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit error */}
              {errors.submit && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md">
                  <p className="text-sm text-red-800 dark:text-red-200">{errors.submit}</p>
                </div>
              )}

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "作成中..." : "アカウントを作成"}
              </Button>
            </form>

            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                すでにアカウントをお持ちですか？{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  ログイン
                </Link>
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
