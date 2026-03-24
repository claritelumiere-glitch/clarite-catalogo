# Planejamento — Clarité Lumière

## Identidade Visual

| Elemento | Valor |
|---|---|
| Cor primária | Roxo/Violeta `#6B2D8B` → `#C2185B` (gradiente) |
| Cor de destaque | Dourado `#D4A017` |
| Cor de texto | Branco `#FFFFFF` |
| Logo | Lustre dourado + versão transparente (PNG/PDF) |
| Slogan | "Onde qualidade e sofisticação se encontram" |
| Fonte | Serif elegante (ex: Playfair Display) + sans-serif limpa |

---

## Stack Técnica

| Camada | Tecnologia | Motivo |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR, SEO, Vercel free tier |
| Linguagem | TypeScript | Segurança de tipos, menos bugs |
| Banco de dados | Supabase (PostgreSQL) | Gratuito, RLS nativo, Auth integrado |
| Autenticação | Supabase Auth | MFA disponível, JWT seguro |
| Storage (imagens) | Supabase Storage | Policies por bucket, CDN |
| Estilização | Tailwind CSS + shadcn/ui | Rápido, consistente, acessível |
| Hosting | Vercel (free tier) | Zero custo inicial, HTTPS automático |
| Dev workflow | GSD (get-shit-done) | Spec-driven com Claude Code |

---

## Arquitetura — 3 sistemas no mesmo repositório (monorepo)

```
clarite-lumiere/
├── apps/
│   ├── site/          → Site institucional (claritelumiere.com)
│   ├── catalogo/      → Catálogo B2B (catalogo.claritelumiere.com)
│   └── admin/         → Painel administrativo (admin.claritelumiere.com)
├── packages/
│   └── ui/            → Componentes compartilhados (logo, cores, tipografia)
├── supabase/
│   ├── migrations/    → Migrações do banco
│   └── seed/          → Dados iniciais de categorias
└── PLANEJAMENTO.md
```

> Alternativa mais simples (recomendada para este porte): um único projeto Next.js com rotas separadas por subdomínio/path, deployed em Vercel com rewrites.

---

## Módulo 1 — Site Institucional

**URL:** `claritelumiere.com`
**Público:** Consumidor final

### Seções
1. **Hero** — Logo + slogan + CTA "Ver Catálogo" + imagem de lustre ambientado
2. **Sobre a empresa** — História da Clarité, missão, valores
3. **Diferenciais** — Qualidade, sofisticação, atendimento personalizado
4. **Categorias em destaque** — Grid com categorias do catálogo (link para o catálogo)
5. **Galeria** — Fotos de ambientes com produtos instalados
6. **Contato** — WhatsApp, email corporativo, formulário de contato
7. **Footer** — Logo, links, redes sociais

### Tecnologias específicas
- Static generation (SSG) para performance máxima e SEO
- Formulário de contato com rate limiting (proteger contra spam/flood)
- Open Graph tags para compartilhamento em redes sociais

---

## Módulo 2 — Catálogo de Produtos

**URL:** `catalogo.claritelumiere.com` ou `claritelumiere.com/catalogo`
**Público:** B2B — arquitetos, decoradores, hospitais, empresas

### Funcionalidades
- Listagem de produtos com grid/lista
- Filtros por: categoria, ambiente (sala, quarto, externo...), material, faixa de preço
- Busca por nome ou código do produto
- Página de detalhe: foto(s), nome, código, descrição, preço, categoria
- Paginação (lazy loading ou infinite scroll)
- Botão "Solicitar orçamento" → abre WhatsApp com produto pré-selecionado

### Banco de dados — Schema Supabase

```sql
-- Categorias
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Produtos
CREATE TABLE produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id UUID REFERENCES categorias(id),
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2),
  imagens TEXT[] DEFAULT '{}',  -- array de URLs do Storage
  ativo BOOLEAN DEFAULT true,
  destaque BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_produtos_ativo ON produtos(ativo);
CREATE INDEX idx_produtos_slug ON produtos(slug);

-- Full-text search em português
CREATE INDEX idx_produtos_busca ON produtos
  USING gin(to_tsvector('portuguese', nome || ' ' || COALESCE(descricao, '') || ' ' || codigo));
```

