import { theme } from '@/theme';
import './App.css';

const { colors, typography, spacing, shadows, borderRadius } = theme;

function App() {
  return (
    <div style={{ fontFamily: typography.fontFamily.sans.join(', '), padding: spacing[8] }}>
      <h1
        style={{
          fontSize: typography.fontSize['4xl'],
          fontWeight: typography.fontWeight.bold,
          color: colors.primary[600],
          marginBottom: spacing[2],
        }}
      >
        ClarioWeb
      </h1>
      <p
        style={{
          fontSize: typography.fontSize.lg,
          color: colors.neutral[500],
          marginBottom: spacing[8],
        }}
      >
        React + TypeScript + Vite backbone — design tokens loaded ✓
      </p>

      {/* Color palette preview */}
      <section style={{ marginBottom: spacing[8] }}>
        <h2 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[4] }}>
          Color Tokens
        </h2>
        <div style={{ display: 'flex', gap: spacing[3], flexWrap: 'wrap' }}>
          {(['primary', 'secondary', 'neutral'] as const).map((palette) =>
            ([500, 600, 700] as const).map((shade) => (
              <div
                key={`${palette}-${shade}`}
                style={{
                  width: '5rem',
                  height: '5rem',
                  borderRadius: borderRadius.lg,
                  background: colors[palette][shade],
                  boxShadow: shadows.md,
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: spacing[1],
                }}
              >
                <span style={{ fontSize: typography.fontSize.xs, color: colors.white }}>
                  {palette}.{shade}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Typography preview */}
      <section style={{ marginBottom: spacing[8] }}>
        <h2 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[4] }}>
          Typography Tokens
        </h2>
        {(
          [
            ['xs', '12px'],
            ['sm', '14px'],
            ['base', '16px'],
            ['lg', '18px'],
            ['xl', '20px'],
            ['2xl', '24px'],
            ['3xl', '30px'],
            ['4xl', '36px'],
          ] as const
        ).map(([name, px]) => (
          <p
            key={name}
            style={{
              fontSize: typography.fontSize[name],
              color: colors.neutral[700],
              margin: `${spacing[1]} 0`,
            }}
          >
            fontSize.{name} — {px}
          </p>
        ))}
      </section>

      {/* Semantic colors preview */}
      <section>
        <h2 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[4] }}>
          Semantic Colors
        </h2>
        <div style={{ display: 'flex', gap: spacing[3], flexWrap: 'wrap' }}>
          {(['success', 'warning', 'error', 'info'] as const).map((key) => (
            <div
              key={key}
              style={{
                padding: `${spacing[3]} ${spacing[5]}`,
                borderRadius: borderRadius.md,
                background: colors[key].light,
                border: `2px solid ${colors[key].default}`,
                color: colors[key].dark,
                fontWeight: typography.fontWeight.medium,
                boxShadow: shadows.sm,
              }}
            >
              {key}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
