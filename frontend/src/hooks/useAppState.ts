import { useCallback, useState } from 'react'
import { AllocationRatio, Expense, SettlementCalculation } from '../types'

export const useAppState = () => {
  // 費用データ
  const [expenses, setExpenses] = useState<Expense[]>([])
  
  // 配分比率（デフォルト値：夫70%, 妻30%）
  const [allocationRatio, setAllocationRatio] = useState<AllocationRatio>({
    husband: 70,
    wife: 30
  })
  
  // 精算計算結果
  const [settlements, setSettlements] = useState<SettlementCalculation[]>([])

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
    completeSettlement
  }
} 
