// Script de teste para o sistema inteligente de presentes
const { supabaseStorage } = require('./src/lib/supabaseStorage.ts')

async function testarSistemaInteligente() {
  console.log('🧪 Testando Sistema Inteligente de Presentes...\n')
  
  try {
    // Teste 1: Verificar conexão com Supabase
    console.log('1️⃣ Testando conexão com Supabase...')
    const stats = await supabaseStorage.getStats()
    console.log('✅ Conexão OK! Estatísticas:', stats)
    
    // Teste 2: Simular sugestões para diferentes tickets
    console.log('\n2️⃣ Testando sugestões inteligentes...')
    
    const ticket1 = 'TESTE-001'
    const ticket2 = 'TESTE-002'
    const ticket3 = 'TESTE-003'
    
    // Simular presentes para teste
    const presentesTeste = [
      { nome: "Smart TV", link: "https://mercadolivre.com/sec/1jaff8k", valor: 2000, categoria: "Eletrodomésticos", prioridade: 1 },
      { nome: "Máquina de Lavar", link: "https://mercadolivre.com/sec/32siZuq", valor: 1500, categoria: "Eletrodomésticos", prioridade: 1 },
      { nome: "Robô Aspirador", link: "https://mercadolivre.com/sec/1pdsqFp", valor: 800, categoria: "Eletrodomésticos", prioridade: 1 }
    ]
    
    // Salvar sugestões para ticket 1
    console.log(`📝 Salvando sugestões para ${ticket1}...`)
    await supabaseStorage.savePresenteSuggestions(ticket1, presentesTeste.slice(0, 2))
    
    // Salvar sugestões para ticket 2
    console.log(`📝 Salvando sugestões para ${ticket2}...`)
    await supabaseStorage.savePresenteSuggestions(ticket2, presentesTeste.slice(1, 3))
    
    // Buscar sugestões para ticket 1
    console.log(`🔍 Buscando sugestões para ${ticket1}...`)
    const sugestoes1 = await supabaseStorage.getPresenteSuggestionsForTicket(ticket1)
    console.log('Sugestões encontradas:', sugestoes1.length)
    
    // Buscar sugestões para ticket 2
    console.log(`🔍 Buscando sugestões para ${ticket2}...`)
    const sugestoes2 = await supabaseStorage.getPresenteSuggestionsForTicket(ticket2)
    console.log('Sugestões encontradas:', sugestoes2.length)
    
    // Teste 3: Verificar todos os presentes sugeridos
    console.log('\n3️⃣ Verificando todos os presentes sugeridos...')
    const todosSugeridos = await supabaseStorage.getAllSuggestedPresentes()
    console.log('Total de presentes sugeridos:', todosSugeridos.length)
    console.log('Presentes:', todosSugeridos)
    
    console.log('\n✅ Teste concluído com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

// Executar teste
testarSistemaInteligente()
