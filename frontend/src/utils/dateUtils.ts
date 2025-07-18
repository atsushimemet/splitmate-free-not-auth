// 年の選択肢（2025年〜2028年）
export const getYearOptions = () => {
  const years = []
  for (let year = 2025; year <= 2028; year++) {
    years.push(year)
  }
  return years
}

// 月の選択肢（1月〜12月）
export const getMonthOptions = () => {
  const months = []
  for (let month = 1; month <= 12; month++) {
    months.push({
      value: month,
      label: `${month}月`
    })
  }
  return months
}

// 前月を取得する関数（デフォルト値用）
export const getPreviousMonth = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() // 0ベース（0=1月、6=7月）
  
  if (month === 0) {
    // 1月の場合は前年の12月
    return {
      year: year - 1,
      month: 12
    }
  } else {
    return {
      year,
      month
    }
  }
}

// 年月を YYYY-MM 形式に変換
export const formatYearMonth = (year: number, month: number): string => {
  const paddedMonth = month.toString().padStart(2, '0')
  return `${year}-${paddedMonth}`
}

// YYYY-MM 形式から年月オブジェクトに変換
export const parseYearMonth = (dateString: string) => {
  const [yearStr, monthStr] = dateString.split('-')
  return {
    year: parseInt(yearStr, 10),
    month: parseInt(monthStr, 10)
  }
}

// 年月の表示形式（例：2025年6月）
export const displayYearMonth = (year: number, month: number): string => {
  return `${year}年${month}月`
} 
