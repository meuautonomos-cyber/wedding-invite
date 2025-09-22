import { NextRequest, NextResponse } from 'next/server'
import { ReconfirmationService } from '@/lib/reconfirmationService'

const reconfirmationService = new ReconfirmationService()

export async function POST(request: NextRequest) {
  try {
    const { ticketId, action } = await request.json()
    
    if (!ticketId || !action) {
      return NextResponse.json(
        { success: false, message: 'Ticket ID e ação são obrigatórios' },
        { status: 400 }
      )
    }

    const result = await reconfirmationService.processReconfirmation(ticketId, action)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao processar reconfirmação:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ticketId = searchParams.get('ticketId')
    
    if (!ticketId) {
      return NextResponse.json(
        { success: false, message: 'Ticket ID é obrigatório' },
        { status: 400 }
      )
    }

    const status = await reconfirmationService.getReconfirmationStatus(ticketId)
    
    return NextResponse.json({ success: true, data: status })
  } catch (error) {
    console.error('Erro ao buscar status da reconfirmação:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
