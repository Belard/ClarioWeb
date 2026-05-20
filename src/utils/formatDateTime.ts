type FormatDateTimeOptions = Intl.DateTimeFormatOptions;

const DEFAULT_OPTIONS: FormatDateTimeOptions = {
  dateStyle: "medium",
  timeStyle: "short",
};

export function formatDateTime(
  value?: string,
  locale = "en-US",
  options: FormatDateTimeOptions = DEFAULT_OPTIONS,
): string {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  try {
    return new Intl.DateTimeFormat(locale, options).format(parsedDate);
  } catch {
    return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
  }
}
