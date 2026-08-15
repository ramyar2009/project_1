import React, { useState, useCallback } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  X,
  CheckCircle2,
} from "lucide-react";
import "./AuthPage.css";

/**
 * ============================================================================
 * AuthPage — Signup / Login component
 * ============================================================================
 * این کامپوننت مستقل است (نه در صفحه اصلی رندر می‌شود) و باید از طریق یک
 * دکمه در هدر و یک روت جدا (مثلاً /auth) با react-router-dom بارگذاری شود:
 *
 *   <Route path="/auth" element={<AuthPage />} />
 *
 * تمام تماس‌های شبکه‌ای اینجا mock هستند و با کامنت "TODO: API" مشخص شده‌اند.
 * فقط کافیست fetch/axios واقعی خودتان را جایگزین کنید.
 * ============================================================================
 */

// ---------- کمکی: تولید کد امنیتی (کپچا) ----------
const CAPTCHA_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function generateCaptcha(length = 5) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
  }
  return out;
}

// ---------- کمکی: اعتبارسنجی ساده ----------
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v) => /^09\d{9}$/.test(v);

export default function AuthPage() {
  const [mode, setMode] = useState("signup"); // 'signup' | 'login'
  const [justRegistered, setJustRegistered] = useState(false);

  return (
    <div dir="rtl" className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-header">
          <p className="auth-eyebrow">فروشگاه</p>
          <h1 className="auth-title">
            {mode === "signup" ? "ایجاد حساب" : "ورود به حساب"}
          </h1>
          <p className="auth-subtitle">
            {mode === "signup"
              ? "چند قدم ساده تا شروع خرید"
              : "خوش برگشتی، اطلاعات خود را وارد کنید"}
          </p>
        </div>

        <div className="auth-card">
          {/* تب‌های جابجایی بین ثبت‌نام و ورود */}
          <div className="auth-tabs">
            <button
              onClick={() => setMode("signup")}
              className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            >
              ثبت‌نام
            </button>
            <button
              onClick={() => setMode("login")}
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
            >
              ورود
            </button>
          </div>

          {mode === "signup" ? (
            <SignupFlow
              onSuccess={() => {
                setJustRegistered(true);
                setMode("login");
              }}
            />
          ) : (
            <LoginFlow justRegistered={justRegistered} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * فلوی ثبت‌نام: فرم -> تایید پیامکی -> اتمام
 * ========================================================================== */
function SignupFlow({ onSuccess }) {
  const [step, setStep] = useState("form"); // 'form' | 'otp'
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    captchaInput: "",
    acceptPrivacy: false,
  });
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const refreshCaptcha = useCallback(() => setCaptcha(generateCaptcha()), []);

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  // آیا هیچ‌کدام از فیلدهای اصلی پر نشده‌اند؟ (برای پیام کلی «فرم خالی است»)
  const isFormEmpty =
    !form.firstName.trim() &&
    !form.lastName.trim() &&
    !form.email.trim() &&
    !form.phone.trim();

  function validateForm() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "نام را وارد کنید";
    if (!form.lastName.trim()) e.lastName = "نام خانوادگی را وارد کنید";
    if (!isEmail(form.email)) e.email = "ایمیل معتبر نیست";
    if (!isPhone(form.phone)) e.phone = "شماره موبایل معتبر نیست (مثال: 0912xxxxxxx)";
    if (form.password.length < 8) e.password = "رمز عبور باید حداقل ۸ کاراکتر باشد";
    if (form.confirmPassword !== form.password) e.confirmPassword = "رمز عبور و تکرار آن یکسان نیستند";
    if (form.captchaInput.trim().toUpperCase() !== captcha) e.captcha = "کد امنیتی درست نیست";
    if (!form.acceptPrivacy) e.acceptPrivacy = "برای ادامه باید حریم خصوصی را تایید کنید";
    return e;
  }

  async function handleContinue() {
    // اگر کاربر هیچ‌چیز وارد نکرده، فقط یک پیام کلی در پایین فرم نشان بده
    if (isFormEmpty) {
      setErrors({});
      setGeneralError("فرم خالی است");
      return;
    }

    const v = validateForm();
    setErrors(v);
    if (Object.keys(v).length > 0) {
      setGeneralError("");
      if (v.captcha) refreshCaptcha();
      return;
    }
    setGeneralError("");
    setSubmitting(true);
    // TODO: API - درخواست ارسال کد تایید به شماره موبایل کاربر
    // await fetch('/api/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone: form.phone }) })
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    setStep("otp");
  }

  async function handleVerified() {
    setSubmitting(true);
    // TODO: API - ارسال نهایی اطلاعات ثبت‌نام پس از تایید موبایل
    // await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(form) })
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    // ثبت‌نام کامل شد؛ کاربر به تب ورود منتقل می‌شود تا خودش نام کاربری/رمز را وارد کند
    onSuccess();
  }

  if (step === "otp") {
    return (
      <OtpFullScreen
        phone={form.phone}
        onBack={() => setStep("form")}
        onVerified={handleVerified}
        submitting={submitting}
      />
    );
  }

  return (
    <div className="auth-form">
      <TextField
        icon={<User size={18} />}
        placeholder="نام"
        value={form.firstName}
        onChange={set("firstName")}
        error={errors.firstName}
      />
      <TextField
        icon={<User size={18} />}
        placeholder="نام خانوادگی"
        value={form.lastName}
        onChange={set("lastName")}
        error={errors.lastName}
      />
      <TextField
        icon={<Mail size={18} />}
        placeholder="ایمیل"
        type="email"
        value={form.email}
        onChange={set("email")}
        error={errors.email}
      />
      <TextField
        icon={<Phone size={18} />}
        placeholder="شماره موبایل (09xxxxxxxxx)"
        value={form.phone}
        onChange={set("phone")}
        error={errors.phone}
      />
      <PasswordField
        placeholder="رمز عبور"
        value={form.password}
        onChange={set("password")}
        error={errors.password}
      />
      <PasswordField
        placeholder="تکرار رمز عبور"
        value={form.confirmPassword}
        onChange={set("confirmPassword")}
        error={errors.confirmPassword}
      />

      <CaptchaField
        captcha={captcha}
        value={form.captchaInput}
        onChange={set("captchaInput")}
        onRefresh={refreshCaptcha}
        error={errors.captcha}
      />

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.acceptPrivacy}
          onChange={set("acceptPrivacy")}
        />
        <span>
          <button
            type="button"
            onClick={() => setShowPrivacy(true)}
            className="privacy-link"
          >
            حریم خصوصی
          </button>{" "}
          را مطالعه کردم و می‌پذیرم
        </span>
      </label>
      {errors.acceptPrivacy && (
        <p className="field-error no-top-margin">{errors.acceptPrivacy}</p>
      )}

      <button
        disabled={submitting}
        onClick={handleContinue}
        className="btn-primary"
      >
        {submitting ? "در حال ارسال..." : "ادامه"}
      </button>

      {generalError && <p className="general-error">{generalError}</p>}

      {showPrivacy && <PrivacyModal onBack={() => setShowPrivacy(false)} />}
    </div>
  );
}

