'use client'

import { useState } from 'react'

export default function TestWhatsAppServicePage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testWhatsAppService = async () => {
    setLoading(true)
    setResult('🔄 Testando WhatsAppService...')
    
    try {
      // Importar o WhatsAppService
      const { WhatsAppService } = await import('@/lib/whatsappService')
      const whatsappService = new WhatsAppService('https://eclectic-biscochitos-4c5969.netlify.app')
      
      const testData = {
        nome: "João Silva",
        telefone: "279998437371",
        status: "confirmado" as const,
        ticketId: "TEST123456",
        observacoes: "Teste do WhatsAppService",
        restricoes_alimentares: "Vegetariano"
      }
      
      console.log('🧪 Testando com dados:', testData)
      
      const success = await whatsappService.sendViaAPI(testData)
      
      if (success) {
        setResult('✅ WhatsAppService funcionou! Mensagem enviada com sucesso.')
      } else {
        setResult('❌ WhatsAppService falhou ao enviar mensagem.')
      }
    } catch (error: any) {
      setResult(`❌ Erro: ${error.message}`)
      console.error('Erro completo:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🧪 Teste WhatsAppService
        </h1>
        
        <button
          onClick={testWhatsAppService}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          {loading ? '🔄 Testando...' : '📱 Testar WhatsAppService'}
        </button>
        
        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-600">
          <p>📱 Telefone de teste: 279998437371</p>
          <p>🔧 Verifique o console do navegador para logs detalhados</p>
        </div>
      </div>
    </div>
  )
}
