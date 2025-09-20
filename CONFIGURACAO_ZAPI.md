# 🔧 Configuração Z-API para Envio Automático

## 📋 Passo a Passo

### 1. **Criar conta no Z-API**
1. Acesse: https://z-api.io
2. Crie uma conta gratuita
3. Conecte seu WhatsApp Business

### 2. **Obter credenciais**
1. Vá em "Instâncias"
2. Crie uma nova instância
3. Copie o **Token** e **Instance ID**

### 3. **Configurar variáveis de ambiente**
Crie/edite o arquivo `.env.local`:

```env
# Configurações do Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zahvmkieicvohphrxwkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaHZta2llaWN2b2hwaHJ4d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNTcyMTgsImV4cCI6MjA3MzczMzIxOH0.5_6ozxN44GiOHi1fPydx6rXquo-N3g-JF98-N8nenzc

# Configurações do Z-API (WhatsApp Automático)
NEXT_PUBLIC_ZAPI_TOKEN=SEU_TOKEN_AQUI
NEXT_PUBLIC_ZAPI_INSTANCE_ID=SEU_INSTANCE_ID_AQUI

# Configurações do WhatsApp Admin
NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER=27996372592
```

### 4. **Atualizar o código**
Edite `src/lib/whatsappAutoService.ts`:

```typescript
// Substitua estas linhas:
this.zApiToken = process.env.NEXT_PUBLIC_ZAPI_TOKEN || 'SEU_TOKEN_AQUI'
this.zApiUrl = 'https://api.z-api.io/instances/SEU_INSTANCE_ID/token/SEU_TOKEN/send-text'

// Por:
this.zApiToken = process.env.NEXT_PUBLIC_ZAPI_TOKEN || ''
this.zApiUrl = `https://api.z-api.io/instances/${process.env.NEXT_PUBLIC_ZAPI_INSTANCE_ID}/token/${this.zApiToken}/send-text`
```

### 5. **Testar o sistema**
1. Reinicie o servidor: `npm run dev`
2. Acesse: `http://localhost:3000/confirmar`
3. Teste com um número real
4. Verifique se a mensagem chegou automaticamente

## 💰 Custos Z-API

### **Plano Gratuito:**
- ✅ 100 mensagens/mês
- ✅ Suporte básico
- ✅ Perfeito para testes

### **Plano Pago:**
- 💰 R$ 0,05 por mensagem
- 💰 R$ 0,01 por mensagem recebida
- 💰 A partir de R$ 9,90/mês

## 🎯 Resultado Final

### **Antes (WhatsApp Web):**
- ❌ Pessoa precisa abrir navegador
- ❌ Pessoa precisa clicar "Enviar"
- ❌ Não é realmente automático

### **Depois (Z-API):**
- ✅ Mensagem chega instantaneamente
- ✅ 100% automático
- ✅ Profissional e confiável
- ✅ Suporte a mídia (QR Code, imagens)

## 🚀 Próximos Passos

1. **Configure o Z-API** seguindo os passos acima
2. **Teste o sistema** com números reais
3. **Monitore os custos** no painel do Z-API
4. **Escale conforme necessário**

**Sistema 100% automático funcionando!** 🎉✅
