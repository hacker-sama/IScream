"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui";
import { extractApiError } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/config";

interface FormData {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  usernameOrEmail?: string;
  password?: string;
  general?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.usernameOrEmail.trim())
    errors.usernameOrEmail = "Please enter your email or username.";
  if (!data.password) errors.password = "Please enter your password.";
  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState<FormData>({
    usernameOrEmail: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      await login({
        usernameOrEmail: form.usernameOrEmail.trim(),
        password: form.password,
      });
      router.push(routes.home);
    } catch (err: unknown) {
      setErrors({
        general: extractApiError(err, "Login failed. Please try again."),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-[1000px] items-start justify-center py-8">
      <div className="flex w-full overflow-hidden rounded-[2rem] border border-gray-100 shadow-2xl shadow-primary/10">
        <div className="relative flex min-h-[620px] w-full flex-col md:flex-row">
          {/* ── LEFT: Branding panel ── */}
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-primary/5 p-10 text-center md:w-1/2">
            {/* Polka dot pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
              <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="dots-login"
                    x="0"
                    y="0"
                    width="28"
                    height="28"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="3" cy="3" r="2.5" fill="#ee2b52" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots-login)" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6">
              {/* Ice cream illustration */}
              <div className="relative h-56 w-56">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAjQpOH1pBEkX2VTQg9HyVVJ0XLkpGwVikydaDcmKyb3XrcoziTcKhvF3P9VC36eeEwyG_vFFw9dBVU2wQBI6g21vXMQDhEbokxiaB60Zlq-GzrR9ZXz2haGb_JoDd6Mziy4csEtIZflnU-irKaCtZWERgFVlJo9g3ntJjNAvFkG_K70K6vjtwLSA4pgLCFsD1iw1qSdcOJGXYToGjwKjcRKlLwB4Xy5Y8bIZ_Py1PlXDsgH9LReu0Pe5vGdTwxKmK-BVxVZAYQM9G"
                  alt="Ice cream sundae illustration"
                  fill
                  className="object-contain drop-shadow-xl"
                  priority
                />
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="text-3xl font-black leading-tight tracking-tight text-text-main">
                  Sweet scoops are
                  <br />
                  waiting!
                </h2>
                <p className="max-w-xs text-sm leading-relaxed text-text-muted">
                  Log in to access your saved recipes, community scoops, and
                  secret dessert books.
                </p>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  {[
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCNSOw2i4IdT_egfUQNLBp7aV5ZfKxaDhynmsQXnpjpQyQsoWZQZpC3X24bHb-I9fOHxm-mKHVyC4rkyrO_e9Iu1qQ7rcT52xOzIQwdWk-I1Ttm58t47aPoaoldw9Xh9id5Q2kXalPb_QwvS4podDe9n4Og0vmz_rS-3BuJfBpEs-qTvG7dj2LJpL2JTKkFGk6uskyfuEemiQrNuZHt1gDm_zmxkYYxE1eu7Xqjj0bdmdc-vTdJ1aZfVJOC1Vvgo9AyUxbjr-gmqM64",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBqQvDSYSraCX-9pJdOwUAObMVRLX6O3_WGD866rgqTjHWdfEB0W9rOh7b_WhHfmKTuB7b3nlkwtkvOQMvfLvyj_tl4twJAdemte0Pwtr16iQRowI5kGUwu9yJ5NGQuINj4vBuGisyH2Aj_8dp5jtuWH72M0jdmTqgXBVasDlZlo_NXyJDsnGzLCLAJX0tpH3px6TyRfDDW9UKy5zDh75UiRvZ8pGUDKjSojgD3mu1AUk6kug7D2vQKgvFA4PY9m85FJsSRZRxdgXki",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAdv-rexvD32l1KWlNBHBbfcYHdvWzrD09TQAEwpZ2YgLOcP6Am17ftmL3YSpijZ2pI3Hpgx-GEKHpLckt2dlry2bzNrho5GP-zzHeMQn2KbJhp4PzIKVo1VW_1nnmVN_zTw99R6EgEW9VsNXq7XDls9A2QzeUOACegSRoM85SruS6d7DqgvfJmWZ_fJtfVjDAt3oth2iHLZfVpxlZB9-z-GXwRPr355V9Gz1hhD6LD8HA4RxrySsYgh8UBopjQQSa8PY4libxix-S7",
                  ].map((src, i) => (
                    <Image
                      key={i}
                      src={src}
                      alt={`User ${i + 1}`}
                      width={36}
                      height={36}
                      className="inline-block h-9 w-9 rounded-full ring-2 ring-white"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-text-muted">
                  Join 10k+ ice cream lovers
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Form panel ── */}
          <div className="flex flex-1 flex-col justify-center bg-white px-8 py-10 md:px-12">
            <div className="flex flex-col gap-7">
              {/* Title */}
              <div>
                <h1 className="text-[2rem] font-bold tracking-tight text-text-main">
                  Customer Login
                </h1>
                <p className="mt-1 text-sm text-text-muted">
                  Welcome back to the parlor!
                </p>
              </div>

              {/* General error */}
              {errors.general && (
                <div className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  <MaterialIcon
                    name="error"
                    filled
                    className="text-[18px] text-red-500"
                  />
                  {errors.general}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
                noValidate
              >
                {/* Email or Username */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="usernameOrEmail"
                    className="text-sm font-semibold text-text-main"
                  >
                    Email or Username
                  </label>
                  <div className="relative">
                    <MaterialIcon
                      name="person"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-text-muted"
                    />
                    <input
                      id="usernameOrEmail"
                      type="text"
                      name="usernameOrEmail"
                      value={form.usernameOrEmail}
                      onChange={handleChange}
                      placeholder="Your email or username"
                      autoComplete="username"
                      className={`h-[52px] w-full rounded-full border bg-white pl-11 pr-4 text-sm text-black outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/15 ${
                        errors.usernameOrEmail
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.usernameOrEmail && (
                    <p className="pl-3 text-xs text-red-500">
                      {errors.usernameOrEmail}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="login-password"
                    className="text-sm font-semibold text-text-main"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <MaterialIcon
                      name="lock"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-text-muted"
                    />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className={`h-[52px] w-full rounded-full border bg-white pl-11 pr-12 text-sm text-black outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/15 ${
                        errors.password ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <MaterialIcon
                        name={showPassword ? "visibility_off" : "visibility"}
                      />
                    </button>
                  </div>
                  {errors.password && (
                    <p className="pl-3 text-xs text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember me + Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 group">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={form.rememberMe}
                      onChange={handleChange}
                      className="h-[18px] w-[18px] cursor-pointer rounded border-gray-300 text-primary focus:ring-primary/30"
                    />
                    <span className="text-sm text-text-muted group-hover:text-primary transition-colors">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-sm font-semibold text-primary hover:underline underline-offset-4"
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover hover:shadow-primary/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Logging in...
                    </>
                  ) : (
                    "Login to Portal"
                  )}
                </button>

                {/* Sign up link */}
                <p className="text-center text-sm text-text-muted">
                  Don&apos;t have an account?{" "}
                  <Link
                    href={routes.register}
                    className="font-semibold text-primary hover:underline underline-offset-4"
                  >
                    Sign up here
                  </Link>
                </p>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-grow border-t border-gray-200" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Or continue with
                  </span>
                  <div className="flex-grow border-t border-gray-200" />
                </div>

                {/* Social */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-full border border-gray-200 py-3 text-sm font-semibold text-text-main transition-colors hover:bg-gray-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 48 48"
                      aria-label="Google"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-full border border-gray-200 py-3 text-sm font-semibold text-text-main transition-colors hover:bg-gray-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 22 22"
                      fill="currentColor"
                      aria-label="Apple"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    Apple
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
