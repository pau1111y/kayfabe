export const calculateElapsedHours = (startTime: number): number => {
  const now = Date.now();
  const elapsedMs = now - startTime;
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  return Math.round(elapsedHours * 100) / 100; // Round to 2 decimal places
};

export const formatHours = (hours: number): string => {
  if (hours === 0) return '0h';
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes}m`;
  }
  return `${hours}h`;
};

export const formatTimeRemaining = (startTime: number, allocatedHours: number): string => {
  const elapsed = calculateElapsedHours(startTime);
  const remaining = Math.max(0, allocatedHours - elapsed);
  return formatHours(remaining);
};
