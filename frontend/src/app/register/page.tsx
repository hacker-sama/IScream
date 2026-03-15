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
  fullName: string;
  username: string;
  email: string;
  password: string;
}

interface FormErrors {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  general?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.username.trim()) {
    errors.username = "Please enter a username.";
  } else if (data.username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters.";
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username.trim())) {
    errors.username = "Only letters, numbers, and underscores are allowed.";
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email address.";
  }

  if (!data.password) {
    errors.password = "Please create a password.";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, login } = useAuth();
  const [form, setForm] = useState<FormData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      await register({
        username: form.username.trim(),
        password: form.password,
        email: form.email.trim() || undefined,
        fullName: form.fullName.trim() || undefined,
      });
      // Auto-login instantly after successful registration
      await login({
        usernameOrEmail: form.username.trim(),
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => router.push(routes.home), 1500);
    } catch (err: unknown) {
      setErrors({
        general: extractApiError(err, "Registration failed. Please try again."),
      });
    } finally {
      setLoading(false);
    }
  }

  // shared input class
  const inputBase = (hasError: boolean) =>
    `h-[52px] w-full rounded-full border bg-white pl-11 pr-4 text-sm text-black outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/15 ${
      hasError ? "border-red-400" : "border-gray-200"
    }`;

  return (
    <div className="flex w-full max-w-[1000px] items-start justify-center py-8">
      <div className="flex w-full overflow-hidden rounded-[2rem] border border-gray-100 shadow-2xl shadow-primary/10">
        <div className="relative flex min-h-[700px] w-full flex-col lg:flex-row">
          {/* ── LEFT: Form panel ── */}
          <div className="flex w-full flex-col justify-center overflow-y-auto bg-white px-8 py-10 lg:w-1/2 lg:px-12">
            <div className="flex w-full max-w-[440px] flex-col gap-5 mx-auto">
              {/* Heading */}
              <div className="flex flex-col gap-1">
                <h1 className="text-[2rem] font-black leading-tight tracking-tight text-text-main">
                  Ready for a sugar rush?
                </h1>
                <p className="text-sm text-text-muted">
                  Join the IScream community for exclusive recipes and books.
                </p>
              </div>

              {/* Tabs */}
              <div className="w-full border-b border-gray-200">
                <div className="flex gap-8">
                  <Link
                    href={routes.login}
                    className="border-b-[2px] border-transparent pb-3 pt-1 text-sm font-semibold text-text-muted transition-colors hover:text-primary"
                  >
                    Log In
                  </Link>
                  <div className="border-b-[2px] border-text-main pb-3 pt-1 text-sm font-bold text-text-main">
                    Sign Up
                  </div>
                </div>
              </div>

              {/* Success */}
              {success ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl bg-green-50 p-8 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-green-100">
                    <MaterialIcon
                      name="check_circle"
                      filled
                      className="text-[36px] text-green-600"
                    />
                  </div>
                  <div>
                    <p className="text-base font-bold text-text-main">
                      Account created!
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      Redirecting you to login...
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                  noValidate
                >
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

                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-text-main">
                      Full Name
                    </label>
                    <div className="relative">
                      <MaterialIcon
                        name="person"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-gray-400"
                      />
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Cherry Garcia"
                        autoComplete="name"
                        className={inputBase(!!errors.fullName)}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="pl-3 text-xs text-red-500">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Username */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-text-main">
                      Username
                    </label>
                    <div className="relative">
                      <MaterialIcon
                        name="alternate_email"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-gray-400"
                      />
                      <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="icecream_fan"
                        autoComplete="username"
                        className={inputBase(!!errors.username)}
                      />
                    </div>
                    {errors.username && (
                      <p className="pl-3 text-xs text-red-500">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-text-main">
                      Email Address
                    </label>
                    <div className="relative">
                      <MaterialIcon
                        name="mail"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-gray-400"
                      />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your_email@example.com"
                        autoComplete="email"
                        className={inputBase(!!errors.email)}
                      />
                    </div>
                    {errors.email && (
                      <p className="pl-3 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-text-main">
                      Password
                    </label>
                    <div className="relative">
                      <MaterialIcon
                        name="lock"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-gray-400"
                      />
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Create a sweet password"
                        autoComplete="new-password"
                        className={inputBase(!!errors.password)}
                      />
                    </div>
                    {errors.password && (
                      <p className="pl-3 text-xs text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Join the Club{" "}
                        <MaterialIcon
                          name="arrow_forward"
                          className="text-sm"
                        />
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-grow border-t border-gray-200" />
                    <span className="text-xs text-text-muted">
                      Or sweeten the deal with
                    </span>
                    <div className="flex-grow border-t border-gray-200" />
                  </div>

                  {/* Social */}
                  <div className="flex justify-center gap-4">
                    <button
                      type="button"
                      className="flex size-11 items-center justify-center rounded-full border border-gray-200 transition-colors hover:bg-gray-50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
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
                    </button>
                    <button
                      type="button"
                      className="flex size-11 items-center justify-center rounded-full border border-gray-200 transition-colors hover:bg-gray-50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 22 22"
                        fill="currentColor"
                        aria-label="Apple"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                    </button>
                  </div>

                  {/* Terms */}
                  <p className="text-center text-xs text-text-muted">
                    By joining, you agree to our{" "}
                    <Link
                      href={routes.privacyPolicy}
                      className="underline hover:text-primary"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href={routes.privacyPolicy}
                      className="underline hover:text-primary"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* ── RIGHT: Photo panel ── */}
          <div className="relative hidden lg:block lg:w-1/2">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 to-transparent" />
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2aKLr7t03shI4-Y6ZNgAcYxdJBIH0tTNo5MbU1wM-TU2rU_AVpKZBRP1NCkHzuwRwgoFzGwweomO3RNMkVnaWClifMeKukdzx9zTy_TmsxugTTLsrix4jKA5ksZS2e6OCVlGJkXvF6a48EZLiCTYMGI61Fh3hgyvsjcA1Q7CUnRQ2VboX3ysybtYRBzh0mdAeUuDHw7yExaY1HIE0Dt1T_RHxVoTZh59lMwGeiR-KvVF4YprN2i98XM8RF6XO1o9ADds22yC8FZ0"
              alt="Vibrant pink strawberry ice cream scoops"
              fill
              sizes="50vw"
              className="object-cover"
              priority
            />
            {/* Quote card */}
            <div className="absolute bottom-10 left-8 right-8 z-20">
              <div className="rounded-2xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur-md">
                <div className="flex items-start gap-3">
                  <MaterialIcon
                    name="format_quote"
                    filled
                    className="text-[32px] text-primary shrink-0"
                  />
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium leading-snug text-text-main">
                      &quot;The secret ingredient is always love... and maybe a
                      little extra sprinkles.&quot;
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex size-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                        A
                      </div>
                      <span className="text-xs font-bold text-text-muted">
                        IScream
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
