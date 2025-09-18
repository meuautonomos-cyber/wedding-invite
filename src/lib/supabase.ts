import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase - usando apenas variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Verificar se as variáveis estão definidas
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis do Supabase não encontradas!')
  console.error('URL:', supabaseUrl)
  console.error('Key:', supabaseKey ? 'Definida' : 'Não definida')
  throw new Error('Variáveis de ambiente do Supabase não encontradas')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      wedding_tickets: {
        Row: {
          id: string
          nome: string
          email: string
          status: 'confirmado' | 'com_acompanhante' | 'nao_poderei'
          acompanhante?: string
          observacoes?: string
          data_confirmacao: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email: string
          status: 'confirmado' | 'com_acompanhante' | 'nao_poderei'
          acompanhante?: string
          observacoes?: string
          data_confirmacao: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          status?: 'confirmado' | 'com_acompanhante' | 'nao_poderei'
          acompanhante?: string
          observacoes?: string
          data_confirmacao?: string
          created_at?: string
          updated_at?: string
        }
      }
      wedding_rsvp: {
        Row: {
          id: string
          nome: string
          telefone: string
          email: string
          quantidade_convidados: number
          restricoes_alimentares?: string
          observacoes?: string
          status: 'confirmado' | 'com_acompanhante' | 'nao_podera_ir'
          data_confirmacao: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          telefone: string
          email: string
          quantidade_convidados: number
          restricoes_alimentares?: string
          observacoes?: string
          status: 'confirmado' | 'com_acompanhante' | 'nao_podera_ir'
          data_confirmacao: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          telefone?: string
          email?: string
          quantidade_convidados?: number
          restricoes_alimentares?: string
          observacoes?: string
          status?: 'confirmado' | 'com_acompanhante' | 'nao_podera_ir'
          data_confirmacao?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
