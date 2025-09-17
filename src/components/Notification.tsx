'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface NotificationProps {
  isVisible: boolean
  type: 'success' | 'error' | 'info'
  title: string
  message: string
  onClose: () => void
  duration?: number
}

export default function Notification({ 
  isVisible, 
  type, 
  title, 
  message, 
  onClose, 
  duration = 5000 
}: NotificationProps) {
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [isVisible, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />
      case 'error':
        return <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
      case 'info':
        return <InformationCircleIcon className="w-6 h-6 text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className="fixed top-4 right-4 z-50 max-w-sm w-full"
        >
          <div className={`p-4 rounded-lg border shadow-lg ${getBgColor()}`}>
            <div className="flex items-start gap-3">
              {getIcon()}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {title}
                </h4>
                <p className="text-gray-700 text-sm mt-1">
                  {message}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fechar notificação"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
