> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Decisões de arquitetura e estado das evidências

## ADR-001 — monólito modular
**Decisão vigente:** um deploy Django + PostgreSQL; módulos internos por domínio, evitando microserviços prematuros. **Trade-off:** deploy único acopla disponibilidade; compensa com simplicidade de transações, backup e observabilidade.

## ADR-002 — valores monetários e ledger
`Decimal`/`NUMERIC`, pagamentos como eventos persistidos, transações atômicas e estorno por nova operação. **Trade-off:** modelo mais complexo que CRUD sobre um saldo, mas preserva histórico e facilita auditoria.

## ADR-003 — modelo MVT com diretórios MVC (síntese documental)
Django MVT mantido; pastas `src/model`, `src/view`, `src/controller` exprimem separação de responsabilidade. `src/web.py` é router central compatível com includes Django. Não há justificativa técnica para migrar tudo para classes genéricas ao custo de regressões.

## ADR-004 — autenticação offline
Conta por nome de usuário obrigatório e e-mail opcional; seis códigos de uso único hash-only; setup obrigatório. Impacto: exigência de armazenamento seguro no momento da emissão, sem suporte para leitura posterior.

## ADR-005 — exportação limitada por domínio
Formato portável JSON + XLSX + manifesto sem credenciais ou permissões da origem. Impacto: restore não reproduz integralmente estado administrativo.

## ADR-006 — IA informativa
Uma integração ativa por núcleo, com consentimento e segredos externos ao banco. Impacto: não é motor autônomo de execução financeira.

## Pendências de decisão
Retenção de logs, RPO/RTO formal, política de criptografia de backups, modelo de permissão pós-importação (atualmente concede edição aos membros existentes), suporte a upgrades entre versões do formato portável e política de host/SSRFi de integrações customizadas.

**Nota:** ADR-003 a 006 são **sínteses desta documentação**, não arquivos de ADR previamente aprovados pelo projeto. ADRs existentes na fonte incluem `docs/ADR/0001-modular-monolith.md` e `0002-money-ledger.md`.
