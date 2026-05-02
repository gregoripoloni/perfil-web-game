export const calculateAwardedPoints = (
  totalTips: number,
  revealedTips: number,
): number => {
  return totalTips - revealedTips;
};
