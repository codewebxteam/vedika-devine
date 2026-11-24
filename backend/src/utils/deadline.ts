/**
 * Utility for real-time order & project delivery deadline calculations.
 * Supports SLA-based dynamic counting (e.g., 10-day fulfillment window),
 * urgent highlight flags (<= 3 days left), and elapsed day tracking.
 */

export interface DeadlineCalculation {
  onboardTimestamp: number;
  onboardFormatted: string; // e.g. "20 Nov 2026"
  targetTimestamp: number;
  targetFormatted: string; // e.g. "30 Nov 2026"
  daysElapsed: number; // e.g. 4 days
  daysRemaining: number; // e.g. 6 days
  totalSlaDays: number; // e.g. 10 days
  isUrgent: boolean; // true if <= 3 days remaining and not completed
  isOverdue: boolean; // true if < 0 days remaining
  urgencyLevel: "overdue" | "urgent" | "normal" | "completed";
  badgeText: string;
  badgeColorClass: string;
}

export const calculateOrderDeadline = (
  createdAt: string | number | undefined,
  orderStatus?: string,
  slaDays: number = 10
): DeadlineCalculation => {
  const isCompleted = orderStatus === "Delivered" || orderStatus === "Cancelled";

  // Parse creation timestamp
  let onboardTimestamp = Date.now();
  if (createdAt) {
    if (typeof createdAt === "number") {
      onboardTimestamp = createdAt;
    } else {
      const parsed = new Date(createdAt).getTime();
      if (!isNaN(parsed)) {
        onboardTimestamp = parsed;
      }
    }
  }

  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();

  const targetTimestamp = onboardTimestamp + slaDays * ONE_DAY_MS;

  // Real days calculation using midnight rounding
  const onboardDate = new Date(onboardTimestamp);
  const nowDate = new Date(now);
  const targetDate = new Date(targetTimestamp);

  // Normalize to start of day for clean integer day count
  const normalizeToDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const daysElapsed = Math.max(
    0,
    Math.floor((normalizeToDay(nowDate) - normalizeToDay(onboardDate)) / ONE_DAY_MS)
  );

  const daysRemaining = Math.floor(
    (normalizeToDay(targetDate) - normalizeToDay(nowDate)) / ONE_DAY_MS
  );

  const isOverdue = !isCompleted && daysRemaining < 0;
  const isUrgent = !isCompleted && !isOverdue && daysRemaining <= 3;

  let urgencyLevel: "overdue" | "urgent" | "normal" | "completed" = "normal";
  let badgeText = `${daysRemaining} Days Left`;
  let badgeColorClass = "bg-amber-950/80 text-amber-300 border-amber-800/80";

  if (isCompleted) {
    urgencyLevel = "completed";
    badgeText = orderStatus === "Delivered" ? "Delivered on Time" : "Cancelled";
    badgeColorClass =
      orderStatus === "Delivered"
        ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/80"
        : "bg-stone-800 text-stone-400 border-stone-700";
  } else if (isOverdue) {
    urgencyLevel = "overdue";
    badgeText = `OVERDUE: ${Math.abs(daysRemaining)}d Late`;
    badgeColorClass = "bg-rose-950 text-rose-300 border-rose-700 font-bold animate-pulse";
  } else if (isUrgent) {
    urgencyLevel = "urgent";
    badgeText =
      daysRemaining === 0
        ? "🚨 URGENT: Due Today!"
        : `🚨 URGENT: ${daysRemaining} Day${daysRemaining === 1 ? "" : "s"} Left!`;
    badgeColorClass =
      "bg-red-950/90 text-red-300 border-red-700 font-bold ring-1 ring-red-500/50";
  } else {
    urgencyLevel = "normal";
    badgeText = `⏳ ${daysRemaining} Days Left`;
    badgeColorClass = "bg-amber-950/60 text-amber-300 border-amber-800/60";
  }

  const formatDateStr = (d: Date) =>
    d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return {
    onboardTimestamp,
    onboardFormatted: formatDateStr(onboardDate),
    targetTimestamp,
    targetFormatted: formatDateStr(targetDate),
    daysElapsed,
    daysRemaining,
    totalSlaDays: slaDays,
    isUrgent,
    isOverdue,
    urgencyLevel,
    badgeText,
    badgeColorClass,
  };
};
