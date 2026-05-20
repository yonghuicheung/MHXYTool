export type Recipe = Record<number, number>

export const spiritStoneRecipes: Record<number, Recipe> = {
  2: { 1: 2 },
  3: { 2: 2 },
  4: { 3: 2 },
  5: { 4: 2 },
  6: { 5: 2 },
  7: { 6: 2 },
  8: { 7: 2, 3: 1 },
  9: { 8: 2, 6: 1 },
  10: { 9: 2, 8: 1 },
}

export const MAX_LEVEL = 10
