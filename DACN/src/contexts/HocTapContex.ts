import type { HocTapContextType } from '@/@types/ContextType/ContextType'
import { createContext } from 'react'

export const HocTapContext = createContext<HocTapContextType | undefined>(undefined)
