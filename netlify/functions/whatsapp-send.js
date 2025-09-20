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
    
    // Montar mensagem seguindo o padrão
    let message = `🎉 *CONFIRMAÇÃO DE PRESENÇA RECEBIDA!*\n\n`
    message += `Olá *${data.nome}*! 👋\n\n`
    message += `✅ Sua presença foi confirmada!\n`
    message += `Estamos muito felizes que você poderá celebrar conosco! 💕\n\n`
    message += `📅 *DETALHES DO EVENTO:*\n`
    message += `👰🤵 Esther & Anthony\n`
    message += `📅 Data: 21/03/26\n`
    message += `🕐 Horário: 15:30\n`
    message += `📍 Local: São Mateus - ES\n\n`
    
    if (data.status === 'com_acompanhante' && data.acompanhante) {
      message += `👥 *Acompanhante:* ${data.acompanhante}\n\n`
    }
    
    if (data.restricoes_alimentares) {
      message += `🍽️ *Restrições alimentares:* ${data.restricoes_alimentares}\n\n`
    }
    
    message += `📋 *INFORMAÇÕES IMPORTANTES:*\n`
    message += `* Chegue 15 minutos antes do horário marcado\n`
    message += `* Apresente este ingresso na entrada\n`
    message += `* Código do ingresso: ${data.ticketId}\n`
    message += `* Seu ingresso personalizado: https://eclectic-biscochitos-4c5969.netlify.app/ingresso?id=${data.ticketId}\n\n`
    
    // Adicionar sugestão de presente
    const presenteSugerido = getSuggestedPresente()
    message += `🎁 *SUGESTÃO DE PRESENTE:*\n`
    message += `Sua presença já é o maior presente, mas se desejar nos presentear:\n\n`
    message += `${presenteSugerido.nome}\n`
    message += `💰 R$ ${presenteSugerido.valor.toFixed(2)}\n`
    message += `🔗 ${presenteSugerido.link}\n\n`
    message += `📱 Ver lista completa: https://eclectic-biscochitos-4c5969.netlify.app/presentes\n\n`
    
    message += `🔗 *LINKS ÚTEIS:*\n`
    message += `* 📍 Local do evento: https://eclectic-biscochitos-4c5969.netlify.app/local\n`
    message += `* 🎁 Lista de presentes: https://eclectic-biscochitos-4c5969.netlify.app/presentes\n`
    message += `* 📱 Site do casamento: https://eclectic-biscochitos-4c5969.netlify.app/site\n\n`
    message += `💕 Muito obrigado por fazer parte do nosso dia especial!\n\n`
    message += `Com carinho,\n*Esther & Anthony* 💍\n\n`
    message += `Esta mensagem foi enviada automaticamente pelo sistema de convites.`

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

