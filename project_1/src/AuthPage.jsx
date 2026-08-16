import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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


const CAPTCHA_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function generateCaptcha(length = 5) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
  }
  return out;
}


const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v) => /^09\d{9}$/.test(v);


const FAKE_USERNAME = "test";
const FAKE_PASSWORD = "123456";

export default function AuthPage() {
  const [mode, setMode] = useState("signup"); // 'signup' | 'login'
  const [justRegistered, setJustRegistered] = useState(false);

  return (
    <div dir="ltr" className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-topbar">
          <Link to="/" className="back-btn">
            <ArrowRight size={16} />
            Back to shop
          </Link>
          <span className="auth-topbar-brand">SHOP</span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">
            {mode === "signup" ? "Create account" : "Sign in"}
          </h1>
          <p className="auth-subtitle">
            {mode === "signup"
              ? "A few simple steps to start shopping"
              : "Welcome back, enter your details"}
          </p>
        </div>

        <div className="auth-card">
          
          <div className="auth-tabs">
            <button
              onClick={() => setMode("signup")}
              className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            >
              Sign up
            </button>
            <button
              onClick={() => setMode("login")}
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
            >
              Sign in
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

  const isFormEmpty =
    !form.firstName.trim() &&
    !form.lastName.trim() &&
    !form.email.trim() &&
    !form.phone.trim();

  function validateForm() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Please enter your first name";
    if (!form.lastName.trim()) e.lastName = "Please enter your last name";
    if (!isEmail(form.email)) e.email = "Invalid email address";
    if (!isPhone(form.phone)) e.phone = "Invalid phone number (example: 0912xxxxxxx)";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match";
    if (form.captchaInput.trim().toUpperCase() !== captcha) e.captcha = "Security code is incorrect";
    if (!form.acceptPrivacy) e.acceptPrivacy = "You must accept the privacy policy to continue";
    return e;
  }

  async function handleContinue() {

    if (isFormEmpty) {
      setErrors({});
      setGeneralError("The form is empty");
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

    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    setStep("otp");
  }

  async function handleVerified() {
    setSubmitting(true);

    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);

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
        placeholder="First name"
        value={form.firstName}
        onChange={set("firstName")}
        error={errors.firstName}
      />
      <TextField
        icon={<User size={18} />}
        placeholder="Last name"
        value={form.lastName}
        onChange={set("lastName")}
        error={errors.lastName}
      />
      <TextField
        icon={<Mail size={18} />}
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={set("email")}
        error={errors.email}
      />
      <TextField
        icon={<Phone size={18} />}
        placeholder="Phone number (09xxxxxxxxx)"
        value={form.phone}
        onChange={set("phone")}
        error={errors.phone}
      />
      <PasswordField
        placeholder="Password"
        value={form.password}
        onChange={set("password")}
        error={errors.password}
      />
      <PasswordField
        placeholder="Confirm password"
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
            Privacy Policy
          </button>{" "}
          and agree to it
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
        {submitting ? "Sending..." : "Continue"}
      </button>

      {generalError && <p className="general-error">{generalError}</p>}

      {showPrivacy && <PrivacyModal onBack={() => setShowPrivacy(false)} />}
    </div>
  );
}

function OtpFullScreen({ phone, onBack, onVerified, submitting }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
 
  const [serverCode] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));

  async function handleVerify() {

    if (code.trim() !== serverCode) {
      setError("The code you entered is incorrect");
      return;
    }
    setError("");
    onVerified();
  }

  return (
    <div className="otp-overlay" dir="ltr">
      <div className="otp-box">
        <div className="otp-icon-circle">
          <Phone size={22} />
        </div>
        <h2 className="otp-title">Enter the verification code</h2>
        <p className="otp-subtitle">A 4-digit code was sent to {phone || "your phone"}</p>

        <p className="demo-code-note">Demo code: {serverCode}</p>

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
          {submitting ? "Checking..." : "Verify code"}
        </button>
        <button onClick={onBack} className="link-btn">
          <ArrowRight size={16} /> Back and edit details
        </button>
      </div>
    </div>
  );
}

