import { useNavigate } from 'react-router-dom'
import { ShareComponent } from './ShareComponent'

export const LandingPage = () => {
  const navigate = useNavigate()

  const handleStartUsing = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SplitMate</h1>
              <span className="ml-2 text-sm text-gray-500">家計費精算システム</span>
            </div>
            <ShareComponent />
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ヒーローセクション */}
        <section className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            夫婦の家計費を
            <span className="text-blue-600">簡単に精算</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            毎月の家計費の支払いと精算で悩んでいませんか？<br />
            SplitMateなら、夫婦の家計費を簡単に管理・精算できます。
          </p>
          <button
            onClick={handleStartUsing}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            無料で始める
          </button>
        </section>

        {/* 課題セクション */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">こんな課題ありませんか？</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">家計費の管理が複雑</h4>
              <p className="text-gray-600">
                誰が何を支払ったか、いくら精算すればいいか、計算が面倒で時間がかかる
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">精算の記録が残らない</h4>
              <p className="text-gray-600">
                精算した金額の記録が残らず、後から確認できない
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">配分比率の調整が困難</h4>
              <p className="text-gray-600">
                収入の差がある場合の配分比率を手動で計算するのが大変
              </p>
            </div>
          </div>
        </section>

        {/* 解決策セクション */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">SplitMateで解決できます</h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">簡単な費用入力</h4>
                  <p className="text-gray-600">
                    費用の内容、金額、支払者を入力するだけで、自動的に精算金額を計算します。
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">柔軟な配分比率設定</h4>
                  <p className="text-gray-600">
                    夫婦の収入差に応じて、配分比率を自由に設定できます（例：夫70%、妻30%）。
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">精算サマリーの共有</h4>
                  <p className="text-gray-600">
                    精算結果をLINEで簡単に共有でき、相手に精算金額を伝えることができます。
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-4">主な機能</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  費用の入力・編集・削除
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  配分比率の設定（夫・妻）
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  自動精算計算
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  精算サマリーの表示
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  LINE共有用テキスト生成
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  データの永続化（ブラウザ保存）
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 利用方法セクション */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">利用方法</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-3">ページを作成</h4>
              <p className="text-gray-600">
                「無料で始める」ボタンを押して、新しいページを作成します。
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-3">費用を入力</h4>
              <p className="text-gray-600">
                家計費の内容、金額、支払者を入力します。
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-3">精算を実行</h4>
              <p className="text-gray-600">
                精算管理タブで精算を承認し、サマリーを共有します。
              </p>
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="text-center bg-white p-12 rounded-lg shadow-md">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            今すぐ始めませんか？
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            夫婦の家計費精算を簡単に。無料で利用できます。
          </p>
          <button
            onClick={handleStartUsing}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            無料で始める
          </button>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 SplitMate. 夫婦の家計費精算を簡単に。
          </p>
        </div>
      </footer>
    </div>
  )
} 
