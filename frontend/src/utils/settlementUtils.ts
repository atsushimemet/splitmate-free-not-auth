import { SettlementCalculation } from '../types'

// 精算サマリーの型定義
export interface SettlementSummary {
  totalSettlementAmount: number
  finalDirection: 'husband_to_wife' | 'wife_to_husband' | 'no_settlement'
  husbandTotalPaid: number
  wifeTotalPaid: number
  husbandTotalBurden: number
  wifeTotalBurden: number
  approvedSettlements: SettlementCalculation[]
}

// 承認された精算の全体サマリーを計算
export const calculateSettlementSummary = (settlements: SettlementCalculation[]): SettlementSummary => {
  // 承認済みの精算のみを対象
  const approvedSettlements = settlements.filter(s => s.status === 'approved')
  
  if (approvedSettlements.length === 0) {
    return {
      totalSettlementAmount: 0,
      finalDirection: 'no_settlement',
      husbandTotalPaid: 0,
      wifeTotalPaid: 0,
      husbandTotalBurden: 0,
      wifeTotalBurden: 0,
      approvedSettlements: []
    }
  }

  // 各自の支払い総額と負担総額を計算
  let husbandTotalPaid = 0
  let wifeTotalPaid = 0
  let husbandTotalBurden = 0
  let wifeTotalBurden = 0

  approvedSettlements.forEach(settlement => {
    const { expense, husbandBurden, wifeBurden } = settlement
    
    // 実際の支払額
    if (expense.payer === 'husband') {
      husbandTotalPaid += expense.amount
    } else {
      wifeTotalPaid += expense.amount
    }
    
    // 負担額
    husbandTotalBurden += husbandBurden
    wifeTotalBurden += wifeBurden
  })

  // 最終的な精算方向と金額を計算
  const husbandBalance = husbandTotalPaid - husbandTotalBurden // 夫の過不足（プラス=多く払った、マイナス=少なく払った）
  const wifeBalance = wifeTotalPaid - wifeTotalBurden // 妻の過不足
  
  let totalSettlementAmount: number
  let finalDirection: 'husband_to_wife' | 'wife_to_husband' | 'no_settlement'

  if (husbandBalance > 0) {
    // 夫が多く支払っている → 妻から夫への精算
    totalSettlementAmount = husbandBalance
    finalDirection = 'wife_to_husband'
  } else if (wifeBalance > 0) {
    // 妻が多く支払っている → 夫から妻への精算
    totalSettlementAmount = wifeBalance
    finalDirection = 'husband_to_wife'
  } else {
    // 精算不要
    totalSettlementAmount = 0
    finalDirection = 'no_settlement'
  }

  return {
    totalSettlementAmount: Math.abs(totalSettlementAmount),
    finalDirection,
    husbandTotalPaid,
    wifeTotalPaid,
    husbandTotalBurden,
    wifeTotalBurden,
    approvedSettlements
  }
}

// 精算方向のテキスト表示
export const getSettlementDirectionText = (direction: string): string => {
  switch (direction) {
    case 'husband_to_wife': return '夫 → 妻'
    case 'wife_to_husband': return '妻 → 夫'
    case 'no_settlement': return '精算不要'
    default: return '不明'
  }
}



// 精算状況のテキスト表示
export const getSettlementStatusText = (status: string): string => {
  switch (status) {
    case 'pending': return '保留'
    case 'approved': return '承認済み'
    case 'completed': return '完了'
    default: return status
  }
}

// 精算状況の色
export const getSettlementStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'approved': return 'bg-blue-100 text-blue-800'
    case 'completed': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
} 

// LINE共有用の精算サマリーテキストを生成
export function generateShareableText(summary: SettlementSummary): string {
  const lines: string[] = []
  
  lines.push('【精算サマリー】')
  
  // 最終精算結果
  if (summary.finalDirection === 'no_settlement') {
    lines.push('最終精算結果: 精算不要')
  } else {
    const directionText = getSettlementDirectionText(summary.finalDirection)
    lines.push(`最終精算結果: ${directionText} ¥${summary.totalSettlementAmount.toLocaleString()}`)
  }
  
  lines.push('')
  lines.push('詳細:')
  
  // 夫の詳細
  lines.push(`夫　実際の支払額: ¥${summary.husbandTotalPaid.toLocaleString()}`)
  lines.push(`　　負担すべき額: ¥${Math.round(summary.husbandTotalBurden).toLocaleString()}`)
  const husbandDiff = summary.husbandTotalPaid - summary.husbandTotalBurden
  lines.push(`　　差額: ${husbandDiff >= 0 ? '+' : ''}¥${Math.round(husbandDiff).toLocaleString()}`)
  
  lines.push('')
  
  // 妻の詳細
  lines.push(`妻　実際の支払額: ¥${summary.wifeTotalPaid.toLocaleString()}`)
  lines.push(`　　負担すべき額: ¥${Math.round(summary.wifeTotalBurden).toLocaleString()}`)
  const wifeDiff = summary.wifeTotalPaid - summary.wifeTotalBurden
  lines.push(`　　差額: ${wifeDiff >= 0 ? '+' : ''}¥${Math.round(wifeDiff).toLocaleString()}`)
  
  // 承認済み費用一覧
  if (summary.approvedSettlements.length > 0) {
    lines.push('')
    lines.push('承認済み費用:')
    
    summary.approvedSettlements.forEach(settlement => {
      const payerName = settlement.expense.payer === 'husband' ? '夫' : '妻'
      lines.push(`・${settlement.expense.description}: ¥${settlement.expense.amount.toLocaleString()}（${payerName}支払）`)
    })
    
    const totalAmount = summary.approvedSettlements.reduce((sum, s) => sum + s.expense.amount, 0)
    lines.push('')
    lines.push(`計${summary.approvedSettlements.length}件の費用、総額: ¥${totalAmount.toLocaleString()}`)
  }
  
  // 戻るボタンについての注意喚起
  lines.push('')
  lines.push('LINEで連携した後は、精算サマリーページ上部の"戻る"ボタンを押下することを忘れずに')
  
  return lines.join('\n')
} 
