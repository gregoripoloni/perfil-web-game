import { TIPS } from '@/constants/tips';

export const hasRemainingTips = (
  cardId: number | null,
  openedTipIds: Record<string, number>,
): boolean => {
  if (cardId == null) return false;

  return TIPS.some(
    (tip) => tip.cardId === cardId && openedTipIds[String(tip.id)] == null,
  );
};
