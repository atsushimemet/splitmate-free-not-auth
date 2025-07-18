import { useNavigate } from 'react-router-dom'
import { createPathWithId, generateRandomId } from '../utils/identifierUtils'
import { ShareComponent } from './ShareComponent'

export const AccessDenied = () => {
  const navigate = useNavigate()

  const handleCreateNewPage = () => {
    // 新しい識別子を生成
    const newId = generateRandomId()
    
    // 初期データをlocalStorageに作成
    const initialData = {
      expenses: [],
      allocation: { husband: 70, wife: 30 },
      settlements: []
    }
    
    try {
      localStorage.setItem(`splitmate_${newId}_expenses`, JSON.stringify(initialData.expenses))
      localStorage.setItem(`splitmate_${newId}_allocation`, JSON.stringify(initialData.allocation))
      localStorage.setItem(`splitmate_${newId}_settlements`, JSON.stringify(initialData.settlements))
      
      // 新しいページにリダイレクト
      navigate(createPathWithId(newId), { replace: true })
    } catch (error) {
      console.error('初期データ作成エラー:', error)
      // エラーの場合は通常のルートリダイレクト
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-6 lg:p-8 text-center">
          {/* アイコン */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>

          {/* タイトル */}
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3">
            アクセスできません
          </h1>

          {/* メッセージ */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            このページは作成者しか見ることができません。<br />
            新しいページを作成するか、正しいURLをご確認ください。
          </p>

          {/* アクションボタン */}
          <div className="space-y-3">
            <button
              onClick={handleCreateNewPage}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              新しいページを作成
            </button>
            
            <div className="flex items-center justify-center">
              <ShareComponent />
            </div>
          </div>

          {/* 追加情報 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              SplitMate - 家計費精算システム
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
