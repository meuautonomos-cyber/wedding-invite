-- =====================================================
-- SCRIPT COMPLETO DE CONFIGURAÇÃO DO SUPABASE
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. SCHEMA PRINCIPAL DO SISTEMA DE CONVITES
-- =====================================================

-- Tabela para armazenar confirmações de presença (RSVP)
CREATE TABLE IF NOT EXISTS wedding_rsvp (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    quantidade_convidados INTEGER DEFAULT 1,
    restricoes_alimentares TEXT,
    observacoes TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('confirmado', 'com_acompanhante', 'nao_podera_ir')),
    data_confirmacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para armazenar ingressos gerados
CREATE TABLE IF NOT EXISTS wedding_tickets (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('confirmado', 'com_acompanhante', 'nao_poderei')),
    acompanhante VARCHAR(255),
    observacoes TEXT,
    data_confirmacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para armazenar presentes recebidos
CREATE TABLE IF NOT EXISTS wedding_gifts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doador_nome VARCHAR(255) NOT NULL,
    doador_telefone VARCHAR(20) NOT NULL,
    doador_email VARCHAR(255),
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('cota', 'item', 'pix')),
    valor DECIMAL(10,2),
    item_nome VARCHAR(255),
    categoria VARCHAR(50),
    mensagem TEXT,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'entregue')),
    data_presente TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para controlar sugestões de presentes por ticket
CREATE TABLE IF NOT EXISTS wedding_presente_suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id VARCHAR(50) NOT NULL,
    presente_nome VARCHAR(255) NOT NULL,
    presente_link TEXT NOT NULL,
    presente_valor DECIMAL(10,2),
    presente_categoria VARCHAR(50),
    prioridade INTEGER DEFAULT 9,
    sugerido_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SCHEMA DE RECONFIRMAÇÃO OBRIGATÓRIA
-- =====================================================

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

-- 3. SCHEMA DE LEMBRETES AUTOMÁTICOS
-- =====================================================

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

-- 4. ÍNDICES PARA MELHOR PERFORMANCE
-- =====================================================

-- Índices para tabelas principais
CREATE INDEX IF NOT EXISTS idx_wedding_rsvp_email ON wedding_rsvp(email);
CREATE INDEX IF NOT EXISTS idx_wedding_rsvp_status ON wedding_rsvp(status);
CREATE INDEX IF NOT EXISTS idx_wedding_tickets_email ON wedding_tickets(email);
CREATE INDEX IF NOT EXISTS idx_wedding_tickets_status ON wedding_tickets(status);
CREATE INDEX IF NOT EXISTS idx_wedding_gifts_doador_email ON wedding_gifts(doador_email);
CREATE INDEX IF NOT EXISTS idx_wedding_gifts_status ON wedding_gifts(status);
CREATE INDEX IF NOT EXISTS idx_wedding_gifts_tipo ON wedding_gifts(tipo);
CREATE INDEX IF NOT EXISTS idx_wedding_presente_suggestions_ticket_id ON wedding_presente_suggestions(ticket_id);
CREATE INDEX IF NOT EXISTS idx_wedding_presente_suggestions_presente_nome ON wedding_presente_suggestions(presente_nome);

-- Índices para reconfirmações
CREATE INDEX IF NOT EXISTS idx_wedding_reconfirmations_ticket_id ON wedding_reconfirmations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_wedding_reconfirmations_status ON wedding_reconfirmations(status);
CREATE INDEX IF NOT EXISTS idx_wedding_reconfirmations_data_limite ON wedding_reconfirmations(data_limite);
CREATE INDEX IF NOT EXISTS idx_wedding_reconfirmations_pendentes ON wedding_reconfirmations(status, data_limite) WHERE status = 'pendente';

CREATE INDEX IF NOT EXISTS idx_wedding_reconfirmation_notifications_ticket_id ON wedding_reconfirmation_notifications(ticket_id);
CREATE INDEX IF NOT EXISTS idx_wedding_reconfirmation_notifications_tipo ON wedding_reconfirmation_notifications(tipo);

