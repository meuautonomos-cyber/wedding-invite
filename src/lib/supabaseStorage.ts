import { supabase } from './supabase'

export interface TicketData {
  id: string
  nome: string
  email: string
  status: 'confirmado' | 'com_acompanhante' | 'nao_poderei'
  acompanhante?: string
  dataConfirmacao: string
  observacoes?: string
}

export interface RSVPData {
  id: string
  nome: string
  telefone: string
  email: string
  quantidade_convidados: number
  restricoes_alimentares?: string
  observacoes?: string
  status: 'confirmado' | 'com_acompanhante' | 'nao_podera_ir'
  data_confirmacao: string
}

export interface GiftData {
  id: string
  doador_nome: string
  doador_telefone: string
  doador_email?: string
  tipo: 'cota' | 'item' | 'pix'
  valor?: number
  item_nome?: string
  categoria?: string
  mensagem?: string
  status: 'pendente' | 'confirmado' | 'entregue'
  data_presente: string
}

export interface PresenteSuggestionData {
  id: string
  ticket_id: string
  presente_nome: string
  presente_link: string
  presente_valor?: number
  presente_categoria?: string
  prioridade: number
  sugerido_em: string
}

class SupabaseStorage {
  // Gerar ID único para o ingresso
  private generateTicketId(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    return `TICKET-${timestamp}-${random}`.toUpperCase()
  }

