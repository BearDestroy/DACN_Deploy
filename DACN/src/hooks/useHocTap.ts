import { HocTapContext } from '@/contexts/HocTapContex'
import { useContext } from 'react'

export function useHoctap() {
  const context = useContext(HocTapContext)
  if (!context) throw new Error('useLearning must be used within a LearningProvider')
  return context
}
