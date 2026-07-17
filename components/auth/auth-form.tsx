"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/lib/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaChevronLeft, FaChevronDown } from "react-icons/fa";
import LanguageSwitcher from "@/components/language-switcher/language-switcher";
import { apiPost, ApiClientError } from "@/lib/api-client";
import sweetAlert from "@/lib/sweet-alert";
import { isRtl, type Locale } from "@/lib/i18n/config";
import styles from "./auth.module.scss";

const COUNTRIES = [
  { code: "EG", flag: "🇪🇬", dial: "+20", name: "Egypt", min: 10, max: 10 },
  { code: "SA", flag: "🇸🇦", dial: "+966", name: "Saudi Arabia", min: 9, max: 9 },
  { code: "AE", flag: "🇦🇪", dial: "+971", name: "UAE", min: 9, max: 9 },
  { code: "KW", flag: "🇰🇼", dial: "+965", name: "Kuwait", min: 8, max: 8 },
  { code: "QA", flag: "🇶🇦", dial: "+974", name: "Qatar", min: 8, max: 8 },
  { code: "BH", flag: "🇧🇭", dial: "+973", name: "Bahrain", min: 8, max: 8 },
  { code: "OM", flag: "🇴🇲", dial: "+968", name: "Oman", min: 8, max: 8 },
  { code: "JO", flag: "🇯🇴", dial: "+962", name: "Jordan", min: 9, max: 9 },
  { code: "LB", flag: "🇱🇧", dial: "+961", name: "Lebanon", min: 7, max: 8 },
  { code: "SY", flag: "🇸🇾", dial: "+963", name: "Syria", min: 9, max: 9 },
  { code: "IQ", flag: "🇮🇶", dial: "+964", name: "Iraq", min: 10, max: 10 },
  { code: "LY", flag: "🇱🇾", dial: "+218", name: "Libya", min: 9, max: 9 },
  { code: "TN", flag: "🇹🇳", dial: "+216", name: "Tunisia", min: 8, max: 8 },
  { code: "DZ", flag: "🇩🇿", dial: "+213", name: "Algeria", min: 9, max: 9 },
  { code: "MA", flag: "🇲🇦", dial: "+212", name: "Morocco", min: 9, max: 9 },
  { code: "SD", flag: "🇸🇩", dial: "+249", name: "Sudan", min: 9, max: 9 },
  { code: "US", flag: "🇺🇸", dial: "+1", name: "USA", min: 10, max: 10 },
  { code: "GB", flag: "🇬🇧", dial: "+44", name: "UK", min: 10, max: 10 },
  { code: "DE", flag: "🇩🇪", dial: "+49", name: "Germany", min: 10, max: 11 },
  { code: "FR", flag: "🇫🇷", dial: "+33", name: "France", min: 9, max: 9 },
  { code: "IT", flag: "🇮🇹", dial: "+39", name: "Italy", min: 9, max: 10 },
  { code: "ES", flag: "🇪🇸", dial: "+34", name: "Spain", min: 9, max: 9 },
  { code: "PT", flag: "🇵🇹", dial: "+351", name: "Portugal", min: 9, max: 9 },
  { code: "TR", flag: "🇹🇷", dial: "+90", name: "Turkey", min: 10, max: 10 },
  { code: "IN", flag: "🇮🇳", dial: "+91", name: "India", min: 10, max: 10 },
  { code: "PK", flag: "🇵🇰", dial: "+92", name: "Pakistan", min: 10, max: 10 },
  { code: "CN", flag: "🇨🇳", dial: "+86", name: "China", min: 11, max: 11 },
  { code: "RU", flag: "🇷🇺", dial: "+7", name: "Russia", min: 10, max: 10 },
  { code: "BR", flag: "🇧🇷", dial: "+55", name: "Brazil", min: 10, max: 11 },
  { code: "ZA", flag: "🇿🇦", dial: "+27", name: "South Africa", min: 9, max: 9 },
];

type Country = (typeof COUNTRIES)[number];

type View =
  | "login"
  | "register"
  | "register-password"
  | "forgot-password"
  | "otp-verify"
  | "reset-password"
  | "verify";

