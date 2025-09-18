import { weddingData } from '@/data/weddingData'

export interface WhatsAppMessage {
  nome: string
  telefone: string
  status: 'confirmado' | 'com_acompanhante' | 'nao_poderei'
  acompanhante?: string
  observacoes?: string
  ticketId: string
}

export class WhatsAppService {
  private readonly whatsappNumber: string

  constructor(whatsappNumber: string) {
    this.whatsappNumber = whatsappNumber.replace(/\D/g, '') // Remove caracteres não numéricos
  }

  /**
   * Gera link do WhatsApp com mensagem personalizada
   */
  generateWhatsAppLink(message: WhatsAppMessage): string {
    const messageText = this.generateMessage(message)
    const encodedMessage = encodeURIComponent(messageText)
    
    return `https://api.whatsapp.com/send?phone=55${this.whatsappNumber}&text=${encodedMessage}`
  }

  /**
   * Gera mensagem personalizada baseada no status da confirmação
   */
  private generateMessage(message: WhatsAppMessage): string {
    const { nome, status, acompanhante, observacoes, ticketId } = message
    
    let messageText = `🎉 *CONFIRMAÇÃO DE PRESENÇA RECEBIDA!*\n\n`
    
    // Saudação personalizada
    messageText += `Olá ${nome}! 👋\n\n`
    
    // Status da confirmação
    switch (status) {
      case 'confirmado':
        messageText += `✅ *Sua presença foi confirmada!*\n`
        messageText += `Estamos muito felizes que você poderá celebrar conosco! 💕\n\n`
        break
        
      case 'com_acompanhante':
        messageText += `✅ *Sua presença foi confirmada!*\n`
        messageText += `Ficamos felizes que você e ${acompanhante} poderão celebrar conosco! 💕\n\n`
        break
        
      case 'nao_poderei':
        messageText += `😔 *Entendemos que não poderá comparecer*\n`
        messageText += `Sentiremos sua falta, mas sabemos que estará conosco em pensamento! 💕\n\n`
        break
    }

    // Informações do evento
    messageText += `📅 *DETALHES DO EVENTO:*\n`
    messageText += `👰🤵 *${weddingData.casamento.noivos.nome_noiva} & ${weddingData.casamento.noivos.nome_noivo}*\n`
    messageText += `📅 Data: ${weddingData.casamento.evento.data}\n`
    messageText += `🕐 Horário: ${weddingData.casamento.evento.hora}\n`
    messageText += `📍 Local: ${weddingData.casamento.evento.local_resumo}\n\n`

    // Instruções importantes
    messageText += `📋 *INFORMAÇÕES IMPORTANTES:*\n`
    messageText += `• Chegue 15 minutos antes do horário marcado\n`
    messageText += `• Apresente este ingresso na entrada\n`
    messageText += `• Código do ingresso: *${ticketId}*\n\n`

    // Lista de presentes
    if (weddingData.casamento.lista_presentes && weddingData.casamento.lista_presentes.itens && weddingData.casamento.lista_presentes.itens.length > 0) {
      messageText += `🎁 *LISTA DE PRESENTES:*\n`
      messageText += `Sua presença já é o maior presente, mas se desejar nos presentear:\n\n`
      
      weddingData.casamento.lista_presentes.itens.slice(0, 5).forEach((presente, index) => {
        messageText += `${index + 1}. *${presente.nome}*\n`
        if (presente.valor) {
          messageText += `   💰 R$ ${presente.valor.toFixed(2)}\n`
        }
        if (presente.link) {
          messageText += `   🔗 ${presente.link}\n`
        }
        messageText += `\n`
      })
      
      if (weddingData.casamento.lista_presentes.itens.length > 5) {
        messageText += `... e mais ${weddingData.casamento.lista_presentes.itens.length - 5} itens na lista completa!\n\n`
      }
      
      messageText += `📱 *Ver lista completa:* ${window.location.origin}/presentes\n\n`
    }

    // Observações se houver
    if (observacoes) {
      messageText += `📝 *SUAS OBSERVAÇÕES:*\n`
      messageText += `${observacoes}\n\n`
    }

    // Links úteis
    messageText += `🔗 *LINKS ÚTEIS:*\n`
    messageText += `• 📍 Local do evento: ${window.location.origin}/local\n`
    messageText += `• 🎁 Lista de presentes: ${window.location.origin}/presentes\n`
    messageText += `• 📱 Site do casamento: ${window.location.origin}/site\n\n`

    // Agradecimento final
    messageText += `💕 *Muito obrigado por fazer parte do nosso dia especial!*\n\n`
    messageText += `Com carinho,\n`
    messageText += `${weddingData.casamento.noivos.nome_noiva} & ${weddingData.casamento.noivos.nome_noivo} 💍\n\n`
    messageText += `_Esta mensagem foi enviada automaticamente pelo sistema de convites._`

    return messageText
  }

  /**
   * Abre o WhatsApp em nova aba
   */
  openWhatsApp(message: WhatsAppMessage): void {
    const link = this.generateWhatsAppLink(message)
    window.open(link, '_blank')
  }

  /**
   * Gera mensagem de teste
   */
  generateTestMessage(): string {
    const testMessage: WhatsAppMessage = {
      nome: 'João Silva',
      telefone: '27999999999',
      status: 'confirmado',
      acompanhante: 'Maria Silva',
      observacoes: 'Vegetariano',
      ticketId: 'TICKET-TEST-123'
    }
    
    return this.generateMessage(testMessage)
  }
}

// Instância padrão - número será carregado do localStorage
export const whatsappService = new WhatsAppService('27999999999') // Número padrão, será sobrescrito
