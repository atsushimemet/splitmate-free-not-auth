// 費用項目の型定義
export interface Expense {
  id: string
  description: string
  amount: number
  payer: 'husband' | 'wife'
  createdAt: string
  isApproved?: boolean
}

// 配分比率の型定義
export interface AllocationRatio {
  husband: number
  wife: number
}

// 精算計算結果の型定義
export interface SettlementCalculation {
  expenseId: string
  expense: Expense
  husbandBurden: number
  wifeBurden: number
  settlementAmount: number
  settlementDirection: 'husband_to_wife' | 'wife_to_husband'
  status: 'pending' | 'approved' | 'completed'
}

// フォーム入力の型定義
export interface ExpenseForm {
  description: string
  amount: string
  payer: 'husband' | 'wife'
} 
