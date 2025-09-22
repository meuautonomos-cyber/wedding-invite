# Sistema de Lembretes Automáticos

## 📅 Visão Geral

O sistema de lembretes automáticos envia mensagens via Z-API a cada 30 dias para relembrar os convidados sobre o casamento, até chegar o grande dia.

## 🎯 Funcionalidades

### Lembretes Programados
- **6 meses antes**: Lembrete inicial com informações básicas
- **4 meses antes**: Contagem regressiva iniciada
- **2 meses antes**: Lembretes importantes e dress code
- **1 mês antes**: Últimas informações e confirmações
- **1 semana antes**: Lembretes finais e preparativos
- **1 dia antes**: Amanhã é o grande dia!
- **No dia**: Hoje é o grande dia!

### Imagens Personalizadas
Cada lembrete inclui uma imagem específica para o período:
- `/images/reminders/6-meses.jpg`
- `/images/reminders/4-meses.jpg`
- `/images/reminders/2-meses.jpg`
- `/images/reminders/1-mes.jpg`
- `/images/reminders/1-semana.jpg`
- `/images/reminders/1-dia.jpg`
- `/images/reminders/hoje.jpg`

## 🚀 Como Usar

### 1. Configurar Banco de Dados
Execute o script SQL para criar a tabela de lembretes:
```sql
-- Execute o arquivo wedding_reminders_schema.sql no Supabase
```

### 2. Iniciar o Processador
```powershell
# Execute o script PowerShell
.\start_reminder_processor.ps1
```

### 3. Verificar Lembretes Manualmente
```bash
# Via API
curl -X POST http://localhost:3000/api/reminders/process

# Ou via GET
curl http://localhost:3000/api/reminders/process
```

## ⚙️ Configuração

### Variáveis de Ambiente
Certifique-se de que as seguintes variáveis estão configuradas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ZAPI_URL` (URL da sua instância Z-API)

### Data do Casamento
A data do casamento está configurada em `src/lib/reminderService.ts`:
```typescript
const weddingDate = new Date('2026-03-21') // Altere conforme necessário
```

## 📊 Estrutura do Banco

### Tabela: wedding_reminders
```sql
CREATE TABLE wedding_reminders (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  dias_restantes INTEGER NOT NULL,
  proximo_envio TIMESTAMP WITH TIME ZONE NOT NULL,
  ultimo_envio TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pendente',
  mensagem_enviada TEXT,
  imagem_enviada TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔄 Fluxo de Funcionamento

1. **Cadastro**: Quando um convidado se cadastra, o sistema cria lembretes automáticos
2. **Agendamento**: Lembretes são agendados a cada 30 dias
3. **Processamento**: O processador verifica lembretes pendentes a cada 30 minutos
4. **Envio**: Lembretes são enviados via Z-API com mensagem e imagem personalizadas
5. **Atualização**: Status é atualizado após envio bem-sucedido

## 📱 Mensagens Personalizadas

Cada lembrete inclui:
- Nome personalizado do convidado
- Dias restantes até o casamento
- Informações do evento (data, hora, local)
- Links úteis (site, presentes, local)
- Imagem específica para o período
- Dicas e lembretes importantes

## 🛠️ Manutenção

### Verificar Status dos Lembretes
```sql
-- Ver lembretes pendentes
SELECT * FROM wedding_reminders WHERE status = 'pendente';

-- Ver lembretes enviados hoje
SELECT * FROM wedding_reminders 
WHERE DATE(ultimo_envio) = CURRENT_DATE;

-- Ver estatísticas
SELECT 
  status,
  COUNT(*) as total
FROM wedding_reminders 
GROUP BY status;
```

### Pausar Lembretes
```sql
-- Pausar lembretes para um convidado específico
UPDATE wedding_reminders 
SET status = 'pausado' 
WHERE ticket_id = 'TICKET_ID';
```

### Reativar Lembretes
```sql
-- Reativar lembretes pausados
UPDATE wedding_reminders 
SET status = 'pendente' 
WHERE ticket_id = 'TICKET_ID' AND status = 'pausado';
```

## 🚨 Troubleshooting

### Lembretes não estão sendo enviados
1. Verifique se o Z-API está rodando
2. Confirme as variáveis de ambiente
3. Verifique os logs do processador
4. Teste o endpoint manualmente

### Erro de conexão com Supabase
1. Verifique as credenciais do Supabase
2. Confirme se a tabela foi criada
3. Teste a conexão manualmente

### Imagens não aparecem
1. Verifique se as imagens existem em `/public/images/reminders/`
2. Confirme as permissões de arquivo
3. Teste o acesso direto às imagens

## 📈 Monitoramento

O sistema registra logs detalhados para monitoramento:
- Criação de lembretes
- Processamento de lembretes pendentes
- Envios bem-sucedidos
- Erros e falhas

## 🔧 Personalização

### Alterar Frequência dos Lembretes
Edite `src/lib/reminderService.ts`:
```typescript
// Alterar de 30 dias para 15 dias
proximoEnvio.setDate(proximoEnvio.getDate() + 15)
```

### Personalizar Mensagens
Edite a função `getReminderMessage()` em `src/lib/reminderService.ts`

### Adicionar Novas Imagens
1. Adicione as imagens em `/public/images/reminders/`
2. Atualize a função `getReminderMessage()`
3. Execute o script de criação de imagens se necessário
