import { SettlementCalculation } from '../types'
import { displayYearMonth, parseYearMonth } from '../utils/dateUtils'
import {
    calculateSettlementSummary,
    getSettlementDirectionText,
    getSettlementStatusColor,
    getSettlementStatusText
} from '../utils/settlementUtils'

interface SettlementSummaryProps {
  settlements: SettlementCalculation[]
  onBack: () => void
  onClearApprovedSettlements: () => void
}

export const SettlementSummary = ({ settlements, onBack, onClearApprovedSettlements }: SettlementSummaryProps) => {
  const summary = calculateSettlementSummary(settlements)

  // 戻るボタンのハンドラ（承認済み精算をクリアしてから画面遷移）
  const handleBack = () => {
    const confirmed = window.confirm(
      '「戻る」を押下するとデータがクリアされます。精算サマリーを相手に連携しましたか？'
    )
    
    if (confirmed) {
      onClearApprovedSettlements() // 承認済み精算をクリア
      onBack() // 画面遷移
    }
  }

  // 支払者の表示名
  const getPayerName = (payer: 'husband' | 'wife') => {
    return payer === 'husband' ? '夫' : '妻'
  }

  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    const { year, month } = parseYearMonth(dateString)
    return displayYearMonth(year, month)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full lg:max-w-6xl lg:mx-auto">
        {/* ヘッダー */}
        <header className="text-center py-3 px-4 lg:py-6 bg-white lg:bg-transparent">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm lg:text-base"
            >
              ← 戻る
            </button>
            <div className="flex-1">
              <h1 className="text-lg lg:text-2xl font-bold text-gray-800">精算サマリー</h1>
              <p className="text-gray-600 text-xs lg:text-sm mt-1">承認済み費用の精算結果</p>
            </div>
            <div className="w-12"></div> {/* 戻るボタンとのバランス調整 */}
          </div>
        </header>

        <div className="px-2 lg:px-0 space-y-4 lg:space-y-6">
          {/* 精算結果カード */}
          <div className="bg-white lg:rounded-lg lg:shadow-md p-4 lg:p-6">
            <h2 className="text-base lg:text-lg font-semibold mb-4 text-center">最終精算結果</h2>
            
            {summary.finalDirection === 'no_settlement' ? (
              <div className="text-center py-6">
                <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-2">精算不要</div>
                <p className="text-gray-600">承認済みの費用がないか、精算が必要ありません</p>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-xl lg:text-2xl font-bold text-blue-600 mb-2">
                  {getSettlementDirectionText(summary.finalDirection)}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                  ¥{summary.totalSettlementAmount.toLocaleString()}
                </div>
                <p className="text-gray-600 text-sm lg:text-base">
                  {summary.finalDirection === 'husband_to_wife' 
                    ? '夫から妻に精算してください' 
                    : '妻から夫に精算してください'}
                </p>
              </div>
            )}
          </div>

          {/* 支払い・負担額の詳細 */}
          <div className="bg-white lg:rounded-lg lg:shadow-md p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold mb-4">支払い・負担額の詳細</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* 夫の詳細 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-600 mb-3">夫</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">実際の支払額:</span>
                    <span className="font-medium">¥{summary.husbandTotalPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">負担すべき額:</span>
                    <span className="font-medium">¥{Math.round(summary.husbandTotalBurden).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">差額:</span>
                    <span className={`font-medium ${summary.husbandTotalPaid - summary.husbandTotalBurden >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {summary.husbandTotalPaid - summary.husbandTotalBurden >= 0 ? '+' : ''}
                      ¥{Math.round(summary.husbandTotalPaid - summary.husbandTotalBurden).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 妻の詳細 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-pink-600 mb-3">妻</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">実際の支払額:</span>
                    <span className="font-medium">¥{summary.wifeTotalPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">負担すべき額:</span>
                    <span className="font-medium">¥{Math.round(summary.wifeTotalBurden).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">差額:</span>
                    <span className={`font-medium ${summary.wifeTotalPaid - summary.wifeTotalBurden >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {summary.wifeTotalPaid - summary.wifeTotalBurden >= 0 ? '+' : ''}
                      ¥{Math.round(summary.wifeTotalPaid - summary.wifeTotalBurden).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 承認済み費用一覧 */}
          {summary.approvedSettlements.length > 0 && (
            <div className="bg-white lg:rounded-lg lg:shadow-md">
              <div className="p-4 lg:p-6 border-b border-gray-200">
                <h3 className="text-base lg:text-lg font-semibold">承認済み費用明細</h3>
                <p className="text-gray-600 text-sm mt-1">{summary.approvedSettlements.length}件の費用</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        費用
                      </th>
                      <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        支払者
                      </th>
                      <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        年月
                      </th>
                      <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        夫負担
                      </th>
                      <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        妻負担
                      </th>
                      <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状況
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {summary.approvedSettlements.map((settlement) => (
                      <tr key={settlement.expenseId} className="hover:bg-gray-50">
                        <td className="px-3 lg:px-4 py-3 lg:py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{settlement.expense.description}</div>
                          <div className="text-xs lg:text-sm text-gray-500">¥{settlement.expense.amount.toLocaleString()}</div>
                        </td>
                        <td className="px-3 lg:px-4 py-3 lg:py-4 whitespace-nowrap text-sm text-gray-900">
                          {getPayerName(settlement.expense.payer)}
                        </td>
                        <td className="px-3 lg:px-4 py-3 lg:py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(settlement.expense.date)}
                        </td>
                        <td className="px-3 lg:px-4 py-3 lg:py-4 whitespace-nowrap text-sm text-gray-900">
                          ¥{Math.round(settlement.husbandBurden).toLocaleString()}
                        </td>
                        <td className="px-3 lg:px-4 py-3 lg:py-4 whitespace-nowrap text-sm text-gray-900">
                          ¥{Math.round(settlement.wifeBurden).toLocaleString()}
                        </td>
                        <td className="px-3 lg:px-4 py-3 lg:py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSettlementStatusColor(settlement.status)}`}>
                            {getSettlementStatusText(settlement.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
