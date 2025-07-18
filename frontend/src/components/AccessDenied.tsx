import { useNavigate } from 'react-router-dom'
import { createPathWithId, generateRandomId } from '../utils/identifierUtils'
import { ShareComponent } from './ShareComponent'

export const TopPage = () => {
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
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
              />
            </svg>
          </div>

          {/* タイトル */}
          <h1 
            className="text-xl lg:text-2xl font-bold text-gray-800 mb-3 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => navigate('/landing_page')}
          >
            SplitMate
          </h1>

          {/* サブタイトル */}
          <p className="text-lg text-gray-600 mb-2">
            家計費精算システム
          </p>

          {/* メッセージ */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            夫婦の家計費を簡単に管理・精算できる<br />
            シンプルで使いやすいアプリです。
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
              無料で利用できます
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
