export type Recipe = Record<number, number>

export const mysticBeadRecipes: Record<number, Recipe> = {
  2: { 1: 3 },
  3: { 2: 3 },
  4: { 3: 3 },
  5: { 4: 3, 2: 1 },
  6: { 5: 3, 3: 1 },
  7: { 6: 3, 4: 1 },
  8: { 7: 3, 5: 1 },
}

export const MAX_LEVEL = 8
