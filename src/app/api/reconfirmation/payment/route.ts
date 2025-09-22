import { NextRequest, NextResponse } from 'next/server'
import { ReconfirmationService } from '@/lib/reconfirmationService'

const reconfirmationService = new ReconfirmationService()

export async function POST(request: NextRequest) {
  try {
    const { ticketId, comprovante } = await request.json()
    
    if (!ticketId || !comprovante) {
      return NextResponse.json(
        { success: false, message: 'Ticket ID e comprovante são obrigatórios' },
        { status: 400 }
      )
    }

    const result = await reconfirmationService.processTaxPayment(ticketId, comprovante)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao processar pagamento:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
