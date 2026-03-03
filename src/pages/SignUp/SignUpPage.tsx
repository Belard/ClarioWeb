/**
 * SignUpPage — name + email + password registration form with i18n support
 *              and strong password validation.
 */
import { useState, type CSSProperties, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layout/AuthLayout/AuthLayout';
import { Icon } from '@/components/ui/Icon/Icon';
import { typography } from '@/theme/typography';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

// ── Password validation rules ────────────────────────────────────────────────

interface PasswordRule {
  key: string;
  test: (pw: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { key: 'auth.validation.passwordMinLength', test: (pw) => pw.length >= 8 },
  { key: 'auth.validation.passwordUppercase', test: (pw) => /[A-Z]/.test(pw) },
  { key: 'auth.validation.passwordLowercase', test: (pw) => /[a-z]/.test(pw) },
  { key: 'auth.validation.passwordNumber', test: (pw) => /\d/.test(pw) },
  { key: 'auth.validation.passwordSpecial', test: (pw) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pw) },
];

// ── Component ────────────────────────────────────────────────────────────────

export function SignUpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string[];
    terms?: string;
  }>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  function validate(): boolean {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = t('auth.validation.required');
    }

    if (!email.trim()) {
      newErrors.email = t('auth.validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('auth.validation.invalidEmail');
    }

    // Password — check each rule
    const failedRules = PASSWORD_RULES.filter((rule) => !rule.test(password));
    if (!password) {
      newErrors.password = [t('auth.validation.required')];
    } else if (failedRules.length > 0) {
      newErrors.password = failedRules.map((r) => t(r.key));
    }

    if (!agreeTerms) {
      newErrors.terms = t('auth.validation.mustAgreeTerms');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError('');
    try {
      await signup(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : t('auth.signup.genericError'));
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <h1 style={styles.title}>{t('auth.signup.title')}</h1>
      <p style={styles.subtitle}>{t('auth.signup.subtitle')}</p>

      {serverError && <div style={styles.serverError}>{serverError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="name">
            {t('auth.signup.nameLabel')}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              ...styles.input,
              ...(submitted && errors.name ? styles.inputError : {}),
            }}
          />
          {submitted && errors.name && <span style={styles.errorText}>{errors.name}</span>}
        </div>

        {/* Email */}
        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="email">
            {t('auth.signup.emailLabel')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              ...styles.input,
              ...(submitted && errors.email ? styles.inputError : {}),
            }}
          />
          {submitted && errors.email && <span style={styles.errorText}>{errors.email}</span>}
        </div>

        {/* Password */}
        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="password">
            {t('auth.signup.passwordLabel')}
          </label>
          <div style={styles.passwordWrapper}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                ...styles.input,
                ...styles.passwordInput,
                ...(submitted && errors.password ? styles.inputError : {}),
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={styles.toggleBtn}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon
                name={showPassword ? 'visibilityOff' : 'visibility'}
                size={20}
                color={colors.neutral[80]}
              />
            </button>
          </div>
          {submitted && errors.password && (
            <div style={styles.errorList}>
              {errors.password.map((msg) => (
                <span key={msg} style={styles.errorText}>{msg}</span>
              ))}
            </div>
          )}
        </div>

        {/* Terms checkbox */}
        <div style={styles.checkboxRow}>
          <input
            id="agreeTerms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            style={styles.checkbox}
          />
          <label htmlFor="agreeTerms" style={styles.checkboxLabel}>
            {t('auth.signup.agreeTerms')}
          </label>
        </div>
        {submitted && errors.terms && <span style={styles.errorTextTerms}>{errors.terms}</span>}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...styles.submitBtn,
            ...(isSubmitting ? styles.submitBtnDisabled : {}),
          }}
        >
          {isSubmitting ? '...' : t('auth.signup.submitButton')}
        </button>
      </form>

      {/* Login link */}
      <p style={styles.bottomText}>
        {t('auth.signup.alreadyMember')}{' '}
        <Link to="/login" style={styles.bottomLink}>
          {t('auth.signup.loginLink')}
        </Link>
      </p>
    </AuthLayout>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, CSSProperties> = {
  title: {
    ...typography.typeStyles.headingXLSemiBold,
    fontFamily: typography.fontFamily.generalSans.join(', '),
    color: colors.black,
    margin: 0,
    marginBottom: spacing[2],
  },
  subtitle: {
    ...typography.typeStyles.bodyM,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.neutral[80],
    margin: 0,
    marginBottom: spacing[8],
  },
  fieldGroup: {
    marginBottom: spacing[5],
  },
  label: {
    display: 'block',
    ...typography.typeStyles.bodySSemiBold,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.black,
    marginBottom: spacing[1.5],
  },
  input: {
    width: '100%',
    padding: `${spacing[3]} ${spacing[3]}`,
    ...typography.typeStyles.bodyM,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.black,
    backgroundColor: colors.white,
    border: `1px solid ${colors.neutral[70]}`,
    borderRadius: '4px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  },
  inputError: {
    borderColor: colors.error.default,
  },
  passwordWrapper: {
    position: 'relative' as const,
  },
  passwordInput: {
    paddingRight: spacing[10],
  },
  toggleBtn: {
    position: 'absolute' as const,
    right: spacing[3],
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    display: 'block',
    ...typography.typeStyles.bodyS,
    color: colors.error.default,
    marginTop: spacing[1],
  },
  errorList: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  errorTextTerms: {
    display: 'block',
    ...typography.typeStyles.bodyS,
    color: colors.error.default,
    marginTop: `-${spacing[2]}`,
    marginBottom: spacing[3],
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing[2],
    marginBottom: spacing[5],
  },
  checkbox: {
    width: '18px',
    height: '18px',
    margin: 0,
    marginTop: '2px',
    cursor: 'pointer',
    accentColor: colors.black,
    flexShrink: 0,
  },
  checkboxLabel: {
    ...typography.typeStyles.bodyS,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.black,
    cursor: 'pointer',
  },
  submitBtn: {
    width: '100%',
    padding: `${spacing[3.5]} 0`,
    ...typography.typeStyles.bodySSemiBold,
    fontFamily: typography.fontFamily.inter.join(', '),
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: colors.white,
    backgroundColor: colors.black,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  bottomText: {
    ...typography.typeStyles.bodyS,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.neutral[80],
    marginTop: spacing[6],
    textAlign: 'center' as const,
  },
  bottomLink: {
    color: colors.neutral[90],
    fontWeight: typography.fontWeight.semibold,
    textDecoration: 'none',
  },
  serverError: {
    ...typography.typeStyles.bodyS,
    color: colors.error.default,
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    border: `1px solid ${colors.error.default}`,
    borderRadius: '4px',
    padding: `${spacing[2.5]} ${spacing[3]}`,
    marginBottom: spacing[4],
    textAlign: 'center' as const,
  } as CSSProperties,
};
