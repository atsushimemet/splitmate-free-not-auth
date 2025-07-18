import { useState } from 'react'

interface ShareComponentProps {
  className?: string
}

export const ShareComponent = ({ className = '' }: ShareComponentProps) => {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      // プロダクト自体を共有するためのルートURL
      const shareUrl = `${window.location.protocol}//${window.location.host}/`
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('URLのコピーに失敗しました:', err)
      // フォールバック: 古いブラウザ対応
      try {
        const textArea = document.createElement('textarea')
        const shareUrl = `${window.location.protocol}//${window.location.host}/`
        textArea.value = shareUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackErr) {
        console.error('フォールバック方式でもコピーに失敗しました:', fallbackErr)
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-1 px-2 lg:px-3 py-1 lg:py-2 text-xs lg:text-sm rounded-md transition-all ${
        copied 
          ? 'bg-green-600 text-white' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } ${className}`}
      title="アプリを友人に紹介"
    >
      <svg 
        className="w-3 h-3 lg:w-4 lg:h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        {copied ? (
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7" 
          />
        ) : (
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" 
          />
        )}
      </svg>
      <span className="hidden lg:inline">
        {copied ? 'コピー完了!' : 'アプリ紹介'}
      </span>
    </button>
  )
} 
