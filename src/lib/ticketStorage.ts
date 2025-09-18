export interface TicketData {
  id: string
  nome: string
  email: string
  status: 'confirmado' | 'com_acompanhante' | 'nao_poderei'
  acompanhante?: string
  dataConfirmacao: string
  observacoes?: string
}

class TicketStorage {
  private storageKey = 'wedding-tickets'

  // Gerar ID único para o ingresso
  private generateTicketId(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    return `TICKET-${timestamp}-${random}`.toUpperCase()
  }

  // Verificar se email já existe
  hasEmail(email: string): boolean {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) return false

      const tickets: TicketData[] = JSON.parse(stored)
      return tickets.some(ticket => ticket.email.toLowerCase() === email.toLowerCase())
    } catch (error) {
      console.error('Erro ao verificar email:', error)
      return false
    }
  }

  // Criar novo ingresso
  createTicket(data: Omit<TicketData, 'id' | 'dataConfirmacao'>): TicketData {
    const ticket: TicketData = {
      ...data,
      id: this.generateTicketId(),
      dataConfirmacao: new Date().toISOString()
    }

    try {
      const stored = localStorage.getItem(this.storageKey)
      const tickets: TicketData[] = stored ? JSON.parse(stored) : []
      
      tickets.push(ticket)
      localStorage.setItem(this.storageKey, JSON.stringify(tickets))
      
      console.log('Ingresso criado:', ticket)
      return ticket
    } catch (error) {
      console.error('Erro ao criar ingresso:', error)
      throw new Error('Erro ao salvar ingresso')
    }
  }

  // Buscar ingresso por ID
  getTicketById(id: string): TicketData | null {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) return null

      const tickets: TicketData[] = JSON.parse(stored)
      return tickets.find(ticket => ticket.id === id) || null
    } catch (error) {
      console.error('Erro ao buscar ingresso:', error)
      return null
    }
  }

  // Buscar ingresso por email
  getTicketByEmail(email: string): TicketData | null {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) return null

      const tickets: TicketData[] = JSON.parse(stored)
      return tickets.find(ticket => ticket.email.toLowerCase() === email.toLowerCase()) || null
    } catch (error) {
      console.error('Erro ao buscar ingresso por email:', error)
      return null
    }
  }

  // Listar todos os ingressos
  getAllTickets(): TicketData[] {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Erro ao listar ingressos:', error)
      return []
    }
  }

  // Atualizar ingresso
  updateTicket(id: string, updates: Partial<Omit<TicketData, 'id'>>): boolean {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) return false

      const tickets: TicketData[] = JSON.parse(stored)
      const index = tickets.findIndex(ticket => ticket.id === id)
      
      if (index === -1) return false

      tickets[index] = { ...tickets[index], ...updates } as TicketData
      localStorage.setItem(this.storageKey, JSON.stringify(tickets))
      
      console.log('Ingresso atualizado:', tickets[index])
      return true
    } catch (error) {
      console.error('Erro ao atualizar ingresso:', error)
      return false
    }
  }

  // Deletar ingresso
  deleteTicket(id: string): boolean {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) return false

      const tickets: TicketData[] = JSON.parse(stored)
      const filteredTickets = tickets.filter(ticket => ticket.id !== id)
      
      if (filteredTickets.length === tickets.length) return false

      localStorage.setItem(this.storageKey, JSON.stringify(filteredTickets))
      console.log('Ingresso deletado:', id)
      return true
    } catch (error) {
      console.error('Erro ao deletar ingresso:', error)
      return false
    }
  }

  // Limpar todos os ingressos (para admin)
  clearAllTickets(): void {
    try {
      localStorage.removeItem(this.storageKey)
      console.log('Todos os ingressos foram removidos')
    } catch (error) {
      console.error('Erro ao limpar ingressos:', error)
    }
  }

  // Exportar dados (para admin)
  exportTickets(): string {
    try {
      const tickets = this.getAllTickets()
      return JSON.stringify(tickets, null, 2)
    } catch (error) {
      console.error('Erro ao exportar ingressos:', error)
      return '[]'
    }
  }

  // Estatísticas
  getStats() {
    const tickets = this.getAllTickets()
    const stats = {
      total: tickets.length,
      confirmados: tickets.filter(t => t.status === 'confirmado').length,
      comAcompanhante: tickets.filter(t => t.status === 'com_acompanhante').length,
      naoPoderao: tickets.filter(t => t.status === 'nao_poderei').length
    }
    
    return stats
  }
}

export const ticketStorage = new TicketStorage()
