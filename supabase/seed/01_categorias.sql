-- Seed: categorias para teste
INSERT INTO categorias (nome, slug, descricao, ordem, ativo) VALUES
  ('Lustres', 'lustres', 'Lustres para sala de estar, jantar e ambientes especiais', 1, true),
  ('Pendentes', 'pendentes', 'Pendentes modernos e clássicos para cozinha e mesa de jantar', 2, true),
  ('Arandelas', 'arandelas', 'Arandelas para corredor, quarto e áreas externas', 3, true),
  ('Plafons', 'plafons', 'Plafons para quartos, banheiros e salas', 4, true),
  ('Spots e Trilhos', 'spots-e-trilhos', 'Spots embutidos e trilhos para iluminação direcional', 5, true),
  ('Luminárias de Mesa', 'luminarias-de-mesa', 'Abajures e luminárias para mesa e criado-mudo', 6, true),
  ('Luminárias Externas', 'luminarias-externas', 'Iluminação para jardim, garagem e área externa', 7, true),
  ('Corporativo', 'corporativo', 'Soluções de iluminação para hotéis, hospitais e escritórios', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- Seed: produtos de exemplo para teste
INSERT INTO produtos (codigo, nome, slug, categoria_id, descricao, preco, ativo, destaque)
SELECT
  'LUS-001',
  'Lustre Imperial Cristal',
  'lustre-imperial-cristal',
  id,
  'Lustre de cristal com acabamento dourado. Ideal para salas de jantar e ambientes de alto padrão. Diâmetro: 80cm, Altura: 60cm. Acompanha 12 lâmpadas E14.',
  2890.00,
  true,
  true
FROM categorias WHERE slug = 'lustres'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO produtos (codigo, nome, slug, categoria_id, descricao, preco, ativo, destaque)
SELECT
  'LUS-002',
  'Lustre Versailles Gold',
  'lustre-versailles-gold',
  id,
  'Lustre clássico inspirado no estilo Versailles, com braços curvados e acabamento gold fosco. 8 pontos de luz. Diâmetro: 100cm.',
  4200.00,
  true,
  true
FROM categorias WHERE slug = 'lustres'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO produtos (codigo, nome, slug, categoria_id, descricao, preco, ativo, destaque)
SELECT
  'PEN-001',
  'Pendente Esfera Âmbar',
  'pendente-esfera-ambar',
  id,
  'Pendente com globo de vidro âmbar e haste cromada. Perfeito para iluminação sobre mesa de jantar ou balcão. Altura ajustável de 30 a 120cm.',
  485.00,
  true,
  false
FROM categorias WHERE slug = 'pendentes'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO produtos (codigo, nome, slug, categoria_id, descricao, preco, ativo, destaque)
SELECT
  'ARA-001',
  'Arandela Colonial Bronze',
  'arandela-colonial-bronze',
  id,
  'Arandela de parede estilo colonial com acabamento bronze envelhecido. Indicada para corredores e salas de estar.',
  320.00,
  true,
  false
FROM categorias WHERE slug = 'arandelas'
ON CONFLICT (codigo) DO NOTHING;
