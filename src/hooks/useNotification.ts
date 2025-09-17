'use client'

import { useState, useCallback } from 'react'

interface NotificationState {
  isVisible: boolean
  type: 'success' | 'error' | 'info'
  title: string
  message: string
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    type: 'info',
    title: '',
    message: ''
  })

  const showNotification = useCallback((
    type: 'success' | 'error' | 'info',
    title: string,
    message: string
  ) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message
    })
  }, [])

  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }))
  }, [])

  const showSuccess = useCallback((title: string, message: string) => {
    showNotification('success', title, message)
  }, [showNotification])

  const showError = useCallback((title: string, message: string) => {
    showNotification('error', title, message)
  }, [showNotification])

  const showInfo = useCallback((title: string, message: string) => {
    showNotification('info', title, message)
  }, [showNotification])

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showInfo
  }
}
