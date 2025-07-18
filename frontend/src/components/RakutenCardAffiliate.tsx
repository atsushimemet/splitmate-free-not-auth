
export const RakutenCardAffiliate = () => {
  const handleRakutenCardClick = () => {
    // 楽天カードのアフィリエイトリンクを新しいタブで開く
    window.open('https://www.rakuten-card.co.jp/e-navi/members/guide/point/', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 lg:p-6 mt-6">
      <div className="flex items-start space-x-3 lg:space-x-4">
        {/* 楽天カードアイコン */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg 
              className="w-6 h-6 lg:w-7 lg:h-7 text-orange-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
              />
            </svg>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-1">
            楽天カードでポイント還元
          </h3>
          <p className="text-sm lg:text-base text-gray-600 mb-3">
            家計費の支払いで楽天ポイントを貯めて、さらにお得に！
          </p>
          
          {/* 特典リスト */}
          <div className="space-y-1 mb-4">
            <div className="flex items-center text-sm text-gray-700">
              <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              年会費永年無料
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              1,000円で1ポイント還元
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              最短即日発行可能
            </div>
          </div>

          {/* CTAボタン */}
          <button
            onClick={handleRakutenCardClick}
            className="w-full lg:w-auto px-4 py-2 bg-orange-600 text-white text-sm lg:text-base font-medium rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>楽天カードを詳しく見る</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      </div>

      {/* 注意書き */}
      <div className="mt-3 pt-3 border-t border-orange-200">
        <p className="text-xs text-gray-500">
          ※ 楽天カードの詳細・お申し込みは楽天カード公式サイトでご確認ください
        </p>
      </div>
    </div>
  )
} 
