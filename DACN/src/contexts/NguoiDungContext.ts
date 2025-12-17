import type { NguoiDungContextType } from '@/@types/ContextType/ContextType'
import { createContext } from 'react'

export const NguoiDungContext = createContext<NguoiDungContextType | undefined>(undefined)
