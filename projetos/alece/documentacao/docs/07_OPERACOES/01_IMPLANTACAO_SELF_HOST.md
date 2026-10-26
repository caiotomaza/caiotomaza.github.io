> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Implantação self-hosted e infraestrutura

## Premissas a confirmar
Host com Docker/Compose compatíveis, arquitetura e recursos suficientes, acesso administrativo, espaço em disco/backup, política de TLS e DNS. Os comandos abaixo são **referências para ambiente compatível identificado**, não autorização para executar em produção sem backup.

## Composição típica
1. `secrets-init` prepara `app_secrets` persistente.
2. `db` sobe PostgreSQL 16 e recebe healthcheck `pg_isready`.
3. `web` monta mídia, segredos e tokens, espera banco pronto e executa inicialização.
4. Gunicorn recebe HTTP interno na porta 8000; host padrão `127.0.0.1:8088`.
5. Proxy reverso opcional fornece TLS e expõe hostname público sem publicar a porta do banco.

## Passo a passo controlado
1. Identificar versão, `.env`, `docker compose config`, nome do projeto e volumes atuais.
2. Criar pg_dump consistente e backups de mídia/segredos e `app_ai_tokens`; registrar SHA-256 e testar restore em ambiente isolado.
3. Inspecionar diferenças de `compose.yaml` e migrações. NÃO fazer `down -v`.
4. Construir imagem em janela controlada; validar liveness/readiness e histórico de erros.
5. Conferir login, recuperação, telas financeiras, criação de perfil, autorização, importação em prévia, relatório e rotina de backup.
6. Manter versão anterior e procedimento de rollback disponíveis.

## Caddy/Pi-hole/VPS
O código distribuído **não** configura Caddy ou Pi-hole automaticamente. Em instalações do homelab, o proxy e DNS internos precisam ser documentados separadamente, sem assumir que `alece.com.br` já está funcional ou que todas as VPS compartilham mesma rede.

## Comunicação e persistência
`db` permanece só na rede Compose `internal`; volumes `app_pgdata`, `app_media`, `app_secrets`, `app_ai_tokens`, `app_financial_backups` e bind `src/logs` preservam estado distinto do container. Backup de volume físico e dump lógico atendem riscos diferentes.
