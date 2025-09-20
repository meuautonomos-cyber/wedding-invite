import { NextRequest, NextResponse } from 'next/server'
import { whatsappAutoService } from '@/lib/whatsappAutoService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, ticketId, nome, status, acompanhante, observacoes, restricoes_alimentares } = body
    
    // Capturar User-Agent do request
    const userAgent = request.headers.get('user-agent') || ''

    if (!to) {
      return NextResponse.json(
        { error: 'Telefone é obrigatório' },
        { status: 400 }
      )
    }

    // Enviando mensagem automática via Z-API

    // Preparar dados para envio automático
    const whatsappData = {
      nome: nome || 'Convidado',
      telefone: to.replace('55', ''),
      status: status || 'confirmado',
      acompanhante,
      observacoes,
      ticketId,
      restricoes_alimentares
    }

    // ENVIO 100% AUTOMÁTICO via Z-API
    const success = await whatsappAutoService.sendWhatsAppMessage(whatsappData, userAgent)
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Mensagem enviada automaticamente via Z-API',
        ticketId,
        to,
        automatic: true
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Falha no envio automático',
        ticketId,
        to,
        automatic: false
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Erro na API WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
