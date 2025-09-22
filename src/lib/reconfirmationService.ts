import { weddingData } from '@/data/weddingData'
import { supabaseStorage } from './supabaseStorage'

interface ReconfirmationData {
  id: string
  ticket_id: string
  nome: string
  telefone: string
  email?: string
  status: 'pendente' | 'confirmado' | 'desistiu' | 'taxa_paga'
  data_limite: string
  data_reconfirmacao?: string
  observacoes?: string
  taxa_desistencia: number
  taxa_paga: boolean
  comprovante_pagamento?: string
}

interface ReconfirmationNotification {
  id: string
  ticket_id: string
  tipo: 'lembrete' | 'ultimo_aviso' | 'confirmacao_obrigatoria' | 'taxa_cobranca'
  mensagem: string
  enviada_em: string
  status_envio: 'enviado' | 'falhou' | 'pendente'
}

export class ReconfirmationService {
  private readonly baseUrl: string
  private readonly wapiUrl: string
  private readonly wapiToken: string
  private readonly wapiInstanceId: string

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl
    this.wapiUrl = process.env.NEXT_PUBLIC_WAPI_BASE_URL || 'https://api.w-api.app'
    this.wapiToken = process.env.NEXT_PUBLIC_WAPI_TOKEN || 'iraQjMkKP80u84RuNVueGqqNS4hlExaM'
    this.wapiInstanceId = process.env.NEXT_PUBLIC_WAPI_INSTANCE_ID || 'LITE-QX34ES-9ZAQOP'
  }

  // Calcular data limite para reconfirmação (21/02/2026)
  private getReconfirmationDeadline(): Date {
    return new Date('2026-02-21T23:59:59-03:00') // 21/02/2026 às 23:59
  }

  // Verificar se está no período de reconfirmação
  isReconfirmationPeriod(): boolean {
    const today = new Date()
    const deadline = this.getReconfirmationDeadline()
    return today >= deadline
  }

  // Criar reconfirmações para todos os convidados confirmados
  async createReconfirmationsForAllGuests(): Promise<void> {
    try {
      if (!this.isReconfirmationPeriod()) {
        console.log('Ainda não é período de reconfirmação')
        return
      }

      // Buscar todos os convidados confirmados
      const confirmedGuests = await supabaseStorage.getConfirmedGuests()
      const deadline = this.getReconfirmationDeadline()

      const reconfirmations: ReconfirmationData[] = confirmedGuests.map(guest => ({
        id: `reconf_${guest.ticket_id}`,
        ticket_id: guest.ticket_id,
        nome: guest.nome,
        telefone: guest.telefone,
        email: guest.email,
        status: 'pendente',
        data_limite: deadline.toISOString(),
        taxa_desistencia: 150.00,
        taxa_paga: false
      }))

      // Salvar no Supabase
      await supabaseStorage.createReconfirmations(reconfirmations)
      
      console.log(`Reconfirmações criadas para ${reconfirmations.length} convidados`)
    } catch (error) {
      console.error('Erro ao criar reconfirmações:', error)
    }
  }

  // Enviar notificações de reconfirmação
  async sendReconfirmationNotifications(): Promise<void> {
    try {
      const pendingReconfirmations = await supabaseStorage.getPendingReconfirmations()
      
      for (const reconfirmation of pendingReconfirmations) {
        await this.sendReconfirmationMessage(reconfirmation)
      }
    } catch (error) {
      console.error('Erro ao enviar notificações de reconfirmação:', error)
    }
  }

  // Enviar mensagem de reconfirmação individual
  private async sendReconfirmationMessage(reconfirmation: ReconfirmationData): Promise<void> {
    try {
      const { evento } = weddingData.casamento
      const deadline = new Date(reconfirmation.data_limite)
      const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      
      let mensagem = ''
      let tipo: ReconfirmationNotification['tipo'] = 'lembrete'

      if (daysLeft > 7) {
        mensagem = `🔔 *RECONFIRMAÇÃO OBRIGATÓRIA - ${daysLeft} DIAS!*\n\nOlá ${reconfirmation.nome}! 👋\n\n*ATENÇÃO:* Em ${daysLeft} dias encerraremos a lista de convidados para nosso casamento!\n\n📅 *Data limite:* ${deadline.toLocaleDateString('pt-BR')}\n📅 *Casamento:* ${evento.data} às ${evento.hora}\n📍 *Local:* ${evento.local_resumo}\n\n⚠️ *IMPORTANTE:*\n• Você DEVE reconfirmar sua presença até ${deadline.toLocaleDateString('pt-BR')}\n• Após esta data, não será mais possível desistir\n• Se desistir após a data limite, será cobrada taxa de R$ 150,00\n\n🔗 *Reconfirme agora:* ${this.baseUrl}/reconfirmar?id=${reconfirmation.ticket_id}\n\n_Esta é uma reconfirmação obrigatória._`
        tipo = 'lembrete'
      } else if (daysLeft > 0) {
        mensagem = `🚨 *ÚLTIMA CHANCE - ${daysLeft} DIAS!*\n\nOlá ${reconfirmation.nome}! ⚠️\n\n*URGENTE:* Restam apenas ${daysLeft} dias para reconfirmar sua presença!\n\n📅 *Data limite:* ${deadline.toLocaleDateString('pt-BR')}\n📅 *Casamento:* ${evento.data} às ${evento.hora}\n📍 *Local:* ${evento.local_resumo}\n\n⚠️ *ATENÇÃO:*\n• Após ${deadline.toLocaleDateString('pt-BR')} não será mais possível desistir\n• Desistência após a data = taxa de R$ 150,00\n• Reconfirme AGORA para garantir sua vaga!\n\n🔗 *Reconfirme URGENTE:* ${this.baseUrl}/reconfirmar?id=${reconfirmation.ticket_id}\n\n_Não perca sua vaga!_`
        tipo = 'ultimo_aviso'
      } else {
        mensagem = `🔒 *LISTA FECHADA - RECONFIRMAÇÃO OBRIGATÓRIA!*\n\nOlá ${reconfirmation.nome}! 🔐\n\n*A lista de convidados foi FECHADA!*\n\n📅 *Casamento:* ${evento.data} às ${evento.hora}\n📍 *Local:* ${evento.local_resumo}\n\n⚠️ *SITUAÇÃO ATUAL:*\n• Você NÃO reconfirmou até a data limite\n• Sua presença está CONFIRMADA automaticamente\n• NÃO é mais possível desistir sem pagar taxa\n• Taxa de desistência: R$ 150,00\n\n🔗 *Ver detalhes:* ${this.baseUrl}/reconfirmar?id=${reconfirmation.ticket_id}\n\n_Reconfirmação automática aplicada._`
        tipo = 'confirmacao_obrigatoria'
      }

      // Enviar via W-API
      const response = await fetch(`${this.wapiUrl}/message/sendText/${this.wapiInstanceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.wapiToken}`
        },
        body: JSON.stringify({
          number: reconfirmation.telefone,
          text: mensagem
        })
      })

      if (response.ok) {
        // Salvar notificação
        await supabaseStorage.createReconfirmationNotification({
          ticket_id: reconfirmation.ticket_id,
          tipo,
          mensagem,
          status_envio: 'enviado'
        })
        
        console.log(`Notificação de reconfirmação enviada para ${reconfirmation.nome}`)
      } else {
        console.error(`Erro ao enviar notificação para ${reconfirmation.nome}`)
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem de reconfirmação:', error)
    }
  }

  // Processar reconfirmação do convidado
  async processReconfirmation(ticketId: string, action: 'confirm' | 'cancel'): Promise<{ success: boolean, message: string, requiresPayment?: boolean }> {
    try {
      const reconfirmation = await supabaseStorage.getReconfirmationByTicketId(ticketId)
      
      if (!reconfirmation) {
        return { success: false, message: 'Reconfirmação não encontrada' }
      }

      const today = new Date()
      const deadline = new Date(reconfirmation.data_limite)
      const isAfterDeadline = today > deadline

      if (action === 'confirm') {
        // Confirmar presença
        await supabaseStorage.updateReconfirmationStatus(ticketId, 'confirmado', {
          data_reconfirmacao: today.toISOString()
        })
        
        return { 
          success: true, 
          message: 'Presença reconfirmada com sucesso! Aguardamos você no casamento!' 
        }
      } else {
        // Cancelar presença
        if (isAfterDeadline) {
          // Após a data limite - cobrar taxa
          await supabaseStorage.updateReconfirmationStatus(ticketId, 'desistiu', {
            data_reconfirmacao: today.toISOString(),
            observacoes: 'Desistência após data limite - taxa aplicada'
          })
          
          return { 
            success: true, 
            message: 'Desistência registrada. Taxa de R$ 150,00 deve ser paga.', 
            requiresPayment: true 
          }
        } else {
          // Antes da data limite - cancelamento gratuito
          await supabaseStorage.updateReconfirmationStatus(ticketId, 'desistiu', {
            data_reconfirmacao: today.toISOString(),
            observacoes: 'Desistência antes da data limite'
          })
          
          return { 
            success: true, 
            message: 'Presença cancelada com sucesso. Não há taxa a pagar.' 
          }
        }
      }
    } catch (error) {
      console.error('Erro ao processar reconfirmação:', error)
      return { success: false, message: 'Erro interno do servidor' }
    }
  }

  // Processar pagamento da taxa de desistência
  async processTaxPayment(ticketId: string, comprovante: string): Promise<{ success: boolean, message: string, pixData?: any }> {
    try {
      const reconfirmation = await supabaseStorage.getReconfirmationByTicketId(ticketId)
      
      if (!reconfirmation || reconfirmation.status !== 'desistiu') {
        return { success: false, message: 'Reconfirmação não encontrada ou status inválido' }
      }

      // Gerar PIX para pagamento da taxa
      const pixData = {
        chave: weddingData.casamento.lista_presentes.pix?.chave || '',
        valor: reconfirmation.taxa_desistencia,
        descricao: `Taxa de desistência - ${reconfirmation.nome} - Casamento Esther & Anthony`,
        qr: weddingData.casamento.lista_presentes.pix?.qr || ''
      }

      // Atualizar status para aguardando pagamento
      await supabaseStorage.updateReconfirmationStatus(ticketId, 'taxa_paga', {
        comprovante_pagamento: comprovante,
        observacoes: `Taxa de desistência - Comprovante: ${comprovante}`
      })

      return { 
        success: true, 
        message: 'PIX gerado com sucesso. Envie o comprovante após o pagamento.',
        pixData 
      }
    } catch (error) {
      console.error('Erro ao processar pagamento da taxa:', error)
      return { success: false, message: 'Erro interno do servidor' }
    }
  }

  // Verificar status da reconfirmação
  async getReconfirmationStatus(ticketId: string): Promise<ReconfirmationData | null> {
    try {
      return await supabaseStorage.getReconfirmationByTicketId(ticketId)
    } catch (error) {
      console.error('Erro ao buscar status da reconfirmação:', error)
      return null
    }
  }
}
