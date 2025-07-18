import { useState } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate, useParams } from 'react-router-dom'
import { AccessDenied } from './components/AccessDenied'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { SettlementSummary } from './components/SettlementSummary'
import { ShareComponent } from './components/ShareComponent'
import { AppProvider, useAppContext } from './context/AppContext'
import { ExpenseForm as ExpenseFormType } from './types'
import { createPathWithId, generateRandomId, isIdentifierExists, isValidIdentifier } from './utils/identifierUtils'
import {
    getSettlementDirectionText,
    getSettlementStatusColor,
    getSettlementStatusText
} from './utils/settlementUtils'

type TabType = 'expense' | 'allocation' | 'settlement'



// メインのタブコンポーネント
function MainTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('expense')
  const appState = useAppContext()
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  
  // ルートページの場合はuserIdがundefinedになるので、AppContextから取得
  const currentUserId = userId || appState.userId

  const tabs = [
    { id: 'expense', label: '費用入力', content: <ExpenseTab appState={appState} /> },
    { id: 'allocation', label: '配分比率設定', content: <AllocationTab appState={appState} /> },
    { id: 'settlement', label: '精算管理', content: <SettlementTab appState={appState} navigate={navigate} userId={currentUserId} /> }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full lg:max-w-6xl lg:mx-auto">
        <header className="py-3 px-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">SplitMate</h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">家計費精算システム</p>
            </div>
            <ShareComponent />
          </div>
        </header>

        {/* タブナビゲーション */}
        <div className="bg-white lg:rounded-lg lg:shadow-md mx-2 lg:mx-0">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-1 py-3 px-2 lg:px-6 text-xs lg:text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab.id as TabType)}
                >
                  <span className="block lg:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* タブコンテンツ */}
          <div className="p-3 lg:p-6">
            {tabs.find(tab => tab.id === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  )
}

// Appコンポーネント（ルーター統合）
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootPage />} />
        <Route path="/:userId" element={<AppWrapper />} />
        <Route path="/:userId/settlement-summary" element={<SettlementSummaryWrapper />} />
      </Routes>
    </Router>
  )
}

// ルートページコンポーネント
function RootPage() {
  const newId = generateRandomId()
  return <Navigate to={createPathWithId(newId)} replace />
}

// AppProviderでラップされたMainTabs
function AppWrapper() {
  const { userId } = useParams<{ userId: string }>()
  
  if (!userId || !isValidIdentifier(userId)) {
    return <Navigate to="/" replace />
  }

  // 識別子が存在するかチェック
  if (!isIdentifierExists(userId)) {
    return <AccessDenied />
  }

  return (
    <AppProvider userId={userId}>
      <MainTabs />
    </AppProvider>
  )
}

// AppProviderでラップされたSettlementSummaryPage
function SettlementSummaryWrapper() {
  const { userId } = useParams<{ userId: string }>()
  
  if (!userId || !isValidIdentifier(userId)) {
    return <Navigate to="/" replace />
  }

  // 識別子が存在するかチェック
  if (!isIdentifierExists(userId)) {
    return <AccessDenied />
  }

  return (
    <AppProvider userId={userId}>
      <SettlementSummaryPage />
    </AppProvider>
  )
}

// 精算サマリーページ
function SettlementSummaryPage() {
  const appState = useAppContext()
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()

  const handleBack = () => {
    if (userId) {
      navigate(createPathWithId(userId))
    }
  }

  return (
    <SettlementSummary 
      settlements={appState.settlements} 
      onBack={handleBack}
      onClearApprovedSettlements={appState.clearApprovedSettlements}
    />
  )
}

// 費用入力タブ
function ExpenseTab({ appState }: { appState: any }) {
  const { expenses, addExpense, deleteExpense, updateExpense } = appState

  const handleAddExpense = (expenseForm: ExpenseFormType) => {
    addExpense(expenseForm)
  }

  return (
    <div className="space-y-6">
      <ExpenseForm onSubmit={handleAddExpense} />
      <ExpenseList 
        expenses={expenses}
        onDelete={deleteExpense}
        onUpdate={updateExpense}
      />
    </div>
  )
}

