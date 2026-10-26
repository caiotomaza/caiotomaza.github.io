> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Configuração operacional por ambiente

**Não distribua `.env` com segredos reais neste pacote documental.** A tabela abaixo descreve nomes de variáveis encontrados nos arquivos de configuração e/ou instruções do projeto. A disponibilidade exata depende da imagem executada.

| Variável | Propósito | Regra |
|---|---|---|
| `ALECE_BIND_IP` | interface publicada no host | padrão `127.0.0.1`; use proxy/TLS ao expor |
| `ALECE_PORT` | porta publicada | padrão `8088` no Compose |
| `ALECE_SECRET_KEY` / `_FILE` | assinatura Django | segredo de alta entropia e armazenamento privado |
| `ALECE_DB_PASSWORD` / `_FILE` | conexão PostgreSQL | não versionar senha |
| `ALECE_DB_NAME` | base de dados | `alece` por padrão |
| `ALECE_DB_USER` | usuário DB | `alece` por padrão |
| `ALECE_DB_HOST` / `ALECE_DB_PORT` | acesso DB | `db:5432` no Compose |
| `ALECE_DEBUG` | debug do framework | `false` em produção |
| `ALECE_ALLOWED_HOSTS` | hosts permitidos | alinhar com DNS/proxy |
| `ALECE_CSRF_TRUSTED_ORIGINS` | origins CSRF | URLs HTTPS exatas |
| `ALECE_SECURE_COOKIES` | flags Secure | habilitar sobre HTTPS |
| `ALECE_SECURE_PROXY_SSL` | cabeçalho HTTPS do proxy | usar somente com proxy confiável |
| `ALECE_LOG_VALIDACAO` | duplicação de logs por startup | `true` conforme padrão solicitado |
| `ALECE_LOG_LEVEL` | nível de logging | `INFO` por padrão |
| `ALECE_AI_SECRET_DIR` | volume privado das API keys | `/app/private/ai` no web |
| `ALECE_AI_ALLOWED_HOSTS` | allowlist de destino de IA | conferir implementação ativa |

## Contrato de segredos
`secrets-init` gera os valores em volume persistente; web e banco consomem arquivos montados. Ao migrar host ou restaurar dados, considere a integridade e a compatibilidade dos segredos. Nunca imprimi-los em log.

## Validação
`docker compose config` valida forma e interpolação; `manage.py check --deploy` é ferramenta adicional de avaliação de segurança (não substitui revisão). Sempre registrar hostname, versão do container e hash de artefato implantado.
