// js/dates.js
// Helpers liés aux dates et au planning (offsets centralisés)

const START_DATE_STR = "2025-09-01";
const END_DATE_STR = "2026-08-30";
const REVIEW_OFFSETS_DAYS = [1, 3, 7, 14, 30, 45, 60, 90, 120, 180, 240, 300];

function parseDate(str) {
  if (!str) return new Date();
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateFr(str) {
  const d = parseDate(str);
  return d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function todayISO() {
  return formatDateISO(new Date());
}

function sanitizeOffsets(offsets) {
  if (!Array.isArray(offsets)) return REVIEW_OFFSETS_DAYS;

  const clean = offsets
    .map(Number)
    .filter(n => Number.isFinite(n) && n >= 0);

  const uniqueSorted = Array.from(new Set(clean)).sort((a, b) => a - b);

  return uniqueSorted.length > 0 ? uniqueSorted : REVIEW_OFFSETS_DAYS;
}

function generateReviewSchedule(learnedDateStr, settings = loadSettings()) {
  const learnedDate = parseDate(learnedDateStr);
  const endDate = parseDate(settings.endDate);

  const reviews = [];
  for (let i = 0; i < settings.reviewOffsets.length; i++) {
    const offset = settings.reviewOffsets[i];
    const reviewDate = addDays(learnedDate, offset);
    if (reviewDate > endDate) {
      break;
    }
    reviews.push({
      index: reviews.length + 1,
      offsetDays: offset,
      date: formatDateISO(reviewDate),
      done: false
    });
  }

  return reviews;
}

function getDaysLeft(settings = loadSettings()) {
  const today = new Date();
  const end = parseDate(settings.endDate);
  const diffMs = end - today;
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.ceil(diffMs / msPerDay));
}
