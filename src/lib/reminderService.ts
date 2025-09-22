import { weddingData } from '@/data/weddingData'
import { supabaseStorage } from './supabaseStorage'

interface ReminderData {
  id: string
  ticket_id: string
  nome: string
  telefone: string
  dias_restantes: number
  proximo_envio: string
  ultimo_envio?: string
  status: 'pendente' | 'enviado' | 'pausado'
  mensagem_enviada?: string
  imagem_enviada?: string
}

export class ReminderService {
  private readonly baseUrl: string
  private readonly zApiUrl: string

  constructor(baseUrl: string = 'http://localhost:3000', zApiUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl
    this.zApiUrl = zApiUrl
  }

  // Calcular quantos dias restam até o casamento
  private getDaysUntilWedding(): number {
    const weddingDate = new Date('2026-03-21') // Data do casamento
    const today = new Date()
    const diffTime = weddingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  // Gerar mensagens de lembrete baseadas nos dias restantes
  private getReminderMessage(diasRestantes: number, ticketId?: string): { mensagem: string, imagem: string } {
    const { noivos, evento } = weddingData.casamento
    const ingressoLink = ticketId ? `${this.baseUrl}/ingresso?id=${ticketId}` : `${this.baseUrl}/ingresso`
    
    if (diasRestantes > 180) {
      return {
        mensagem: `🎉 *LEMBRETE ESPECIAL - ${diasRestantes} DIAS!*\n\nOlá! 👋\n\nEstamos muito animados para nosso grande dia! Ainda faltam *${diasRestantes} dias* para o casamento de *${noivos.nome_noiva} & ${noivos.nome_noivo}*.\n\n📅 *Data:* ${evento.data}\n🕐 *Horário:* ${evento.hora}\n📍 *Local:* ${evento.local_resumo}\n\n💕 *Preparem-se para uma celebração inesquecível!*\n\n🔗 *Links úteis:*\n• Site: ${this.baseUrl}/site\n• Lista de presentes: ${this.baseUrl}/presentes\n• Local: ${this.baseUrl}/local\n\n_Esta mensagem foi enviada automaticamente._`,
        imagem: '/images/reminders/6-meses.jpg'
      }
    } else if (diasRestantes > 120) {
      return {
        mensagem: `💍 *LEMBRETE - ${diasRestantes} DIAS!*\n\nOi! 😊\n\nO tempo está passando e nosso casamento está chegando! Faltam apenas *${diasRestantes} dias* para o grande dia!\n\n📅 *${evento.data} às ${evento.hora}*\n📍 *${evento.local_resumo}*\n\n🎁 *Dica:* Já conferiram nossa lista de presentes? Temos itens incríveis para nossa casa!\n\n🔗 *Acesse:* ${this.baseUrl}/presentes\n\n_Contagem regressiva iniciada!_ ⏰`,
        imagem: '/images/reminders/4-meses.jpg'
      }
    } else if (diasRestantes > 60) {
      return {
        mensagem: `⏰ *${diasRestantes} DIAS PARA O GRANDE DIA!*\n\nOlá! 👋\n\nA emoção está aumentando! Faltam *${diasRestantes} dias* para o casamento de *${noivos.nome_noiva} & ${noivos.nome_noivo}*!\n\n📅 *${evento.data} às ${evento.hora}*\n📍 *${evento.local_resumo}*\n\n💡 *Lembretes importantes:*\n• Confirme sua presença: ${this.baseUrl}/confirmar\n• Veja o dress code: ${this.baseUrl}/site\n• Lista de presentes: ${this.baseUrl}/presentes\n\n_Estamos contando os dias!_ 💕`,
        imagem: '/images/reminders/2-meses.jpg'
      }
    } else if (diasRestantes > 30) {
      return {
        mensagem: `🔥 *APENAS ${diasRestantes} DIAS!*\n\nOi! 😍\n\nA contagem regressiva está acelerando! Faltam apenas *${diasRestantes} dias* para nosso casamento!\n\n📅 *${evento.data} às ${evento.hora}*\n📍 *${evento.local_resumo}*\n\n🎯 *Últimas informações:*\n• Chegue 15 minutos antes\n• Dress code: evite branco, verde e creme\n• Confirme presença: ${this.baseUrl}/confirmar\n\n_Estamos muito ansiosos!_ 💍`,
        imagem: '/images/reminders/1-mes.jpg'
      }
    } else if (diasRestantes > 7) {
      return {
        mensagem: `🚨 *ÚLTIMOS ${diasRestantes} DIAS!*\n\nOlá! 😱\n\nNossa! Faltam apenas *${diasRestantes} dias* para o casamento! A emoção está no máximo!\n\n📅 *${evento.data} às ${evento.hora}*\n📍 *${evento.local_resumo}*\n\n⚠️ *IMPORTANTE:*\n• Chegue 15 minutos antes\n• Traga o ingresso digital: ${ingressoLink}\n• Dress code: cores vibrantes (não branco/verde/creme)\n\n_Estamos quase lá!_ 🎉`,
        imagem: '/images/reminders/1-semana.jpg'
      }
    } else if (diasRestantes > 1) {
      return {
        mensagem: `🎊 *AMANHÃ É O GRANDE DIA!*\n\nOi! 😍\n\nAmanhã é o dia! *${diasRestantes} dias* restantes para o casamento de *${noivos.nome_noiva} & ${noivos.nome_noivo}*!\n\n📅 *${evento.data} às ${evento.hora}*\n📍 *${evento.local_resumo}*\n\n🎯 *Lembretes finais:*\n• Chegue 15 minutos antes\n• Traga o ingresso: ${ingressoLink}\n• Venha com o coração cheio de alegria!\n\n_Até amanhã!_ 💕`,
        imagem: '/images/reminders/1-dia.jpg'
      }
    } else {
      return {
        mensagem: `🎉 *HOJE É O GRANDE DIA!*\n\nOlá! 😍\n\nHoje é o dia! O casamento de *${noivos.nome_noiva} & ${noivos.nome_noivo}* é hoje!\n\n📅 *${evento.data} às ${evento.hora}*\n📍 *${evento.local_resumo}*\n\n🎯 *Últimos lembretes:*\n• Chegue 15 minutos antes\n• Traga o ingresso: ${ingressoLink}\n• Venha pronto para celebrar!\n\n_Estamos ansiosos para vê-los!_ 💍🎊`,
        imagem: '/images/reminders/hoje.jpg'
      }
    }
  }

  // Criar lembretes para um novo convidado
  async createRemindersForGuest(ticketId: string, nome: string, telefone: string): Promise<void> {
    try {
      const diasRestantes = this.getDaysUntilWedding()
      
      // Criar lembretes a cada 30 dias
      const reminders: ReminderData[] = []
      let proximoEnvio = new Date()
      proximoEnvio.setDate(proximoEnvio.getDate() + 30) // Primeiro lembrete em 30 dias

      for (let i = 0; i < 6; i++) { // Máximo 6 lembretes
        const diasParaEnvio = 30 * (i + 1)
        if (diasParaEnvio <= diasRestantes) {
          const dataEnvio = new Date()
          dataEnvio.setDate(dataEnvio.getDate() + diasParaEnvio)
          
          reminders.push({
            id: `${ticketId}_reminder_${i + 1}`,
            ticket_id: ticketId,
            nome,
            telefone,
            dias_restantes: Math.max(0, diasRestantes - diasParaEnvio),
            proximo_envio: dataEnvio.toISOString(),
            status: 'pendente'
          })
        }
      }

      // Salvar no Supabase
      await supabaseStorage.createReminders(reminders)
      
      console.log(`Lembretes criados para ${nome}: ${reminders.length} lembretes`)
    } catch (error) {
      console.error('Erro ao criar lembretes:', error)
    }
  }

  // Processar lembretes pendentes
  async processPendingReminders(): Promise<void> {
    try {
      const reminders = await supabaseStorage.getPendingReminders()
      
      for (const reminder of reminders) {
        const hoje = new Date()
        const proximoEnvio = new Date(reminder.proximo_envio)
        
        if (hoje >= proximoEnvio) {
          await this.sendReminder(reminder)
        }
      }
    } catch (error) {
      console.error('Erro ao processar lembretes:', error)
    }
  }

  // Enviar lembrete individual
  private async sendReminder(reminder: ReminderData): Promise<void> {
    try {
      const { mensagem, imagem } = this.getReminderMessage(reminder.dias_restantes, reminder.ticket_id)
      
      // Enviar via Z-API
      const response = await fetch(`${this.zApiUrl}/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: reminder.telefone,
          message: mensagem,
          image: imagem
        })
      })

      if (response.ok) {
        // Atualizar status do lembrete
        await supabaseStorage.updateReminderStatus(reminder.id, 'enviado', {
          mensagem_enviada: mensagem,
          imagem_enviada: imagem,
          ultimo_envio: new Date().toISOString()
        })
        
        console.log(`Lembrete enviado para ${reminder.nome}`)
      } else {
        console.error(`Erro ao enviar lembrete para ${reminder.nome}`)
      }
    } catch (error) {
      console.error('Erro ao enviar lembrete:', error)
    }
  }

  // Agendar próximo lembrete
  async scheduleNextReminder(ticketId: string): Promise<void> {
    try {
      const proximoReminder = await supabaseStorage.getNextReminder(ticketId)
      
      if (proximoReminder) {
        // Agendar para 30 dias depois do último envio
        const proximoEnvio = new Date()
        proximoEnvio.setDate(proximoEnvio.getDate() + 30)
        
        await supabaseStorage.updateReminderNextSend(proximoReminder.id, proximoEnvio.toISOString())
      }
    } catch (error) {
      console.error('Erro ao agendar próximo lembrete:', error)
    }
  }
}
