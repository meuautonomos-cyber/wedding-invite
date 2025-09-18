# 🔧 Correção do Erro "Invalid API key" do Supabase

## ❌ Problema Identificado
O erro "Invalid API key" indica que a chave da API do Supabase está inválida ou expirada.

## ✅ Soluções

### 1. **Configurar Variáveis no Netlify**

1. Acesse seu projeto no [Netlify](https://netlify.com)
2. Vá em **Site Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL = https://zahvmkieicvohphrxwkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = [SUA_CHAVE_AQUI]
```

### 2. **Obter Nova Chave do Supabase**

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie a **anon/public** key
5. Cole no Netlify

### 3. **Executar SQL no Supabase**

Execute o conteúdo do arquivo `supabase-schema.sql` no SQL Editor do Supabase.

### 4. **Testar Localmente**

1. Crie um arquivo `.env.local` na raiz do projeto:
```
NEXT_PUBLIC_SUPABASE_URL=https://zahvmkieicvohphrxwkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUA_CHAVE_AQUI]
```

2. Execute:
```bash
npm run dev
```

3. Acesse `/admin` e clique em "Testar Supabase"

## 🚨 Importante

- **Nunca commite** o arquivo `.env.local` no Git
- As variáveis no Netlify devem ser **exatamente** como mostrado acima
- A chave deve ser a **anon/public** key, não a service role key

## 📞 Se o problema persistir

1. Verifique se o projeto Supabase está ativo
2. Confirme se as tabelas foram criadas corretamente
3. Teste a conexão no painel admin
