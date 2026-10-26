> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Estrutura de repositório e responsabilidades

```text
alece/
├── compose.yaml                 # serviços, redes e volumes
├── docker/                      # Dockerfile, secrets-init, startup e logs
├── manage.py                    # CLI Django
├── src/
│   ├── web.py                   # declaração central de rotas WEB
│   ├── controller/
│   │   ├── config/              # settings, urls adapter, wsgi/asgi
│   │   └── apps/
│   │       ├── core/            # autenticação, usuário, auditoria, IA, health
│   │       └── finance/         # models, forms, views, serviços financeiros
│   ├── model/finance/domain/    # regras matemáticas puras, sem Django
│   ├── view/
│   │   ├── templates/           # HTML Django por recurso
│   │   └── static/              # CSS, JS, ícones e dependências vendorizadas
│   ├── requirements/           # produção/dev com locks
│   └── logs/                   # logs opt-in, não colocar segredos
├── tests/                       # auth, finance, imports, UI, ops etc.
├── docs/                        # ADRs, manutenção, segurança, histórico
├── scripts/                     # verificações e auditoria visual
└── .github/workflows/           # CI e release
```

## Sobre `public/`
A distribuição mais recente examinada não depende da pasta antiga `public/`; `MEDIA_ROOT` aponta para `media/` e `STATIC_ROOT` para `.staticfiles/`. `app_media` continua sendo o volume persistente no container. **Não remova volumes** ao reestruturar diretórios.

## Pontos de entrada e rastreamento
- Route: `src/web.py` → `config.urls` → `apps.core.urls` / `apps.finance.urls`.
- Alteração financeira: view → formulário → `services.*` → ORM → `TransactionBatch` / `JournalEntry`.
- Autenticação: views `core.auth_views`, modelo `UserProfile` e tabelas Django `auth_user`.
- Template: `src/view/templates/{finance,core,auth}/...`.

## Convenção de alterações
1. Alterar serviço/contrato com comportamento testável; não duplicar regras em JS.
2. Incluir testes regressivos no diretório de domínio.
3. Se schema mudar, criar migration sem destruir dados e definir rollback.
4. Documentar decisão em ADR e atualizar changelog quando a interface pública ou persistência mudar.
