# 🔧 Variáveis de Ambiente para Netlify

## 📋 Configuração Necessária

Para que o envio automático de WhatsApp funcione no Netlify, você precisa configurar estas variáveis de ambiente no painel do Netlify:

### **Configurações do Z-API (WhatsApp Automático)**
```
NEXT_PUBLIC_ZAPI_TOKEN=SEU_TOKEN_AQUI
NEXT_PUBLIC_ZAPI_INSTANCE_ID=SEU_INSTANCE_ID_AQUI
NEXT_PUBLIC_ZAPI_CLIENT_TOKEN=SEU_CLIENT_TOKEN_AQUI
```

### **Configurações do Supabase**
```
NEXT_PUBLIC_SUPABASE_URL=https://zahvmkieicvohphrxwkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaHZta2llaWN2b2hwaHJ4d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNTcyMTgsImV4cCI6MjA3MzczMzIxOH0.5_6ozxN44GiOHi1fPydx6rXquo-N3g-JF98-N8nenzc
```

### **Configurações do WhatsApp Admin**
```
NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER=27996372592
```

## 🚀 Como Configurar no Netlify

1. **Acesse o painel do Netlify**
2. **Vá em Site settings > Environment variables**
3. **Adicione cada variável** com seus valores reais
4. **Salve as configurações**
5. **Faça um novo deploy**

## ⚠️ Importante

- **NEXT_PUBLIC_ZAPI_CLIENT_TOKEN** é obrigatório para o envio automático
- Sem essa variável, as mensagens não serão enviadas
- Certifique-se de que o token está correto e ativo

## 🎯 Resultado

Com essas variáveis configuradas, o sistema de envio automático funcionará perfeitamente no Netlify!
