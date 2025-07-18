import { createContext, ReactNode, useContext } from 'react'
import { useAppState } from '../hooks/useAppState'

// Context型定義
type AppContextType = ReturnType<typeof useAppState>

const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider コンポーネント
interface AppProviderProps {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const appState = useAppState()
  
  return (
    <AppContext.Provider value={appState}>
      {children}
    </AppContext.Provider>
  )
}

// カスタムフック
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
} 