// Função para sugerir presente aleatório
function getSuggestedPresente() {
  const presentes = [
    { nome: "Jogo de panelas antiaderentes/inox", valor: 150.00, link: "https://mercadolivre.com/sec/2usVbzq" },
    { nome: "Conjunto de facas", valor: 80.00, link: "https://mercadolivre.com/sec/19LNmft" },
    { nome: "Liquidificador", valor: 120.00, link: "https://mercadolivre.com/sec/1SoRVx2" },
    { nome: "Batedeira", valor: 100.00, link: "https://mercadolivre.com/sec/2frVCiG" },
    { nome: "Mixer 3 em 1", valor: 90.00, link: "https://mercadolivre.com/sec/1JScTpa" },
    { nome: "Torradeira", valor: 60.00, link: "https://mercadolivre.com/sec/2RJhMuX" },
    { nome: "Sanduicheira/grill", valor: 70.00, link: "https://mercadolivre.com/sec/19tYLWx" },
    { nome: "Fritadeira sem óleo (Airfryer)", valor: 200.00, link: "https://mercadolivre.com/sec/1jDdXWD" },
    { nome: "Panela elétrica de arroz", valor: 110.00, link: "https://mercadolivre.com/sec/2MXn8XZ" },
    { nome: "Conjunto de travessas de vidro/cerâmica", valor: 85.00, link: "https://mercadolivre.com/sec/26av8p9" },
    { nome: "Jogo de pratos", valor: 75.00, link: "https://mercadolivre.com/sec/15kfbN3" },
    { nome: "Jogo de Talheres", valor: 65.00, link: "https://mercadolivre.com/sec/1VpEqxE" },
    { nome: "Conjunto de copos", valor: 55.00, link: "https://mercadolivre.com/sec/1bwH3eF" },
    { nome: "Jogo de potes herméticos para mantimentos", valor: 95.00, link: "https://mercadolivre.com/sec/2P9bHYg" },
    { nome: "Conjunto de formas para bolo e assadeira", valor: 80.00, link: "https://mercadolivre.com/sec/2rfXnPM" },
    { nome: "Jogo de cama (lençóis, fronhas, edredom)", valor: 180.00, link: "https://mercadolivre.com/sec/2NXLpcs" },
    { nome: "Colcha ou cobre-leito", valor: 120.00, link: "https://mercadolivre.com/sec/2Pk99ys" },
    { nome: "Travesseiros", valor: 70.00, link: "https://mercadolivre.com/sec/1piNg8B" },
    { nome: "Almofadas decorativas", valor: 50.00, link: "https://mercadolivre.com/sec/16vMCgZ" },
    { nome: "Manta aconchegante", valor: 90.00, link: "https://mercadolivre.com/sec/1B8XRBh" },
    { nome: "Kit organizadores de guarda-roupa", valor: 110.00, link: "https://mercadolivre.com/sec/23LXFht" },
    { nome: "Jogo de Toalhas", valor: 85.00, link: "https://mercadolivre.com/sec/14QL9NG" },
    { nome: "Roupões de casal", valor: 130.00, link: "https://mercadolivre.com/sec/27xRcLL" },
    { nome: "Tapetes antiderrapantes", valor: 60.00, link: "https://mercadolivre.com/sec/1FKWkrJ" },
    { nome: "Kit de higiene (porta-sabonete, escova, etc.)", valor: 45.00, link: "https://mercadolivre.com/sec/2MNDEoL" },
    { nome: "Jogo Tapete Cozinha", valor: 40.00, link: "https://mercadolivre.com/sec/1AeuNjb" },
    { nome: "Cortinas", valor: 100.00, link: "https://mercadolivre.com/sec/1CwNdqD" },
    { nome: "Estante para Livros", valor: 150.00, link: "https://mercadolivre.com/sec/1tnwT39" },
    { nome: "Micro-Ondas", valor: 250.00, link: "https://mercadolivre.com/sec/2gGDJiH" },
    { nome: "Aspirador de Pó Vertical", valor: 200.00, link: "https://mercadolivre.com/sec/18fYNWW" },
    { nome: "Robô Aspirador de Pó", valor: 400.00, link: "https://mercadolivre.com/sec/1pdsqFp" },
    { nome: "Ventilador", valor: 80.00, link: "https://mercadolivre.com/sec/2GYR7oM" },
    { nome: "Smart Tv", valor: 800.00, link: "https://mercadolivre.com/sec/1jaff8k" },
    { nome: "Ferro de Passar", valor: 70.00, link: "https://mercadolivre.com/sec/1NdYDhp" },
    { nome: "Maquina de Lavar", valor: 600.00, link: "https://mercadolivre.com/sec/32siZuq" },
    { nome: "Jogo Americano", valor: 30.00, link: "https://mercadolivre.com/sec/2sytDNj" },
    { nome: "Sousplat", valor: 15.00, link: "https://mercadolivre.com/sec/2xcp8oD" },
    { nome: "Jarra de suco/água", valor: 35.00, link: "https://mercadolivre.com/sec/1j4AAFa" },
    { nome: "Garrafa térmica para café/chá", valor: 45.00, link: "https://mercadolivre.com/sec/1k75wCy" },
    { nome: "Jogo de Xicaras", valor: 55.00, link: "https://mercadolivre.com/sec/28yi7aT" }
  ]
  
  // Selecionar presente aleatório
  const randomIndex = Math.floor(Math.random() * presentes.length)
  return presentes[randomIndex]
}
