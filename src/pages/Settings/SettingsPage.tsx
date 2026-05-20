import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@/components/ui/Icon/Icon";
import { useAuth } from "@/hooks";
import { credentialsService, oauthService, settingsStorage } from "@/services";
import { colors, spacing, typography } from "@/theme";
import type {
  CredentialsStatusItem,
  CredentialsStatusResponse,
  OAuthPlatform,
  PostDefaults,
  PostType,
  PrivacyLevel,
  PublishPlatform,
} from "@/types";
import { formatDateTime } from "@/utils";

type PlatformState = {
  id: OAuthPlatform;
  connected: boolean;
  isExpired: boolean;
  expiresAt?: string;
};

const OAUTH_PLATFORMS: Array<{
  id: OAuthPlatform;
  labelKey: string;
  icon?: "facebook" | "instagram" | "youtube" | "tiktok";
}> = [
  {
    id: "facebook",
    labelKey: "settings.platforms.items.facebook",
    icon: "facebook",
  },
  {
    id: "instagram",
    labelKey: "settings.platforms.items.instagram",
    icon: "instagram",
  },
  { id: "tiktok", labelKey: "settings.platforms.items.tiktok", icon: "tiktok" },
  { id: "twitter", labelKey: "settings.platforms.items.twitter" },
  {
    id: "youtube",
    labelKey: "settings.platforms.items.youtube",
    icon: "youtube",
  },
];

const PUBLISH_PLATFORMS: Array<{ id: PublishPlatform; labelKey: string }> = [
  { id: "facebook", labelKey: "settings.platforms.items.facebook" },
  { id: "instagram", labelKey: "settings.platforms.items.instagram" },
  { id: "youtube", labelKey: "settings.platforms.items.youtube" },
  { id: "tiktok", labelKey: "settings.platforms.items.tiktok" },
];

const POST_TYPE_OPTIONS: PostType[] = ["normal", "short", "story"];
const PRIVACY_OPTIONS: PrivacyLevel[] = [
  "public",
  "followers",
  "friends",
  "private",
];

function normalizePlatformStatus(
  response: CredentialsStatusResponse,
): PlatformState[] {
  const platformsFromResponse = response.platforms ?? [];

  const connectedFromArray = new Set<string>([
    ...(response.connected_platforms ?? []),
    ...platformsFromResponse.filter(
      (item): item is string => typeof item === "string",
    ),
  ]);

  const statusItems: CredentialsStatusItem[] = [
    ...(response.credentials ?? []),
    ...platformsFromResponse.filter(
      (item): item is CredentialsStatusItem =>
        typeof item === "object" && item !== null && "platform" in item,
    ),
  ];

  const statusByPlatform = new Map<string, CredentialsStatusItem>();
  statusItems.forEach((item) => {
    statusByPlatform.set(item.platform, item);
  });

  return OAUTH_PLATFORMS.map((platform) => {
    const credentialStatus = statusByPlatform.get(platform.id);
    const expiresAt = credentialStatus?.expires_at;
    const isExpiredByDate =
      Boolean(expiresAt) && new Date(expiresAt as string).getTime() <= Date.now();
    const isExpired = Boolean(credentialStatus?.is_expired) || isExpiredByDate;
    const connected =
      Boolean(credentialStatus?.connected) || connectedFromArray.has(platform.id);

    return {
      id: platform.id,
      connected,
      isExpired,
      expiresAt,
    };
  });
}

