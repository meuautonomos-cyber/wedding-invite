'use client'

import { useState } from 'react'

export default function TestWhatsAppPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testWhatsApp = async () => {
    setLoading(true)
    setResult('🔄 Testando...')
    
    try {
      const response = await fetch('https://api.w-api.app/v1/message/send-text?instanceId=LITE-QX34ES-9ZAQ0P', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer jraQjMkKP80u84RuNVueGqqNS4hIExa7M'
        },
        body: JSON.stringify({
          phone: '55279998437371',
          message: '🧪 TESTE NEXT.JS - Mensagem enviada do projeto Next.js!'
        })
      })

      if (response.ok) {
        const result = await response.json()
        setResult(`✅ Sucesso! MessageId: ${result.messageId}`)
      } else {
        const error = await response.text()
        setResult(`❌ Erro: ${error}`)
      }
    } catch (error: any) {
      setResult(`❌ Erro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🧪 Teste WhatsApp
        </h1>
        
        <button
          onClick={testWhatsApp}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          {loading ? '🔄 Testando...' : '📱 Testar Envio WhatsApp'}
        </button>
        
        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <pre className="text-sm">{result}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
