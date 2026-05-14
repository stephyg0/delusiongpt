export function isLateNight(date = new Date()): boolean {
  const hour = date.getHours();
  return hour >= 23 || hour < 5;
}

export function getPartOfDay(date = new Date()): "morning" | "afternoon" | "evening" | "night" {
  const hour = date.getHours();
  if (hour < 5) return "night";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  if (hour < 23) return "evening";
  return "night";
}
