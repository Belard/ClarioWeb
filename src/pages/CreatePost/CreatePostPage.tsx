import { useMemo, useRef, useState, type CSSProperties, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/ui/Icon/Icon';
import { ApiTimeoutError, postService } from '@/services';
import { borderRadius, colors, shadows, spacing, typography } from '@/theme';

const MAX_FILES = 5;

const PLATFORM_OPTIONS = [
  { id: 'facebook', label: 'Facebook', icon: 'facebook' },
  { id: 'instagram', label: 'Instagram', icon: 'instagram' },
  { id: 'youtube', label: 'YouTube', icon: 'youtube' },
  { id: 'tiktok', label: 'TikTok', icon: 'tiktok' },
] as const;

type PlatformOption = (typeof PLATFORM_OPTIONS)[number];

export function CreatePostPage() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformOption['id'][]>([]);
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ platforms?: string; content?: string }>({});

  const selectedPlatformItems = useMemo(
    () => PLATFORM_OPTIONS.filter((option) => selectedPlatforms.includes(option.id)),
    [selectedPlatforms],
  );

  const availablePlatformItems = useMemo(
    () => PLATFORM_OPTIONS.filter((option) => !selectedPlatforms.includes(option.id)),
    [selectedPlatforms],
  );

  function addPlatform(platformId: PlatformOption['id']) {
    setSelectedPlatforms((prev: PlatformOption['id'][]) =>
      prev.includes(platformId) ? prev : [...prev, platformId],
    );
    setFieldErrors((prev: { platforms?: string; content?: string }) => ({
      ...prev,
      platforms: undefined,
    }));
  }

  function removePlatform(platformId: PlatformOption['id']) {
    setSelectedPlatforms((prev: PlatformOption['id'][]) =>
      prev.filter((item: PlatformOption['id']) => item !== platformId),
    );
  }

  function clearPlatforms() {
    setSelectedPlatforms([]);
    setShowPlatformPicker(false);
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const nextFiles = Array.from(event.target.files ?? []);
    if (!nextFiles.length) {
      return;
    }

    setSuccessMessage('');
    setSubmitError('');

    setAttachments((prev: File[]) => {
      const merged = [...prev, ...nextFiles];
      if (merged.length > MAX_FILES) {
        setSubmitError(t('createPost.errors.maxFiles'));
        return merged.slice(0, MAX_FILES);
      }
      return merged;
    });

    event.target.value = '';
  }

  function removeAttachment(index: number) {
    setAttachments((prev: File[]) => prev.filter((_: File, currentIndex: number) => currentIndex !== index));
  }

  function validateBeforePublish() {
    const nextErrors: typeof fieldErrors = {};

    if (selectedPlatforms.length === 0) {
      nextErrors.platforms = t('createPost.errors.selectPlatform');
    }

    if (!content.trim()) {
      nextErrors.content = t('createPost.errors.postRequired');
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handlePublish() {
    if (isSubmitting) {
      return;
    }

    setSuccessMessage('');
    setSubmitError('');

    if (!validateBeforePublish()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedMediaIds: string[] = [];
      if (attachments.length > 0) {
        try {
          uploadedMediaIds = await Promise.all(
            attachments.map(async (file: File) => {
              const response = await postService.uploadMedia(file);
              return response.id;
            }),
          );
        } catch (error) {
          setSubmitError(
            error instanceof ApiTimeoutError
              ? t('createPost.errors.timeout')
              : t('createPost.errors.uploadFailed'),
          );
          return;
        }
      }

      await postService.createPost({
        content: content.trim(),
        platforms: selectedPlatforms,
        post_type: 'normal',
        privacy_level: 'public',
        is_sponsored: false,
        media_ids: uploadedMediaIds,
      });

      setContent('');
      setSelectedPlatforms([]);
      setAttachments([]);
      setShowPlatformPicker(false);
      setFieldErrors({});
      setSuccessMessage(t('createPost.success'));
    } catch (error) {
      const message =
        error instanceof ApiTimeoutError
          ? t('createPost.errors.timeout')
          : error instanceof Error
            ? error.message
            : t('createPost.errors.publishFailed');
      setSubmitError(message || t('createPost.errors.publishFailed'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.mainPanel}>
        <h1 style={styles.title}>{t('createPost.title')}</h1>
        <p style={styles.subtitle}>{t('createPost.subtitle')}</p>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>{t('createPost.publishTo')}</h2>
            <button type="button" style={styles.clearButton} onClick={clearPlatforms}>
              {t('createPost.clearPlatforms')}
            </button>
          </div>

          <div style={styles.platformPickerBox}>
            <div style={styles.platformChips}>
              {selectedPlatformItems.map((platform) => (
                <div key={platform.id} style={styles.platformChip}>
                  <Icon name={platform.icon} size={16} />
                  <span>{platform.label}</span>
                  <button
                    type="button"
                    style={styles.iconActionButton}
                    onClick={() => removePlatform(platform.id)}
                    aria-label={`Remove ${platform.label}`}
                  >
                    <Icon name="close" size={14} color={colors.neutral[80]} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                style={styles.iconActionButton}
                onClick={() => setShowPlatformPicker((prev: boolean) => !prev)}
                aria-label="Add platform"
              >
                <Icon name="add" size={16} color={colors.neutral[90]} />
              </button>
            </div>

            {showPlatformPicker && availablePlatformItems.length > 0 && (
              <div style={styles.availablePlatformsRow}>
                {availablePlatformItems.map((platform) => (
                  <button
                    key={platform.id}
                    type="button"
                    style={styles.availablePlatformButton}
                    onClick={() => addPlatform(platform.id)}
                  >
                    <Icon name={platform.icon} size={16} />
                    <span>{platform.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {fieldErrors.platforms && <span style={styles.errorText}>{fieldErrors.platforms}</span>}
        </section>

        <section style={styles.section}>
          <h2 style={styles.postTitle}>{t('createPost.postLabel')}</h2>
          <textarea
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              if (fieldErrors.content) {
                setFieldErrors((prev) => ({ ...prev, content: undefined }));
              }
            }}
            placeholder={t('createPost.postPlaceholder')}
            style={{
              ...styles.textarea,
              ...(fieldErrors.content ? styles.textareaError : {}),
            }}
          />
          {fieldErrors.content && <span style={styles.errorText}>{fieldErrors.content}</span>}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelection}
            style={styles.hiddenInput}
          />

          <button
            type="button"
            style={styles.addFilesButton}
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon name="attachment" size={18} color={colors.neutral[90]} />
            <span>{t('createPost.addFiles')}</span>
          </button>

          {attachments.length > 0 && (
            <div style={styles.attachmentsList}>
              {attachments.map((file, index) => (
                <div key={`${file.name}-${index}`} style={styles.attachmentItem}>
                  <div style={styles.attachmentInfo}>
                    <Icon name="image" size={16} color={colors.neutral[80]} />
                    <span style={styles.attachmentName}>{file.name}</span>
                  </div>
                  <button
                    type="button"
                    style={styles.iconActionButton}
                    onClick={() => removeAttachment(index)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <Icon name="close" size={14} color={colors.neutral[80]} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {submitError && <div style={styles.errorBanner}>{submitError}</div>}
        {successMessage && <div style={styles.successBanner}>{successMessage}</div>}

        <div style={styles.publishRow}>
          <button
            type="button"
            style={{
              ...styles.publishButton,
              ...(isSubmitting ? styles.publishButtonDisabled : {}),
            }}
            onClick={handlePublish}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('createPost.publishing') : t('createPost.publish')}
          </button>
        </div>
      </div>

      <aside style={styles.sidePanel}>
        <p style={styles.comingSoon}>{t('createPost.comingSoon')}</p>
      </aside>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: colors.neutral[30],
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    gap: spacing[4],
    boxSizing: 'border-box',
  },
  mainPanel: {
    flex: '1 1 48rem',
    minWidth: '18rem',
    maxWidth: '60rem',
    padding: `${spacing[6]} ${spacing[8]} ${spacing[4]}`,
    boxSizing: 'border-box',
  },
  title: {
    ...typography.typeStyles.headingLSemiBold,
    fontFamily: typography.fontFamily.generalSans.join(', '),
    color: colors.primary[700],
    margin: 0,
  },
  subtitle: {
    ...typography.typeStyles.bodyM,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.neutral[80],
    margin: `${spacing[1]} 0 ${spacing[7]}`,
  },
  section: {
    marginBottom: spacing[7],
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  sectionTitle: {
    ...typography.typeStyles.headingSSemiBold,
    fontFamily: typography.fontFamily.generalSans.join(', '),
    color: colors.neutral[90],
    margin: 0,
  },
  clearButton: {
    ...typography.typeStyles.linkS,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.neutral[80],
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  platformPickerBox: {
    border: `1px solid ${colors.neutral[60]}`,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    padding: spacing[2],
  },
  platformChips: {
    display: 'flex',
    gap: spacing[2],
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  platformChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[1.5],
    ...typography.typeStyles.bodyS,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.neutral[90],
    backgroundColor: colors.neutral[30],
    border: `1px solid ${colors.neutral[50]}`,
    borderRadius: borderRadius.full,
    padding: `${spacing[1]} ${spacing[2]}`,
  },
  iconActionButton: {
    width: '1.75rem',
    height: '1.75rem',
    borderRadius: borderRadius.full,
    border: 'none',
    background: colors.transparent,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  availablePlatformsRow: {
    marginTop: spacing[2],
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  availablePlatformButton: {
    ...typography.typeStyles.bodyS,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.neutral[90],
    backgroundColor: colors.neutral[20],
    border: `1px solid ${colors.neutral[50]}`,
    borderRadius: borderRadius.full,
    padding: `${spacing[1]} ${spacing[2.5]}`,
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[1.5],
    cursor: 'pointer',
  },
  postTitle: {
    ...typography.typeStyles.headingSSemiBold,
    fontFamily: typography.fontFamily.generalSans.join(', '),
    color: colors.black,
    margin: 0,
    marginBottom: spacing[3],
  },
  textarea: {
    width: '100%',
    minHeight: '12rem',
    maxHeight: '16rem',
    resize: 'vertical',
    ...typography.typeStyles.bodyM,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.neutral[90],
    backgroundColor: colors.white,
    border: `1px solid ${colors.neutral[60]}`,
    borderRadius: borderRadius.md,
    padding: spacing[3],
    boxSizing: 'border-box',
    outline: 'none',
  },
  textareaError: {
    borderColor: colors.error.default,
  },
  hiddenInput: {
    display: 'none',
  },
  addFilesButton: {
    marginTop: spacing[3],
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[1.5],
    ...typography.typeStyles.bodyM,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.neutral[90],
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  },
  attachmentsList: {
    marginTop: spacing[3],
    display: 'grid',
    gap: spacing[2],
  },
  attachmentItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    border: `1px solid ${colors.neutral[60]}`,
    borderRadius: borderRadius.md,
    padding: `${spacing[1.5]} ${spacing[2]}`,
  },
  attachmentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    minWidth: 0,
  },
  attachmentName: {
    ...typography.typeStyles.bodyS,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.neutral[90],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '28rem',
  },
  errorText: {
    display: 'block',
    marginTop: spacing[1.5],
    ...typography.typeStyles.bodyS,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.error.default,
  },
  errorBanner: {
    ...typography.typeStyles.bodyS,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.error.dark,
    backgroundColor: colors.error.light,
    border: `1px solid ${colors.error.default}`,
    borderRadius: borderRadius.md,
    padding: `${spacing[2]} ${spacing[3]}`,
    marginBottom: spacing[3],
  },
  successBanner: {
    ...typography.typeStyles.bodyS,
    fontFamily: typography.fontFamily.inter.join(', '),
    color: colors.success.dark,
    backgroundColor: colors.success.light,
    border: `1px solid ${colors.success.default}`,
    borderRadius: borderRadius.md,
    padding: `${spacing[2]} ${spacing[3]}`,
    marginBottom: spacing[3],
  },
  publishRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: spacing[4],
  },
  publishButton: {
    ...typography.typeStyles.bodyMSemiBold,
    fontFamily: typography.fontFamily.generalSans.join(', '),
    color: colors.white,
    backgroundColor: colors.primary[500],
    border: 'none',
    borderRadius: borderRadius.md,
    padding: `${spacing[2]} ${spacing[4]}`,
    cursor: 'pointer',
    boxShadow: shadows.sm,
  },
  publishButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  sidePanel: {
    flex: '1 1 18rem',
    minWidth: '15rem',
    height: '100%',
    backgroundColor: colors.neutral[50],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
    boxSizing: 'border-box',
  },
  comingSoon: {
    ...typography.typeStyles.headingMSemiBold,
    fontFamily: typography.fontFamily.generalSans.join(', '),
    color: colors.neutral[100],
    margin: 0,
  },
};
