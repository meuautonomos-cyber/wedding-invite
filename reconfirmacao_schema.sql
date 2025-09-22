-- Schema para sistema de reconfirmação obrigatória
-- Execute este SQL no Supabase SQL Editor

-- Tabela para controlar reconfirmações
CREATE TABLE IF NOT EXISTS wedding_reconfirmations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES wedding_tickets(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'desistiu', 'taxa_paga')),
  data_limite TIMESTAMP WITH TIME ZONE NOT NULL,
  data_reconfirmacao TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  taxa_desistencia DECIMAL(10,2) DEFAULT 150.00,
  taxa_paga BOOLEAN DEFAULT FALSE,
  comprovante_pagamento TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para histórico de notificações de reconfirmação
CREATE TABLE IF NOT EXISTS wedding_reconfirmation_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES wedding_tickets(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('lembrete', 'ultimo_aviso', 'confirmacao_obrigatoria', 'taxa_cobranca')),
  mensagem TEXT NOT NULL,
  enviada_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status_envio TEXT DEFAULT 'enviado' CHECK (status_envio IN ('enviado', 'falhou', 'pendente'))
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_wedding_reconfirmations_ticket_id ON wedding_reconfirmations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_wedding_reconfirmations_status ON wedding_reconfirmations(status);
CREATE INDEX IF NOT EXISTS idx_wedding_reconfirmations_data_limite ON wedding_reconfirmations(data_limite);
CREATE INDEX IF NOT EXISTS idx_wedding_reconfirmations_pendentes ON wedding_reconfirmations(status, data_limite) WHERE status = 'pendente';

CREATE INDEX IF NOT EXISTS idx_wedding_reconfirmation_notifications_ticket_id ON wedding_reconfirmation_notifications(ticket_id);
CREATE INDEX IF NOT EXISTS idx_wedding_reconfirmation_notifications_tipo ON wedding_reconfirmation_notifications(tipo);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_wedding_reconfirmations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_wedding_reconfirmations_updated_at
  BEFORE UPDATE ON wedding_reconfirmations
  FOR EACH ROW
  EXECUTE FUNCTION update_wedding_reconfirmations_updated_at();

-- Políticas de segurança (RLS)
ALTER TABLE wedding_reconfirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_reconfirmation_notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para reconfirmações
CREATE POLICY "Permitir inserção de reconfirmações" ON wedding_reconfirmations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura de reconfirmações" ON wedding_reconfirmations
    FOR SELECT USING (true);

CREATE POLICY "Permitir atualização de reconfirmações" ON wedding_reconfirmations
    FOR UPDATE USING (true);

-- Políticas para notificações de reconfirmação
CREATE POLICY "Permitir inserção de notificações de reconfirmação" ON wedding_reconfirmation_notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura de notificações de reconfirmação" ON wedding_reconfirmation_notifications
    FOR SELECT USING (true);
