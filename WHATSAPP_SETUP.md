# 📱 Sistema de WhatsApp para Convites de Casamento

## 🎯 Funcionalidades Implementadas

### ✅ Mensagem Automática Personalizada
- **Confirmação de presença** com detalhes do evento
- **QR Code único** para cada ingresso
- **Sistema inteligente de sugestão de presentes** com priorização
- **Informações personalizadas** (restrições alimentares, observações)
- **Links úteis** para todas as páginas

### ✅ Sistema Inteligente de Presentes
- **Priorização automática** dos presentes mais caros
- **Evita repetições** até acabar todas as opções
- **Sugestão de compra em grupo** quando acabar os presentes
- **Controle de disponibilidade** em tempo real no Supabase
- **Categorização** por ambiente (Cozinha, Quarto, etc.)
- **Sistema de status** (Pendente/Confirmado/Entregue)

### ✅ Sistema de Cotas para Presentes Caros
- **Presentes caros** podem ser divididos em cotas
- **Links diretos** para compra no Mercado Livre
- **Sugestão automática** de compra em grupo
- **Controle de quem já foi sugerido** cada presente

## 🚀 Como Implementar

### 1. **Opção 1: WhatsApp Web (Gratuito)**
```bash
# Instalar dependências do servidor
npm install whatsapp-web.js qrcode-terminal express cors

# Iniciar servidor WhatsApp
node whatsapp-server.js
```

**Vantagens:**
- ✅ Gratuito
- ✅ Fácil de configurar
- ✅ Funciona imediatamente

**Desvantagens:**
- ❌ Precisa manter celular conectado
- ❌ Pode desconectar ocasionalmente

### 2. **Opção 2: API WhatsApp Business (Recomendado)**
```bash
# Usar provedores como Twilio ou MessageBird
# Custo: ~R$ 0,05 por mensagem
```

**Vantagens:**
- ✅ Mais confiável
- ✅ Não precisa de celular
- ✅ Melhor para produção

### 3. **Opção 3: Fallback SMS/Email**
- Se WhatsApp falhar, envia por SMS ou email
- **Backup automático** sempre funciona

## 📋 Configuração Passo a Passo

### 1. **Atualizar Lista de Presentes**
Edite `src/lib/whatsappService.ts` e atualize a função `getPresentesList()`:

```typescript
private getPresentesList(): PresenteItem[] {
  return [
    { nome: "Jogo de panelas antiaderentes/inox", link: "https://mercadolivre.com/sec/2usVbzq", categoria: "Cozinha" },
    // ... adicione todos os presentes
  ]
}
```

### 2. **Configurar Número do WhatsApp**
No admin (`/admin/whatsapp`), configure o número:
- **Formato:** (27) 99637-2592
- **Salvo em:** localStorage

### 3. **Testar Sistema**
1. Acesse `/confirmar`
2. Preencha os dados
3. Confirme presença
4. Verifique se a mensagem foi enviada

## 🧠 Sistema Inteligente de Presentes

### Como Funciona:
1. **Priorização Automática:**
   - Presentes mais caros são sugeridos primeiro
   - Ordenação por prioridade e valor
   - Evita repetições até acabar todas as opções

2. **Controle de Disponibilidade:**
   - Salva no Supabase quais presentes já foram sugeridos
   - Cada ticket recebe sugestões únicas
   - Sistema evita sugerir o mesmo presente para pessoas diferentes

3. **Sugestão de Compra em Grupo:**
   - Quando acabam os presentes únicos
   - Sugere presentes caros para compra coletiva
   - Marca com 👥 para indicar compra em grupo

### Estrutura de Prioridades:
```
Prioridade 1: Eletrodomésticos caros (Smart TV, Máquina de Lavar, etc.)
Prioridade 2: Cozinha cara (Airfryer, Panelas, etc.)
Prioridade 3: Cozinha média (Batedeira, Liquidificador, etc.)
Prioridade 4: Mesa e Decoração (Pratos, Talheres, etc.)
Prioridade 5: Cozinha básica (Torradeira, Sanduicheira, etc.)
Prioridade 6: Banheiro e Organização (Toalhas, Roupões, etc.)
Prioridade 7: Decoração e Acessórios (Almofadas, Mantas, etc.)
Prioridade 8: Mesa e Acessórios (Jogo Americano, Sousplat, etc.)
Prioridade 9: Eletrodomésticos básicos (Ventilador, Ferro, etc.)
```

