> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Migrações, compatibilidade e evolução do esquema

O repositório observado possui migrações separadas para `apps.core` e `apps.finance`. Exemplos recentes: `core.0008_recovery_code_set`, `core.0009_one_active_ai_provider`, `finance.0011_financialprofile_deleted_at`. As migrations têm dependências e transições de schema; mantenha ordem e verifique o grafo com Django.

## Fluxo recomendado
1. Antes do deploy: identificar versão e migration atual; backup lógico consistente com SHA-256; validar capacidade de restore.
2. Executar `python manage.py check` e `python manage.py migrate --plan` em ambiente com dependências.
3. Simular upgrade numa cópia do banco com dados representativos, testando migrações e regras.
4. Aplicar sob janela de mudança; inspecionar logs e constraints.
5. Rodar `python manage.py migrate --check --noinput` e testes de leitura/escrita autorizados.
6. Para rollback com migração não reversível ou destrutiva, restaurar backup compatível em vez de invocar `migrate` às cegas.

## Risco operacional atual
`docker/start.sh` executa `migrate --noinput` automaticamente **antes** do validador read-only. Portanto, iniciar uma versão nova pode modificar o banco. A checagem de startup não substitui backup prévio. Não use `docker compose down -v`.

## Princípio expand/contract
Adicionar coluna nullable → popular via migration idempotente → código compatível → só depois, numa versão distinta, remover campo anterior. Ao alterar formato de dados portáveis, versionar schema e manter migração de formato explícita.
