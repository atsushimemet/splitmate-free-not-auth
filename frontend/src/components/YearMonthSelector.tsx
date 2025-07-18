import { formatYearMonth, getMonthOptions, getPreviousMonth, getYearOptions, parseYearMonth } from '../utils/dateUtils'

interface YearMonthSelectorProps {
  value: string // YYYY-MM format
  onChange: (value: string) => void
  className?: string
  error?: string
}

export const YearMonthSelector = ({ value, onChange, className = '', error }: YearMonthSelectorProps) => {
  const yearOptions = getYearOptions()
  const monthOptions = getMonthOptions()
  
  // 現在の値をパース（値が空の場合はデフォルト値を使用）
  const currentValue = value || (() => {
    const prev = getPreviousMonth()
    return formatYearMonth(prev.year, prev.month)
  })()
  
  const { year, month } = parseYearMonth(currentValue)

  const handleYearChange = (newYear: number) => {
    const newValue = formatYearMonth(newYear, month)
    onChange(newValue)
  }

  const handleMonthChange = (newMonth: number) => {
    const newValue = formatYearMonth(year, newMonth)
    onChange(newValue)
  }

  const baseSelectClass = `px-2 lg:px-3 py-1 lg:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
    error ? 'border-red-500' : 'border-gray-300'
  }`

  return (
    <div className={className}>
      <div className="flex gap-1 lg:gap-2">
        {/* 年選択 */}
        <div className="flex-1">
          <select
            value={year}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className={baseSelectClass}
          >
            {yearOptions.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}年
              </option>
            ))}
          </select>
        </div>

        {/* 月選択 */}
        <div className="flex-1">
          <select
            value={month}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className={baseSelectClass}
          >
            {monthOptions.map((monthOption) => (
              <option key={monthOption.value} value={monthOption.value}>
                {monthOption.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
} 
