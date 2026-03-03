/**
 * LoginPage — email + password login form with i18n support.
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

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState('');

  function validate(): boolean {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = t('auth.validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('auth.validation.invalidEmail');
    }

    if (!password) {
      newErrors.password = t('auth.validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError('');
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : t('auth.login.genericError'));
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <h1 style={styles.title}>{t('auth.login.title')}</h1>
      <p style={styles.subtitle}>{t('auth.login.subtitle')}</p>

      {serverError && <div style={styles.serverError}>{serverError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="email">
            {t('auth.login.emailLabel')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              ...styles.input,
              ...(errors.email ? styles.inputError : {}),
            }}
          />
          {errors.email && <span style={styles.errorText}>{errors.email}</span>}
        </div>

        {/* Password */}
        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="password">
            {t('auth.login.passwordLabel')}
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
                ...(errors.password ? styles.inputError : {}),
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
          {errors.password && <span style={styles.errorText}>{errors.password}</span>}
        </div>

        {/* Keep me logged in */}
        <div style={styles.checkboxRow}>
          <input
            id="keepLoggedIn"
            type="checkbox"
            checked={keepLoggedIn}
            onChange={(e) => setKeepLoggedIn(e.target.checked)}
            style={styles.checkbox}
          />
          <label htmlFor="keepLoggedIn" style={styles.checkboxLabel}>
            {t('auth.login.keepLoggedIn')}
          </label>
        </div>

        {/* Forgot password */}
        <div style={styles.forgotRow}>
          <span style={styles.forgotLink}>
            {t('auth.login.forgotPassword')}
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...styles.submitBtn,
            ...(isSubmitting ? styles.submitBtnDisabled : {}),
          }}
        >
          {isSubmitting ? '...' : t('auth.login.submitButton')}
        </button>
      </form>

      {/* Sign up link */}
      <p style={styles.bottomText}>
        {t('auth.login.noAccount')}{' '}
        <Link to="/signup" style={styles.bottomLink}>
          {t('auth.login.signUpLink')}
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
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  checkbox: {
    width: '18px',
    height: '18px',
    margin: 0,
    cursor: 'pointer',
    accentColor: colors.black,
  },
  checkboxLabel: {
    ...typography.typeStyles.bodyS,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.black,
    cursor: 'pointer',
  },
  forgotRow: {
    marginBottom: spacing[6],
  },
  forgotLink: {
    ...typography.typeStyles.bodyS,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.neutral[80],
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
