import { useCallback, useEffect, useState } from 'react'
import { AllocationRatio, Expense, SettlementCalculation } from '../types'

// localStorageのキー生成
const getStorageKey = (id: string, dataType: string) => `splitmate_${id}_${dataType}`

// localStorageからデータを取得
const loadFromStorage = <T>(id: string, dataType: string, defaultValue: T): T => {
  try {
    const key = getStorageKey(id, dataType)
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
    return defaultValue
  }
}

// localStorageにデータを保存
const saveToStorage = <T>(id: string, dataType: string, data: T): void => {
  try {
    const key = getStorageKey(id, dataType)
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export const useAppState = (userId: string) => {
  // 費用データ
  const [expenses, setExpenses] = useState<Expense[]>(() => 
    loadFromStorage(userId, 'expenses', [])
  )
  
  // 配分比率（デフォルト値：夫70%, 妻30%）
  const [allocationRatio, setAllocationRatio] = useState<AllocationRatio>(() =>
    loadFromStorage(userId, 'allocation', { husband: 70, wife: 30 })
  )
  
  // 精算計算結果
  const [settlements, setSettlements] = useState<SettlementCalculation[]>(() =>
    loadFromStorage(userId, 'settlements', [])
  )

  // データが変更されたときにlocalStorageに保存
  useEffect(() => {
    saveToStorage(userId, 'expenses', expenses)
  }, [userId, expenses])

  useEffect(() => {
    saveToStorage(userId, 'allocation', allocationRatio)
  }, [userId, allocationRatio])

  useEffect(() => {
    saveToStorage(userId, 'settlements', settlements)
  }, [userId, settlements])

  // 精算計算（最初に定義）
  const calculateSettlement = useCallback((expense: Expense) => {
    const husbandBurden = (expense.amount * allocationRatio.husband) / 100
    const wifeBurden = (expense.amount * allocationRatio.wife) / 100
    
    let settlementAmount: number
    let settlementDirection: 'husband_to_wife' | 'wife_to_husband'
    
    if (expense.payer === 'husband') {
      // 夫が支払った場合、妻の負担分を夫に精算
      settlementAmount = wifeBurden
      settlementDirection = 'wife_to_husband'
    } else {
      // 妻が支払った場合、夫の負担分を妻に精算
      settlementAmount = husbandBurden
      settlementDirection = 'husband_to_wife'
    }

    const settlement: SettlementCalculation = {
      expenseId: expense.id,
      expense,
      husbandBurden,
      wifeBurden,
      settlementAmount,
      settlementDirection,
      status: 'pending'
    }

    setSettlements(prev => {
      const filtered = prev.filter(s => s.expenseId !== expense.id)
      return [...filtered, settlement]
    })
  }, [allocationRatio])

  // 費用追加
  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setExpenses(prev => [...prev, newExpense])
    
    // 精算計算を実行
    calculateSettlement(newExpense)
  }, [calculateSettlement])

  // 費用削除
  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id))
    setSettlements(prev => prev.filter(settlement => settlement.expenseId !== id))
  }, [])

  // 費用編集
  const updateExpense = useCallback((id: string, updatedExpense: Partial<Expense>) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      )
    )
    
    // 精算計算を再実行
    const expense = expenses.find(e => e.id === id)
    if (expense) {
      calculateSettlement({ ...expense, ...updatedExpense })
    }
  }, [expenses, calculateSettlement])

  // 配分比率更新
  const updateAllocationRatio = useCallback((ratio: AllocationRatio) => {
    setAllocationRatio(ratio)
    
    // 全ての費用に対して精算を再計算
    expenses.forEach(expense => calculateSettlement(expense))
  }, [expenses, calculateSettlement])

  // 精算承認
  const approveSettlement = useCallback((expenseId: string) => {
    setSettlements(prev =>
      prev.map(settlement =>
        settlement.expenseId === expenseId
          ? { ...settlement, status: 'approved' as const }
          : settlement
      )
    )
  }, [])

  // 精算完了
  const completeSettlement = useCallback((expenseId: string) => {
    setSettlements(prev =>
      prev.map(settlement =>
        settlement.expenseId === expenseId
          ? { ...settlement, status: 'completed' as const }
          : settlement
      )
    )
  }, [])

  // 承認済み精算と対応する費用を削除（精算完了後のクリーンアップ）
  const clearApprovedSettlements = useCallback(() => {
    setSettlements(prev => {
      // 承認済みの精算を取得
      const approvedSettlements = prev.filter(s => s.status === 'approved')
      const approvedExpenseIds = approvedSettlements.map(s => s.expenseId)
      
      console.log('承認済み精算件数:', approvedSettlements.length)
      console.log('削除対象費用ID:', approvedExpenseIds)
      
      // 承認済みの費用を削除
      setExpenses(expensePrev => {
        const filteredExpenses = expensePrev.filter(expense => !approvedExpenseIds.includes(expense.id))
        console.log('削除前費用件数:', expensePrev.length, '削除後費用件数:', filteredExpenses.length)
        
        // localStorageに即座に保存
        saveToStorage(userId, 'expenses', filteredExpenses)
        
        return filteredExpenses
      })
      
      // 承認済みの精算データを削除
      const filteredSettlements = prev.filter(settlement => settlement.status !== 'approved')
      console.log('削除前精算件数:', prev.length, '削除後精算件数:', filteredSettlements.length)
      
      // localStorageに即座に保存
      saveToStorage(userId, 'settlements', filteredSettlements)
      
      return filteredSettlements
    })
  }, [userId])

  return {
    // データ
    expenses,
    allocationRatio,
    settlements,
    
    // アクション
    addExpense,
    deleteExpense,
    updateExpense,
    updateAllocationRatio,
    approveSettlement,
    completeSettlement,
    clearApprovedSettlements
  }
} 
