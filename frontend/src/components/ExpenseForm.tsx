import { useState } from 'react'
import { ExpenseForm as ExpenseFormType } from '../types'

interface ExpenseFormProps {
  onSubmit: (expense: ExpenseFormType) => void
}

export const ExpenseForm = ({ onSubmit }: ExpenseFormProps) => {
  const [form, setForm] = useState<ExpenseFormType>({
    description: '',
    amount: '',
    payer: 'husband'
  })

  const [errors, setErrors] = useState<Partial<ExpenseFormType>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<ExpenseFormType> = {}
    
    if (!form.description.trim()) {
      newErrors.description = '説明を入力してください'
    }
    
    if (!form.amount.trim()) {
      newErrors.amount = '金額を入力してください'
    } else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      newErrors.amount = '正しい金額を入力してください'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(form)
      
      // 連続登録のため説明と支払者を維持、金額のみクリア
      setForm(prev => ({
        ...prev,
        amount: ''
      }))
      setErrors({})
    }
  }

  const handleInputChange = (field: keyof ExpenseFormType, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="bg-white p-4 lg:p-6 lg:rounded-lg lg:shadow-md mb-4 lg:mb-6">
      <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">新しい費用を追加</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          {/* 説明 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              説明（店舗名など）
            </label>
            <input
              type="text"
              id="description"
              value={form.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例：マルエツ"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* 金額 */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              金額（円）
            </label>
            <input
              type="number"
              id="amount"
              value={form.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="3000"
              min="0"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* 支払者 */}
          <div>
            <label htmlFor="payer" className="block text-sm font-medium text-gray-700 mb-1">
              支払者
            </label>
            <select
              id="payer"
              value={form.payer}
              onChange={(e) => handleInputChange('payer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="husband">夫</option>
              <option value="wife">妻</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            追加
          </button>
        </div>
      </form>
    </div>
  )
} 
