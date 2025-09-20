exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // Responder a requisições OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  // Apenas aceitar POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido' })
    }
  }

  try {
    const body = JSON.parse(event.body)
    const { to, ticketId, nome, status, acompanhante, observacoes, restricoes_alimentares } = body
    
    // Capturar User-Agent do request
    const userAgent = event.headers['user-agent'] || ''

    if (!to) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Telefone é obrigatório' })
      }
    }

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
    const success = await sendWhatsAppMessage(whatsappData, userAgent)
    
    if (success) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Mensagem enviada automaticamente via Z-API',
          ticketId,
          to,
          automatic: true
        })
      }
    } else {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Falha no envio automático',
          ticketId,
          to,
          automatic: false
        })
      }
    }

  } catch (error) {
    console.error('Erro na função WhatsApp:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro interno do servidor' })
    }
  }
}

// Função para enviar mensagem via Z-API
async function sendWhatsAppMessage(data, userAgent) {
  try {
    // Configurações da Z-API
    const zApiToken = process.env.NEXT_PUBLIC_ZAPI_TOKEN
    const instanceId = process.env.NEXT_PUBLIC_ZAPI_INSTANCE_ID
    const clientToken = process.env.NEXT_PUBLIC_ZAPI_CLIENT_TOKEN
    
    if (!zApiToken || !instanceId || !clientToken) {
      console.error('❌ Variáveis de ambiente Z-API não configuradas')
      return false
    }

    const zApiUrl = `https://api.z-api.io/instances/${instanceId}/token/${zApiToken}/send-text`
    
    console.log('🔧 Debug Z-API:', {
      url: zApiUrl,
      clientToken: clientToken ? '***' + clientToken.slice(-4) : 'VAZIO',
      phone: `55${data.telefone}`,
      nome: data.nome
    })

    // Gerar QR Code
    const qrCode = generateQRCode(data.ticketId)
    
    // Montar mensagem
    let message = `🎉 *CONFIRMAÇÃO DE PRESENÇA* 🎉\n\n`
    message += `Olá *${data.nome}*! 👋\n\n`
    message += `Sua presença foi confirmada para o casamento de *Esther & Anthony*! 💕\n\n`
    message += `📅 *Data:* 20 de Setembro de 2025\n`
    message += `🕐 *Horário:* 19:00\n`
    message += `📍 *Local:* Valle Verde Eventos\n\n`
    
    if (data.status === 'com_acompanhante' && data.acompanhante) {
      message += `👥 *Acompanhante:* ${data.acompanhante}\n\n`
    }
    
    if (data.restricoes_alimentares) {
      message += `🍽️ *Restrições alimentares:* ${data.restricoes_alimentares}\n\n`
    }
    
    message += `🎫 *Seu ingresso digital:*\n`
    message += `\`\`\`\n${qrCode}\n\`\`\`\n\n`
    message += `📱 *Como usar:*\n`
    message += `• Apresente este QR Code na entrada\n`
    message += `• Chegue com 30min de antecedência\n`
    message += `• Traga documento com foto\n\n`
    message += `💌 *Dress Code:* Elegante\n`
    message += `🎁 *Lista de presentes:* https://eclectic-biscochitos-4c5969.netlify.app/presentes\n\n`
    message += `Estamos ansiosos para celebrar com você! 🥂\n\n`
    message += `Com carinho,\n*Esther & Anthony* 💕`

    // Enviar via Z-API
    const response = await fetch(zApiUrl, {
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
      console.log('✅ Mensagem enviada com sucesso via Z-API')
      return true
    } else {
      const errorText = await response.text()
      console.error('❌ Erro ao enviar via Z-API:', response.status, errorText)
      return false
    }
    
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem automática:', error)
    return false
  }
}

// Função para gerar QR Code
function generateQRCode(ticketId) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
