'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { weddingData } from '@/data/weddingData'
import { supabaseStorage, TicketData, RSVPData } from '@/lib/supabaseStorage'
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function ConfirmarPage() {
  const router = useRouter()
  const { noivos, evento, rsvp } = weddingData.casamento
  const [formData, setFormData] = useState<Omit<RSVPData, 'id' | 'data_confirmacao'>>({
    nome: '',
    telefone: '',
    email: '',
    quantidade_convidados: 1,
    restricoes_alimentares: '',
    observacoes: '',
    status: 'confirmado'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [duplicateEmail, setDuplicateEmail] = useState(false)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [whatsappSent, setWhatsappSent] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantidade_convidados' ? parseInt(value) : value
    }))
  }

  const handleStatusChange = (status: RSVPData['status']) => {
    setFormData(prev => ({
      ...prev,
      status,
      quantidade_convidados: status === 'nao_podera_ir' ? 0 : 1
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setDuplicateEmail(false)

    try {
      // Verificar se email já existe
      const emailExists = await supabaseStorage.hasEmail(formData.email)
      if (emailExists) {
        setDuplicateEmail(true)
        setIsSubmitting(false)
        return
      }

      // Criar RSVP primeiro
      const rsvpData: Omit<RSVPData, 'id' | 'data_confirmacao'> = {
        nome: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
        quantidade_convidados: formData.quantidade_convidados,
        restricoes_alimentares: formData.restricoes_alimentares || '',
        observacoes: formData.observacoes || '',
        status: formData.status
      }

      await supabaseStorage.createRSVP(rsvpData)

      // Criar ingresso
      const ticketData: Omit<TicketData, 'id' | 'dataConfirmacao'> = {
        nome: formData.nome,
        email: formData.email,
        status: formData.status === 'nao_podera_ir' ? 'nao_poderei' : 
                formData.status === 'com_acompanhante' ? 'com_acompanhante' : 'confirmado',
        observacoes: formData.restricoes_alimentares || formData.observacoes || ''
      }

      if (formData.status === 'com_acompanhante' && formData.observacoes) {
        ticketData.acompanhante = formData.observacoes
      }

      const ticket = await supabaseStorage.createTicket(ticketData)

      console.log('RSVP e ingresso criados:', ticket)
      
      // Enviar WhatsApp automaticamente APENAS se confirmar presença
      if (formData.status !== 'nao_podera_ir') {
        try {
          // ENVIO 100% AUTOMÁTICO via Netlify Function
          const response = await fetch('/.netlify/functions/whatsapp-send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: `55${formData.telefone}`,
              ticketId: ticket.id,
              nome: formData.nome,
              status: formData.status,
              acompanhante: formData.status === 'com_acompanhante' ? formData.observacoes : undefined,
              observacoes: formData.restricoes_alimentares || formData.observacoes || '',
              restricoes_alimentares: formData.restricoes_alimentares
            })
          })
          
          if (response.ok) {
            const result = await response.json()
            console.log('✅ Mensagem enviada automaticamente!', result)
            setWhatsappSent(true)
          } else {
            console.log('⚠️ Falha no envio automático')
            setWhatsappSent(false)
          }
        } catch (error) {
          console.error('Erro ao enviar WhatsApp:', error)
          // Não falha o processo se o WhatsApp der erro
        }
      }
      
      setTicketId(ticket.id)
      setShowSuccess(true)
    } catch (error) {
      console.error('Erro ao criar RSVP/ingresso:', error)
      setShowError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.nome && formData.telefone && formData.status

  const formatDate = (dateString: string) => {
    // Se for formato DD/MM/YY, converter para formato válido
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/')
      const fullYear = year && year.length === 2 ? `20${year}` : year || '2026'
      const paddedMonth = month ? month.padStart(2, '0') : '01'
      const paddedDay = day ? day.padStart(2, '0') : '01'
      // Criar data no formato correto (YYYY-MM-DD)
      const date = new Date(parseInt(fullYear), parseInt(paddedMonth) - 1, parseInt(paddedDay))
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Verificar se a data limite ainda é válida
  const isRSVPExpired = () => {
    const today = new Date()
    
    // Converter data limite do formato DD/MM/YY para Date
    let deadline: Date
    if (rsvp.data_limite.includes('/')) {
      const [day, month, year] = rsvp.data_limite.split('/')
      const fullYear = year && year.length === 2 ? `20${year}` : year || '2026'
      const paddedMonth = month ? month.padStart(2, '0') : '01'
      const paddedDay = day ? day.padStart(2, '0') : '01'
      deadline = new Date(parseInt(fullYear), parseInt(paddedMonth) - 1, parseInt(paddedDay))
    } else {
      deadline = new Date(rsvp.data_limite)
    }
    
        // Verificando se RSVP expirou
    return today > deadline
  }

  return (
    <div className="min-h-screen bg-wedding-cream-50">
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
            Confirmar Presença
          </h1>
          <div className="w-9"></div>
        </div>
      </header>

      <main className="px-4 py-8 max-w-2xl mx-auto">
        {/* Informações do Evento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-script text-wedding-green-800 mb-4 title-elegant">
            {noivos.nome_noiva} & {noivos.nome_noivo}
          </h2>
          <div className="card">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CalendarIcon className="w-5 h-5 text-wedding-green-600" />
              <p className="text-wedding-green-700 font-medium">
                {formatDate(evento.data)} às {evento.hora}
              </p>
            </div>
            <p className="text-wedding-green-600 text-sm">
              Confirme sua presença até {formatDate(rsvp.data_limite)}
            </p>
          </div>

          {/* Aviso se a data limite passou */}
          {isRSVPExpired() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                <p className="text-red-800 font-semibold">
                  Prazo de Confirmação Encerrado
                </p>
              </div>
              <p className="text-red-700 text-sm">
                O prazo para confirmação de presença encerrou em {formatDate(rsvp.data_limite)}. 
                Entre em contato com os noivos para mais informações.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Formulário RSVP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status de Presença */}
            <div className="card">
              <h3 className="text-lg font-semibold text-wedding-green-800 mb-4">
                Você poderá comparecer?
              </h3>
              <div className="space-y-3">
                <div 
                  className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors hover:bg-wedding-cream-50"
                  onClick={() => {
                    console.log('Clicou em confirmado')
                    handleStatusChange('confirmado')
                  }}
                >
                  <input
                    type="radio"
                    name="status"
                    value="confirmado"
                    checked={formData.status === 'confirmado'}
                    onChange={() => handleStatusChange('confirmado')}
                    className="w-4 h-4 mr-3"
                  />
                  <div>
                    <p className="font-medium text-wedding-green-800">Sim, estarei presente!</p>
                    <p className="text-sm text-wedding-green-600">Confirmo minha presença na celebração</p>
                  </div>
                </div>

                <div 
                  className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors hover:bg-wedding-cream-50"
                  onClick={() => {
                    console.log('Clicou em não poderá ir')
                    handleStatusChange('nao_podera_ir')
                  }}
                >
                  <input
                    type="radio"
                    name="status"
                    value="nao_podera_ir"
                    checked={formData.status === 'nao_podera_ir'}
                    onChange={() => handleStatusChange('nao_podera_ir')}
                    className="w-4 h-4 mr-3"
                  />
                  <div>
                    <p className="font-medium text-wedding-green-800">Infelizmente não poderei ir</p>
                    <p className="text-sm text-wedding-green-600">Mas estarei presente em pensamento</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Pessoais */}
            <div className="card">
              <h3 className="text-lg font-semibold text-wedding-green-800 mb-4">
                Informações Pessoais
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-wedding-green-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-wedding-cream-300 rounded-lg focus:ring-2 focus:ring-wedding-green-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-wedding-green-700 mb-1">
                    Telefone/WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    required
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-wedding-cream-300 rounded-lg focus:ring-2 focus:ring-wedding-green-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-wedding-green-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-wedding-green-500 focus:border-transparent ${
                      duplicateEmail ? 'border-red-500' : 'border-wedding-cream-300'
                    }`}
                    placeholder="seu@email.com"
                  />
                  {duplicateEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      Este email já foi utilizado para confirmar presença.
                    </p>
                  )}
                </div>
              </div>
            </div>


            {/* Restrições Alimentares */}
            <div className="card">
              <h3 className="text-lg font-semibold text-wedding-green-800 mb-4">
                Restrições Alimentares
              </h3>
              <div>
                <label className="block text-sm font-medium text-wedding-green-700 mb-1">
                  Alergias, intolerâncias ou preferências alimentares
                </label>
                <textarea
                  name="restricoes_alimentares"
                  value={formData.restricoes_alimentares}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-wedding-cream-300 rounded-lg focus:ring-2 focus:ring-wedding-green-500 focus:border-transparent"
                  placeholder="Ex: vegetariano, alergia a frutos do mar, etc."
                />
              </div>
            </div>

            {/* Observações */}
            <div className="card">
              <h3 className="text-lg font-semibold text-wedding-green-800 mb-4">
                Observações
              </h3>
              <div>
                <label className="block text-sm font-medium text-wedding-green-700 mb-1">
                  Mensagem para os noivos ou observações adicionais
                </label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-wedding-cream-300 rounded-lg focus:ring-2 focus:ring-wedding-green-500 focus:border-transparent"
                  placeholder="Deixe uma mensagem carinhosa para os noivos..."
                />
              </div>
            </div>

            {/* Botão de Envio */}
            <motion.button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              whileHover={{ scale: isFormValid ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid ? 0.98 : 1 }}
              className={`w-full py-4 rounded-lg font-medium transition-all ${
                isFormValid && !isSubmitting
                  ? 'btn-primary'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar Presença'}
            </motion.button>
          </form>
        </motion.div>

        {/* Modal de Sucesso */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showSuccess ? 1 : 0 }}
          className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${
            showSuccess ? 'block' : 'hidden'
          }`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: showSuccess ? 1 : 0.8, opacity: showSuccess ? 1 : 0 }}
            className="bg-white rounded-xl p-6 max-w-sm w-full text-center"
          >
            <CheckCircleIcon className="w-16 h-16 text-wedding-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-wedding-green-800 mb-2">
              Confirmação Enviada!
            </h3>
            <p className="text-wedding-green-700 mb-4">
              {rsvp.mensagem_pos_confirmacao}
            </p>
            <p className="text-sm text-wedding-green-600 mb-4">
              Seu ingresso foi gerado e uma mensagem foi enviada para seu WhatsApp com todas as informações!
            </p>
            
            {/* Status do WhatsApp */}
            <div className={`p-3 rounded-lg mb-4 ${whatsappSent ? 'bg-green-100 border border-green-200' : 'bg-yellow-100 border border-yellow-200'}`}>
              <div className="flex items-center gap-2">
                {whatsappSent ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-800 font-medium">
                      ✅ Mensagem enviada para seu WhatsApp automaticamente!
                    </p>
                  </>
                ) : (
                  <>
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                    <p className="text-sm text-yellow-800 font-medium">
                      ⚠️ Falha ao enviar WhatsApp automaticamente. Verifique seu número.
                    </p>
                  </>
                )}
              </div>
            </div>
            
            {/* Informações do ingresso */}
            {ticketId && (
              <div className="bg-wedding-cream-100 p-3 rounded-lg mb-4">
                <h4 className="font-semibold text-wedding-green-800 mb-2 text-sm">Seu Ingresso Personalizado</h4>
                <p className="text-xs text-wedding-green-700 mb-1">
                  <strong>Código:</strong> {ticketId}
                </p>
                <p className="text-xs text-wedding-green-700">
                  <strong>Link:</strong> <a href={`/ingresso?id=${ticketId}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    Ver ingresso completo
                  </a>
                </p>
              </div>
            )}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowSuccess(false)
                  if (ticketId) {
                    router.push(`/ingresso?id=${ticketId}`)
                  }
                }}
                className="btn-primary w-full"
              >
                Ver Meu Ingresso
              </button>
              <button
                onClick={() => setShowSuccess(false)}
                className="btn-outline w-full"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Modal de Erro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showError ? 1 : 0 }}
          className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${
            showError ? 'block' : 'hidden'
          }`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: showError ? 1 : 0.8, opacity: showError ? 1 : 0 }}
            className="bg-white rounded-xl p-6 max-w-sm w-full text-center"
          >
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-wedding-green-800 mb-2">
              Erro ao Enviar
            </h3>
            <p className="text-wedding-green-700 mb-4">
              Ocorreu um erro ao enviar sua confirmação. Tente novamente.
            </p>
            <button
              onClick={() => setShowError(false)}
              className="btn-primary w-full"
            >
              Tentar Novamente
            </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}