import { CURRENCY_LOCALE_MAP } from "./currencyLocale";

export const formatDateTimeByCurrency = (value, currency = "INR") => {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date)) return "—";

  const { locale, hour12 } =
    CURRENCY_LOCALE_MAP[currency] || CURRENCY_LOCALE_MAP.INR;

  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour12,
  });
};
