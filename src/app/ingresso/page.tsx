'use client'

import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { ArrowLeftIcon, CheckCircleIcon, CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'
import { weddingData } from '@/data/weddingData'
import { supabaseStorage, TicketData } from '@/lib/supabaseStorage'

function IngressoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ticketData, setTicketData] = useState<TicketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { noivos, evento } = weddingData.casamento

  useEffect(() => {
    const ticketId = searchParams.get('id')
    if (!ticketId) {
      setError('Ingresso não encontrado')
      setLoading(false)
      return
    }

    // Buscar dados do ingresso
    const loadTicket = async () => {
      try {
        const ticket = await supabaseStorage.getTicketById(ticketId)
        
        if (ticket) {
          setTicketData(ticket)
        } else {
          setError('Ingresso não encontrado')
        }
      } catch (err) {
        console.error('Erro ao carregar ingresso:', err)
        setError('Erro ao carregar ingresso')
      } finally {
        setLoading(false)
      }
    }

    loadTicket()
  }, [searchParams])

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado'
      case 'com_acompanhante':
        return 'Com Acompanhante'
      case 'nao_poderei':
        return 'Não Poderá Ir'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'text-green-600 bg-green-100'
      case 'com_acompanhante':
        return 'text-blue-600 bg-blue-100'
      case 'nao_poderei':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-wedding-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-olive mx-auto mb-4"></div>
          <p className="text-wedding-olive-ink">Carregando seu ingresso...</p>
        </div>
      </div>
    )
  }

  if (error || !ticketData) {
    return (
      <div className="min-h-screen bg-wedding-cream flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎫</div>
          <h1 className="text-2xl font-script text-wedding-olive-ink mb-4">
            Ingresso não encontrado
          </h1>
          <p className="text-wedding-olive-ink mb-6">
            {error || 'O ingresso solicitado não foi encontrado.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
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
            Seu Ingresso
          </h1>
          <div className="w-9"></div>
        </div>
      </header>

      <main className="px-4 py-8 max-w-md mx-auto">
        {/* Ingresso Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-wedding-gold">
            {/* Header do Ingresso */}
            <div className="bg-gradient-to-r from-wedding-olive to-wedding-olive-ink p-6 text-center">
              <h2 className="text-2xl font-script text-wedding-gold mb-2">
                {noivos.nome_noiva} & {noivos.nome_noivo}
              </h2>
              <p className="text-wedding-cream text-sm">Cerimônia de Casamento</p>
            </div>

            {/* Conteúdo do Ingresso */}
            <div className="p-6">
              {/* Nome do Convidado */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-script text-wedding-olive-ink mb-2">
                  {ticketData.nome}
                </h3>
                {ticketData.acompanhante && (
                  <p className="text-wedding-olive-ink">
                    + {ticketData.acompanhante}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="text-center mb-6">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(ticketData.status)}`}>
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  {getStatusText(ticketData.status)}
                </span>
              </div>

              {/* Detalhes do Evento */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-wedding-olive" />
                  <div>
                    <p className="text-sm text-wedding-olive-ink font-medium">Data</p>
                    <p className="text-wedding-olive-ink">{evento.data}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ClockIcon className="w-5 h-5 text-wedding-olive" />
                  <div>
                    <p className="text-sm text-wedding-olive-ink font-medium">Horário</p>
                    <p className="text-wedding-olive-ink">{evento.hora}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-wedding-olive" />
                  <div>
                    <p className="text-sm text-wedding-olive-ink font-medium">Local</p>
                    <p className="text-wedding-olive-ink">{evento.local_resumo}</p>
                  </div>
                </div>
              </div>

              {/* Código do Ingresso */}
              <div className="text-center border-t border-wedding-cream-200 pt-4">
                <p className="text-xs text-wedding-olive-ink mb-2">Código do Ingresso</p>
                <p className="font-mono text-sm text-wedding-olive font-bold">
                  {ticketData.id}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Informações Importantes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-script text-wedding-olive-ink mb-4 text-center">
              Informações Importantes
            </h3>
            <ul className="space-y-2 text-sm text-wedding-olive-ink">
              <li>• Apresente este ingresso na entrada do evento</li>
              <li>• Chegue 15 minutos antes do horário marcado</li>
              <li>• Em caso de dúvidas, entre em contato conosco</li>
              <li>• Este ingresso é pessoal e intransferível</li>
            </ul>
          </div>
        </motion.div>

        {/* Botões de Ação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <button
            onClick={() => router.push('/local')}
            className="w-full btn-primary"
          >
            Ver Local do Evento
          </button>
          
          <button
            onClick={() => router.push('/presentes')}
            className="w-full btn-outline"
          >
            Ver Lista de Presentes
          </button>
        </motion.div>
      </main>
    </div>
  )
}

export default function IngressoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-wedding-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-olive mx-auto mb-4"></div>
          <p className="text-wedding-olive-ink">Carregando seu ingresso...</p>
        </div>
      </div>
    }>
      <IngressoContent />
    </Suspense>
  )
}
