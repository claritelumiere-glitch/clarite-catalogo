-- ═══════════════════════════════════════════════════════════
-- Clarité Lumière — Storage & Additional RLS Policies
-- ═══════════════════════════════════════════════════════════

-- Storage bucket para imagens de produtos
-- NOTA: Execute no Supabase Dashboard > Storage > New Bucket:
--   Nome: imagens
--   Public: true
-- Ou use a API/CLI do Supabase para criar o bucket.

-- Storage policies (aplicar depois de criar o bucket no dashboard)
-- Leitura pública de imagens
CREATE POLICY "imagens_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'imagens');

-- Apenas usuários autenticados podem fazer upload
CREATE POLICY "imagens_auth_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'imagens'
    AND auth.role() = 'authenticated'
  );

-- Apenas usuários autenticados podem deletar
CREATE POLICY "imagens_auth_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'imagens'
    AND auth.role() = 'authenticated'
  );

-- Garante que RLS está habilitado nas tabelas principais
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- ── Políticas para categorias ────────────────────────────────

-- Qualquer um pode LER categorias ativas
DO $$ BEGIN
  CREATE POLICY "categorias_publicas" ON categorias
    FOR SELECT USING (ativo = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Autenticado pode VER todas (incluindo inativas) no admin
DO $$ BEGIN
  CREATE POLICY "categorias_admin_select" ON categorias
    FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Autenticado pode ESCREVER categorias
DO $$ BEGIN
  CREATE POLICY "categorias_admin_write" ON categorias
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Políticas para produtos ────────────────────────────────

-- Qualquer um pode LER produtos ativos
DO $$ BEGIN
  CREATE POLICY "produtos_publicos" ON produtos
    FOR SELECT USING (ativo = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Autenticado pode escrever produtos
DO $$ BEGIN
  CREATE POLICY "produtos_admin" ON produtos
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
