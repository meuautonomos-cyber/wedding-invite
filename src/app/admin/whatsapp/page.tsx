'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, PhoneIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { whatsappService } from '@/lib/whatsappService'

export default function WhatsAppConfigPage() {
  const router = useRouter()
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [testMessage, setTestMessage] = useState('')

  useEffect(() => {
    // Carregar número salvo ou usar o padrão
    const savedNumber = localStorage.getItem('wedding-whatsapp-number')
    if (savedNumber) {
      setWhatsappNumber(savedNumber)
    } else {
      // Usar número padrão do casal
      setWhatsappNumber('(27) 99637-2592')
    }
  }, [])

  const handleSave = async () => {
    if (!whatsappNumber) {
      alert('Por favor, informe o número do WhatsApp')
      return
    }

    setIsSaving(true)
    
    try {
      // Salvar número no localStorage
      localStorage.setItem('wedding-whatsapp-number', whatsappNumber)
      
      // Número salvo com sucesso
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar configuração')
    } finally {
      setIsSaving(false)
    }
  }

  const handleTest = () => {
    if (!whatsappNumber) {
      alert('Por favor, configure o número do WhatsApp primeiro')
      return
    }

    const testService = new (whatsappService.constructor as any)(whatsappNumber)
    const message = testService.generateTestMessage()
    setTestMessage(message)
  }

  const formatPhoneNumber = (value: string) => {
    // Remove caracteres não numéricos
    const numbers = value.replace(/\D/g, '')
    
    // Aplica máscara (XX) XXXXX-XXXX
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    
    return numbers.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  return (
    <div className="min-h-screen bg-wedding-cream page-container">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-wedding-cream-200 z-10">
        <div className="flex items-center justify-between p-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="p-2 hover:bg-wedding-cream-100 rounded-full transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeftIcon className="w-5 h-5 text-wedding-green-600" />
          </motion.button>
          <h1 className="text-xl font-script text-wedding-green-800 title-elegant">
            Configuração WhatsApp
          </h1>
          <div className="w-9"></div>
        </div>
      </header>

      <main className="px-4 py-8 max-w-2xl mx-auto">
        {/* Card de configuração */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <PhoneIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-wedding-green-800">
                Número do WhatsApp
              </h2>
              <p className="text-wedding-green-600 text-sm">
                Configure o número que receberá as confirmações
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-wedding-green-700 mb-2">
                Número do WhatsApp (com DDD)
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(formatPhoneNumber(e.target.value))}
                placeholder="(27) 99999-9999"
                className="w-full px-4 py-3 border border-wedding-cream-300 rounded-lg focus:ring-2 focus:ring-wedding-green-500 focus:border-transparent"
                maxLength={15}
              />
              <p className="text-xs text-wedding-green-600 mt-1">
                Exemplo: (27) 99999-9999
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving || !whatsappNumber}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Salvando...' : 'Salvar Configuração'}
              </button>
              
              <button
                onClick={handleTest}
                disabled={!whatsappNumber}
                className="px-4 py-3 bg-wedding-cream-100 text-wedding-green-700 rounded-lg hover:bg-wedding-cream-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Testar
              </button>
            </div>
          </div>
        </motion.div>

        {/* Card de preview da mensagem */}
        {testMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-wedding-green-800 mb-4">
              Preview da Mensagem
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {testMessage}
              </pre>
            </div>
            <p className="text-xs text-wedding-green-600 mt-2">
              Esta é uma mensagem de exemplo. A mensagem real será personalizada com os dados do convidado.
            </p>
          </motion.div>
        )}

        {/* Card de informações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-wedding-cream-50 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-wedding-green-800 mb-4">
            Como Funciona
          </h3>
          <ul className="space-y-2 text-sm text-wedding-green-700">
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Quando alguém confirmar presença, uma mensagem será enviada automaticamente para este número</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>A mensagem incluirá o nome do convidado, status da confirmação e detalhes do evento</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Também incluirá a lista de presentes e instruções importantes</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>O WhatsApp abrirá automaticamente para o convidado enviar a mensagem</span>
            </li>
          </ul>
        </motion.div>

        {/* Modal de sucesso */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full text-center"
            >
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-wedding-green-800 mb-2">
                Configuração Salva!
              </h3>
              <p className="text-wedding-green-700 mb-4">
                O número do WhatsApp foi configurado com sucesso.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="btn-primary w-full"
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
