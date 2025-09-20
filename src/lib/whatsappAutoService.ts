import { weddingData } from '@/data/weddingData'
import { supabaseStorage } from './supabaseStorage'
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

export class WhatsAppAutoService {
  private readonly baseUrl: string
  private readonly zApiToken: string
  private readonly zApiUrl: string

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl
    // Token do Z-API (você precisa obter em https://z-api.io)
    this.zApiToken = process.env.NEXT_PUBLIC_ZAPI_TOKEN || ''
    const instanceId = process.env.NEXT_PUBLIC_ZAPI_INSTANCE_ID || ''
    const clientToken = process.env.NEXT_PUBLIC_ZAPI_CLIENT_TOKEN || ''
    this.zApiUrl = `https://api.z-api.io/instances/${instanceId}/token/${this.zApiToken}/send-text`
    
    // Configuração do WhatsAppAutoService
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
      { nome: "Travessa de Porcelanato", link: "https://mercadolivre.com/sec/2xcp8oD", categoria: "Mesa", valor: 15, prioridade: 8 },
      { nome: "Jarra de suco/água", link: "https://mercadolivre.com/sec/1j4AAFa", categoria: "Mesa", valor: 25, prioridade: 8 },
      { nome: "Garrafa térmica para café/chá", link: "https://mercadolivre.com/sec/1k75wCy", categoria: "Mesa", valor: 30, prioridade: 8 },
      { nome: "Jogo de Xicaras", link: "https://mercadolivre.com/sec/28yi7aT", categoria: "Mesa", valor: 20, prioridade: 8 },
      
