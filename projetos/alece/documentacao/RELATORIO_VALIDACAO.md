# Relatório de validação da entrega documental

## Validações executadas

- ZIP original examinado: 30 entradas, materiais de documentação, portfólio e protótipo.
- Fonte original preservada byte a byte dentro de `fontes/docs-alece-original.zip`; SHA-256 recomputado e comparado.
- Análise estática de uma distribuição de código disponível na conversa; não foi executado Django.
- 26 classes ORM e 219 campos detectados por AST; catálogo com 100 chamadas `path()` literais, com ressalva de composição dinâmica.
- 12 arquivos SVG produzidos a partir dos DOTs e parseados como XML válido; 12 fontes Mermaid e 12 DOTs presentes.
- 30 capítulos Markdown examinados com pares de delimitadores de código balanceados.
- Índice e manual HTML foram parseados estruturalmente.
- Geração de arquivo MANIFESTO_SHA256.txt com checksums por arquivo.

## Testes não executados / limitações

- Django/PostgreSQL, login, CRUD, migrations e backup/restauração: **não executados**; esta é uma entrega documental.
- Teste visual em navegador real: a política do Chromium disponível bloqueou navegação a `file://` e a URL de prévia simulada; **não há aprovação de responsividade visual do manual HTML em Chromium**.
- Diagramas mostram relações simplificadas e não substituem validação de constraints em PostgreSQL.
- Catálogo de rotas obtido estaticamente; URLs construídas em loops Python não são completamente enumeradas.

## Resultado

A documentação gerada está íntegra em nível de arquivos, sintaxe de diagrama e estrutura HTML. **Não é comprovação do funcionamento do ALECE em produção**. Compare com o commit efetivamente implantado antes de tomar decisões de migração, configuração ou segurança.
