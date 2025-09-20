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
    
    // Adicionar sugestão de presente inteligente
    const presenteSugerido = getSmartPresenteSuggestion(userAgent)
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

// Função para detectar iPhone
function detectIPhone(userAgent) {
  return /iPhone|iPad|iPod/i.test(userAgent || '')
}

// Função para detectar Android
function detectAndroid(userAgent) {
  return /Android/i.test(userAgent || '')
}

// Função para sugerir presente inteligente baseado no dispositivo
function getSmartPresenteSuggestion(userAgent) {
  const presentes = [
    // ELETRODOMÉSTICOS CAROS (Prioridade 1)
    { nome: "Smart Tv", link: "https://mercadolivre.com/sec/1jaff8k", categoria: "Eletrodomésticos", valor: 800.00, prioridade: 1 },
    { nome: "Maquina de Lavar", link: "https://mercadolivre.com/sec/32siZuq", categoria: "Eletrodomésticos", valor: 600.00, prioridade: 1 },
    { nome: "Robô Aspirador de Pó", link: "https://mercadolivre.com/sec/1pdsqFp", categoria: "Eletrodomésticos", valor: 400.00, prioridade: 1 },
    { nome: "Aspirador de Pó Vertical", link: "https://mercadolivre.com/sec/18fYNWW", categoria: "Eletrodomésticos", valor: 200.00, prioridade: 1 },
    { nome: "Micro-Ondas", link: "https://mercadolivre.com/sec/2gGDJiH", categoria: "Eletrodomésticos", valor: 250.00, prioridade: 1 },
    
    // COZINHA CARA (Prioridade 2)
    { nome: "Fritadeira sem óleo (Airfryer)", link: "https://mercadolivre.com/sec/1jDdXWD", categoria: "Cozinha", valor: 200.00, prioridade: 2 },
    { nome: "Jogo de panelas antiaderentes/inox", link: "https://mercadolivre.com/sec/2usVbzq", categoria: "Cozinha", valor: 150.00, prioridade: 2 },
    { nome: "Conjunto de travessas de vidro/cerâmica", link: "https://mercadolivre.com/sec/26av8p9", categoria: "Mesa", valor: 85.00, prioridade: 2 },
    { nome: "Jogo de cama (lençóis, fronhas, edredom)", link: "https://mercadolivre.com/sec/2NXLpcs", categoria: "Quarto", valor: 180.00, prioridade: 2 },
    
    // COZINHA MÉDIA (Prioridade 3)
    { nome: "Batedeira", link: "https://mercadolivre.com/sec/2frVCiG", categoria: "Cozinha", valor: 100.00, prioridade: 3 },
    { nome: "Liquidificador", link: "https://mercadolivre.com/sec/1SoRVx2", categoria: "Cozinha", valor: 120.00, prioridade: 3 },
    { nome: "Mixer 3 em 1", link: "https://mercadolivre.com/sec/1JScTpa", categoria: "Cozinha", valor: 90.00, prioridade: 3 },
    { nome: "Panela elétrica de arroz", link: "https://mercadolivre.com/sec/2MXn8XZ", categoria: "Cozinha", valor: 110.00, prioridade: 3 },
    { nome: "Conjunto de formas para bolo e assadeira", link: "https://mercadolivre.com/sec/2rfXnPM", categoria: "Cozinha", valor: 80.00, prioridade: 3 },
    
    // MESA E DECORAÇÃO (Prioridade 4)
    { nome: "Jogo de pratos", link: "https://mercadolivre.com/sec/15kfbN3", categoria: "Mesa", valor: 75.00, prioridade: 4 },
    { nome: "Jogo de Talheres", link: "https://mercadolivre.com/sec/1VpEqxE", categoria: "Mesa", valor: 65.00, prioridade: 4 },
    { nome: "Conjunto de copos", link: "https://mercadolivre.com/sec/1bwH3eF", categoria: "Mesa", valor: 55.00, prioridade: 4 },
    { nome: "Colcha ou cobre-leito", link: "https://mercadolivre.com/sec/2Pk99ys", categoria: "Quarto", valor: 120.00, prioridade: 4 },
    { nome: "Travesseiros", link: "https://mercadolivre.com/sec/1piNg8B", categoria: "Quarto", valor: 70.00, prioridade: 4 },
    { nome: "Cortinas", link: "https://mercadolivre.com/sec/1CwNdqD", categoria: "Decoração", valor: 100.00, prioridade: 4 },
    { nome: "Estante para Livros", link: "https://mercadolivre.com/sec/1tnwT39", categoria: "Sala", valor: 150.00, prioridade: 4 },
    
    // COZINHA BÁSICA (Prioridade 5)
    { nome: "Torradeira", link: "https://mercadolivre.com/sec/2RJhMuX", categoria: "Cozinha", valor: 60.00, prioridade: 5 },
    { nome: "Sanduicheira/grill", link: "https://mercadolivre.com/sec/19tYLWx", categoria: "Cozinha", valor: 70.00, prioridade: 5 },
    { nome: "Conjunto de facas", link: "https://mercadolivre.com/sec/19LNmft", categoria: "Cozinha", valor: 80.00, prioridade: 5 },
    { nome: "Jogo de potes herméticos para mantimentos", link: "https://mercadolivre.com/sec/2P9bHYg", categoria: "Cozinha", valor: 95.00, prioridade: 5 },
    { nome: "Jogo Tapete Cozinha", link: "https://mercadolivre.com/sec/1AeuNjb", categoria: "Cozinha", valor: 40.00, prioridade: 5 },
    
    // BANHEIRO E ORGANIZAÇÃO (Prioridade 6)
    { nome: "Jogo de Toalhas", link: "https://mercadolivre.com/sec/14QL9NG", categoria: "Banheiro", valor: 85.00, prioridade: 6 },
    { nome: "Roupões de casal", link: "https://mercadolivre.com/sec/27xRcLL", categoria: "Banheiro", valor: 130.00, prioridade: 6 },
    { nome: "Kit de higiene (porta-sabonete, escova, etc.)", link: "https://mercadolivre.com/sec/2MNDEoL", categoria: "Banheiro", valor: 45.00, prioridade: 6 },
    { nome: "Kit organizadores de guarda-roupa", link: "https://mercadolivre.com/sec/23LXFht", categoria: "Organização", valor: 110.00, prioridade: 6 },
    
    // DECORAÇÃO E ACESSÓRIOS (Prioridade 7)
    { nome: "Almofadas decorativas", link: "https://mercadolivre.com/sec/16vMCgZ", categoria: "Decoração", valor: 50.00, prioridade: 7 },
    { nome: "Manta aconchegante", link: "https://mercadolivre.com/sec/1B8XRBh", categoria: "Decoração", valor: 90.00, prioridade: 7 },
    { nome: "Tapetes antiderrapantes", link: "https://mercadolivre.com/sec/1FKWkrJ", categoria: "Decoração", valor: 60.00, prioridade: 7 },
    
    // ACESSÓRIOS BÁSICOS (Prioridade 8)
    { nome: "Jogo Americano", link: "https://mercadolivre.com/sec/2sytDNj", categoria: "Mesa", valor: 30.00, prioridade: 8 },
    { nome: "Sousplat", link: "https://mercadolivre.com/sec/2xcp8oD", categoria: "Mesa", valor: 15.00, prioridade: 8 },
    { nome: "Jarra de suco/água", link: "https://mercadolivre.com/sec/1j4AAFa", categoria: "Cozinha", valor: 35.00, prioridade: 8 },
    { nome: "Garrafa térmica para café/chá", link: "https://mercadolivre.com/sec/1k75wCy", categoria: "Cozinha", valor: 45.00, prioridade: 8 },
    { nome: "Jogo de Xicaras", link: "https://mercadolivre.com/sec/28yi7aT", categoria: "Mesa", valor: 55.00, prioridade: 8 },
    
    // ELETRODOMÉSTICOS BÁSICOS (Prioridade 9)
    { nome: "Ventilador", link: "https://mercadolivre.com/sec/2GYR7oM", categoria: "Eletrodomésticos", valor: 80.00, prioridade: 9 },
    { nome: "Ferro de Passar", link: "https://mercadolivre.com/sec/1NdYDhp", categoria: "Eletrodomésticos", valor: 70.00, prioridade: 9 }
  ]
  
  // Detectar tipo de dispositivo
  const isIPhone = detectIPhone(userAgent)
  const isAndroid = detectAndroid(userAgent)
  
  console.log(`📱 Dispositivo detectado: ${isIPhone ? 'iPhone' : isAndroid ? 'Android' : 'Outro'}`)
  
  // Separar presentes por faixas de preço
  const caros = presentes.filter(p => (p.prioridade || 9) <= 3) // Prioridade 1-3
  const medios = presentes.filter(p => (p.prioridade || 9) >= 4 && (p.prioridade || 9) <= 6) // Prioridade 4-6
  const baratos = presentes.filter(p => (p.prioridade || 9) >= 7) // Prioridade 7-9
  
  let selectedPresentes = []
  
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
  
  // Selecionar o primeiro da lista (mais prioritário)
  if (selectedPresentes.length > 0) {
    return selectedPresentes[0]
  }
  
  // Fallback: selecionar aleatório
  const randomIndex = Math.floor(Math.random() * presentes.length)
  return presentes[randomIndex]
}