-- Índices para lembretes
CREATE INDEX IF NOT EXISTS idx_wedding_reminders_ticket_id ON wedding_reminders(ticket_id);
CREATE INDEX IF NOT EXISTS idx_wedding_reminders_status ON wedding_reminders(status);
CREATE INDEX IF NOT EXISTS idx_wedding_reminders_proximo_envio ON wedding_reminders(proximo_envio);
CREATE INDEX IF NOT EXISTS idx_wedding_reminders_pending ON wedding_reminders(status, proximo_envio) WHERE status = 'pendente';

-- 5. FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Função específica para reconfirmações
CREATE OR REPLACE FUNCTION update_wedding_reconfirmations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função específica para lembretes
CREATE OR REPLACE FUNCTION update_wedding_reminders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at nas tabelas principais
CREATE TRIGGER update_wedding_rsvp_updated_at 
    BEFORE UPDATE ON wedding_rsvp 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wedding_tickets_updated_at 
    BEFORE UPDATE ON wedding_tickets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wedding_gifts_updated_at 
    BEFORE UPDATE ON wedding_gifts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers para reconfirmações
CREATE TRIGGER trigger_update_wedding_reconfirmations_updated_at
  BEFORE UPDATE ON wedding_reconfirmations
  FOR EACH ROW
  EXECUTE FUNCTION update_wedding_reconfirmations_updated_at();

-- Triggers para lembretes
CREATE TRIGGER trigger_update_wedding_reminders_updated_at
  BEFORE UPDATE ON wedding_reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_wedding_reminders_updated_at();

-- 6. POLÍTICAS DE SEGURANÇA (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE wedding_rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_presente_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_reconfirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_reconfirmation_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_reminders ENABLE ROW LEVEL SECURITY;

-- Políticas para wedding_rsvp
CREATE POLICY "Permitir inserção de RSVP" ON wedding_rsvp
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura de RSVP por email" ON wedding_rsvp
    FOR SELECT USING (true);

-- Políticas para wedding_tickets
CREATE POLICY "Permitir inserção de ingressos" ON wedding_tickets
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura de ingressos" ON wedding_tickets
    FOR SELECT USING (true);

CREATE POLICY "Permitir atualização de ingressos" ON wedding_tickets
    FOR UPDATE USING (true);

-- Políticas para wedding_gifts
CREATE POLICY "Permitir inserção de presentes" ON wedding_gifts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura de presentes" ON wedding_gifts
    FOR SELECT USING (true);

CREATE POLICY "Permitir atualização de presentes" ON wedding_gifts
    FOR UPDATE USING (true);

-- Políticas para wedding_presente_suggestions
CREATE POLICY "Permitir inserção de sugestões de presentes" ON wedding_presente_suggestions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura de sugestões de presentes" ON wedding_presente_suggestions
    FOR SELECT USING (true);

CREATE POLICY "Permitir atualização de sugestões de presentes" ON wedding_presente_suggestions
    FOR UPDATE USING (true);

-- Políticas para wedding_reconfirmations
CREATE POLICY "Permitir inserção de reconfirmações" ON wedding_reconfirmations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura de reconfirmações" ON wedding_reconfirmations
    FOR SELECT USING (true);

CREATE POLICY "Permitir atualização de reconfirmações" ON wedding_reconfirmations
    FOR UPDATE USING (true);

-- Políticas para wedding_reconfirmation_notifications
CREATE POLICY "Permitir inserção de notificações de reconfirmação" ON wedding_reconfirmation_notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura de notificações de reconfirmação" ON wedding_reconfirmation_notifications
    FOR SELECT USING (true);

-- Políticas para wedding_reminders
CREATE POLICY "Permitir inserção de lembretes" ON wedding_reminders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura de lembretes" ON wedding_reminders
    FOR SELECT USING (true);

CREATE POLICY "Permitir atualização de lembretes" ON wedding_reminders
    FOR UPDATE USING (true);

-- =====================================================
-- FIM DO SCRIPT DE CONFIGURAÇÃO
-- =====================================================

-- Verificação final - listar todas as tabelas criadas
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'wedding_%'
ORDER BY tablename;
