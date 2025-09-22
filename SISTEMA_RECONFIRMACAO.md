# Sistema de Reconfirmação Obrigatória

## 📅 Visão Geral

Sistema real de reconfirmação obrigatória que funciona 30 dias antes do casamento, com taxa de desistência de R$ 150,00 e integração com pagamento via PIX.

## 🎯 Funcionalidades

### Reconfirmação Obrigatória
- **30 dias antes**: Lista de convidados é fechada
- **Reconfirmação obrigatória**: Todos os confirmados devem reconfirmar
- **Taxa de desistência**: R$ 150,00 para quem desistir após a data limite
- **Pagamento real**: Integração com PIX para cobrança da taxa

### Notificações Automáticas
- **Lembretes**: 7+ dias antes da data limite
- **Último aviso**: 1-7 dias antes da data limite
- **Confirmação obrigatória**: Após a data limite
- **Cobrança de taxa**: Para quem desistir após a data limite

## 🚀 Como Usar

### 1. Configurar Banco de Dados
Execute o script SQL para criar as tabelas:
```sql
-- Execute o arquivo reconfirmacao_schema.sql no Supabase
```

### 2. Iniciar o Sistema
```powershell
# Execute o script PowerShell
.\start_reconfirmation_system.ps1
```

### 3. Verificar Reconfirmações Manualmente
```bash
# Via API
curl -X POST http://localhost:3000/api/reconfirmation/notify

# Ou via GET
curl http://localhost:3000/api/reconfirmation/notify
```

## ⚙️ Configuração