/* ---------- صفحه/دیو تمام‌صفحه تایید کد پیامکی ---------- */
function OtpFullScreen({ phone, onBack, onVerified, submitting }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  // در دنیای واقعی کد صحیح روی سرور است؛ اینجا فقط برای دمو شبیه‌سازی شده
  const [serverCode] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));

  async function handleVerify() {
    // TODO: API - بررسی کد پیامکی وارد شده در سمت سرور
    // const res = await fetch('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, code }) })
    if (code.trim() !== serverCode) {
      setError("کد وارد شده صحیح نیست");
      return;
    }
    setError("");
    onVerified();
  }

  return (
    <div className="otp-overlay" dir="rtl">
      <div className="otp-box">
        <div className="otp-icon-circle">
          <Phone size={22} />
        </div>
        <h2 className="otp-title">کد تایید را وارد کنید</h2>
        <p className="otp-subtitle">کد ۴ رقمی به شماره {phone || "شما"} پیامک شد</p>

        {/* فقط برای دمو نمایش داده می‌شود؛ در نسخه واقعی حذف کنید */}
        <p className="demo-code-note">کد آزمایشی: {serverCode}</p>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          maxLength={4}
          className={`otp-input ${error ? "error" : ""}`}
          placeholder="----"
        />
        {error && <p className="field-error center">{error}</p>}

        <button
          disabled={code.length !== 4 || submitting}
          onClick={handleVerify}
          className="btn-primary"
        >
          {submitting ? "در حال بررسی..." : "تایید کد"}
        </button>
        <button onClick={onBack} className="link-btn">
          <ArrowRight size={16} /> بازگشت و ویرایش اطلاعات
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
 * فلوی ورود: فرم ورود -> (در صورت نیاز) فراموشی رمز عبور
 * ========================================================================== */
function LoginFlow({ justRegistered }) {
  const [step, setStep] = useState("login"); // login | forgot-contact | forgot-otp | forgot-newpass | forgot-done
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    setSubmitting(true);
    setError("");
    setWrongPassword(false);
    // TODO: API - بررسی نام کاربری و رمز عبور
    // const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) })
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);

    // --- دمو: هر مقدار غیرخالی را نادرست در نظر می‌گیریم تا رفتار خطا دیده شود
    const success = false; // این مقدار را با نتیجه واقعی API جایگزین کنید
    if (!success) {
      setError("نام کاربری یا رمز عبور اشتباه است");
      setWrongPassword(true);
    }
    // در صورت موفقیت: هدایت به کامپوننت/صفحه دوم (پنل کاربری)
    // navigate('/dashboard')
  }

  if (step === "forgot-contact" || step === "forgot-otp" || step === "forgot-newpass" || step === "forgot-done") {
    return (
      <ForgotPasswordFlow
        step={step}
        setStep={setStep}
        onFinished={() => setStep("login")}
      />
    );
  }

  return (
    <div className="auth-form">
      {justRegistered && (
        <div className="success-note">
          <CheckCircle2 size={16} />
          ثبت‌نام با موفقیت انجام شد، حالا وارد شوید
        </div>
      )}
      <TextField
        icon={<User size={18} />}
        placeholder="نام کاربری"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <PasswordField
        placeholder="رمز عبور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="field-error center">{error}</p>}

      <button
        disabled={!username || !password || submitting}
        onClick={handleLogin}
        className="btn-primary"
      >
        {submitting ? "در حال ورود..." : "ورود"}
      </button>

      {wrongPassword && (
        <button onClick={() => setStep("forgot-contact")} className="link-btn center">
          تغییر رمز عبور
        </button>
      )}
    </div>
  );
}

