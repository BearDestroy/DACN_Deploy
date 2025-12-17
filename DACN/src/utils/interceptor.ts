import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'

const httpInstance: AxiosInstance = axios.create({
  baseURL: '/api'
})

httpInstance.interceptors.request.use(async (config) => {
  const token = await localStorage.getItem('access_token')
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<IBackendRes<T>> =>
    httpInstance.get<IBackendRes<T>>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IBackendRes<T>> =>
    httpInstance.post<IBackendRes<T>>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IBackendRes<T>> =>
    httpInstance.put<IBackendRes<T>>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<IBackendRes<T>> =>
    httpInstance.delete<IBackendRes<T>>(url, config).then((res) => res.data)
}