### Variáveis de Ambiente
Certifique-se de que as seguintes variáveis estão configuradas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ZAPI_URL` (URL da sua instância Z-API)

### Data do Casamento
A data do casamento está configurada em `src/lib/reconfirmationService.ts`:
```typescript
this.weddingDate = new Date('2026-03-21') // Altere conforme necessário
```

### Taxa de Desistência
A taxa está configurada em `src/lib/reconfirmationService.ts`:
```typescript
taxa_desistencia: 150.00 // Altere conforme necessário
```

## 📊 Estrutura do Banco

### Tabela: wedding_reconfirmations
```sql
CREATE TABLE wedding_reconfirmations (
  id UUID PRIMARY KEY,
  ticket_id TEXT NOT NULL,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  data_limite TIMESTAMP WITH TIME ZONE NOT NULL,
  data_reconfirmacao TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  taxa_desistencia DECIMAL(10,2) DEFAULT 150.00,
  taxa_paga BOOLEAN DEFAULT FALSE,
  comprovante_pagamento TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: wedding_reconfirmation_notifications
```sql
CREATE TABLE wedding_reconfirmation_notifications (
  id UUID PRIMARY KEY,
  ticket_id TEXT NOT NULL,
  tipo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  enviada_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status_envio TEXT DEFAULT 'enviado'
);
```

## 🔄 Fluxo de Funcionamento

1. **30 dias antes**: Sistema cria reconfirmações para todos os convidados confirmados
2. **Notificações**: Envia lembretes via WhatsApp
3. **Reconfirmação**: Convidados acessam `/reconfirmar?id=TICKET_ID`
4. **Ações possíveis**:
   - Confirmar presença (gratuito)
   - Cancelar presença (gratuito antes da data limite)
   - Cancelar presença (taxa de R$ 150,00 após a data limite)
5. **Pagamento**: Taxa paga via PIX com comprovante

## 📱 Página de Reconfirmação

### URL: `/reconfirmar?id=TICKET_ID`

**Funcionalidades:**
- Exibe informações do convidado
- Mostra data limite para reconfirmação
- Permite confirmar ou cancelar presença
- Gera PIX para pagamento da taxa
- Processa comprovante de pagamento

## 💰 Sistema de Pagamento

### PIX para Taxa de Desistência
- **Chave PIX**: Mesma do casamento
- **Valor**: R$ 150,00 (configurável)
- **Descrição**: "Taxa de desistência - [Nome] - Casamento Esther & Anthony"
- **Comprovante**: Número ou observação do pagamento

## 🚨 Mensagens de Notificação

### 7+ Dias Antes da Data Limite
```
🔔 RECONFIRMAÇÃO OBRIGATÓRIA - [X] DIAS!

Olá [Nome]! 👋

ATENÇÃO: Em [X] dias encerraremos a lista de convidados para nosso casamento!

📅 Data limite: [Data]
📅 Casamento: 21/03/2026 às 15:30
📍 Local: Valle Verde

⚠️ IMPORTANTE:
• Você DEVE reconfirmar sua presença até [Data]
• Após esta data, não será mais possível desistir
• Se desistir após a data limite, será cobrada taxa de R$ 150,00

🔗 Reconfirme agora: [link]/reconfirmar?id=[TICKET_ID]

Esta é uma reconfirmação obrigatória.
```

### 1-7 Dias Antes da Data Limite
```
🚨 ÚLTIMA CHANCE - [X] DIAS!

Olá [Nome]! ⚠️

URGENTE: Restam apenas [X] dias para reconfirmar sua presença!

📅 Data limite: [Data]
📅 Casamento: 21/03/2026 às 15:30
📍 Local: Valle Verde

⚠️ ATENÇÃO:
• Após [Data] não será mais possível desistir
• Desistência após a data = taxa de R$ 150,00
• Reconfirme AGORA para garantir sua vaga!

🔗 Reconfirme URGENTE: [link]/reconfirmar?id=[TICKET_ID]

Não perca sua vaga!
```

### Após a Data Limite
```
🔒 LISTA FECHADA - RECONFIRMAÇÃO OBRIGATÓRIA!

Olá [Nome]! 🔐

A lista de convidados foi FECHADA!

📅 Casamento: 21/03/2026 às 15:30
📍 Local: Valle Verde

⚠️ SITUAÇÃO ATUAL:
• Você NÃO reconfirmou até a data limite
• Sua presença está CONFIRMADA automaticamente
• NÃO é mais possível desistir sem pagar taxa
• Taxa de desistência: R$ 150,00

🔗 Ver detalhes: [link]/reconfirmar?id=[TICKET_ID]

Reconfirmação automática aplicada.
```

## 🛠️ Manutenção

### Verificar Status das Reconfirmações
```sql
-- Ver reconfirmações pendentes
SELECT * FROM wedding_reconfirmations WHERE status = 'pendente';

-- Ver reconfirmações confirmadas
SELECT * FROM wedding_reconfirmations WHERE status = 'confirmado';

-- Ver desistências com taxa
SELECT * FROM wedding_reconfirmations WHERE status = 'desistiu';

-- Ver pagamentos processados
SELECT * FROM wedding_reconfirmations WHERE status = 'taxa_paga';

-- Estatísticas
SELECT 
  status,
  COUNT(*) as total,
  SUM(taxa_desistencia) as total_taxas
FROM wedding_reconfirmations 
GROUP BY status;
```

### Pausar Sistema
```sql
-- Pausar notificações (atualizar status para 'pausado')
UPDATE wedding_reconfirmations 
SET status = 'pausado' 
WHERE status = 'pendente';
```

## 🚨 Troubleshooting

### Reconfirmações não estão sendo criadas
1. Verifique se está no período (30 dias antes)
2. Confirme se há convidados confirmados
3. Verifique os logs do sistema
4. Teste a API manualmente

### Notificações não estão sendo enviadas
1. Verifique se o Z-API está rodando
2. Confirme as variáveis de ambiente
3. Verifique os logs do processador
4. Teste o endpoint manualmente

### Pagamentos não estão sendo processados
1. Verifique se a chave PIX está correta
2. Confirme se o comprovante foi enviado
3. Verifique os logs de pagamento
4. Teste a API de pagamento

## 📈 Monitoramento

O sistema registra logs detalhados para monitoramento:
- Criação de reconfirmações
- Envio de notificações
- Processamento de reconfirmações
- Pagamentos de taxas
- Erros e falhas

## 🔧 Personalização

### Alterar Data Limite
Edite `src/lib/reconfirmationService.ts`:
```typescript
// Alterar de 30 dias para 45 dias
deadline.setDate(deadline.getDate() - 45)
```

### Alterar Taxa de Desistência
Edite `src/lib/reconfirmationService.ts`:
```typescript
taxa_desistencia: 200.00 // Alterar valor
```

### Personalizar Mensagens
Edite a função `sendReconfirmationMessage()` em `src/lib/reconfirmationService.ts`

## 🎉 Benefícios

- **Controle real**: Lista fechada 30 dias antes
- **Cobrança efetiva**: Taxa de desistência via PIX
- **Automação completa**: Notificações automáticas
- **Interface amigável**: Página de reconfirmação intuitiva
- **Relatórios detalhados**: Controle total via banco de dados
- **Integração perfeita**: Funciona com sistema existente