  // Verificar se email já existe no RSVP
  async hasEmailInRSVP(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('wedding_rsvp')
        .select('email')
        .eq('email', email.toLowerCase())
        .limit(1)

      if (error) {
        console.error('Erro ao verificar email no RSVP:', error)
        return false
      }

      return data && data.length > 0
    } catch (error) {
      console.error('Erro ao verificar email no RSVP:', error)
      return false
    }
  }

  // Verificar se email já existe nos ingressos
  async hasEmailInTickets(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('wedding_tickets')
        .select('email')
        .eq('email', email.toLowerCase())
        .limit(1)

      if (error) {
        console.error('Erro ao verificar email nos ingressos:', error)
        return false
      }

      return data && data.length > 0
    } catch (error) {
      console.error('Erro ao verificar email nos ingressos:', error)
      return false
    }
  }

  // Verificar se email já existe (em qualquer tabela)
  async hasEmail(email: string): Promise<boolean> {
    const [rsvpExists, ticketExists] = await Promise.all([
      this.hasEmailInRSVP(email),
      this.hasEmailInTickets(email)
    ])
    
    return rsvpExists || ticketExists
  }

  // Criar RSVP
  async createRSVP(data: Omit<RSVPData, 'id' | 'data_confirmacao'>): Promise<RSVPData> {
    try {
      const rsvpData = {
        ...data,
        email: data.email.toLowerCase(),
        data_confirmacao: new Date().toISOString()
      }

      const { data: result, error } = await supabase
        .from('wedding_rsvp')
        .insert(rsvpData)
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar RSVP:', error)
        throw new Error('Erro ao salvar confirmação de presença')
      }

      console.log('RSVP criado:', result)
      return result
    } catch (error) {
      console.error('Erro ao criar RSVP:', error)
      throw error
    }
  }

  // Criar ingresso
  async createTicket(data: Omit<TicketData, 'id' | 'dataConfirmacao'>): Promise<TicketData> {
    try {
      const ticketData = {
        id: this.generateTicketId(),
        ...data,
        email: data.email.toLowerCase(),
        data_confirmacao: new Date().toISOString()
      }

      const { data: result, error } = await supabase
        .from('wedding_tickets')
        .insert(ticketData)
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar ingresso:', error)
        throw new Error('Erro ao criar ingresso')
      }

      console.log('Ingresso criado:', result)
      return {
        id: result.id,
        nome: result.nome,
        email: result.email,
        status: result.status,
        acompanhante: result.acompanhante,
        dataConfirmacao: result.data_confirmacao,
        observacoes: result.observacoes
      }
    } catch (error) {
      console.error('Erro ao criar ingresso:', error)
      throw error
    }
  }

  // Buscar ingresso por ID
  async getTicketById(id: string): Promise<TicketData | null> {
    try {
      const { data, error } = await supabase
        .from('wedding_tickets')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Não encontrado
        }
        console.error('Erro ao buscar ingresso:', error)
        return null
      }

      return {
        id: data.id,
        nome: data.nome,
        email: data.email,
        status: data.status,
        acompanhante: data.acompanhante,
        dataConfirmacao: data.data_confirmacao,
        observacoes: data.observacoes
      }
    } catch (error) {
      console.error('Erro ao buscar ingresso:', error)
      return null
    }
  }

  // Buscar ingresso por email
  async getTicketByEmail(email: string): Promise<TicketData | null> {
    try {
      const { data, error } = await supabase
        .from('wedding_tickets')
        .select('*')
        .eq('email', email.toLowerCase())
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Não encontrado
        }
        console.error('Erro ao buscar ingresso por email:', error)
        return null
      }

      return {
        id: data.id,
        nome: data.nome,
        email: data.email,
        status: data.status,
        acompanhante: data.acompanhante,
        dataConfirmacao: data.data_confirmacao,
        observacoes: data.observacoes
      }
    } catch (error) {
      console.error('Erro ao buscar ingresso por email:', error)
      return null
    }
  }

  // Listar todos os RSVPs
  async getAllRSVPs(): Promise<RSVPData[]> {
    try {
      const { data, error } = await supabase
        .from('wedding_rsvp')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao listar RSVPs:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro ao listar RSVPs:', error)
      return []
    }
  }

  // Listar todos os ingressos
  async getAllTickets(): Promise<TicketData[]> {
    try {
      const { data, error } = await supabase
        .from('wedding_tickets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao listar ingressos:', error)
        return []
      }

      return (data || []).map(ticket => ({
        id: ticket.id,
        nome: ticket.nome,
        email: ticket.email,
        status: ticket.status,
        acompanhante: ticket.acompanhante,
        dataConfirmacao: ticket.data_confirmacao,
        observacoes: ticket.observacoes
      }))
    } catch (error) {
      console.error('Erro ao listar ingressos:', error)
      return []
    }
  }

  // Criar presente
  async createGift(data: Omit<GiftData, 'id' | 'data_presente'>): Promise<GiftData> {
    try {
      const giftData = {
        ...data,
        doador_email: data.doador_email?.toLowerCase() || null,
        data_presente: new Date().toISOString()
      }

      const { data: result, error } = await supabase
        .from('wedding_gifts')
        .insert(giftData)
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar presente:', error)
        throw new Error('Erro ao salvar presente')
      }

      console.log('Presente criado:', result)
      return result
    } catch (error) {
      console.error('Erro ao criar presente:', error)
      throw error
    }
  }

  // Listar todos os presentes
  async getAllGifts(): Promise<GiftData[]> {
    try {
      const { data, error } = await supabase
        .from('wedding_gifts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao listar presentes:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro ao listar presentes:', error)
      return []
    }
  }

  // Atualizar status do presente
  async updateGiftStatus(id: string, status: 'pendente' | 'confirmado' | 'entregue'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('wedding_gifts')
        .update({ status })
        .eq('id', id)

      if (error) {
        console.error('Erro ao atualizar presente:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erro ao atualizar presente:', error)
      return false
    }
  }

  // Salvar sugestões de presentes para um ticket
  async savePresenteSuggestions(ticketId: string, suggestions: Array<{
    nome: string
    link: string
    valor?: number
    categoria?: string
    prioridade?: number
  }>): Promise<boolean> {
    try {
      const suggestionData = suggestions.map(suggestion => ({
        ticket_id: ticketId,
        presente_nome: suggestion.nome,
        presente_link: suggestion.link,
        presente_valor: suggestion.valor || null,
        presente_categoria: suggestion.categoria || null,
        prioridade: suggestion.prioridade || 9
      }))

      const { error } = await supabase
        .from('wedding_presente_suggestions')
        .insert(suggestionData)

      if (error) {
        console.error('Erro ao salvar sugestões:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erro ao salvar sugestões:', error)
      return false
    }
  }

  // Buscar sugestões já feitas para um ticket
  async getPresenteSuggestionsForTicket(ticketId: string): Promise<PresenteSuggestionData[]> {
    try {
      const { data, error } = await supabase
        .from('wedding_presente_suggestions')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('prioridade', { ascending: true })

      if (error) {
        console.error('Erro ao buscar sugestões:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error)
      return []
    }
  }

  // Buscar todos os presentes já sugeridos (para evitar repetições)
  async getAllSuggestedPresentes(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('wedding_presente_suggestions')
        .select('presente_nome')

      if (error) {
        console.error('Erro ao buscar presentes sugeridos:', error)
        return []
      }

      return data?.map(item => item.presente_nome) || []
    } catch (error) {
      console.error('Erro ao buscar presentes sugeridos:', error)
      return []
    }
  }

  // Estatísticas
  async getStats() {
    try {
      const [rsvpStats, ticketStats, giftStats] = await Promise.all([
        supabase
          .from('wedding_rsvp')
          .select('status')
          .then(({ data }) => {
            const stats = { total: 0, confirmados: 0, comAcompanhante: 0, naoPoderao: 0 }
            data?.forEach(item => {
              stats.total++
              if (item.status === 'confirmado') stats.confirmados++
              else if (item.status === 'com_acompanhante') stats.comAcompanhante++
              else if (item.status === 'nao_podera_ir') stats.naoPoderao++
            })
            return stats
          }),
        supabase
          .from('wedding_tickets')
          .select('status')
          .then(({ data }) => {
            const stats = { total: 0, confirmados: 0, comAcompanhante: 0, naoPoderao: 0 }
            data?.forEach(item => {
              stats.total++
              if (item.status === 'confirmado') stats.confirmados++
              else if (item.status === 'com_acompanhante') stats.comAcompanhante++
              else if (item.status === 'nao_poderei') stats.naoPoderao++
            })
            return stats
          }),
        supabase
          .from('wedding_gifts')
          .select('status, valor')
          .then(({ data }) => {
            const stats = { 
              total: 0, 
              pendentes: 0, 
              confirmados: 0, 
              entregues: 0,
              valorTotal: 0
            }
            data?.forEach(item => {
              stats.total++
              if (item.status === 'pendente') stats.pendentes++
              else if (item.status === 'confirmado') stats.confirmados++
              else if (item.status === 'entregue') stats.entregues++
              if (item.valor) stats.valorTotal += item.valor
            })
            return stats
          })
      ])

      return {
        rsvp: rsvpStats,
        tickets: ticketStats,
        gifts: giftStats
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      return {
        rsvp: { total: 0, confirmados: 0, comAcompanhante: 0, naoPoderao: 0 },
        tickets: { total: 0, confirmados: 0, comAcompanhante: 0, naoPoderao: 0 },
        gifts: { total: 0, pendentes: 0, confirmados: 0, entregues: 0, valorTotal: 0 }
      }
    }
  }

  // Funções para lembretes
  async createReminders(reminders: any[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('wedding_reminders')
        .insert(reminders)

      if (error) {
        console.error('Erro ao criar lembretes:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erro ao criar lembretes:', error)
      return false
    }
  }

  async getPendingReminders(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('wedding_reminders')
        .select('*')
        .eq('status', 'pendente')
        .lte('proximo_envio', new Date().toISOString())

      if (error) {
        console.error('Erro ao buscar lembretes pendentes:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar lembretes pendentes:', error)
      return []
    }
  }

  async updateReminderStatus(id: string, status: string, data?: any): Promise<boolean> {
    try {
      const updateData: any = { status }
      if (data) {
        Object.assign(updateData, data)
      }

      const { error } = await supabase
        .from('wedding_reminders')
        .update(updateData)
        .eq('id', id)

      if (error) {
        console.error('Erro ao atualizar status do lembrete:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erro ao atualizar status do lembrete:', error)
      return false
    }
  }

  async getNextReminder(ticketId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('wedding_reminders')
        .select('*')
        .eq('ticket_id', ticketId)
        .eq('status', 'pendente')
        .order('proximo_envio', { ascending: true })
        .limit(1)
        .single()

      if (error) {
        console.error('Erro ao buscar próximo lembrete:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar próximo lembrete:', error)
      return null
    }
  }

  async updateReminderNextSend(id: string, proximoEnvio: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('wedding_reminders')
        .update({ proximo_envio: proximoEnvio })
        .eq('id', id)

      if (error) {
        console.error('Erro ao atualizar próximo envio:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erro ao atualizar próximo envio:', error)
      return false
    }
  }

  // Funções para reconfirmação
  async getConfirmedGuests(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('wedding_tickets')
        .select('*')
        .in('status', ['confirmado', 'com_acompanhante'])

      if (error) {
        console.error('Erro ao buscar convidados confirmados:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar convidados confirmados:', error)
      return []
    }
  }

  async createReconfirmations(reconfirmations: any[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('wedding_reconfirmations')
        .insert(reconfirmations)

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('relation "wedding_reconfirmations" does not exist')) {
          console.log('Tabela wedding_reconfirmations não existe. Execute o schema SQL primeiro.')
          return false
        }
        console.error('Erro ao criar reconfirmações:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erro ao criar reconfirmações:', error)
      return false
    }
  }

  async getPendingReconfirmations(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('wedding_reconfirmations')
        .select('*')
        .eq('status', 'pendente')

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('relation "wedding_reconfirmations" does not exist')) {
          console.log('Tabela wedding_reconfirmations não existe. Execute o schema SQL primeiro.')
          return []
        }
        console.error('Erro ao buscar reconfirmações pendentes:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar reconfirmações pendentes:', error)
      return []
    }
  }

  async getReconfirmationByTicketId(ticketId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('wedding_reconfirmations')
        .select('*')
        .eq('ticket_id', ticketId)
        .single()

      if (error) {
        // Se a tabela não existe, retorna null sem erro
        if (error.code === 'PGRST116' || error.message?.includes('relation "wedding_reconfirmations" does not exist')) {
          console.log('Tabela wedding_reconfirmations não existe. Execute o schema SQL primeiro.')
          return null
        }
        console.error('Erro ao buscar reconfirmação:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar reconfirmação:', error)
      return null
    }
  }

  async updateReconfirmationStatus(ticketId: string, status: string, data?: any): Promise<boolean> {
    try {
      const updateData: any = { status }
      if (data) {
        Object.assign(updateData, data)
      }

      const { error } = await supabase
        .from('wedding_reconfirmations')
        .update(updateData)
        .eq('ticket_id', ticketId)

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('relation "wedding_reconfirmations" does not exist')) {
          console.log('Tabela wedding_reconfirmations não existe. Execute o schema SQL primeiro.')
          return false
        }
        console.error('Erro ao atualizar status da reconfirmação:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erro ao atualizar status da reconfirmação:', error)
      return false
    }
  }

  async createReconfirmationNotification(notification: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('wedding_reconfirmation_notifications')
        .insert(notification)

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('relation "wedding_reconfirmation_notifications" does not exist')) {
          console.log('Tabela wedding_reconfirmation_notifications não existe. Execute o schema SQL primeiro.')
          return false
        }
        console.error('Erro ao criar notificação de reconfirmação:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erro ao criar notificação de reconfirmação:', error)
      return false
    }
  }

  // Funções para o painel admin
  async getAllReconfirmations(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('wedding_reconfirmations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('relation "wedding_reconfirmations" does not exist')) {
          console.log('Tabela wedding_reconfirmations não existe. Execute o schema SQL primeiro.')
          return []
        }
        console.error('Erro ao buscar reconfirmações:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar reconfirmações:', error)
      return []
    }
  }

  async getReconfirmationNotifications(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('wedding_reconfirmation_notifications')
        .select('*')
        .order('enviada_em', { ascending: false })

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('relation "wedding_reconfirmation_notifications" does not exist')) {
          console.log('Tabela wedding_reconfirmation_notifications não existe. Execute o schema SQL primeiro.')
          return []
        }
        console.error('Erro ao buscar notificações de reconfirmação:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar notificações de reconfirmação:', error)
      return []
    }
  }

  async getGuestMessages(): Promise<any[]> {
    try {
      // Buscar mensagens dos RSVPs
      const { data: rsvpMessages, error: rsvpError } = await supabase
        .from('wedding_rsvp')
        .select('nome, observacoes, data_confirmacao')
        .not('observacoes', 'is', null)
        .neq('observacoes', '')
        .neq('observacoes', 'EMPTY')

      if (rsvpError) {
        console.error('Erro ao buscar mensagens dos RSVPs:', rsvpError)
      }

      // Buscar mensagens dos tickets
      const { data: ticketMessages, error: ticketError } = await supabase
        .from('wedding_tickets')
        .select('nome, observacoes, data_confirmacao')
        .not('observacoes', 'is', null)
        .neq('observacoes', '')
        .neq('observacoes', 'EMPTY')

      if (ticketError) {
        console.error('Erro ao buscar mensagens dos tickets:', ticketError)
      }

      // Combinar e formatar mensagens
      const allMessages = [
        ...(rsvpMessages || []).map(msg => ({
          ...msg,
          tipo: 'RSVP',
          origem: 'wedding_rsvp'
        })),
        ...(ticketMessages || []).map(msg => ({
          ...msg,
          tipo: 'Ticket',
          origem: 'wedding_tickets'
        }))
      ]

      // Ordenar por data
      return allMessages.sort((a, b) => 
        new Date(b.data_confirmacao).getTime() - new Date(a.data_confirmacao).getTime()
      )
    } catch (error) {
      console.error('Erro ao buscar mensagens dos convidados:', error)
      return []
    }
  }
}

export const supabaseStorage = new SupabaseStorage()