// 配分比率設定タブ
function AllocationTab({ appState }: { appState: any }) {
  const { allocationRatio, updateAllocationRatio } = appState
  const [husbandRatio, setHusbandRatio] = useState(allocationRatio.husband.toString())
  const [wifeRatio, setWifeRatio] = useState(allocationRatio.wife.toString())

  const handleRatioChange = (type: 'husband' | 'wife', value: string) => {
    const numValue = Number(value)
    if (isNaN(numValue) || numValue < 0 || numValue > 100) return

    if (type === 'husband') {
      setHusbandRatio(value)
      setWifeRatio((100 - numValue).toString())
    } else {
      setWifeRatio(value)
      setHusbandRatio((100 - numValue).toString())
    }
  }

  const handleSave = () => {
    const husband = Number(husbandRatio)
    const wife = Number(wifeRatio)
    
    if (husband + wife === 100) {
      updateAllocationRatio({ husband, wife })
      alert('配分比率を更新しました')
    } else {
      alert('合計が100%になるように設定してください')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-6">配分比率設定</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            夫の負担比率（%）
          </label>
          <input
            type="number"
            value={husbandRatio}
            onChange={(e) => handleRatioChange('husband', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            妻の負担比率（%）
          </label>
          <input
            type="number"
            value={wifeRatio}
            onChange={(e) => handleRatioChange('wife', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            max="100"
          />
        </div>

        <div className="text-sm text-gray-600">
          合計: {Number(husbandRatio) + Number(wifeRatio)}%
        </div>

        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          設定を保存
        </button>
      </div>
    </div>
  )
}

// 精算管理タブ
function SettlementTab({ 
  appState, 
  navigate,
  userId
}: { 
  appState: any, 
  navigate: (path: string) => void,
  userId: string
}) {
  const { settlements, approveSettlement, completeSettlement } = appState
  const [selectedSettlements, setSelectedSettlements] = useState<Set<string>>(new Set())

  const handleSelectAll = () => {
    if (selectedSettlements.size === settlements.length) {
      setSelectedSettlements(new Set())
    } else {
      setSelectedSettlements(new Set(settlements.map((s: any) => s.expenseId)))
    }
  }

  const handleSelectItem = (expenseId: string) => {
    const newSelected = new Set(selectedSettlements)
    if (newSelected.has(expenseId)) {
      newSelected.delete(expenseId)
    } else {
      newSelected.add(expenseId)
    }
    setSelectedSettlements(newSelected)
  }

  const handleBulkApprove = () => {
    if (window.confirm(`選択した${selectedSettlements.size}件の精算を承認しますか？`)) {
      selectedSettlements.forEach(expenseId => approveSettlement(expenseId))
      setSelectedSettlements(new Set())
    }
  }

  const handleViewSummary = () => {
    navigate(createPathWithId(userId, '/settlement-summary'))
  }

  // 承認済み精算の件数
  const approvedCount = settlements.filter((s: any) => s.status === 'approved').length

  if (settlements.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">精算管理</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-500 text-center py-8">精算対象の費用がありません</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-3 lg:gap-0">
        <h2 className="text-xl font-semibold">精算管理</h2>
        
        <div className="flex gap-2">
          {/* 精算サマリーボタン */}
          {approvedCount > 0 && (
            <button
              onClick={handleViewSummary}
              className="px-3 lg:px-4 py-2 bg-green-600 text-white text-xs lg:text-sm rounded-md hover:bg-green-700 whitespace-nowrap"
            >
              精算サマリー ({approvedCount}件)
            </button>
          )}
          
          {/* 一括承認ボタン */}
          {selectedSettlements.size > 0 && (
            <button
              onClick={handleBulkApprove}
              className="px-3 lg:px-4 py-2 bg-blue-600 text-white text-xs lg:text-sm rounded-md hover:bg-blue-700 whitespace-nowrap"
            >
              一括承認 ({selectedSettlements.size})
            </button>
          )}
        </div>
      </div>

      <div className="bg-white lg:rounded-lg lg:shadow-md">
        <div className="p-4 border-b border-gray-200">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={selectedSettlements.size === settlements.length && settlements.length > 0}
              onChange={handleSelectAll}
              className="rounded"
            />
            全選択
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">選択</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">費用</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">夫負担</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">妻負担</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">精算方向</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">精算金額</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状況</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {settlements.map((settlement: any) => (
                <tr key={settlement.expenseId} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedSettlements.has(settlement.expenseId)}
                      onChange={() => handleSelectItem(settlement.expenseId)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{settlement.expense.description}</div>
                    <div className="text-sm text-gray-500">¥{settlement.expense.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ¥{Math.round(settlement.husbandBurden).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ¥{Math.round(settlement.wifeBurden).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getSettlementDirectionText(settlement.settlementDirection)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ¥{Math.round(settlement.settlementAmount).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSettlementStatusColor(settlement.status)}`}>
                      {getSettlementStatusText(settlement.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {settlement.status === 'pending' && (
                      <button
                        onClick={() => approveSettlement(settlement.expenseId)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        承認
                      </button>
                    )}
                    {settlement.status === 'approved' && (
                      <button
                        onClick={() => completeSettlement(settlement.expenseId)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        完了
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App 
