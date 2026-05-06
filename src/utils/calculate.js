export function getLevel1Count(recipes, level) {
  const cache = { 1: 1 }
  function compute(l) {
    if (cache[l] !== undefined) return cache[l]
    const recipe = recipes[l]
    if (!recipe) return 0
    let total = 0
    for (const [componentLevel, count] of Object.entries(recipe)) {
      total += compute(Number(componentLevel)) * count
    }
    cache[l] = total
    return total
  }
  return compute(level)
}

// Format the recipe as human-readable text like "2个1级"
export function formatRecipe(recipes, level) {
  if (level === 1) return '—'
  const recipe = recipes[level]
  if (!recipe) return '—'
  const parts = Object.entries(recipe)
    .sort((a, b) => Number(b[0]) - Number(a[0])) // higher level first
    .map(([lvl, count]) => `${count}个${lvl}级`)
  return parts.join('+')
}

// Calculate all costs for levels 1..maxLevel
export function calculateCosts(recipes, maxLevel, gemPrice, cangbaogePrice, synthesisCosts = {}) {
  const cache = { 1: 1 }
  function getCount(level) {
    if (cache[level] !== undefined) return cache[level]
    const recipe = recipes[level]
    if (!recipe) return 0
    let total = 0
    for (const [componentLevel, count] of Object.entries(recipe)) {
      total += getCount(Number(componentLevel)) * count
    }
    cache[level] = total
    return total
  }

  const rows = []
  for (let level = 1; level <= maxLevel; level++) {
    const level1Count = getCount(level)
    const materialCostLiang = level1Count * gemPrice
    const materialCostYuan = materialCostLiang / 10000 * cangbaogePrice
    const synthesisCost = synthesisCosts[level] || 0
    const totalCostLiang = materialCostLiang + synthesisCost
    const totalCostYuan = totalCostLiang / 10000 * cangbaogePrice

    rows.push({
      level,
      recipe: formatRecipe(recipes, level),
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
