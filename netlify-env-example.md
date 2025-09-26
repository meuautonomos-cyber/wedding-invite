# 🔧 Variáveis de Ambiente para Netlify

## 📋 Configuração Necessária

Para que o envio automático de WhatsApp funcione no Netlify, você precisa configurar estas variáveis de ambiente no painel do Netlify:

### **Configurações da W-API (WhatsApp Automático)**
```
NEXT_PUBLIC_WAPI_TOKEN=SEU_TOKEN_AQUI
NEXT_PUBLIC_WAPI_INSTANCE_ID=SEU_INSTANCE_ID_AQUI
NEXT_PUBLIC_WAPI_BASE_URL=https://api.w-api.app/v1
```

### **Configurações do Supabase**
```
NEXT_PUBLIC_SUPABASE_URL=https://ffxrnehakpudyooxqrpv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmeHJuZWhha3B1ZHlvb3hxcnB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4OTcxMDgsImV4cCI6MjA3NDQ3MzEwOH0.pxwF8SVUI_jXH1grxouwQaiClqcz2nAx4V3hGkUg-vo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmeHJuZWhha3B1ZHlvb3hxcnB2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODg5NzEwOCwiZXhwIjoyMDc0NDczMTA4fQ.CLszNxJC0U07qNZsxdsuNnc6e0tH4gwS1XvvUlCRbUg
```

### **Configurações do WhatsApp Admin**
```
NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER=279998437371
```

## 🚀 Como Configurar no Netlify

1. **Acesse o painel do Netlify**
2. **Vá em Site settings > Environment variables**
3. **Adicione cada variável** com seus valores reais
4. **Salve as configurações**
5. **Faça um novo deploy**

## ⚠️ Importante

- **NEXT_PUBLIC_WAPI_TOKEN** é obrigatório para o envio automático
- Sem essa variável, as mensagens não serão enviadas
- Certifique-se de que o token está correto e ativo

## 🎯 Resultado

Com essas variáveis configuradas, o sistema de envio automático funcionará perfeitamente no Netlify!