function LoginFlow({ justRegistered }) {
  const [step, setStep] = useState("login"); // login | forgot-contact | forgot-otp | forgot-newpass | forgot-done
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    setSubmitting(true);
    setError("");
    setWrongPassword(false);

    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);

    const success = username === FAKE_USERNAME && password === FAKE_PASSWORD;
    if (!success) {
      setError("Username or password is incorrect");
      setWrongPassword(true);
      return;
    }
    navigate("/dashboard");
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
          Account created successfully, now sign in
        </div>
      )}
      <p className="demo-code-note">
        Demo account — username: {FAKE_USERNAME} / password: {FAKE_PASSWORD}
      </p>
      <TextField
        icon={<User size={18} />}
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <PasswordField
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="field-error center">{error}</p>}

      <button
        disabled={!username || !password || submitting}
        onClick={handleLogin}
        className="btn-primary"
      >
        {submitting ? "Signing in..." : "Sign in"}
      </button>

      {wrongPassword && (
        <button onClick={() => setStep("forgot-contact")} className="link-btn center">
          Change password
        </button>
      )}
    </div>
  );
}

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
      setError("Enter a valid email or phone number");
      return;
    }
    setError("");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    setStep("forgot-otp");
  }

  function verifyCode() {
    if (code.trim() !== serverCode) {
      setError("The code you entered is incorrect");
      return;
    }
    setError("");
    setStep("forgot-newpass");
  }

  async function submitNewPassword() {
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    setStep("forgot-done");
  }

  if (step === "forgot-done") {
    return (
      <div className="forgot-done">
        <CheckCircle2 className="forgot-done-icon" size={44} />
        <h3 className="forgot-done-title">Password changed successfully</h3>
        <button onClick={onFinished} className="btn-primary top-gap">
          Back to sign in
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
        <ArrowRight size={16} /> Back
      </button>

      {step === "forgot-contact" && (
        <>
          <p className="helper-text">Enter your email or phone number</p>
          <TextField
            icon={<Mail size={18} />}
            placeholder="Email or phone number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          {error && <p className="field-error">{error}</p>}
          <button
            disabled={!contact || submitting}
            onClick={sendCode}
            className="btn-primary"
          >
            {submitting ? "Sending..." : "Send code"}
          </button>
        </>
      )}

      {step === "forgot-otp" && (
        <>
          <p className="helper-text">Enter the code sent to {contact}</p>
          <p className="demo-code-note">Demo code: {serverCode}</p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            maxLength={4}
            className="otp-input"
            placeholder="----"
          />
          {error && <p className="field-error">{error}</p>}
          <button disabled={code.length !== 4} onClick={verifyCode} className="btn-primary">
            Verify code
          </button>
        </>
      )}

      {step === "forgot-newpass" && (
        <>
          <PasswordField
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <PasswordField
            placeholder="Confirm new password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          {error && <p className="field-error">{error}</p>}
          <button
            disabled={!newPassword || !confirmNewPassword || submitting}
            onClick={submitNewPassword}
            className="btn-primary"
          >
            {submitting ? "Saving..." : "Save new password"}
          </button>
        </>
      )}
    </div>
  );
}

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
        <button type="button" onClick={onRefresh} className="captcha-refresh" title="New code">
          <RefreshCw size={18} />
        </button>
      </div>
      <div className="top-gap-sm">
        <TextField
          icon={<ShieldCheck size={18} />}
          placeholder="Enter the security code"
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
    <div className="modal-overlay" dir="ltr">
      <div className="modal-panel">
        <div className="modal-header">
          <h3>Privacy Policy</h3>
          <button onClick={onBack} className="modal-close">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <p>
            Your personal information, including name, email, and phone number, is used only to create and manage
            your account, process orders, and notify you about your order status.
          </p>
          <p>
            Your password is stored encrypted, and no one, including our
            staff, has direct access to it.
          </p>
          <p>
            Your information is not shared with third parties without your consent, except where
            required by law.
          </p>
        </div>
        <div className="modal-footer">
          <button onClick={onBack} className="btn-primary">
            <ArrowRight size={18} /> Back
          </button>
        </div>
      </div>
    </div>
  );
}
