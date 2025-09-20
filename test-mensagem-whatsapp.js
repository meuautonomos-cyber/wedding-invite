// Teste para verificar a mensagem do WhatsApp
const { whatsappService } = require('./src/lib/whatsappService.ts')

async function testarMensagem() {
  console.log('🧪 Testando geração de mensagem...\n')
  
  const dadosTeste = {
    nome: 'Anthony Rodrigo',
    telefone: '27999999999',
    status: 'confirmado',
    ticketId: 'TICKET-TESTE-123',
    restricoes_alimentares: 'Vegetariano'
  }
  
  try {
    const service = new (whatsappService.constructor)('27996372592')
    const mensagem = await service.generateMessage(dadosTeste)
    
    console.log('📱 Mensagem gerada:')
    console.log('=' .repeat(50))
    console.log(mensagem)
    console.log('=' .repeat(50))
    
    console.log('\n✅ Teste concluído!')
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

testarMensagem()
