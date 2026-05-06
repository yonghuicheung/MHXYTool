import { gemRecipes, MAX_LEVEL } from '../data/gemRecipes.js'

// Memoized recursive: how many level-1 gems to make one gem of given level
const level1CountCache = { 1: 1 }

export function getLevel1Count(level) {
  if (level1CountCache[level] !== undefined) return level1CountCache[level]
  const recipe = gemRecipes[level]
  if (!recipe) return 0
  let total = 0
  for (const [componentLevel, count] of Object.entries(recipe)) {
    total += getLevel1Count(Number(componentLevel)) * count
  }
  level1CountCache[level] = total
  return total
}

// Format the recipe as human-readable text like "2个1级"
export function formatRecipe(level) {
  if (level === 1) return '—'
  const recipe = gemRecipes[level]
  if (!recipe) return '—'
  const parts = Object.entries(recipe)
    .sort((a, b) => Number(b[0]) - Number(a[0])) // higher level first
    .map(([lvl, count]) => `${count}个${lvl}级`)
  return parts.join('+')
}

// Calculate all costs for levels 1..MAX_LEVEL
export function calculateCosts(gemPrice, cangbaogePrice, synthesisCosts) {
  const rows = []
  for (let level = 1; level <= MAX_LEVEL; level++) {
    const level1Count = getLevel1Count(level)
    const materialCostLiang = level1Count * gemPrice
    const materialCostYuan = materialCostLiang / 10000 * cangbaogePrice
    const synthesisCost = synthesisCosts[level] || 0
    const totalCostLiang = materialCostLiang + synthesisCost
    const totalCostYuan = totalCostLiang / 10000 * cangbaogePrice

    rows.push({
      level,
      recipe: formatRecipe(level),
      level1Count,
      materialCostLiang,
      materialCostYuan,
      synthesisCost,
      totalCostLiang,
      totalCostYuan,
    })
  }
  return rows
}

// 元/3000万两
export function get3000wanPrice(cangbaogePrice) {
  return cangbaogePrice * 3000
}
