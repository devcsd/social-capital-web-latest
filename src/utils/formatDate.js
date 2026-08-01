export const formatDateTimeByCurrency = (value) => {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date)) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};