export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  const [platforms, setPlatforms] = useState<PlatformState[]>(() =>
    OAUTH_PLATFORMS.map((platform) => ({
      id: platform.id,
      connected: false,
      isExpired: false,
    })),
  );
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(true);
  const [platformError, setPlatformError] = useState("");
  const [disconnectingPlatform, setDisconnectingPlatform] =
    useState<OAuthPlatform | null>(null);

  const [defaults, setDefaults] = useState<PostDefaults | null>(null);
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(true);
  const [isSavingDefaults, setIsSavingDefaults] = useState(false);
  const [defaultsMessage, setDefaultsMessage] = useState("");

  async function loadPlatforms() {
    setIsLoadingPlatforms(true);
    setPlatformError("");

    try {
      const response = await credentialsService.getConnectedPlatforms();
      setPlatforms(normalizePlatformStatus(response));
    } catch {
      setPlatformError(t("settings.platforms.loadError"));
    } finally {
      setIsLoadingPlatforms(false);
    }
  }

  async function loadDefaults() {
    setIsLoadingDefaults(true);
    setDefaultsMessage("");

    try {
      const savedDefaults = await settingsStorage.loadPostDefaults();
      setDefaults(savedDefaults);
    } catch {
      setDefaultsMessage(t("settings.defaults.loadError"));
    } finally {
      setIsLoadingDefaults(false);
    }
  }

  useEffect(() => {
    void loadPlatforms();
    void loadDefaults();
  }, []);

  const defaultsReady = useMemo(() => defaults ?? null, [defaults]);

  async function connectPlatform(platform: OAuthPlatform) {
    setPlatformError("");

    try {
      await oauthService.startOAuth(platform);
    } catch {
      setPlatformError(t("settings.platforms.connectError"));
    }
  }

  async function disconnectPlatform(platform: OAuthPlatform) {
    setDisconnectingPlatform(platform);
    setPlatformError("");

    try {
      await credentialsService.disconnectPlatform({ platform });
      await loadPlatforms();
    } catch {
      setPlatformError(t("settings.platforms.disconnectError"));
    } finally {
      setDisconnectingPlatform(null);
    }
  }

  function updateDefaults<K extends keyof PostDefaults>(
    key: K,
    value: PostDefaults[K],
  ) {
    if (!defaultsReady) {
      return;
    }

    setDefaults({
      ...defaultsReady,
      [key]: value,
    });
  }

  function toggleDefaultPlatform(platform: PublishPlatform) {
    if (!defaultsReady) {
      return;
    }

    const exists = defaultsReady.platforms.includes(platform);
    const nextPlatforms = exists
      ? defaultsReady.platforms.filter((item) => item !== platform)
      : [...defaultsReady.platforms, platform];

    setDefaults({
      ...defaultsReady,
      platforms: nextPlatforms,
    });
  }

  async function saveDefaults() {
    if (!defaultsReady || isSavingDefaults) {
      return;
    }

    setIsSavingDefaults(true);
    setDefaultsMessage("");

    try {
      await settingsStorage.savePostDefaults(defaultsReady);
      setDefaultsMessage(t("settings.defaults.saved"));
    } catch {
      setDefaultsMessage(t("settings.defaults.saveError"));
    } finally {
      setIsSavingDefaults(false);
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>{t("settings.title")}</h1>
        <p style={styles.subtitle}>{t("settings.subtitle")}</p>
      </header>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>{t("settings.platforms.title")}</h2>
        <p style={styles.sectionDescription}>
          {t("settings.platforms.description")}
        </p>

        {isLoadingPlatforms ? (
          <p style={styles.helperText}>{t("settings.common.loading")}</p>
        ) : null}
        {platformError ? <p style={styles.errorText}>{platformError}</p> : null}

        <div style={styles.platformGrid}>
          {platforms.map((platform) => {
            const platformMeta = OAUTH_PLATFORMS.find(
              (item) => item.id === platform.id,
            );
            const isDisconnecting = disconnectingPlatform === platform.id;
            const isHealthyConnected = platform.connected && !platform.isExpired;
            const statusLabel = platform.isExpired
              ? t("settings.platforms.expired")
              : platform.connected
                ? t("settings.platforms.connected")
                : t("settings.platforms.disconnected");

            return (
              <article key={platform.id} style={styles.platformCard}>
                <div style={styles.platformHeader}>
                  <div style={styles.platformNameRow}>
                    {platformMeta?.icon ? (
                      <Icon name={platformMeta.icon} size={16} />
                    ) : null}
                    <span style={styles.platformName}>
                      {t(platformMeta?.labelKey ?? "")}
                    </span>
                  </div>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(platform.isExpired
                        ? styles.statusExpired
                        : platform.connected
                          ? styles.statusConnected
                          : styles.statusDisconnected),
                    }}
                  >
                    {statusLabel}
                  </span>
                </div>

                {platform.isExpired ? (
                  <p style={styles.warningText}>
                    {t("settings.platforms.reconnectRequired")}
                  </p>
                ) : null}

                {platform.expiresAt ? (
                  <p style={styles.expiryText}>
                    {t("settings.platforms.expiresAt", {
                      value: formatDateTime(platform.expiresAt, i18n.language),
                    })}
                  </p>
                ) : null}

                <div style={styles.platformActionsRow}>
                  <button
                    type="button"
                    style={{
                      ...styles.secondaryButton,
                      ...(isHealthyConnected ? styles.buttonDisabled : {}),
                    }}
                    onClick={() => void connectPlatform(platform.id)}
                    disabled={isHealthyConnected}
                  >
                    {platform.isExpired
                      ? t("settings.platforms.reconnect")
                      : t("settings.platforms.connect")}
                  </button>

                  <button
                    type="button"
                    style={{
                      ...styles.dangerButton,
                      ...(platform.connected ? {} : styles.buttonDisabled),
                    }}
                    onClick={() => disconnectPlatform(platform.id)}
                    disabled={!platform.connected || isDisconnecting}
                  >
                    {isDisconnecting
                      ? t("settings.common.loading")
                      : t("settings.platforms.disconnect")}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>{t("settings.defaults.title")}</h2>
        <p style={styles.sectionDescription}>
          {t("settings.defaults.description")}
        </p>

        {isLoadingDefaults || !defaultsReady ? (
          <p style={styles.helperText}>{t("settings.common.loading")}</p>
        ) : (
          <div style={styles.defaultsGrid}>
            <label style={styles.fieldLabel}>
              {t("settings.defaults.postType")}
              <select
                style={styles.selectField}
                value={defaultsReady.post_type}
                onChange={(event) =>
                  updateDefaults("post_type", event.target.value as PostType)
                }
              >
                {POST_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {t(`settings.defaults.types.${option}`)}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.fieldLabel}>
              {t("settings.defaults.privacy")}
              <select
                style={styles.selectField}
                value={defaultsReady.privacy_level}
                onChange={(event) =>
                  updateDefaults(
                    "privacy_level",
                    event.target.value as PrivacyLevel,
                  )
                }
              >
                {PRIVACY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {t(`settings.defaults.privacyOptions.${option}`)}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={defaultsReady.is_sponsored}
                onChange={(event) =>
                  updateDefaults("is_sponsored", event.target.checked)
                }
              />
              <span>{t("settings.defaults.sponsored")}</span>
            </label>

            <div style={styles.platformSelectionBlock}>
              <span style={styles.fieldLabelText}>
                {t("settings.defaults.platforms")}
              </span>
              <div style={styles.platformToggleRow}>
                {PUBLISH_PLATFORMS.map((platform) => {
                  const isActive = defaultsReady.platforms.includes(
                    platform.id,
                  );

                  return (
                    <button
                      key={platform.id}
                      type="button"
                      style={{
                        ...styles.chip,
                        ...(isActive ? styles.chipActive : {}),
                      }}
                      onClick={() => toggleDefaultPlatform(platform.id)}
                    >
                      {t(platform.labelKey)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={styles.actionsRow}>
              <button
                type="button"
                style={{
                  ...styles.primaryButton,
                  ...(isSavingDefaults ? styles.buttonDisabled : {}),
                }}
                disabled={isSavingDefaults}
                onClick={saveDefaults}
              >
                {isSavingDefaults
                  ? t("settings.defaults.saving")
                  : t("settings.defaults.save")}
              </button>
              {defaultsMessage ? (
                <span style={styles.helperText}>{defaultsMessage}</span>
              ) : null}
            </div>
          </div>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>{t("settings.account.title")}</h2>
        <p style={styles.sectionDescription}>
          {t("settings.account.description")}
        </p>

        <dl style={styles.accountList}>
          <div style={styles.accountRow}>
            <dt style={styles.accountLabel}>{t("settings.account.name")}</dt>
            <dd style={styles.accountValue}>{user?.name ?? "-"}</dd>
          </div>
          <div style={styles.accountRow}>
            <dt style={styles.accountLabel}>{t("settings.account.email")}</dt>
            <dd style={styles.accountValue}>{user?.email ?? "-"}</dd>
          </div>
        </dl>

        <div style={styles.actionsRow}>
          <button
            type="button"
            style={styles.dangerButton}
            onClick={logout}
          >
            {t("settings.account.logout")}
          </button>
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: spacing[8],
    display: "flex",
    flexDirection: "column",
    gap: spacing[5],
  },
  header: {
    color: colors.white,
  },
  title: {
    margin: 0,
    fontSize: typography.fontSize["3xl"],
    fontFamily: typography.fontFamily.sans.join(", "),
  },
  subtitle: {
    marginTop: spacing[2],
    marginBottom: 0,
    fontSize: typography.fontSize.md,
    color: colors.neutral[50],
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: spacing[4],
    padding: spacing[5],
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
  },
  sectionTitle: {
    margin: 0,
    color: colors.neutral[90],
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.sans.join(", "),
  },
  sectionDescription: {
    margin: 0,
    color: colors.neutral[80],
    fontSize: typography.fontSize.sm,
  },
  helperText: {
    margin: 0,
    color: colors.neutral[80],
    fontSize: typography.fontSize.sm,
  },
  errorText: {
    margin: 0,
    color: colors.error.default,
    fontSize: typography.fontSize.sm,
  },
  warningText: {
    margin: 0,
    color: colors.warning.default,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  platformGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: spacing[3],
  },
  platformCard: {
    border: `1px solid ${colors.neutral[40]}`,
    borderRadius: spacing[3],
    padding: spacing[4],
    display: "flex",
    flexDirection: "column",
    gap: spacing[3],
  },
  platformHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[2],
  },
  platformNameRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing[2],
  },
  platformName: {
    fontSize: typography.fontSize.md,
    color: colors.neutral[90],
    fontWeight: typography.fontWeight.semibold,
  },
  statusBadge: {
    borderRadius: spacing[2],
    padding: `${spacing[1]} ${spacing[2]}`,
    fontSize: typography.fontSize.label,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  statusConnected: {
    color: colors.success.dark,
    backgroundColor: colors.success.light,
  },
  statusDisconnected: {
    color: colors.neutral[80],
    backgroundColor: colors.neutral[30],
  },
  statusExpired: {
    color: colors.warning.dark,
    backgroundColor: colors.warning.light,
  },
  expiryText: {
    margin: 0,
    color: colors.neutral[80],
    fontSize: typography.fontSize.label,
  },
  actionsRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing[2],
    flexWrap: "wrap",
  },
  platformActionsRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing[2],
    flexWrap: "wrap",
    marginTop: "auto",
  },
  primaryButton: {
    border: `1px solid ${colors.primary[500]}`,
    backgroundColor: colors.primary[500],
    color: colors.white,
    borderRadius: spacing[2],
    padding: `${spacing[2]} ${spacing[3]}`,
    cursor: "pointer",
  },
  secondaryButton: {
    border: `1px solid ${colors.primary[500]}`,
    backgroundColor: colors.white,
    color: colors.primary[500],
    borderRadius: spacing[2],
    padding: `${spacing[2]} ${spacing[3]}`,
    cursor: "pointer",
  },
  dangerButton: {
    border: `1px solid ${colors.error.default}`,
    backgroundColor: colors.white,
    color: colors.error.default,
    borderRadius: spacing[2],
    padding: `${spacing[2]} ${spacing[3]}`,
    cursor: "pointer",
  },
  buttonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
  defaultsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: spacing[4],
  },
  fieldLabel: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
    color: colors.neutral[90],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  fieldLabelText: {
    color: colors.neutral[90],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  selectField: {
    border: `1px solid ${colors.neutral[50]}`,
    borderRadius: spacing[2],
    minHeight: "2.5rem",
    padding: `0 ${spacing[3]}`,
    fontSize: typography.fontSize.sm,
    color: colors.neutral[90],
    backgroundColor: colors.white,
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing[2],
    color: colors.neutral[90],
    fontSize: typography.fontSize.sm,
    marginTop: spacing[2],
  },
  platformSelectionBlock: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
  },
  platformToggleRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  chip: {
    border: `1px solid ${colors.neutral[50]}`,
    borderRadius: spacing[2],
    padding: `${spacing[1.5]} ${spacing[3]}`,
    backgroundColor: colors.white,
    color: colors.neutral[90],
    cursor: "pointer",
    fontSize: typography.fontSize.sm,
  },
  chipActive: {
    border: `1px solid ${colors.primary[500]}`,
    backgroundColor: colors.primary[50],
    color: colors.primary[600],
  },
  accountList: {
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: spacing[3],
  },
  accountRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacing[4],
    paddingBottom: spacing[2],
    borderBottom: `1px solid ${colors.neutral[40]}`,
  },
  accountLabel: {
    margin: 0,
    color: colors.neutral[80],
    fontSize: typography.fontSize.sm,
  },
  accountValue: {
    margin: 0,
    color: colors.neutral[90],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
};
