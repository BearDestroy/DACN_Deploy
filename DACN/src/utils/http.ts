// utils/axios.config.ts
import axios, { type AxiosInstance } from 'axios'

const BACKEND_URL = '1.55.203.158:5154/api/'

export const httpInstance: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})
