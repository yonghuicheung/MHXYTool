import type { Recipe } from './gemRecipes'

export const colorDustRecipes: Record<number, Recipe> = {
  2: { 1: 2 },
  3: { 2: 2, 1: 1 },
  4: { 3: 2, 2: 1 },
  5: { 4: 2, 3: 1 },
  6: { 5: 2, 4: 1 },
  7: { 6: 2, 5: 1 },
  8: { 7: 2, 6: 1 },
  9: { 8: 2, 7: 1 },
  10: { 9: 2, 8: 1 },
  11: { 10: 2, 9: 1 },
  12: { 11: 2, 10: 1 },
  13: { 12: 2, 11: 1 },
  14: { 13: 2, 12: 1 },
  15: { 14: 2, 13: 1 },
}

export const COLOR_DUST_MAX_LEVEL = 15
