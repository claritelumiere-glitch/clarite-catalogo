-- ═══════════════════════════════════════════════════════════
-- Clarité Lumière — Initial Schema
-- ═══════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Categorias ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Produtos ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2),
  imagens TEXT[] DEFAULT '{}',
  ativo BOOLEAN DEFAULT true,
  destaque BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Índices ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);
CREATE INDEX IF NOT EXISTS idx_produtos_destaque ON produtos(destaque);
CREATE INDEX IF NOT EXISTS idx_produtos_slug ON produtos(slug);
CREATE INDEX IF NOT EXISTS idx_categorias_slug ON categorias(slug);
CREATE INDEX IF NOT EXISTS idx_categorias_ativo ON categorias(ativo);

-- Full-text search em português
CREATE INDEX IF NOT EXISTS idx_produtos_busca ON produtos
  USING gin(to_tsvector('portuguese', nome || ' ' || COALESCE(descricao, '') || ' ' || codigo));

-- ── Auto-update updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER produtos_updated_at
  BEFORE UPDATE ON produtos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read active records
CREATE POLICY "categorias_public_read" ON categorias
  FOR SELECT USING (ativo = true);

CREATE POLICY "produtos_public_read" ON produtos
  FOR SELECT USING (ativo = true);

-- Admin: authenticated users have full access
CREATE POLICY "categorias_admin_all" ON categorias
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "produtos_admin_all" ON produtos
  FOR ALL USING (auth.role() = 'authenticated');

-- ── Audit Log ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,  -- 'create', 'update', 'delete'
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_log_admin" ON audit_log
  FOR ALL USING (auth.role() = 'authenticated');

-- ── Seed: default categories ─────────────────────────────────
INSERT INTO categorias (nome, slug, ordem) VALUES
  ('Lustres', 'lustres', 1),
  ('Pendentes', 'pendentes', 2),
  ('Plafons', 'plafons', 3),
  ('Arandelas', 'arandelas', 4),
  ('Luminárias de Chão', 'luminarias-de-chao', 5),
  ('Luminárias de Mesa', 'luminarias-de-mesa', 6),
  ('Spots e Trilhos', 'spots-e-trilhos', 7),
  ('Fitas LED', 'fitas-led', 8),
  ('Externas', 'externas', 9)
ON CONFLICT (slug) DO NOTHING;
