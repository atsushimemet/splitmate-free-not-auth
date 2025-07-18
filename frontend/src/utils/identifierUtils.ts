// ランダムな識別子を生成する関数
export function generateRandomId(): string {
  // 英数字のみを使用したランダムな8文字の識別子を生成
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 識別子の形式が正しいかチェックする関数
export function isValidIdentifier(id: string): boolean {
  // 8文字の英数字かどうかをチェック
  const regex = /^[a-z0-9]{8}$/
  return regex.test(id)
}

// URLから識別子を抽出する関数
export function extractIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/([a-z0-9]{8})/)
  return match ? match[1] : null
}

// 識別子付きのパスを生成する関数
export function createPathWithId(id: string, path: string = ''): string {
  return `/${id}${path}`
} 
