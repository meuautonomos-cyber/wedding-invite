import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('Testando conexão com Supabase...')
    
    // Teste 1: Verificar se consegue conectar
    const { error } = await supabase
      .from('wedding_rsvp')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Erro na conexão:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Conexão com Supabase OK')
    
    // Teste 2: Tentar inserir um registro de teste
    const testData = {
      nome: 'Teste',
      telefone: '27999999999',
      email: 'teste@teste.com',
      quantidade_convidados: 1,
      restricoes_alimentares: null,
      observacoes: null,
      status: 'confirmado'
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('wedding_rsvp')
      .insert(testData)
      .select()
      .single()
    
    if (insertError) {
      console.error('Erro ao inserir teste:', insertError)
      return { success: false, error: insertError.message }
    }
    
    console.log('Inserção de teste OK:', insertData)
    
    // Limpar o registro de teste
    await supabase
      .from('wedding_rsvp')
      .delete()
      .eq('email', 'teste@teste.com')
    
    return { success: true, message: 'Supabase funcionando corretamente' }
    
  } catch (error) {
    console.error('Erro geral:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}
