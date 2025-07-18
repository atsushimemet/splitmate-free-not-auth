import { useState } from 'react'
import { Expense } from '../types'
import { displayYearMonth, parseYearMonth } from '../utils/dateUtils'
import { YearMonthSelector } from './YearMonthSelector'

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
  onUpdate: (id: string, expense: Partial<Expense>) => void
}

export const ExpenseList = ({ expenses, onDelete, onUpdate }: ExpenseListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Expense>>({})
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [filterMonth, setFilterMonth] = useState<string>('')

  // 月でフィルタリング
  const filteredExpenses = filterMonth
    ? expenses.filter(expense => expense.date === filterMonth)
    : expenses

  // 全選択/全解除
  const handleSelectAll = () => {
    if (selectedItems.size === filteredExpenses.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredExpenses.map(expense => expense.id)))
    }
  }

  // 個別選択
  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  // 一括削除
  const handleBulkDelete = () => {
    if (window.confirm(`選択した${selectedItems.size}件の費用を削除しますか？`)) {
      selectedItems.forEach(id => onDelete(id))
      setSelectedItems(new Set())
    }
  }

  // 編集開始
  const startEdit = (expense: Expense) => {
    setEditingId(expense.id)
    setEditForm(expense)
  }

  // 編集保存
  const saveEdit = () => {
    if (editingId && editForm) {
      onUpdate(editingId, editForm)
      setEditingId(null)
      setEditForm({})
    }
  }

  // 編集キャンセル
  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  // 支払者の表示名
  const getPayerName = (payer: 'husband' | 'wife') => {
    return payer === 'husband' ? '夫' : '妻'
  }

  // 日付のフォーマット（新しいユーティリティ関数を使用）
  const formatDate = (dateString: string) => {
    const { year, month } = parseYearMonth(dateString)
    return displayYearMonth(year, month)
  }

  // 月の選択肢を生成（プルダウン用）
  const getMonthOptions = () => {
    const months = [...new Set(expenses.map(expense => expense.date))].sort()
    return months
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white p-4 lg:p-6 lg:rounded-lg lg:shadow-md">
        <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">費用一覧</h3>
        <p className="text-gray-500 text-center py-6 lg:py-8">まだ費用が登録されていません</p>
      </div>
    )
  }

  return (
    <div className="bg-white lg:rounded-lg lg:shadow-md">
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-3 lg:mb-4 gap-2 lg:gap-0">
          <h3 className="text-base lg:text-lg font-semibold">費用一覧</h3>
          <div className="flex gap-2 items-center">
            {/* 月フィルター */}
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-2 lg:px-3 py-1 border border-gray-300 rounded-md text-xs lg:text-sm flex-1 lg:flex-none"
            >
              <option value="">全ての月</option>
              {getMonthOptions().map(month => (
                <option key={month} value={month}>
                  {formatDate(month)}
                </option>
              ))}
            </select>
            
            {/* 一括削除ボタン */}
            {selectedItems.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-2 lg:px-3 py-1 bg-red-600 text-white text-xs lg:text-sm rounded-md hover:bg-red-700 whitespace-nowrap"
              >
                選択削除 ({selectedItems.size})
              </button>
            )}
          </div>
        </div>

        {/* 全選択チェックボックス */}
        {filteredExpenses.length > 0 && (
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={selectedItems.size === filteredExpenses.length && filteredExpenses.length > 0}
              onChange={handleSelectAll}
              className="rounded"
            />
            全選択
          </label>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                選択
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                説明
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                金額
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                支払者
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                年月
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExpenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(expense.id)}
                    onChange={() => handleSelectItem(expense.id)}
                    className="rounded"
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {editingId === expense.id ? (
                    <input
                      type="text"
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{expense.description}</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {editingId === expense.id ? (
                    <input
                      type="number"
                      value={editForm.amount || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">¥{expense.amount.toLocaleString()}</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {editingId === expense.id ? (
                    <select
                      value={editForm.payer || expense.payer}
                      onChange={(e) => setEditForm(prev => ({ ...prev, payer: e.target.value as 'husband' | 'wife' }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="husband">夫</option>
                      <option value="wife">妻</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-900">{getPayerName(expense.payer)}</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {editingId === expense.id ? (
                    <div className="w-48">
                      <YearMonthSelector
                        value={editForm.date || expense.date}
                        onChange={(value) => setEditForm(prev => ({ ...prev, date: value }))}
                        className="text-sm"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-900">{formatDate(expense.date)}</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {editingId === expense.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={saveEdit}
                        className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        保存
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        キャンセル
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(expense)}
                        className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('この費用を削除しますか？')) {
                            onDelete(expense.id)
                          }
                        }}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        削除
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredExpenses.length === 0 && filterMonth && (
        <div className="p-6 text-center text-gray-500">
          {formatDate(filterMonth)}の費用はありません
        </div>
      )}
    </div>
  )
} 
