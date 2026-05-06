import type { Recipe } from './gemRecipes'

export const starStoneRecipes: Record<number, Recipe> = {
  2: { 1: 3 },
  3: { 2: 3 },
  4: { 3: 3 },
  5: { 4: 3 },
  6: { 5: 3 },
  7: { 6: 3 },
  8: { 7: 3 },
  9: { 8: 3, 5: 1 },
  10: { 9: 3, 6: 1, 7: 1 },
  11: { 10: 3, 9: 1 },
}

export const STAR_STONE_MAX_LEVEL = 11
