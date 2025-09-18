// Teste para verificar se a chave está sendo carregada
export function testKey() {
  console.log('🔍 Testando variáveis de ambiente:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA')
  console.log('Tamanho da chave:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length)
  console.log('Chave começa com eyJ:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith('eyJ'))
  console.log('Chave termina com zc:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.endsWith('zc'))
}
