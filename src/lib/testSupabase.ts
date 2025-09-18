import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Testando conexão com Supabase...')
    console.log('URL:', 'https://zahvmkieicvohphrxwkr.supabase.co')
    console.log('Key (primeiros 20 chars):', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
    
    // Teste simples: apenas verificar se consegue conectar
    const { data, error } = await supabase
      .from('wedding_rsvp')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Erro na conexão:', error)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Conexão com Supabase OK!')
    console.log('📊 Dados retornados:', data)
    
    return { success: true, message: 'Supabase funcionando corretamente!' }
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}
