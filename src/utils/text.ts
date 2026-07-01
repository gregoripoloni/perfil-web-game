export const normalizeAnswer = (value?: string): string =>
  (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

export const isDuplicateGuess = (
  answer: string,
  history: string[],
): boolean =>
  history.some((g) => normalizeAnswer(g) === normalizeAnswer(answer));
