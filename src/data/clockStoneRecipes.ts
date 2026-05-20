export type Recipe = Record<number, number>

export const clockStoneRecipes: Record<number, Recipe> = {
  2: { 1: 3 },
  3: { 2: 3 },
  4: { 3: 4 },
  5: { 4: 3 },
  6: { 5: 4 },
  7: { 6: 4 },
  8: { 7: 5 },
}

export const MAX_LEVEL = 8
