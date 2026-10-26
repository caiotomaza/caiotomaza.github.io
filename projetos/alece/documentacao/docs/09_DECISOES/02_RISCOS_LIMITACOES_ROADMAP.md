> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Riscos, limitações e roadmap técnico

## Riscos com evidência no código
- **Migrar no boot:** migrações podem alterar schema antes de healthchecks; exigir backup antes de deploy.
- **Múltiplos CSS:** regras superpostas podem introduzir regressões visuais em modal/tabela.
- **Permissões pós-importação:** todos os membros existentes ganham `edit` nos perfis importados; revisar conceito de privilégio mínimo.
- **Volumes independentes:** restaurar só PostgreSQL não restaura todos os arquivos e secrets.
- **Startup não cobre execução:** views e DB podem responder e ainda apresentar erro em CRUD específico.
- **IA personalizada:** endpoint externo é superfície de SSRF/vazamento; endurecer allowlist e logs.

## Melhorias recomendadas (NÃO DECLARAR IMPLEMENTADAS)
1. Revisar política de permissões pós-importação (opção mais segura: somente admin; grant posterior).
2. Pipeline completo de testes Django/PostgreSQL na CI com cobertura prioritária de auth, ledger e transferência.
3. Contract tests versionados do ZIP financeiro (`alece-financeiro` v1 → v2).
4. Testes de restore automatizados em DB descartável, com evidência de RPO/RTO.
5. Consolidação de tokens visuais e remoção de overrides redundantes.
6. Observabilidade sem dados sensíveis, alertas para loops de restart e erro 500.
7. Revisão de dependências e estratégia de atualização de Docker/Postgres.
8. Especificação de ameaças para AI, importação e downloads.

## Separação de cronologias
Protótipo HTML v1.32.1 é uma **revisão de interface/especificação** e não versão do servidor Django. Os documentos de 18/10 carregam decisões antigas; arquivos do código de 24/10 são a fonte de implementação inspecionada; nenhum dos dois representa necessariamente a versão que roda hoje em produção.
