
export const RakutenCardBanner = () => {
  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
      <div className="text-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          💡夫婦で割り勘が面倒なら家族カードを！
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          楽天カードで家計費の支払いを一元化して、ポイント還元もお得に
        </p>
      </div>
      
      <div className="flex justify-center">
        <a 
          href="https://hb.afl.rakuten.co.jp/hsc/4a79da6d.d9c1ce17.4a79d932.d7886e02/?link_type=pict&ut=eyJwYWdlIjoic2hvcCIsInR5cGUiOiJwaWN0IiwiY29sIjoxLCJjYXQiOjEsImJhbiI6MTY2NzYzLCJhbXAiOmZhbHNlfQ%3D%3D" 
          target="_blank" 
          rel="nofollow sponsored noopener"
          className="inline-block"
        >
          <img 
            src="https://hbb.afl.rakuten.co.jp/hsb/4a79da6d.d9c1ce17.4a79d932.d7886e02/?me_id=2101008&me_adv_id=166763&t=pict" 
            style={{ margin: '2px' }} 
            alt="楽天カード" 
            title="楽天カード"
            className="max-w-full h-auto"
          />
        </a>
      </div>
      
      <div className="mt-3 pt-3 border-t border-orange-200">
        <p className="text-xs text-gray-500 text-center">
          ※ 楽天カードの詳細・お申し込みは楽天カード公式サイトでご確認ください<br />
          ※ このリンクはPR（プロモーション）です
        </p>
      </div>
    </div>
  )
} 
