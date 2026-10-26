> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Startup, healthchecks e condições de falha

## Sequência real identificada em `docker/start.sh`
1. Verifica acesso a `ALECE_SECRET_KEY` e `ALECE_DB_PASSWORD`, sem imprimir valores.
2. Executa `python manage.py check`.
3. **Executa migrations:** `python manage.py migrate --noinput` (muda o banco quando há migrations pendentes).
4. Confere migrations aplicadas: `migrate --check --noinput`.
5. Executa `python manage.py alece_startup_check` (leitura).
6. Inicia Gunicorn em 0.0.0.0:8000 com dois workers.

## O validador inspeciona
`reverse/resolve()` para rotas essenciais; carregamento de templates; estáticos essenciais; `SELECT 1` no banco; introspecção de tabelas Django por módulo; acesso de escrita a mídia e diretório de logs quando habilitado.

## Liveness versus readiness
- **Liveness:** processo/app responde; não comprova dependências funcionais.
- **Readiness:** endpoint `/saude/pronto/` inclui consulta ao PostgreSQL. Banco disponível não significa que cada CRUD/relatório foi testado.
- **Teste funcional:** separado em banco de testes com pytest/Django, sem rodar escrituras reais durante boot.

## Falha crítica
Startup aborta e registra diagnóstico; o container pode reiniciar conforme `restart: unless-stopped`. Não mascarar erro nem entrar em loop sem investigar logs/health e versão de migrations.

## Critério de aceitação realista
Nenhum teste garante operação 100%. O conjunto mínimo é: integridade do build, migrações coerentes, DB pronto, autorização, renderização das páginas, fluxos de pagamento/importação em ambiente isolado, exportação, auditoria e backup/restauração testada.
