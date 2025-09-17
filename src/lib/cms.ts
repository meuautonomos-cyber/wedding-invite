// Sistema de CMS simples para gerenciar dados do casamento
// Em produção, isso seria substituído por um CMS headless real

import { RSVPData, GiftData } from '@/types'

// Simulação de banco de dados em memória
let rsvpData: RSVPData[] = []
let giftData: GiftData[] = []

export const cms = {
  // RSVP
  async getRSVPs(): Promise<RSVPData[]> {
    return rsvpData
  },

  async createRSVP(data: Omit<RSVPData, 'id' | 'data_confirmacao'>): Promise<RSVPData> {
    const newRSVP: RSVPData = {
      ...data,
      id: Date.now().toString(),
      data_confirmacao: new Date().toISOString()
    }
    rsvpData.push(newRSVP)
    return newRSVP
  },

  async updateRSVP(id: string, data: Partial<RSVPData>): Promise<RSVPData | null> {
    const index = rsvpData.findIndex(rsvp => rsvp.id === id)
    if (index === -1) return null
    
    rsvpData[index] = { ...rsvpData[index], ...data } as RSVPData
    return rsvpData[index]
  },

  async deleteRSVP(id: string): Promise<boolean> {
    const index = rsvpData.findIndex(rsvp => rsvp.id === id)
    if (index === -1) return false
    
    rsvpData.splice(index, 1)
    return true
  },

  // Presentes
  async getGifts(): Promise<GiftData[]> {
    return giftData
  },

  async createGift(data: Omit<GiftData, 'id' | 'data_presente'>): Promise<GiftData> {
    const newGift: GiftData = {
      ...data,
      id: Date.now().toString(),
      data_presente: new Date().toISOString()
    }
    giftData.push(newGift)
    return newGift
  },

  async updateGift(id: string, data: Partial<GiftData>): Promise<GiftData | null> {
    const index = giftData.findIndex(gift => gift.id === id)
    if (index === -1) return null
    
    giftData[index] = { ...giftData[index], ...data } as GiftData
    return giftData[index]
  },

  async deleteGift(id: string): Promise<boolean> {
    const index = giftData.findIndex(gift => gift.id === id)
    if (index === -1) return false
    
    giftData.splice(index, 1)
    return true
  },

  // Relatórios
  async getRSVPReport() {
    const total = rsvpData.length
    const confirmados = rsvpData.filter(rsvp => rsvp.status === 'confirmado').length
    const comAcompanhante = rsvpData.filter(rsvp => rsvp.status === 'com_acompanhante').length
    const naoPoderaoIr = rsvpData.filter(rsvp => rsvp.status === 'nao_podera_ir').length
    const totalConvidados = rsvpData.reduce((sum, rsvp) => sum + rsvp.quantidade_convidados, 0)

    return {
      total,
      confirmados,
      comAcompanhante,
      naoPoderaoIr,
      totalConvidados,
      data: rsvpData
    }
  },

  async getGiftReport() {
    const total = giftData.length
    const totalValor = giftData.reduce((sum, gift) => sum + (gift.valor || 0), 0)
    const pendentes = giftData.filter(gift => gift.status === 'pendente').length
    const confirmados = giftData.filter(gift => gift.status === 'confirmado').length
    const entregues = giftData.filter(gift => gift.status === 'entregue').length

    return {
      total,
      totalValor,
      pendentes,
      confirmados,
      entregues,
      data: giftData
    }
  },

  // Exportar dados
  async exportToCSV(type: 'rsvp' | 'gifts'): Promise<string> {
    const data = type === 'rsvp' ? rsvpData : giftData
    
    if (data.length === 0) return ''
    
    const firstItem = data[0]
    if (!firstItem) return ''
    
    const headers = Object.keys(firstItem)
    const csvContent = [
      headers.join(','),
      ...data.map(item => 
        headers.map(header => {
          const value = item[header as keyof typeof item]
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        }).join(',')
      )
    ].join('\n')
    
    return csvContent
  }
}

// Função para simular delay de API
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
