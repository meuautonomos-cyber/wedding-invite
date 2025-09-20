// Teste para verificar se o WhatsApp está sendo aberto
console.log('🧪 Testando envio de WhatsApp...')

// Simular dados de teste
const dadosTeste = {
  nome: 'João Silva',
  telefone: '27999999999',
  status: 'confirmado',
  ticketId: 'TICKET-TESTE-123'
}

// Simular abertura do WhatsApp Web
const mensagem = `🎉 *CONFIRMAÇÃO DE PRESENÇA RECEBIDA!*

Olá ${dadosTeste.nome}! 👋

✅ *Sua presença foi confirmada!*
Estamos muito felizes que você poderá celebrar conosco! 💕

📅 *DETALHES DO EVENTO:*
👰🤵 *Esther & Anthony*
📅 Data: 21/03/26
🕐 Horário: 15:30
📍 Local: São Mateus - ES

📋 *INFORMAÇÕES IMPORTANTES:*
• Chegue 15 minutos antes do horário marcado
• Apresente este ingresso na entrada
• Código do ingresso: *${dadosTeste.ticketId}*
• Seu ingresso personalizado: http://localhost:3000/ingresso?id=${dadosTeste.ticketId}

🎁 *SUGESTÃO DE PRESENTE:*
Sua presença já é o maior presente, mas se desejar nos presentear:

*Smart TV*
💰 R$ 2000.00
🔗 https://mercadolivre.com/sec/1jaff8k

📱 *Ver lista completa:* http://localhost:3000/presentes

🔗 *LINKS ÚTEIS:*
• 📍 Local do evento: http://localhost:3000/local
• 🎁 Lista de presentes: http://localhost:3000/presentes
• 📱 Site do casamento: http://localhost:3000/site

💕 *Muito obrigado por fazer parte do nosso dia especial!*

Com carinho,
Esther & Anthony 💍

_Esta mensagem foi enviada automaticamente pelo sistema de convites._`

const whatsappUrl = `https://web.whatsapp.com/send?phone=55${dadosTeste.telefone}&text=${encodeURIComponent(mensagem)}`

console.log('📱 Dados do teste:')
console.log('Nome:', dadosTeste.nome)
console.log('Telefone:', dadosTeste.telefone)
console.log('Ticket ID:', dadosTeste.ticketId)
console.log('')
console.log('🔗 URL do WhatsApp:')
console.log(whatsappUrl)
console.log('')
console.log('📝 Mensagem (primeiros 200 caracteres):')
console.log(mensagem.substring(0, 200) + '...')
console.log('')
console.log('✅ Teste concluído!')
console.log('💡 Para testar: copie a URL e cole no navegador')