/* ---------- فراموشی / تغییر رمز عبور ---------- */
function ForgotPasswordFlow({ step, setStep, onFinished }) {
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverCode] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));

  async function sendCode() {
    if (!isEmail(contact) && !isPhone(contact)) {
      setError("ایمیل یا شماره موبایل معتبر وارد کنید");
      return;
    }
    setError("");
    setSubmitting(true);
    // TODO: API - ارسال کد بازیابی به ایمیل یا موبایل وارد شده
    // await fetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ contact }) })
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    setStep("forgot-otp");
  }

  function verifyCode() {
    // TODO: API - بررسی کد بازیابی
    if (code.trim() !== serverCode) {
      setError("کد وارد شده صحیح نیست");
      return;
    }
    setError("");
    setStep("forgot-newpass");
  }

  async function submitNewPassword() {
    if (newPassword.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }
    setError("");
    setSubmitting(true);
    // TODO: API - جایگزینی رمز عبور قدیمی با رمز جدید
    // await fetch('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ contact, code, newPassword }) })
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    setStep("forgot-done");
  }

  if (step === "forgot-done") {
    return (
      <div className="forgot-done">
        <CheckCircle2 className="forgot-done-icon" size={44} />
        <h3 className="forgot-done-title">رمز عبور با موفقیت تغییر کرد</h3>
        <button onClick={onFinished} className="btn-primary top-gap">
          بازگشت به ورود
        </button>
      </div>
    );
  }

  return (
    <div className="auth-form">
      <button
        onClick={() => (step === "forgot-contact" ? onFinished() : setStep("forgot-contact"))}
        className="link-btn"
      >
        <ArrowRight size={16} /> بازگشت
      </button>

      {step === "forgot-contact" && (
        <>
          <p className="helper-text">ایمیل یا شماره موبایل خود را وارد کنید</p>
          <TextField
            icon={<Mail size={18} />}
            placeholder="ایمیل یا شماره موبایل"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          {error && <p className="field-error">{error}</p>}
          <button
            disabled={!contact || submitting}
            onClick={sendCode}
            className="btn-primary"
          >
            {submitting ? "در حال ارسال..." : "ارسال کد"}
          </button>
        </>
      )}

      {step === "forgot-otp" && (
        <>
          <p className="helper-text">کد ارسال‌شده به {contact} را وارد کنید</p>
          <p className="demo-code-note">کد آزمایشی: {serverCode}</p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            maxLength={4}
            className="otp-input"
            placeholder="----"
          />
          {error && <p className="field-error">{error}</p>}
          <button disabled={code.length !== 4} onClick={verifyCode} className="btn-primary">
            تایید کد
          </button>
        </>
      )}

      {step === "forgot-newpass" && (
        <>
          <PasswordField
            placeholder="رمز عبور جدید"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <PasswordField
            placeholder="تکرار رمز عبور جدید"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          {error && <p className="field-error">{error}</p>}
          <button
            disabled={!newPassword || !confirmNewPassword || submitting}
            onClick={submitNewPassword}
            className="btn-primary"
          >
            {submitting ? "در حال ذخیره..." : "ثبت رمز جدید"}
          </button>
        </>
      )}
    </div>
  );
}