const VALID_ENTRY_VIEWS: View[] = ["login", "register", "forgot-password"];

function PhoneInput({
  value,
  onChange,
  onCountryChange,
  selectedCountry,
  placeholder,
  error,
}: {
  value: string;
  onChange: (digits: string) => void;
  onCountryChange: (c: Country) => void;
  selectedCountry: Country;
  placeholder: string;
  error: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles["phone-input-wrapper"]} ref={wrapperRef}>
      <div className={`${styles["phone-input-container"]} ${error ? styles["phone-input-container--error"] : ""}`}>
        <button
          type="button"
          className={styles["country-selector"]}
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Select country code"
        >
          <span className={styles["country-flag"]}>{selectedCountry.flag}</span>
          <span className={styles["country-dial"]}>{selectedCountry.dial}</span>
          <FaChevronDown size={14} className={`${styles["country-chevron"]} ${open ? styles.open : ""}`} />
        </button>

        <div className={styles["phone-divider"]} />

        <input
          type="tel"
          className={styles["phone-number-input"]}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
          maxLength={selectedCountry.max}
        />
      </div>

      {error && <span className={styles["phone-error"]}>{error}</span>}

      {open && (
        <div className={styles["country-dropdown"]}>
          <div className={styles["country-search-wrapper"]}>
            <input
              type="text"
              className={styles["country-search"]}
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <ul className={styles["country-list"]}>
            {filtered.map((country) => (
              <li
                key={country.code}
                className={`${styles["country-item"]} ${selectedCountry.code === country.code ? styles["country-item--active"] : ""}`}
                onClick={() => {
                  onCountryChange(country);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <span className={styles["country-flag"]}>{country.flag}</span>
                <span className={styles["country-name"]}>{country.name}</span>
                <span className={styles["country-dial-muted"]}>{country.dial}</span>
              </li>
            ))}
            {filtered.length === 0 && <li className={`${styles["country-item"]} ${styles["country-item--empty"]}`}>No results</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

function PasswordInput({
  placeholder,
  value,
  onChange,
  isVisible,
  toggleVisible,
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isVisible: boolean;
  toggleVisible: () => void;
}) {
  return (
    <div className={styles["input-icon-wrapper"]}>
      <FaLock size={18} className={`${styles["input-icon"]} ${styles["input-icon--start"]}`} />
      <input type={isVisible ? "text" : "password"} required placeholder={placeholder} value={value} onChange={onChange} />
      <div
        className={`${styles["input-icon"]} ${styles["input-icon--toggle"]}`}
        onClick={toggleVisible}
        role="button"
        aria-label={isVisible ? "Hide password" : "Show password"}
      >
        {isVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
      </div>
    </div>
  );
}

function OtpGrid({
  otp,
  otpRefs,
  onChange,
  onKeyDown,
  onPaste,
  disabled,
}: {
  otp: string[];
  otpRefs: React.RefObject<(HTMLInputElement | null)[]>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  disabled: boolean;
}) {
  return (
    <div className={styles["otp-container"]}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            otpRefs.current[index] = el;
          }}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          className={`${styles["otp-input"]} ${digit ? styles.filled : ""} ${disabled ? styles.locked : ""}`}
          disabled={disabled}
          onChange={(e) => onChange(e, index)}
          onKeyDown={(e) => onKeyDown(e, index)}
          onPaste={onPaste}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}

const IMAGE_MAP: Record<View, string> = {
  login: "/img/adventure.webp",
  register: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=800&q=80",
  "forgot-password": "/img/contact-cta.webp",
  "otp-verify": "/img/contact-cta.webp",
  "reset-password": "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=800&q=80",
  "register-password": "/img/contact-cta.webp",
  verify: "/img/contact-cta.webp",
};

export default function AuthForm() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialView = (searchParams.get("view") as View) || "login";
  const [view, setView] = useState<View>(VALID_ENTRY_VIEWS.includes(initialView) ? initialView : "login");
  const [previousView, setPreviousView] = useState<View>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [localPhone, setLocalPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirmation: "",
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetPasswordFields, setResetPasswordFields] = useState({ password: "", passwordConfirmation: "" });

  const dir = isRtl(locale) ? "rtl" : "ltr";

  function switchView(v: View) {
    setPreviousView(view);
    setError(null);
    setSuccessMessage(null);
    setOtp(["", "", "", "", "", ""]);
    setView(v);
    router.replace(`/auth?view=${v}`, { scroll: false });
  }

  function handleCountryChange(country: Country) {
    setSelectedCountry(country);
    setLocalPhone("");
    setPhoneError("");
    setRegisterData((prev) => ({ ...prev, phone: "" }));
  }

  function handlePhoneChange(digits: string) {
    setLocalPhone(digits);
    setPhoneError("");
    setRegisterData((prev) => ({ ...prev, phone: `${selectedCountry.dial.replace("+", "")}${digits}` }));
  }

  async function handleVerifyEmail(fullOtp: string) {
    const code = fullOtp;
    if (code.length < 6) return setError(t("please_enter_otp"));
    const targetEmail = view === "otp-verify" ? forgotEmail : registerData.email;
    if (!targetEmail) return setError(t("email_missing_error"));

    setLoading(true);
    setError(null);
    try {
      if (view === "otp-verify") {
        const res = await apiPost<{ resetToken: string }>("/api/auth/user/verify-reset-otp", {
          email: targetEmail,
          otp: code,
        });
        sweetAlert.success(t("verified_success"));
        setResetToken(res.resetToken);
        switchView("reset-password");
      } else {
        await apiPost("/api/auth/user/verify-otp", { email: targetEmail, otp: code });
        sweetAlert.success(t("verified_success"));
        window.location.href = "/";
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t("invalid_otp"));
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    switchView(previousView);
  }

  function togglePassword(field: string) {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = Array(6).fill("");
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length - 1, 5)]?.focus();
    if (pasted.length === 6) handleVerifyEmail(pasted);
  }

  function handleOtpKeyDown(e: React.KeyboardEvent<HTMLInputElement>, i: number) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[i] !== "") {
        newOtp[i] = "";
        setOtp(newOtp);
      } else if (i > 0) {
        newOtp[i - 1] = "";
        setOtp(newOtp);
        otpRefs.current[i - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      otpRefs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < 5) {
      e.preventDefault();
      otpRefs.current[i + 1]?.focus();
    }
  }

  function handleOtpChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    if (!char) return;
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
    if (index < 5) setTimeout(() => otpRefs.current[index + 1]?.focus(), 0);
    if (newOtp.filter((d) => d !== "").length === 6) handleVerifyEmail(newOtp.join(""));
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiPost("/api/auth/user/login", loginData);
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t("login_error"));
    } finally {
      setLoading(false);
    }
  }

  function handleRegisterNext(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const nameRegex = /^[؀-ۿa-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(registerData.firstName.trim())) return setError(t("first_name_invalid"));
    if (!nameRegex.test(registerData.lastName.trim())) return setError(t("last_name_invalid"));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email.trim())) return setError(t("email_invalid"));

    const digits = localPhone.replace(/\D/g, "");
    if (digits.length < selectedCountry.min || digits.length > selectedCountry.max) {
      setPhoneError(
        `Phone must be ${
          selectedCountry.min === selectedCountry.max ? selectedCountry.min : `${selectedCountry.min}–${selectedCountry.max}`
        } digits for ${selectedCountry.name}`
      );
      return;
    }

    switchView("register-password");
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(registerData.password)) return setError(t("password_weak"));
    if (registerData.password !== registerData.passwordConfirmation) return setError(t("passwords_not_match"));

    setLoading(true);
    setError(null);
    try {
      await apiPost("/api/auth/user/register", registerData);
      switchView("verify");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t("unexpected_error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiPost("/api/auth/user/forgot-password", { email: forgotEmail });
      setSuccessMessage(t("otp_sent"));
      switchView("otp-verify");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t("otp_send_error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (resetPasswordFields.password !== resetPasswordFields.passwordConfirmation) return setError(t("passwords_not_match"));

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await apiPost("/api/auth/user/reset-password", { resetToken, password: resetPasswordFields.password });
      setSuccessMessage(t("password_changed_success"));
      setTimeout(() => switchView("login"), 2000);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t("password_change_error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    const email = view === "otp-verify" ? forgotEmail : registerData.email;
    try {
      await apiPost("/api/auth/user/resend-code", { email });
      setSuccessMessage(t("otp_resent_success"));
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t("otp_resend_error"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const titles: Record<View, string> = {
      login: "Login",
      register: "Register",
      "register-password": "Register - Password",
      "forgot-password": "Forgot Password",
      "otp-verify": "Verify OTP",
      "reset-password": "Reset Password",
      verify: "Verify Email",
    };
    document.title = `Bedouin Trails | ${titles[view]}`;
  }, [view]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 4000);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  return (
    <div className={styles["auth-page-wrapper"]}>
      <div className={styles["auth-container"]}>
        <div className={styles["auth-container__form-side"]} dir={dir}>
          <div className={styles["brand-header"]}>
            <img src="/img/logo.png" alt="Logo" className={styles.logo} />
          </div>

          <div className={styles["form-content"]}>
            {error && <div className={styles["error-message-overlay"]}>{error}</div>}
            {successMessage && <div className={styles["success-message-overlay"]}>{successMessage}</div>}

            {view === "login" && (
              <form onSubmit={handleLogin}>
                <h1>{t("login_title")} 👋</h1>
                <p>{t("login_welcome")}</p>
                <div className={styles["input-group"]}>
                  <div className={styles["input-icon-wrapper"]}>
                    <FaEnvelope size={18} className={`${styles["input-icon"]} ${styles["input-icon--start"]}`} />
                    <input
                      type="email"
                      required
                      placeholder={t("email")}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles["input-group"]}>
                  <PasswordInput
                    placeholder={t("password")}
                    value={loginData.password}
                    isVisible={!!showPassword.login}
                    toggleVisible={() => togglePassword("login")}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                </div>
                <div className={styles["input-group__label-row"]}>
                  <span className={styles["forgot-link"]} onClick={() => switchView("forgot-password")}>
                    {t("forgot_password")}
                  </span>
                </div>
                <p className={styles["switch-view"]}>
                  {t("dont_have_account")} <span onClick={() => switchView("register")}>{t("create_account")}</span>
                </p>
                <button type="submit" className={styles["submit-btn"]} disabled={loading}>
                  {loading ? t("loading") : t("login")}
                </button>
              </form>
            )}

            {view === "register" && (
              <form onSubmit={handleRegisterNext}>
                <h1>{t("register_title")}</h1>
                <p>{t("register_desc")}</p>
                <div dir={dir} className={styles["input-group-row"]}>
                  <div className={styles["input-group"]}>
                    <input
                      type="text"
                      required
                      placeholder={t("first_name")}
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                    />
                  </div>
                  <div className={styles["input-group"]}>
                    <input
                      type="text"
                      required
                      placeholder={t("last_name")}
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles["input-group"]}>
                  <div className={styles["input-icon-wrapper"]}>
                    <FaEnvelope size={18} className={`${styles["input-icon"]} ${styles["input-icon--start"]}`} />
                    <input
                      type="email"
                      required
                      placeholder={t("email")}
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles["input-group"]}>
                  <PhoneInput
                    value={localPhone}
                    onChange={handlePhoneChange}
                    onCountryChange={handleCountryChange}
                    selectedCountry={selectedCountry}
                    placeholder={`${selectedCountry.min}–${selectedCountry.max} digits`}
                    error={phoneError}
                  />
                </div>

                <p className={styles["switch-view"]}>
                  {t("already_have_account")} <span onClick={() => switchView("login")}>{t("login")}</span>
                </p>
                <button type="submit" className={styles["submit-btn"]}>
                  {t("next")}
                </button>
              </form>
            )}

            {view === "register-password" && (
              <form onSubmit={handleRegister}>
                <h1>{t("register_title")}</h1>
                <p>{t("password_min")}</p>
                <div className={styles["input-group"]}>
                  <PasswordInput
                    placeholder={t("password_min")}
                    value={registerData.password}
                    isVisible={!!showPassword.reg}
                    toggleVisible={() => togglePassword("reg")}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  />
                </div>
                <div className={styles["input-group"]}>
                  <PasswordInput
                    placeholder={t("confirm_password")}
                    value={registerData.passwordConfirmation}
                    isVisible={!!showPassword.regConfirm}
                    toggleVisible={() => togglePassword("regConfirm")}
                    onChange={(e) => setRegisterData({ ...registerData, passwordConfirmation: e.target.value })}
                  />
                </div>
                <button type="submit" className={styles["submit-btn"]} disabled={loading}>
                  {loading ? t("loading") : t("register")}
                </button>
              </form>
            )}

            {(view === "otp-verify" || view === "verify") && (
              <div className={styles["verify-view"]}>
                <h1>{view === "verify" ? t("verify_title") : t("reset_otp_title")}</h1>
                <p>{t("verify_desc")}</p>
                <OtpGrid
                  otp={otp}
                  otpRefs={otpRefs}
                  onChange={handleOtpChange}
                  onKeyDown={handleOtpKeyDown}
                  onPaste={handleOtpPaste}
                  disabled={loading}
                />
                <button
                  className={styles["submit-btn"]}
                  onClick={() => handleVerifyEmail(otp.join(""))}
                  disabled={loading || otp.some((d) => d === "")}
                >
                  {loading ? t("loading_verifying") : t("next")}
                </button>
                <p className={styles["switch-view"]}>
                  {t("didnt_receive_code")} <span onClick={handleResendOtp}>{t("resend")}</span>
                </p>
              </div>
            )}

            {view === "reset-password" && (
              <form onSubmit={handleResetPassword}>
                <h1>{t("enter_new_password_title")}</h1>
                <p>{t("enter_new_password_desc")}</p>
                <div className={styles["input-group"]}>
                  <PasswordInput
                    placeholder={t("new_password_label")}
                    isVisible={!!showPassword.newPass}
                    toggleVisible={() => togglePassword("newPass")}
                    value={resetPasswordFields.password}
                    onChange={(e) => setResetPasswordFields({ ...resetPasswordFields, password: e.target.value })}
                  />
                </div>
                <div className={styles["input-group"]}>
                  <PasswordInput
                    placeholder={t("confirm_password")}
                    isVisible={!!showPassword.confPass}
                    toggleVisible={() => togglePassword("confPass")}
                    value={resetPasswordFields.passwordConfirmation}
                    onChange={(e) => setResetPasswordFields({ ...resetPasswordFields, passwordConfirmation: e.target.value })}
                  />
                </div>
                <button type="submit" className={styles["submit-btn"]} disabled={loading}>
                  {loading ? t("loading_updating") : t("save")}
                </button>
              </form>
            )}

            {view === "forgot-password" && (
              <form onSubmit={handleForgotPassword}>
                <h1>{t("forgot_password_title")}</h1>
                <p>{t("forgot_password_desc")}</p>
                <div className={styles["input-group"]}>
                  <div className={styles["input-icon-wrapper"]}>
                    <FaEnvelope size={18} className={`${styles["input-icon"]} ${styles["input-icon--start"]}`} />
                    <input type="email" required placeholder={t("email")} value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className={styles["submit-btn"]} disabled={loading}>
                  {loading ? t("loading_sending") : t("next")}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className={styles["auth-container__image-side"]} style={{ backgroundImage: `url(${IMAGE_MAP[view]})` }}>
          <div className={styles["corner-curve-wrapper"]}>
            <div className={`${styles["corner-curve"]} ${styles["corner-curve--top-left"]}`}></div>
            <LanguageSwitcher />
          </div>
          {view !== "login" && (
            <button className={styles["back-button"]} onClick={handleBack}>
              <FaChevronLeft />
            </button>
          )}
          <div className={`${styles["corner-curve"]} ${styles["corner-curve--bottom-right"]}`}></div>
          <div className={styles["glass-card"]}>
            <p>{["register", "register-password", "verify"].includes(view) ? t("glass_register") : t("glass_login")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
