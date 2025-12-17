// utils/toast.ts
import { toast } from 'sonner'
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react'

interface ToastOptions {
  message: string
  duration?: number
}

// Success Toast
export function showSuccessToast({ message, duration = 3000 }: ToastOptions) {
  toast.custom(
    (id) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#DFF6DD',
          color: '#2E7D32',
          padding: '12px 16px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          minWidth: 250
        }}
      >
        <CheckCircle size={20} />
        <span style={{ flex: 1 }}>{message}</span>
        <button
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 'bold'
          }}
          onClick={() => toast.dismiss(id)}
        >
          ✕
        </button>
      </div>
    ),
    { duration, position: 'top-right' }
  )
}

// Error Toast
export function showErrorToast({ message, duration = 3000 }: ToastOptions) {
  toast.custom(
    (id) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#FFE5E5',
          color: '#D32F2F',
          padding: '12px 16px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          minWidth: 250
        }}
      >
        <XCircle size={20} />
        <span style={{ flex: 1 }}>{message}</span>
        <button
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 'bold'
          }}
          onClick={() => toast.dismiss(id)}
        >
          ✕
        </button>
      </div>
    ),
    { duration, position: 'top-right' }
  )
}

// Info Toast
export function showInfoToast({ message, duration = 3000 }: ToastOptions) {
  toast.custom(
    (id) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#E3F2FD',
          color: '#1565C0',
          padding: '12px 16px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          minWidth: 250
        }}
      >
        <Info size={20} />
        <span style={{ flex: 1 }}>{message}</span>
        <button
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 'bold'
          }}
          onClick={() => toast.dismiss(id)}
        >
          ✕
        </button>
      </div>
    ),
    { duration, position: 'top-right' }
  )
}

// Warning Toast
export function showWarningToast({ message, duration = 3000 }: ToastOptions) {
  toast.custom(
    (id) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#FFF4E5',
          color: '#FF9800',
          padding: '12px 16px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          minWidth: 250
        }}
      >
        <AlertTriangle size={20} />
        <span style={{ flex: 1 }}>{message}</span>
        <button
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 'bold'
          }}
          onClick={() => toast.dismiss(id)}
        >
          ✕
        </button>
      </div>
    ),
    { duration, position: 'top-right' }
  )
}