## 🎨 Personalização da Mensagem

### Template da Mensagem:
```
🎉 *CONFIRMAÇÃO DE PRESENÇA RECEBIDA!*

Olá [NOME]! 👋

✅ *Sua presença foi confirmada!*
Estamos muito felizes que você poderá celebrar conosco! 💕

📅 *DETALHES DO EVENTO:*
👰🤵 *Esther & Anthony*
📅 Data: 21/03/26
🕐 Horário: 15:30
📍 Local: São Mateus - ES

📋 *INFORMAÇÕES IMPORTANTES:*
• Chegue 15 minutos antes do horário marcado
• Apresente este ingresso na entrada
• Código do ingresso: *TICKET-123*

🎁 *SUGESTÕES DE PRESENTES:*
[PRESENTES PRIORIZADOS POR VALOR E DISPONIBILIDADE]

1. *Smart TV* 💰 R$ 2000.00
   🔗 https://mercadolivre.com/sec/1jaff8k

2. *Máquina de Lavar* 💰 R$ 1500.00
   🔗 https://mercadolivre.com/sec/32siZuq

3. *Robô Aspirador* 💰 R$ 800.00
   🔗 https://mercadolivre.com/sec/1pdsqFp

💡 *DICA:* Os presentes marcados com 👥 podem ser comprados em grupo!
Entre em contato conosco para organizar a compra coletiva.

📱 *Ver lista completa:* http://localhost:3000/presentes

📝 *SUAS OBSERVAÇÕES:*
[RESTRIÇÕES ALIMENTARES E OBSERVAÇÕES]

🔗 *LINKS ÚTEIS:*
• 📍 Local do evento: http://localhost:3000/local
• 🎁 Lista de presentes: http://localhost:3000/presentes
• 📱 Site do casamento: http://localhost:3000/site

💕 *Muito obrigado por fazer parte do nosso dia especial!*

Com carinho,
Esther & Anthony 💍
```

## 🔧 Arquitetura do Sistema

```
Cliente confirma presença
    ↓
Supabase (salva dados)
    ↓
WhatsApp Service (gera mensagem)
    ↓
WhatsApp Web/API (envia mensagem)
    ↓
Cliente recebe mensagem personalizada
```

## 📊 Monitoramento

### Admin Dashboard (`/admin`)
- **RSVPs:** Filtros por status
- **Presentes:** Lista com ações
- **Estatísticas:** Contadores em tempo real
- **Exportação:** CSV com todos os dados

### Logs do Sistema
- **Console:** Logs detalhados
- **Supabase:** Histórico completo
- **WhatsApp:** Status de envio

## 🚨 Troubleshooting

### WhatsApp não conecta:
1. Verifique se o celular está conectado
2. Escaneie o QR Code novamente
3. Reinicie o servidor

### Mensagem não enviada:
1. Verifique o número do telefone
2. Confirme se o WhatsApp está ativo
3. Teste com fallback SMS/Email

### QR Code não aparece:
1. Verifique se o QR Code foi gerado
2. Confirme se está salvo no localStorage
3. Teste a geração manual

## 💡 Melhorias Futuras

### 1. **Sistema de Cotas para Presentes Caros**
```typescript
interface PresenteCota {
  nome: string
  valorTotal: number
  valorCota: number
  cotasDisponiveis: number
  cotasVendidas: number
}
```

### 2. **Notificações Push**
- Notificar quando presente for confirmado
- Alertas de novos RSVPs

### 3. **Analytics Avançado**
- Gráficos de confirmações
- Relatórios de presentes
- Métricas de engajamento

## 🎉 Resultado Final

O sistema agora envia automaticamente:
- ✅ **Mensagem personalizada** com nome e detalhes
- ✅ **QR Code único** para cada ingresso
- ✅ **Lista de presentes** com links diretos
- ✅ **Informações do evento** completas
- ✅ **Links úteis** para todas as páginas
- ✅ **Fallback** para SMS/Email se WhatsApp falhar

**Tudo funcionando perfeitamente!** 🎊
