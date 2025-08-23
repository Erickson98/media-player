type FormatFollowersOpts = {
  locale?: string;
  compact?: boolean;
  maxFractionDigits?: number;
  label?: string;
};

export function formatFollowers(
  n: number,
  {
    locale = "es",
    compact = false,
    maxFractionDigits = compact ? 2 : 0,
    label = locale.startsWith("es") ? "seguidores" : "followers",
  }: FormatFollowersOpts = {}
): string {
  const fmt = new Intl.NumberFormat(locale, {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: maxFractionDigits,
  });
  return `${fmt.format(n)}${label ? ` ${label}` : ""}`;
}
