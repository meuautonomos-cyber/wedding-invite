-- Tabela para gerenciar lembretes automáticos
CREATE TABLE IF NOT EXISTS wedding_reminders (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES wedding_tickets(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  dias_restantes INTEGER NOT NULL,
  proximo_envio TIMESTAMP WITH TIME ZONE NOT NULL,
  ultimo_envio TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'enviado', 'pausado')),
  mensagem_enviada TEXT,
  imagem_enviada TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_wedding_reminders_ticket_id ON wedding_reminders(ticket_id);
CREATE INDEX IF NOT EXISTS idx_wedding_reminders_status ON wedding_reminders(status);
CREATE INDEX IF NOT EXISTS idx_wedding_reminders_proximo_envio ON wedding_reminders(proximo_envio);
CREATE INDEX IF NOT EXISTS idx_wedding_reminders_pending ON wedding_reminders(status, proximo_envio) WHERE status = 'pendente';

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_wedding_reminders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_wedding_reminders_updated_at
  BEFORE UPDATE ON wedding_reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_wedding_reminders_updated_at();

-- Políticas de segurança (RLS)
ALTER TABLE wedding_reminders ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de lembretes
CREATE POLICY "Permitir inserção de lembretes" ON wedding_reminders
    FOR INSERT WITH CHECK (true);

-- Política para permitir leitura de lembretes
CREATE POLICY "Permitir leitura de lembretes" ON wedding_reminders
    FOR SELECT USING (true);

-- Política para permitir atualização de lembretes
CREATE POLICY "Permitir atualização de lembretes" ON wedding_reminders
    FOR UPDATE USING (true);
