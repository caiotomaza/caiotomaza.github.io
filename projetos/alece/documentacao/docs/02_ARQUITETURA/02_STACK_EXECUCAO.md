> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Stack, dependências e infraestrutura

## Stack comprovada no snapshot examinado
| Camada | Tecnologia / versão configurada | Evidência |
|---|---|---|
| Linguagem | Python no container definido em `docker/Dockerfile`; utilitário `secrets-init`: Python 3.12 Alpine | `docker/Dockerfile`, `compose.yaml` |
| Framework web | Django **5.2.18** | `src/requirements/production.lock` |
| Banco | PostgreSQL **16** Bookworm | `compose.yaml` (`postgres:16-bookworm`) |
| Driver | Psycopg **3.3.6** | lockfile de produção |
| Servidor WSGI | Gunicorn **23.0.0**, dois workers | `production.lock`, `docker/start.sh` |
| Static | WhiteNoise + Django Staticfiles | `config/settings.py` |
| Frontend | Django Templates, CSS e JavaScript próprios | `src/view` |
| Gráficos | artefato Chart.js local, onde referenciado | `src/view/static/vendor`, templates |
| Dependências | `pip-compile` / `production.lock` com hashes | `src/requirements` |
| Orquestração | Docker Compose, projeto `alece` | `compose.yaml` |
| Rede | bridge interna do Compose, banco sem porta publicada | `compose.yaml` |

**Conflito histórico:** textos de 18/10 citam PostgreSQL 18 e Python 3.13 para DevKit/proposta. O `compose.yaml` do código examinado usa PostgreSQL 16. Para implantar, prevalece a versão realmente construída e implantada, não a antiga descrição.

## Containers e persistência
- `secrets-init`: cria segredos persistentes no volume `app_secrets`, sem imprimi-los.
- `db`: PostgreSQL isolado na rede `internal`, volume `app_pgdata`.
- `web`: Django/Gunicorn, healthcheck `/saude/pronto/`; porta publicada em `ALECE_BIND_IP:ALECE_PORT`, valor padrão `127.0.0.1:8088`.
- `app_media`: arquivos de upload; `app_ai_tokens`: credenciais externas de IA; `app_financial_backups`: backups financeiros do serviço.
- `./src/logs:/app/src/logs`: registro opcional por inicialização, a partir de `ALECE_LOG_VALIDACAO`.

## Entradas HTTP e HTTPS
- A aplicação atende HTTP interno; um proxy reverso (ex.: Caddy) pode estabelecer HTTPS público, observando `ALLOWED_HOSTS`, origens CSRF e cabeçalhos encaminhados.
- PostgreSQL não deve ser exposto externamente.
- TLS e cookies seguros são requisitos para autenticação fora do loopback. Não indicar `ALECE_SECURE_COOKIES=false` como configuração de produção em HTTPS.

## Reprodutibilidade
O lockfile contém versões e hashes. Isso **não** garante que o build funcionará em arquiteturas não verificadas ou que a disponibilidade das dependências será eterna. Mantenha CI e auditoria de vulnerabilidades.
