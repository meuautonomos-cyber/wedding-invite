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
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar email no RSVP:', error)
        return false
      }

      return !!data
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
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar email nos ingressos:', error)
        return false
      }

      return !!data
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

  // Estatísticas
  async getStats() {
    try {
      const [rsvpStats, ticketStats] = await Promise.all([
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
          })
      ])

      return {
        rsvp: rsvpStats,
        tickets: ticketStats
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      return {
        rsvp: { total: 0, confirmados: 0, comAcompanhante: 0, naoPoderao: 0 },
        tickets: { total: 0, confirmados: 0, comAcompanhante: 0, naoPoderao: 0 }
      }
    }
  }
}

export const supabaseStorage = new SupabaseStorage()
