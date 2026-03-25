-- ═══════════════════════════════════════════════════════════
-- Clarité Lumière — Add estoque & caracteristicas to produtos
-- ═══════════════════════════════════════════════════════════

-- Estoque: quantidade disponível do produto
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS estoque INT DEFAULT 0;

-- Características: dados técnicos do produto (material, dimensões, voltagem, etc.)
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS caracteristicas JSONB DEFAULT '{}';

-- Index para busca por estoque (produtos disponíveis)
CREATE INDEX IF NOT EXISTS idx_produtos_estoque ON produtos(estoque) WHERE estoque > 0;