### Row Level Security (RLS)
```sql
-- Catálogo: leitura pública, escrita apenas admin
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode LER produtos ativos
CREATE POLICY "produtos_publicos" ON produtos
  FOR SELECT USING (ativo = true);

-- Só admin autenticado pode INSERT/UPDATE/DELETE
CREATE POLICY "produtos_admin" ON produtos
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## Módulo 3 — Painel Admin

**URL:** `admin.claritelumiere.com` ou `claritelumiere.com/admin`
**Acesso:** Apenas Gabrielly (autenticada via Supabase Auth)

### Funcionalidades
- Login com email + senha (Supabase Auth)
- Dashboard com contadores (total de produtos, categorias, produtos ativos)
- **CRUD Categorias:** criar, editar, reordenar, ativar/desativar
- **CRUD Produtos:**
  - Upload de múltiplas imagens (Supabase Storage, validação de tipo/tamanho)
  - Campos: código, nome, categoria, descrição, preço, status
  - Preview das imagens antes de salvar
  - Marcar como destaque
- Busca e filtros no admin para gerenciar facilmente ~1000 produtos
- Exportar catálogo em CSV (backup)

---

## Segurança — Threat Model Completo

### Autenticação e Autorização
| Ameaça | Proteção |
|---|---|
| Brute force no login | Rate limiting (max 5 tentativas / 15min) via Supabase Auth |
| Sessão roubada | JWT com expiração curta + refresh token rotativo |
| Acesso não autorizado ao admin | RLS no banco — sem bypass possível mesmo com acesso direto ao SQL |
| Escalada de privilégios | Supabase Auth com roles, nenhuma rota admin acessível sem `auth.role() = authenticated` |

### Injeção e Input
| Ameaça | Proteção |
|---|---|
| SQL Injection | Supabase usa queries parametrizadas nativamente — nunca string concatenation |
| XSS | Next.js escapa HTML por padrão; sanitização com DOMPurify onde houver HTML customizado |
| Path Traversal | Validação de slugs e IDs com regex antes de qualquer query |
| SSRF | Sem fetch de URLs arbitrárias fornecidas pelo usuário |

### Upload de Arquivos
| Ameaça | Proteção |
|---|---|
| Upload de malware | Validar MIME type no servidor (não só extensão), max 5MB por imagem |
| Acesso a arquivos privados | Supabase Storage Policies — bucket público apenas para leitura de imagens |
| Hotlink/scraping das imagens | Aceitável para catálogo; adicionar transformação de imagem com signed URLs se necessário |

### Infraestrutura
| Ameaça | Proteção |
|---|---|
| Secrets expostos | Todas as variáveis em `.env.local` / Vercel Environment Variables, nunca no código |
| HTTPS | Vercel fornece TLS automático + HSTS |
| Clickjacking | Header `X-Frame-Options: DENY` via Next.js middleware |
| CSRF | Next.js Server Actions usam tokens implícitos; formulários públicos com honeypot |
| DDoS simples | Vercel Edge + Supabase têm rate limiting básico; Cloudflare grátis como camada adicional |
| Dados sensíveis expostos | Nunca retornar campos desnecessários nas queries (select apenas o que precisa) |
| Enumeração de usuários | Supabase Auth retorna mensagem genérica em caso de email não encontrado |

### Boas práticas adicionais
- `Content-Security-Policy` header configurado no `next.config.js`
- Dependências auditadas com `npm audit` no CI
- Supabase Vault para armazenar secrets sensíveis se necessário
- Logs de acesso ao admin (tabela de audit_log no Supabase)
- Backup automático do Supabase (disponível no free tier por 7 dias)

---

## Cronograma de Entrega

| Data | Entrega |
|---|---|
| 04/04/2026 | Catálogo online (estrutura + primeiros produtos) |
| 04/05/2026 | Catálogo completo (~1000 produtos preenchidos) |
| TBD | Site institucional |
| TBD | Emails corporativos configurados |

## Pagamentos

| Vencimento | Valor |
|---|---|
| 30/04/2026 | R$ 450,00 |
| 30/05/2026 | R$ 450,00 |
| 30/06/2026 | R$ 450,00 |
| 30/07/2026 | R$ 450,00 |
| 30/08/2026 | R$ 450,00 |
| 30/09/2026 | R$ 450,00 |
| **Total** | **R$ 2.700,00** |

---

## Próximos passos

- [ ] 1. Instalar GSD: `npx get-shit-done-cc@latest`
- [ ] 2. Criar projeto no Supabase (free tier)
- [ ] 3. Inicializar repositório Next.js com TypeScript + Tailwind
- [ ] 4. Configurar Supabase migrations (schema acima)
- [ ] 5. Construir o catálogo (listagem + filtros + página de produto)
- [ ] 6. Construir o admin (login + CRUD produtos + upload imagens)
- [ ] 7. Iniciar cadastro dos produtos do fornecedor
- [ ] 8. Site institucional
- [ ] 9. Configurar domínio claritelumiere.com + DNS
- [ ] 10. Configurar emails corporativos (Google Workspace ou Zoho Mail)
