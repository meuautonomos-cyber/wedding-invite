-- Schema do banco de dados para o sistema de convites de casamento
-- Execute este SQL no Supabase SQL Editor

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

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_wedding_rsvp_email ON wedding_rsvp(email);
CREATE INDEX IF NOT EXISTS idx_wedding_rsvp_status ON wedding_rsvp(status);
CREATE INDEX IF NOT EXISTS idx_wedding_tickets_email ON wedding_tickets(email);
CREATE INDEX IF NOT EXISTS idx_wedding_tickets_status ON wedding_tickets(status);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_wedding_rsvp_updated_at 
    BEFORE UPDATE ON wedding_rsvp 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wedding_tickets_updated_at 
    BEFORE UPDATE ON wedding_tickets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança (RLS)
ALTER TABLE wedding_rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_tickets ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de novos RSVPs
CREATE POLICY "Permitir inserção de RSVP" ON wedding_rsvp
    FOR INSERT WITH CHECK (true);

-- Política para permitir leitura de RSVPs por email
CREATE POLICY "Permitir leitura de RSVP por email" ON wedding_rsvp
    FOR SELECT USING (true);

-- Política para permitir inserção de ingressos
CREATE POLICY "Permitir inserção de ingressos" ON wedding_tickets
    FOR INSERT WITH CHECK (true);

-- Política para permitir leitura de ingressos
CREATE POLICY "Permitir leitura de ingressos" ON wedding_tickets
    FOR SELECT USING (true);

-- Política para permitir atualização de ingressos
CREATE POLICY "Permitir atualização de ingressos" ON wedding_tickets
    FOR UPDATE USING (true);