/* ============================================================================
 * کامپوننت‌های کمکی UI
 * ========================================================================== */
function TextField({ icon, error, ...props }) {
  return (
    <div>
      <div className={`field-box ${error ? "error" : ""}`}>
        <span className="field-icon">{icon}</span>
        <input {...props} className="field-input" />
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function PasswordField({ error, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <div className={`field-box ${error ? "error" : ""}`}>
        <span className="field-icon">
          <Lock size={18} />
        </span>
        <input {...props} type={visible ? "text" : "password"} className="field-input" />
        <button type="button" onClick={() => setVisible((v) => !v)} className="field-icon-btn">
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function CaptchaField({ captcha, value, onChange, onRefresh, error }) {
  return (
    <div>
      <div className="captcha-row">
        <div className="captcha-box">
          {captcha.split("").map((ch, i) => (
            <span
              key={`${captcha}-${i}`}
              className="captcha-char"
              style={{
                "--tilt": `${(i % 2 === 0 ? -1 : 1) * (8 + i * 2)}deg`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>
        <button type="button" onClick={onRefresh} className="captcha-refresh" title="کد جدید">
          <RefreshCw size={18} />
        </button>
      </div>
      <div className="top-gap-sm">
        <TextField
          icon={<ShieldCheck size={18} />}
          placeholder="کد امنیتی را وارد کنید"
          value={value}
          onChange={onChange}
        />
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function PrivacyModal({ onBack }) {
  return (
    <div className="modal-overlay" dir="rtl">
      <div className="modal-panel">
        <div className="modal-header">
          <h3>حریم خصوصی</h3>
          <button onClick={onBack} className="modal-close">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <p>
            اطلاعات شخصی شما شامل نام، ایمیل و شماره موبایل تنها برای ایجاد و مدیریت
            حساب کاربری، پردازش سفارش‌ها و اطلاع‌رسانی درباره وضعیت خرید استفاده می‌شود.
          </p>
          <p>
            رمز عبور شما به‌صورت رمزنگاری‌شده ذخیره می‌شود و هیچ‌کس، از جمله کارکنان
            ما، به آن دسترسی مستقیم ندارد.
          </p>
          <p>
            اطلاعات شما بدون رضایت شما در اختیار اشخاص ثالث قرار نمی‌گیرد، مگر در
            مواردی که قانون الزام کند.
          </p>
        </div>
        <div className="modal-footer">
          <button onClick={onBack} className="btn-primary">
            <ArrowRight size={18} /> بازگشت
          </button>
        </div>
      </div>
    </div>
  );
}
