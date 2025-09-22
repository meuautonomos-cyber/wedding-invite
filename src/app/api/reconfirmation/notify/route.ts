import { NextRequest, NextResponse } from 'next/server'
import { ReconfirmationService } from '@/lib/reconfirmationService'

const reconfirmationService = new ReconfirmationService()

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Iniciando envio de notificações de reconfirmação...')
    
    // Criar reconfirmações para todos os convidados se necessário
    await reconfirmationService.createReconfirmationsForAllGuests()
    
    // Enviar notificações
    await reconfirmationService.sendReconfirmationNotifications()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Notificações de reconfirmação processadas com sucesso' 
    })
  } catch (error) {
    console.error('Erro ao processar notificações de reconfirmação:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('📅 Verificando notificações de reconfirmação...')
    
    await reconfirmationService.createReconfirmationsForAllGuests()
    await reconfirmationService.sendReconfirmationNotifications()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Verificação de reconfirmações concluída' 
    })
  } catch (error) {
    console.error('Erro ao verificar reconfirmações:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}
