import { NextRequest, NextResponse } from 'next/server'
import { ReminderService } from '@/lib/reminderService'

const reminderService = new ReminderService()

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Processando lembretes pendentes...')
    
    await reminderService.processPendingReminders()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Lembretes processados com sucesso' 
    })
  } catch (error) {
    console.error('Erro ao processar lembretes:', error)
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
    console.log('📅 Verificando lembretes pendentes...')
    
    await reminderService.processPendingReminders()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Verificação de lembretes concluída' 
    })
  } catch (error) {
    console.error('Erro ao verificar lembretes:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}