      // ELETRODOMÉSTICOS BÁSICOS (Prioridade 9)
      { nome: "Ventilador", link: "https://mercadolivre.com/sec/2GYR7oM", categoria: "Eletrodomésticos", valor: 80, prioridade: 9 },
      { nome: "Ferro de Passar", link: "https://mercadolivre.com/sec/1NdYDhp", categoria: "Eletrodomésticos", valor: 60, prioridade: 9 }
    ]
  }

  // Detectar iPhone
  private detectIPhone(userAgent?: string): boolean {
    if (typeof window !== 'undefined' && !userAgent) {
      userAgent = navigator.userAgent
    }
    return /iPhone|iPad|iPod/i.test(userAgent || '')
  }

  // Detectar Android
  private detectAndroid(userAgent?: string): boolean {
    if (typeof window !== 'undefined' && !userAgent) {
      userAgent = navigator.userAgent
    }
    return /Android/i.test(userAgent || '')
  }

  // Sistema inteligente de sugestão de presentes baseado no dispositivo
  private async getSmartPresenteSuggestions(ticketId: string, userAgent?: string): Promise<PresenteItem[]> {
    try {
      // Buscar presentes já sugeridos para este ticket
      const suggestedPresentes = await this.getSuggestedPresentesForTicket(ticketId)
      
      // Se já tem sugestão para este ticket, retornar a existente
      if (suggestedPresentes.length > 0) {
        return suggestedPresentes
      }
      
      // Detectar tipo de dispositivo
      const isIPhone = this.detectIPhone(userAgent)
      const isAndroid = this.detectAndroid(userAgent)
      
      console.log(`📱 Dispositivo detectado: ${isIPhone ? 'iPhone' : isAndroid ? 'Android' : 'Outro'}`)
      
      // Obter todos os presentes
      const allPresentes = this.getPresentesList()
      
      // Buscar todos os presentes já sugeridos globalmente
      const allSuggestedPresentes = await supabaseStorage.getAllSuggestedPresentes()
      
      // Filtrar presentes já sugeridos globalmente
      const availablePresentes = allPresentes.filter(presente => 
        !allSuggestedPresentes.includes(presente.nome)
      )
      
      let suggestions: PresenteItem[] = []
      
      if (availablePresentes.length > 0) {
        // Separar presentes por faixas de preço
        const caros = availablePresentes.filter(p => (p.prioridade || 9) <= 3) // Prioridade 1-3
        const medios = availablePresentes.filter(p => (p.prioridade || 9) >= 4 && (p.prioridade || 9) <= 6) // Prioridade 4-6
        const baratos = availablePresentes.filter(p => (p.prioridade || 9) >= 7) // Prioridade 7-9
        
        let selectedPresentes: PresenteItem[] = []
        
        if (isIPhone) {
          // iPhone: 70% caros, 30% baratos
          const random = Math.random()
          if (random < 0.7 && caros.length > 0) {
            selectedPresentes = caros.sort((a, b) => (b.valor || 0) - (a.valor || 0))
            console.log(`🍎 iPhone: Sugerindo presente CARO (70% chance)`)
          } else if (baratos.length > 0) {
            selectedPresentes = baratos.sort((a, b) => (a.valor || 0) - (b.valor || 0))
            console.log(`🍎 iPhone: Sugerindo presente BARATO (30% chance)`)
          } else if (medios.length > 0) {
            selectedPresentes = medios.sort((a, b) => (b.valor || 0) - (a.valor || 0))
            console.log(`🍎 iPhone: Fallback para MÉDIO`)
          }
        } else if (isAndroid) {
          // Android: 70% baratos, 30% caros
          const random = Math.random()
          if (random < 0.7 && baratos.length > 0) {
            selectedPresentes = baratos.sort((a, b) => (a.valor || 0) - (b.valor || 0))
            console.log(`🤖 Android: Sugerindo presente BARATO (70% chance)`)
          } else if (caros.length > 0) {
            selectedPresentes = caros.sort((a, b) => (b.valor || 0) - (a.valor || 0))
            console.log(`🤖 Android: Sugerindo presente CARO (30% chance)`)
          } else if (medios.length > 0) {
            selectedPresentes = medios.sort((a, b) => (b.valor || 0) - (a.valor || 0))
            console.log(`🤖 Android: Fallback para MÉDIO`)
          }
        } else {
          // Outros dispositivos: 50% médios, 25% caros, 25% baratos
          const random = Math.random()
          if (random < 0.5 && medios.length > 0) {
            selectedPresentes = medios.sort((a, b) => (b.valor || 0) - (a.valor || 0))
            console.log(`💻 Outro: Sugerindo presente MÉDIO (50% chance)`)
          } else if (random < 0.75 && caros.length > 0) {
            selectedPresentes = caros.sort((a, b) => (b.valor || 0) - (a.valor || 0))
            console.log(`💻 Outro: Sugerindo presente CARO (25% chance)`)
          } else if (baratos.length > 0) {
            selectedPresentes = baratos.sort((a, b) => (a.valor || 0) - (b.valor || 0))
            console.log(`💻 Outro: Sugerindo presente BARATO (25% chance)`)
          }
        }
        
        // Se não encontrou presentes na categoria específica, usar fallback
        if (selectedPresentes.length === 0) {
          selectedPresentes = availablePresentes
            .sort((a, b) => (b.valor || 0) - (a.valor || 0))
          console.log(`🔄 Fallback: Usando primeiro disponível`)
        }
        
        // Pegar apenas 1 presente
        suggestions = selectedPresentes.slice(0, 1)
        
        // Salvar sugestões no Supabase
        await supabaseStorage.savePresenteSuggestions(ticketId, suggestions)
        
        return suggestions
      }
      
      // Se acabaram os presentes, sugerir compra em grupo
      const groupSuggestions = this.getGroupPurchaseSuggestions()
      
      // Salvar sugestões de grupo no Supabase
      await supabaseStorage.savePresenteSuggestions(ticketId, groupSuggestions)
      
      return groupSuggestions
    } catch (error) {
      console.error('Erro ao obter sugestões:', error)
      return this.getPresentesList().slice(0, 1)
    }
  }

  // Buscar presentes já sugeridos para um ticket
  private async getSuggestedPresentesForTicket(ticketId: string): Promise<PresenteItem[]> {
    try {
      const suggestions = await supabaseStorage.getPresenteSuggestionsForTicket(ticketId)
      return suggestions.map(suggestion => ({
        nome: suggestion.presente_nome,
        link: suggestion.presente_link,
        valor: suggestion.presente_valor,
        categoria: suggestion.presente_categoria,
        prioridade: suggestion.prioridade
      }))
    } catch (error) {
      console.error('Erro ao buscar presentes sugeridos:', error)
      return []
    }
  }

  // Sugestões para compra em grupo quando acabar os presentes
  private getGroupPurchaseSuggestions(): PresenteItem[] {
    const expensivePresentes = this.getPresentesList()
      .filter(p => (p.valor || 0) > 200)
      .sort((a, b) => (b.valor || 0) - (a.valor || 0))
      .slice(0, 1)
    
    return expensivePresentes.map(presente => ({
      ...presente,
      nome: `${presente.nome} (COMPRA EM GRUPO)`,
      grupo: true
    }))
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

  // Gerar mensagem personalizada
  private async generateMessage(data: WhatsAppMessageData, userAgent?: string): Promise<string> {
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
    
    // Sistema inteligente de sugestão de presentes baseado no dispositivo
    const suggestedPresentes = await this.getSmartPresenteSuggestions(ticketId, userAgent)
    
    if (suggestedPresentes.length > 0) {
      const presente = suggestedPresentes[0] // Pegar apenas o primeiro (único)
      const valorText = presente.valor ? `💰 R$ ${presente.valor.toFixed(2)}` : ''
      const grupoText = presente.grupo ? ' 👥' : ''
      
      messageText += `🎁 *SUGESTÃO DE PRESENTE:*\n`
      messageText += `Sua presença já é o maior presente, mas se desejar nos presentear:\n\n`
      messageText += `*${presente.nome}*${grupoText}\n`
      if (valorText) messageText += `${valorText}\n`
      messageText += `🔗 ${presente.link}\n\n`
      
      // Se é sugestão de grupo, adicionar explicação
      if (presente.grupo) {
        messageText += `💡 *DICA:* Este presente pode ser comprado em grupo!\n`
        messageText += `Entre em contato conosco para organizar a compra coletiva.\n\n`
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

  // ENVIO 100% AUTOMÁTICO via Z-API
  async sendWhatsAppMessage(data: WhatsAppMessageData, userAgent?: string): Promise<boolean> {
    try {
      // Validar credenciais
      if (!this.zApiToken || !this.zApiUrl.includes('3E780CBE27A2F0395961EE5C772D9ACD')) {
        console.error('❌ Credenciais Z-API não configuradas corretamente')
        return false
      }
      
      const message = await this.generateMessage(data, userAgent)
      const qrCode = await this.generateQRCode(data.ticketId)
      
      // Enviando mensagem automática via Z-API
      
      // Salvar QR Code no localStorage para exibir na página (apenas no cliente)
      if (typeof window !== 'undefined' && qrCode) {
        localStorage.setItem(`qr-${data.ticketId}`, qrCode)
      }
      
      // ENVIO AUTOMÁTICO via Z-API
      const clientToken = process.env.NEXT_PUBLIC_ZAPI_CLIENT_TOKEN || ''
      const response = await fetch(this.zApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Client-Token': clientToken
        },
        body: JSON.stringify({
          phone: `55${data.telefone}`,
          message: message
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        return true
      } else {
        const errorText = await response.text()
        console.error('Erro ao enviar via Z-API:', response.status, errorText)
        return false
      }
      
    } catch (error) {
      console.error('Erro ao enviar mensagem automática:', error)
      return false
    }
  }

  // Testar conexão com Z-API
  async testConnection(): Promise<boolean> {
    try {
      const clientToken = process.env.NEXT_PUBLIC_ZAPI_CLIENT_TOKEN || ''
      const response = await fetch(`https://api.z-api.io/instances/${process.env.NEXT_PUBLIC_ZAPI_INSTANCE_ID}/token/${this.zApiToken}/status`, {
        method: 'GET',
        headers: {
          'Client-Token': clientToken
        }
      })
      
      if (response.ok) {
        return true
      } else {
        console.error('Erro na conexão Z-API:', response.status)
        return false
      }
    } catch (error) {
      console.error('Erro ao testar Z-API:', error)
      return false
    }
  }
}

export const whatsappAutoService = new WhatsAppAutoService()
