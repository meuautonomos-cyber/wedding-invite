'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ReconfirmationService } from '@/lib/reconfirmationService'
import { weddingData } from '@/data/weddingData'

export default function ReconfirmarPage() {
  const [ticketId, setTicketId] = useState('')
  const [reconfirmation, setReconfirmation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<'confirm' | 'cancel' | null>(null)
  const [result, setResult] = useState<{ success: boolean, message: string, requiresPayment?: boolean } | null>(null)
  const [pixData, setPixData] = useState<any>(null)
  const [comprovante, setComprovante] = useState('')

  const reconfirmationService = new ReconfirmationService()

  useEffect(() => {
    // Pegar ticketId da URL
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    if (id) {
      setTicketId(id)
      loadReconfirmation(id)
    }
  }, [loadReconfirmation])

  const loadReconfirmation = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const data = await reconfirmationService.getReconfirmationStatus(id)
      setReconfirmation(data)
    } catch (error) {
      console.error('Erro ao carregar reconfirmação:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleReconfirmation = async (actionType: 'confirm' | 'cancel') => {
    if (!ticketId) return

    setLoading(true)
    setAction(actionType)
    
    try {
      const result = await reconfirmationService.processReconfirmation(ticketId, actionType)
      setResult(result)
      
      if (result.requiresPayment) {
        const pixResult = await reconfirmationService.processTaxPayment(ticketId, '')
        if (pixResult.pixData) {
          setPixData(pixResult.pixData)
        }
      }
    } catch (error) {
      console.error('Erro ao processar reconfirmação:', error)
      setResult({ success: false, message: 'Erro interno do servidor' })
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!ticketId || !comprovante) return

    setLoading(true)
    try {
      const result = await reconfirmationService.processTaxPayment(ticketId, comprovante)
      setResult(result)
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      setResult({ success: false, message: 'Erro interno do servidor' })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading && !reconfirmation) {
    return (
      <div className="min-h-screen bg-wedding-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-gold mx-auto mb-4"></div>
          <p className="text-wedding-olive-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!reconfirmation) {
    return (
      <div className="min-h-screen bg-wedding-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-script text-wedding-olive-800 mb-4">
            Reconfirmação não encontrada
          </h1>
          <p className="text-wedding-olive-600 mb-6">
            Verifique se o link está correto ou entre em contato conosco.
          </p>
          <Link
            href="/"
            className="bg-gradient-to-r from-wedding-gold to-wedding-olive text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-wedding-cream py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-wedding-ring/20"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-script text-wedding-olive-800 mb-4">
              Reconfirmação de Presença
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-wedding-gold to-wedding-olive mx-auto rounded-full mb-4"></div>
            <p className="text-wedding-olive-600">
              Olá <strong>{reconfirmation.nome}</strong>! Confirme sua presença no nosso casamento.
            </p>
          </div>

          {/* Informações do Evento */}
          <div className="bg-wedding-cream-100 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-wedding-olive-800 mb-4">
              Informações do Casamento
            </h2>
            <div className="space-y-2">
              <p><strong>Data:</strong> {weddingData.casamento.evento.data}</p>
              <p><strong>Horário:</strong> {weddingData.casamento.evento.hora}</p>
              <p><strong>Local:</strong> {weddingData.casamento.evento.local_resumo}</p>
              <p><strong>Data limite para reconfirmação:</strong> {formatDate(reconfirmation.data_limite)}</p>
            </div>
          </div>

          {/* Status da Reconfirmação */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-wedding-olive-800 mb-4">
              Status da Reconfirmação
            </h2>
            <div className={`p-4 rounded-xl ${
              reconfirmation.status === 'confirmado' ? 'bg-green-100 text-green-800' :
              reconfirmation.status === 'desistiu' ? 'bg-red-100 text-red-800' :
              reconfirmation.status === 'taxa_paga' ? 'bg-yellow-100 text-yellow-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              <p className="font-medium">
                {reconfirmation.status === 'confirmado' && '✅ Presença Confirmada'}
                {reconfirmation.status === 'desistiu' && '❌ Presença Cancelada'}
                {reconfirmation.status === 'taxa_paga' && '💰 Taxa Paga'}
                {reconfirmation.status === 'pendente' && '⏳ Aguardando Reconfirmação'}
              </p>
            </div>
          </div>

          {/* Ações */}
          {reconfirmation.status === 'pendente' && (
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold text-wedding-olive-800">
                Escolha uma opção:
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleReconfirmation('confirm')}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loading && action === 'confirm' ? 'Confirmando...' : '✅ Confirmar Presença'}
                </button>
                
                <button
                  onClick={() => handleReconfirmation('cancel')}
                  disabled={loading}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loading && action === 'cancel' ? 'Cancelando...' : '❌ Cancelar Presença'}
                </button>
              </div>
            </div>
          )}

          {/* Resultado */}
          {result && (
            <div className={`p-4 rounded-xl mb-6 ${
              result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <p className="font-medium">{result.message}</p>
            </div>
          )}

          {/* PIX para Pagamento */}
          {pixData && (
            <div className="bg-wedding-gold/10 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-wedding-olive-800 mb-4">
                Pagamento da Taxa de Desistência
              </h3>
              <p className="text-wedding-olive-600 mb-4">
                Valor: <strong>{formatCurrency(pixData.valor)}</strong>
              </p>
              <p className="text-wedding-olive-600 mb-4">
                Chave PIX: <strong>{pixData.chave}</strong>
              </p>
              <p className="text-wedding-olive-600 mb-4">
                Descrição: {pixData.descricao}
              </p>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Número do comprovante ou observação"
                  value={comprovante}
                  onChange={(e) => setComprovante(e.target.value)}
                  className="w-full p-3 border border-wedding-ring/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-wedding-gold"
                />
                <button
                  onClick={handlePayment}
                  disabled={loading || !comprovante}
                  className="w-full bg-gradient-to-r from-wedding-gold to-wedding-olive text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Processando...' : 'Enviar Comprovante'}
                </button>
              </div>
            </div>
          )}

          {/* Informações Importantes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              ⚠️ Informações Importantes
            </h3>
            <ul className="text-yellow-700 space-y-2 text-sm">
              <li>• A reconfirmação é obrigatória até {formatDate(reconfirmation.data_limite)}</li>
              <li>• Após esta data, não será mais possível cancelar gratuitamente</li>
              <li>• Cancelamento após a data limite = taxa de {formatCurrency(reconfirmation.taxa_desistencia)}</li>
              <li>• A taxa deve ser paga via PIX para a chave informada</li>
              <li>• Em caso de dúvidas, entre em contato conosco</li>
            </ul>
          </div>

          {/* Botão Voltar */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="text-wedding-olive-600 hover:text-wedding-gold transition-colors duration-300"
            >
              ← Voltar ao site
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
