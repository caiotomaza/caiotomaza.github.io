> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# CI/CD, modelo de trabalho e governança

## Organização do trabalho
Fluxo recomendado baseado no repositório: issues curtas por domínio, PRs pequenos com descrição de risco, teste e migração, revisão técnica e rastreabilidade no changelog. ADRs para decisões que afetam dados, autorização, stack ou contratos externos.

## Pipeline observado
Há `.github/workflows/ci.yml` e `release.yml`, scripts em `scripts/`, lockfiles e testes modulares. Os nomes concretos dos jobs e condições devem ser conferidos no YAML da versão alvo; sua existência não significa execução em servidor.

## Regras de revisão
- Mudança de dinheiro: casos de arredondamento, fonte da verdade, idempotência, regressão com ledger e rollback.
- Mudança de autorização: ameaças IDOR e teste de papel em outro Workspace.
- Alteração visual: ao menos dois temas, desktop/mobile, teclado, contraste e SSR templates.
- Mudança de schema: migration reversível quando possível, plano expand/contract e backup.
- Dependência nova: justificativa, provenance, hashes e manutenção.

## Definition of Done
Código com testes locais e CI verde; docs atualizadas; telas funcionais e sem erro 500; auth/CSRF verificados; operação em banco isolado; deploy com backup; saúde validada; logs inspecionados; instruções de rollback. **Não declarar “100% validado” sem execução funcional.**

## Estratégia de release
Tag reprodutível, artefato com SHA-256, migrations listadas, risk notes, compatibilidade de volume, release notes e janela de aplicação. Em produção, testar versão em homologação antes de promover.
