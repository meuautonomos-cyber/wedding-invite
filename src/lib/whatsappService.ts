import { weddingData } from '@/data/weddingData'
import { supabaseStorage } from './supabaseStorage'
import { ReminderService } from './reminderService'
import { supabase } from './supabase'
import QRCode from 'qrcode'

interface WhatsAppMessageData {
  nome: string
  telefone: string
  status: 'confirmado' | 'com_acompanhante' | 'nao_poderei'
  acompanhante?: string
  observacoes?: string
  ticketId: string
  restricoes_alimentares?: string
}

interface PresenteItem {
  nome: string
  link: string
  valor?: number
  categoria?: string
  prioridade?: number
}

export class WhatsAppService {
  private readonly baseUrl: string
  private readonly wapiUrl: string
  private readonly wapiToken: string
  private readonly wapiInstanceId: string
  private readonly reminderService: ReminderService

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl
    this.wapiUrl = process.env.NEXT_PUBLIC_WAPI_BASE_URL || 'https://api.w-api.app/v1'
    this.wapiToken = process.env.NEXT_PUBLIC_WAPI_TOKEN || ''
    this.wapiInstanceId = process.env.NEXT_PUBLIC_WAPI_INSTANCE_ID || ''
    this.reminderService = new ReminderService(baseUrl)
  }

  // Lista de presentes com valores e prioridades
  private getPresentesList(): PresenteItem[] {
    return [
      // ELETRODOMÉSTICOS CAROS (Prioridade 1)
      { nome: "Smart Tv", link: "https://mercadolivre.com/sec/1jaff8k", categoria: "Eletrodomésticos", valor: 2000, prioridade: 1 },
      { nome: "Maquina de Lavar", link: "https://mercadolivre.com/sec/32siZuq", categoria: "Eletrodomésticos", valor: 1500, prioridade: 1 },
      { nome: "Robô Aspirador de Pó", link: "https://mercadolivre.com/sec/1pdsqFp", categoria: "Eletrodomésticos", valor: 800, prioridade: 1 },
      { nome: "Aspirador de Pó Vertical", link: "https://mercadolivre.com/sec/18fYNWW", categoria: "Eletrodomésticos", valor: 400, prioridade: 1 },
      { nome: "Micro-Ondas", link: "https://mercadolivre.com/sec/2gGDJiH", categoria: "Eletrodomésticos", valor: 300, prioridade: 1 },
      
      // COZINHA CARA (Prioridade 2)
      { nome: "Fritadeira sem óleo (Airfryer)", link: "https://mercadolivre.com/sec/1jDdXWD", categoria: "Cozinha", valor: 400, prioridade: 2 },
      { nome: "Jogo de panelas antiaderentes/inox", link: "https://mercadolivre.com/sec/2usVbzq", categoria: "Cozinha", valor: 300, prioridade: 2 },
      { nome: "Conjunto de travessas de vidro/cerâmica", link: "https://mercadolivre.com/sec/26av8p9", categoria: "Mesa", valor: 250, prioridade: 2 },
      { nome: "Jogo de cama (lençóis, fronhas, edredom)", link: "https://mercadolivre.com/sec/2NXLpcs", categoria: "Quarto", valor: 200, prioridade: 2 },
      
      // COZINHA MÉDIA (Prioridade 3)
      { nome: "Batedeira", link: "https://mercadolivre.com/sec/2frVCiG", categoria: "Cozinha", valor: 150, prioridade: 3 },
      { nome: "Liquidificador", link: "https://mercadolivre.com/sec/1SoRVx2", categoria: "Cozinha", valor: 120, prioridade: 3 },
      { nome: "Mixer 3 em 1", link: "https://mercadolivre.com/sec/1JScTpa", categoria: "Cozinha", valor: 100, prioridade: 3 },
      { nome: "Panela elétrica de arroz", link: "https://mercadolivre.com/sec/2MXn8XZ", categoria: "Cozinha", valor: 80, prioridade: 3 },
      { nome: "Conjunto de formas para bolo e assadeira", link: "https://mercadolivre.com/sec/2rfXnPM", categoria: "Cozinha", valor: 60, prioridade: 3 },
      
      // MESA E DECORAÇÃO (Prioridade 4)
      { nome: "Jogo de pratos", link: "https://mercadolivre.com/sec/15kfbN3", categoria: "Mesa", valor: 80, prioridade: 4 },
      { nome: "Jogo de Talheres", link: "https://mercadolivre.com/sec/1VpEqxE", categoria: "Mesa", valor: 60, prioridade: 4 },
      { nome: "Conjunto de copos", link: "https://mercadolivre.com/sec/1bwH3eF", categoria: "Mesa", valor: 50, prioridade: 4 },
      { nome: "Colcha ou cobre-leito", link: "https://mercadolivre.com/sec/2Pk99ys", categoria: "Quarto", valor: 80, prioridade: 4 },
      { nome: "Travesseiros", link: "https://mercadolivre.com/sec/1piNg8B", categoria: "Quarto", valor: 60, prioridade: 4 },
      { nome: "Cortinas", link: "https://mercadolivre.com/sec/1CwNdqD", categoria: "Decoração", valor: 100, prioridade: 4 },
      { nome: "Estante para Livros", link: "https://mercadolivre.com/sec/1tnwT39", categoria: "Sala", valor: 120, prioridade: 4 },
      
      // COZINHA BÁSICA (Prioridade 5)
      { nome: "Torradeira", link: "https://mercadolivre.com/sec/2RJhMuX", categoria: "Cozinha", valor: 50, prioridade: 5 },
      { nome: "Sanduicheira/grill", link: "https://mercadolivre.com/sec/19tYLWx", categoria: "Cozinha", valor: 40, prioridade: 5 },
      { nome: "Conjunto de facas", link: "https://mercadolivre.com/sec/19LNmft", categoria: "Cozinha", valor: 30, prioridade: 5 },
      { nome: "Jogo de potes herméticos para mantimentos", link: "https://mercadolivre.com/sec/2P9bHYg", categoria: "Cozinha", valor: 40, prioridade: 5 },
      { nome: "Jogo Tapete Cozinha", link: "https://mercadolivre.com/sec/1AeuNjb", categoria: "Cozinha", valor: 25, prioridade: 5 },
      
      // BANHEIRO E ORGANIZAÇÃO (Prioridade 6)
      { nome: "Jogo de Toalhas", link: "https://mercadolivre.com/sec/14QL9NG", categoria: "Banheiro", valor: 60, prioridade: 6 },
      { nome: "Roupões de casal", link: "https://mercadolivre.com/sec/27xRcLL", categoria: "Banheiro", valor: 80, prioridade: 6 },
      { nome: "Kit de higiene (porta-sabonete, escova, etc.)", link: "https://mercadolivre.com/sec/2MNDEoL", categoria: "Banheiro", valor: 40, prioridade: 6 },
      { nome: "Kit organizadores de guarda-roupa", link: "https://mercadolivre.com/sec/23LXFht", categoria: "Organização", valor: 50, prioridade: 6 },
      
      // DECORAÇÃO E ACESSÓRIOS (Prioridade 7)
      { nome: "Almofadas decorativas", link: "https://mercadolivre.com/sec/16vMCgZ", categoria: "Decoração", valor: 30, prioridade: 7 },
      { nome: "Manta aconchegante", link: "https://mercadolivre.com/sec/1B8XRBh", categoria: "Decoração", valor: 40, prioridade: 7 },
      { nome: "Tapetes antiderrapantes", link: "https://mercadolivre.com/sec/1FKWkrJ", categoria: "Decoração", valor: 25, prioridade: 7 },
      
      // MESA E ACESSÓRIOS (Prioridade 8)
      { nome: "Jogo Americano", link: "https://mercadolivre.com/sec/2sytDNj", categoria: "Mesa", valor: 20, prioridade: 8 },
      { nome: "Sousplat", link: "https://mercadolivre.com/sec/2xcp8oD", categoria: "Mesa", valor: 15, prioridade: 8 },
      { nome: "Jarra de suco/água", link: "https://mercadolivre.com/sec/1j4AAFa", categoria: "Mesa", valor: 25, prioridade: 8 },
      { nome: "Garrafa térmica para café/chá", link: "https://mercadolivre.com/sec/1k75wCy", categoria: "Mesa", valor: 30, prioridade: 8 },
      { nome: "Jogo de Xicaras", link: "https://mercadolivre.com/sec/28yi7aT", categoria: "Mesa", valor: 20, prioridade: 8 },
      
      // ELETRODOMÉSTICOS BÁSICOS (Prioridade 9)
      { nome: "Ventilador", link: "https://mercadolivre.com/sec/2GYR7oM", categoria: "Eletrodomésticos", valor: 80, prioridade: 9 },
      { nome: "Ferro de Passar", link: "https://mercadolivre.com/sec/1NdYDhp", categoria: "Eletrodomésticos", valor: 60, prioridade: 9 }
    ]
  }

  // Gerar QR Code para o ingresso
  private async generateQRCode(ticketId: string): Promise<string> {
    try {
      const qrData = `${this.baseUrl}/ingresso?id=${ticketId}`
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      return qrCodeDataURL
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
      return ''
    }
  }

  // Sistema inteligente de sugestão de presentes
  private async getSmartPresenteSuggestions(ticketId: string): Promise<PresenteItem[]> {
    try {
      // Buscar presentes já sugeridos GLOBALMENTE (para evitar repetições entre pessoas)
      const allSuggestedPresentes = await supabaseStorage.getAllSuggestedPresentes()
      
      // Obter todos os presentes ordenados por prioridade
      const allPresentes = this.getPresentesList().sort((a, b) => {
        if (a.prioridade !== b.prioridade) {
          return (a.prioridade || 9) - (b.prioridade || 9)
        }
        return (b.valor || 0) - (a.valor || 0)
      })
      
      // Filtrar presentes já sugeridos GLOBALMENTE
      const availablePresentes = allPresentes.filter(presente => 
        !allSuggestedPresentes.includes(presente.nome)
      )
      
      console.log('🎁 Sugestões disponíveis:', availablePresentes.length, 'de', allPresentes.length)
      console.log('🎁 Já sugeridos:', allSuggestedPresentes)
      
      // Se ainda há presentes disponíveis, sugerir APENAS 1 presente por pessoa
      if (availablePresentes.length > 0) {
        const suggestions = availablePresentes.slice(0, 1) // APENAS 1 presente por pessoa
        
        // Salvar sugestões no Supabase
        await supabaseStorage.savePresenteSuggestions(ticketId, suggestions)
        
        console.log('🎁 Sugerindo:', suggestions[0]?.nome)
        return suggestions
      }
      
      // Se acabaram os presentes, sugerir compra em grupo
      const groupSuggestions = this.getGroupPurchaseSuggestions()
      console.log('🎁 Sugerindo compra em grupo:', groupSuggestions.length, 'itens')
      
      return groupSuggestions
    } catch (error) {
      console.error('Erro ao obter sugestões:', error)
      return this.getPresentesList().slice(0, 1) // Apenas 1 presente em caso de erro
    }
  }


  // Sugestões para compra em grupo quando acabar os presentes
  private getGroupPurchaseSuggestions(): PresenteItem[] {
    const expensivePresentes = this.getPresentesList()
      .filter(p => (p.valor || 0) > 200)
      .sort((a, b) => (b.valor || 0) - (a.valor || 0))
      .slice(0, 3)
    
    return expensivePresentes.map(presente => ({
      ...presente,
      nome: `${presente.nome} (COMPRA EM GRUPO)`,
      grupo: true
    }))
  }

  // Gerar mensagem personalizada
  private async generateMessage(data: WhatsAppMessageData): Promise<string> {
    const { nome, status, acompanhante, observacoes, ticketId, restricoes_alimentares } = data
    const { noivos, evento } = weddingData.casamento
    
    let messageText = `🎉 *CONFIRMAÇÃO DE PRESENÇA RECEBIDA!*\n\n`
    messageText += `Olá ${nome}! 👋\n\n`
    
    if (status === 'com_acompanhante' && acompanhante) {
      messageText += `✅ *Sua presença foi confirmada com acompanhante: ${acompanhante}!*\n`
    } else if (status === 'confirmado') {
      messageText += `✅ *Sua presença foi confirmada!*\n`
    }
    
    messageText += `Estamos muito felizes que você poderá celebrar conosco! 💕\n\n`
    
    messageText += `📅 *DETALHES DO EVENTO:*\n`
    messageText += `👰🤵 *${noivos.nome_noiva} & ${noivos.nome_noivo}*\n`
    messageText += `📅 Data: ${evento.data}\n`
    messageText += `🕐 Horário: ${evento.hora}\n`
    messageText += `📍 Local: ${evento.local_resumo}\n\n`
    
    messageText += `📋 *INFORMAÇÕES IMPORTANTES:*\n`
    messageText += `• Chegue 15 minutos antes do horário marcado\n`
    messageText += `• Apresente este ingresso na entrada\n`
    messageText += `• Código do ingresso: *${ticketId}*\n`
    messageText += `• Seu ingresso personalizado: ${this.baseUrl}/ingresso?id=${ticketId}\n\n`
    
    // Sistema inteligente de sugestão de presentes - APENAS 1 por pessoa
    const suggestedPresentes = await this.getSmartPresenteSuggestions(ticketId)
    
    if (suggestedPresentes.length > 0) {
      const presente = suggestedPresentes[0] // Pegar apenas o primeiro (único)
      if (presente) {
        const valorText = presente.valor ? `💰 R$ ${presente.valor.toFixed(2)}` : ''

        messageText += `🎁 *SUGESTÃO DE PRESENTE:*\n`
        messageText += `Sua presença já é o maior presente, mas se desejar nos presentear:\n\n`
        messageText += `*${presente.nome}*\n`
        if (valorText) messageText += `${valorText}\n`
        messageText += `🔗 ${presente.link}\n\n`
      }
    } else {
      messageText += `🎁 *LISTA DE PRESENTES:*\n`
      messageText += `Sua presença já é o maior presente! Se desejar nos presentear, veja nossa lista completa.\n\n`
    }
    
    messageText += `📱 *Ver lista completa:* ${this.baseUrl}/presentes\n\n`
    
    // Observações
    if (restricoes_alimentares || observacoes) {
      messageText += `📝 *SUAS OBSERVAÇÕES:*\n`
      if (restricoes_alimentares) {
        messageText += `• Restrições alimentares: ${restricoes_alimentares}\n`
      }
      if (observacoes) {
        messageText += `• Observações: ${observacoes}\n`
      }
      messageText += `\n`
    }
    
    messageText += `🔗 *LINKS ÚTEIS:*\n`
    messageText += `• 📍 Local do evento: ${this.baseUrl}/local\n`
    messageText += `• 🎁 Lista de presentes: ${this.baseUrl}/presentes\n`
    messageText += `• 📱 Site do casamento: ${this.baseUrl}/site\n\n`
    
    messageText += `💕 *Muito obrigado por fazer parte do nosso dia especial!*\n\n`
    messageText += `Com carinho,\n${noivos.nome_noiva} & ${noivos.nome_noivo} 💍\n\n`
    messageText += `_Esta mensagem foi enviada automaticamente pelo sistema de convites._`
    
    return messageText
  }

  // Enviar mensagem via WhatsApp Web para a PESSOA QUE SE CADASTROU
  async sendWhatsAppMessage(data: WhatsAppMessageData): Promise<boolean> {
    try {
      const message = await this.generateMessage(data)
      const qrCode = await this.generateQRCode(data.ticketId)
      
      // CORRIGIDO: Enviar para a PESSOA que se cadastrou, não para o admin
      const whatsappUrl = `https://web.whatsapp.com/send?phone=55${data.telefone}&text=${encodeURIComponent(message)}`
      
      // Salvar QR Code no localStorage para exibir na página
      if (qrCode) {
        localStorage.setItem(`qr-${data.ticketId}`, qrCode)
      }
      
      console.log('📱 Preparando envio para:', data.telefone)
      console.log('🔗 URL do WhatsApp:', whatsappUrl)
      
      // SEMPRE abrir WhatsApp Web para enviar a mensagem
      console.log('🚀 Abrindo WhatsApp Web automaticamente...')
      window.open(whatsappUrl, '_blank')
      
      // Também tentar via API para logs
      try {
        await this.sendViaAPI(data)
      } catch (error) {
        console.log('⚠️ API falhou, mas WhatsApp Web foi aberto')
      }
      
      return true
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error)
      return false
    }
  }

  // Enviar via W-API
  async sendViaAPI(data: WhatsAppMessageData): Promise<boolean> {
    try {
      const message = await this.generateMessage(data)
      
      // Enviar mensagem via W-API (formato correto testado)
      const response = await fetch(`${this.wapiUrl}/message/send-text?instanceId=${this.wapiInstanceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.wapiToken}`
        },
        body: JSON.stringify({
          phone: `55${data.telefone}`,
          message: message
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ W-API retornou sucesso:', result)
        
        // Criar lembretes automáticos APENAS para convidados confirmados
        if (data.status === 'confirmado' || data.status === 'com_acompanhante') {
          try {
            await this.reminderService.createRemindersForGuest(
              data.ticketId, 
              data.nome, 
              data.telefone
            )
            console.log('📅 Lembretes criados para convidado confirmado:', data.nome)
          } catch (error) {
            console.error('Erro ao criar lembretes:', error)
          }
        } else {
          console.log('⚠️ Lembretes NÃO criados - convidado não confirmou presença:', data.nome)
        }
        
        // Abrir WhatsApp Web com a mensagem
        const whatsappUrl = `https://web.whatsapp.com/send?phone=55${data.telefone}&text=${encodeURIComponent(message)}`
        console.log('🔗 Abrindo WhatsApp Web...')
        window.open(whatsappUrl, '_blank')
        return true
      } else {
        console.error('❌ Erro na W-API:', await response.text())
        return false
      }
    } catch (error) {
      console.error('Erro ao enviar via W-API:', error)
      return false
    }
  }

  // Fallback para SMS/Email
  async sendFallback(data: WhatsAppMessageData): Promise<boolean> {
    try {
      const message = await this.generateMessage(data)
      
      // Tentar enviar por email se tiver
      if (data.telefone.includes('@')) {
        const emailUrl = `mailto:${data.telefone}?subject=Confirmação de Presença - ${weddingData.casamento.noivos.nome_noiva} & ${weddingData.casamento.noivos.nome_noivo}&body=${encodeURIComponent(message)}`
        window.open(emailUrl)
        return true
      }
      
      // Tentar enviar por SMS
      const smsUrl = `sms:${data.telefone}?body=${encodeURIComponent(message)}`
      window.open(smsUrl)
      return true
    } catch (error) {
      console.error('Erro no fallback:', error)
      return false
    }
  }

  // Função para resetar sugestões (útil para testes ou quando todos os presentes foram sugeridos)
  static async resetSuggestedPresentes(): Promise<void> {
    try {
      // Limpar todas as sugestões da tabela
      const { error } = await supabase
        .from('wedding_presente_suggestions')
        .delete()
        .neq('id', 0) // Deletar todos os registros
      
      if (error) {
        console.error('Erro ao resetar sugestões:', error)
      } else {
        console.log('🔄 Sugestões de presentes resetadas no Supabase')
      }
    } catch (error) {
      console.error('Erro ao resetar sugestões:', error)
    }
  }

  // Função para verificar quantos presentes já foram sugeridos
  static async getSuggestedPresentesCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('wedding_presente_suggestions')
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.error('Erro ao contar sugestões:', error)
        return 0
      }
      
      return count || 0
    } catch (error) {
      console.error('Erro ao contar sugestões:', error)
      return 0
    }
  }
}

export const whatsappService = new WhatsAppService('27996372592')