# 🚀 Configuração do Supabase

## 📋 Passos para configurar o banco de dados:

### 1. **Execute o SQL no Supabase:**
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **SQL Editor**
3. Cole e execute o conteúdo do arquivo `supabase-schema.sql`

### 2. **Configure as variáveis de ambiente:**
Crie um arquivo `.env.local` na raiz do projeto com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://zahvmkieicvohphrxwkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaHZta2llaWN2b2hwcmh3a3IiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc1ODE1NzIxOCwiZXhwIjoyMDczNzMzMjE4fQ.5_6ozxN44GiOHi1fPydx6rXquo-N3g-JF98-N8nenzc
```

### 3. **Teste o sistema:**
1. Acesse `/confirmar`
2. Faça uma confirmação de presença
3. Verifique se foi salvo no Supabase
4. Acesse o ingresso gerado

## 🔧 Funcionalidades implementadas:

- ✅ **Dados persistentes** no banco Supabase
- ✅ **Controle de duplicatas** por email
- ✅ **Ingressos únicos** com códigos
- ✅ **Estatísticas** de confirmações
- ✅ **Segurança** com RLS habilitado

## 📊 Tabelas criadas:

- `wedding_rsvp` - Confirmações de presença
- `wedding_tickets` - Ingressos gerados

## 🎯 Próximos passos:

1. Execute o SQL no Supabase
2. Configure as variáveis de ambiente
3. Teste o sistema completo
4. Deploy no Netlify

**Sistema pronto para uso com banco de dados real!** 🎉
