# ALECE — Manual técnico consolidado

Compilação por assunto; cada capítulo também está disponível isoladamente em `docs/`.

**Conferido em:** 25/10/2026. **Método:** leitura documental + inspeção estática de snapshot; sem execução em produção.


---

<!-- Fonte: docs/01_PRODUTO/01_IDENTIDADE_ESCOPO.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Identidade, propósito e contrato do produto

**ALECE Finance** é uma aplicação web de gestão financeira pessoal/familiar, planejada para execução **self-hosted**. O usuário hospeda o software, mantém os dados sob seu controle e pode inspecionar e alterar o código sob **GNU GPL-3.0-only**. O nome remete à história familiar narrada nos documentos do projeto; essa origem não implica associação institucional com entidades homônimas.

## Problema e proposta de valor
O produto evita confundir previsão financeira com dinheiro movimentado. Reúne renda planejada, saldos de contas, despesas recorrentes e eventuais, investimentos, metas, reserva, movimentações efetivas, importações e relatórios. Cada evento financeiro tem uma fonte de verdade em dados persistidos e deve ser auditável.

## Público e operação
- Pessoa individual ou grupo familiar em espaço financeiro (`Workspace`) com um ou mais usuários.
- Dois papéis de negócio: `admin` e `common`. Ser administrador de um espaço não concede acesso a outro.
- Até cinco perfis financeiros **ativos** por espaço, além de arquivados/históricos.
- Navegação em português brasileiro com rotas sem acentos: `/visao-geral/`, `/despesas/`, `/investimentos/`, `/movimentacoes/`, `/configuracoes/`.
- Interface em claro/escuro e controle de aparência associado ao usuário.

## Princípios normativos
1. **Estabilidade > confiabilidade > segurança > recuperabilidade > manutenibilidade > desempenho.**
2. **Privacidade por desenho:** o sistema não exige telemetria; envio a provedor externo de IA requer escolha e consentimento explícitos.
3. **Planejar não é executar:** cadastro de renda, contas ou compromissos não gera pagamento.
4. **Histórico auditável:** valores financeiros confirmados não devem ser apagados por correção silenciosa; usar estorno/correção rastreável.
5. **Autorização no servidor** por usuário, espaço, perfil, módulo e objeto; esconder botões não equivale a controlar acesso.
6. **Portabilidade:** Docker Compose é o alvo operacional, sem dependência indispensável de um servidor ZimaOS específico.

## Fora do escopo desta documentação
Não é garantia de retorno financeiro, conciliação automática sem supervisão, auditoria regulatória, política de privacidade jurídica nem laudo de pentest. A especificação v1.32.1 inclui decisões históricas que podem não ter sido materializadas.

## Evidências e trilha
- Fontes anexadas: `ALECE_Contexto_Integral_para_Gemini_2026-10-18.md`, `ALECE_Documentacao_Completa_Engenharia_2026-10-18.md`, `documentacao-tecica_v1.32.1.md`.
- Código conferido: `README.md`, `docs/PRODUCT.md`, `src/web.py`, `src/controller/apps/finance/models.py`.


---

<!-- Fonte: docs/01_PRODUTO/02_MATRIZ_FUNCIONAL.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Mapa funcional por página, regra e persistência

| Área | Finalidade | Casos de uso / ações | Evidência de código |
|---|---|---|---|
| Visão geral | panorama e renda consolidada | saldo informado, compromissos do mês, Resumo, gráficos, renda, contas | `apps.finance.public_routes`, `views`, `services.metrics` |
| Despesas | planejar e consultar gastos | CRUD de previsíveis, imprevisíveis, categorias, competências, filtro de mês | `views.record_edit/delete`, `models.RecurringExpense`, `UnexpectedExpense`, `MonthlyExpense` |
| Investimentos | patrimônio e objetivos | posições, categorias fixas, aplicações/resgates, metas e reserva | `InvestmentPosition`, `ReservePolicy`, `transaction_views`, `services.planning` |
| Movimentações | execução e conferência | pagar, transferir, estornar, importar, revisar e confirmar | `TransactionBatch`, `LedgerLeg`, `JournalEntry`, `import_views` |
| Configurações | identidade e administração | conta, usuários, perfis, permissões, provedores de IA, logs, relatórios | `settings_views`, `user_views`, `permissions`, templates core |
| Logs | auditoria e diagnóstico | filtrar, detalhar, identificar incidentes | `SystemLog`, `core.views`, `/logs/` |
| Relatórios | panoramas e transferência | DRE, patrimônio, investimentos, metas, exportação XLSX/JSON | `reports_views`, `financial_transfer_views` |

## Operações de escrita / leitura
Um formulário de cadastro apresenta uma intenção de escrita. Para efetivar um débito, a aplicação precisa validar permissões, integridade de saldo, conta, perfil, competência e idempotência no backend. Gráficos usam dados confirmados quando assim declarados; cadastros ainda não pagos não são eventos de ledger.

## UX consolidada
- Modais Django para criação e edição, com tratamento de envio, confirmação e responsividade.
- Componentes de tabela dentro de cartões; cabeçalho e ações alinhados, distanciamento interno consistente.
- Campos `select`, `checkbox`, datas e ações obedecem aos tokens de tema.
- Importação bancária inicia após seleção/arraste do arquivo e segue para **prévia**, não para confirmação financeira automática.

## Estado da verificação
Os arquivos citados estão presentes no snapshot auditado. Um item existir como rota ou template não comprova cobertura end-to-end nem êxito no PostgreSQL real; ver `08_QUALIDADE/01_ESTRATEGIA_TESTES.md`.


---

<!-- Fonte: docs/02_ARQUITETURA/01_ESTILO_CAMADAS.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Estilo arquitetural e fronteiras

**Padrão principal:** monólito modular Django com PostgreSQL, organizado por áreas de domínio (`core`, `finance`) e serviços de aplicação. É uma decisão deliberada para permitir transações financeiras dentro de um único banco, operação mais simples e recuperação controlada. Não é um conjunto de microsserviços.

## MVT versus MVC
A tecnologia Django define **Model–View–Template (MVT)**:
- **Model:** dados e mapeamento ORM; constraints e migrações Django, sobretudo `apps.finance.models` e `apps.core.models`.
- **View Django:** controlador da requisição HTTP: autenticação, validação, montagem do contexto e resposta. Conceitualmente assume parte do **Controller** do MVC tradicional.
- **Template:** camada de apresentação HTML. Não executa SQL, lançamento financeiro ou autorização independente.

O repositório também tem diretórios `src/model`, `src/view` e `src/controller`; esses nomes traduzem responsabilidades, mas **não transformam Django em um framework MVC puro**. O roteador `src/web.py` agrupa URL patterns como conveniência similar a Laravel, sem substituição do mecanismo oficial de URLconf e `reverse()`.

## Mapa de execução
1. Browser envia HTTP com sessão e proteção CSRF.
2. Django resolve `src/web.py` / includes de apps e passa por middleware.
3. View identifica usuário e objeto, avalia autorização e chama formulário/serviço.
4. Serviço de aplicação mantém transação, bloqueios e validações relevantes.
5. Modelos ORM persistem no PostgreSQL; cálculos puros usam `Decimal`.
6. Template renderiza resultado ou o serviço retorna documento / download.

## Padrões observados e responsabilidade
| Padrão | Aplicação observada | Cuidado |
|---|---|---|
| Modular monolith | apps `core`, `finance` | preservar fronteira sem rede entre módulos |
| MVT/MVC adaptado | views HTTP, templates, models | controller não conter transação financeira extensa |
| Service layer | `apps.finance.services.*` | validação central, autorização por objeto |
| Domain model / funções puras | `src/model/finance/domain`, `apps.finance.domain` | preferir `Decimal` e testes isolados |
| Transactional consistency | `transaction.atomic`, ledger e estornos | impedir gravações parciais |
| Idempotency | chaves em `TransactionBatch` e `ImportRow` | verificar concorrência e repetição |
| Audit trail | `SystemLog`, batches e journal | separar operação de usuário de evento de diagnóstico |
| Adapter/pipeline | parsing CSV, OFX, PDF, staging | tratar input externo como não confiável |
| Soft delete/arquivamento | perfis, contas, vínculos | preservar integridade histórica |
| Configuration via environment | settings e volumes de segredos | nunca comitar credenciais reais |

## Regras entre camadas
- View não deve alterar `BankAccount.balance` arbitrariamente.
- Serviço não deve conhecer CSS, HTML ou DOM.
- Autorização **não** deve depender de estado de checkbox do frontend.
- Integração com IA não pode alterar lançamentos apenas por responder com uma análise.
- `src/model/` abriga domínio puro, não um segundo ORM paralelo ao Django.

**Referências:** `docs/ARCHITECTURE.md`, `docs/ARCHITECTURE_MVC.md`, `src/web.py`, `apps.finance.services.ledger`.


---

<!-- Fonte: docs/02_ARQUITETURA/02_STACK_EXECUCAO.md -->
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


---

<!-- Fonte: docs/02_ARQUITETURA/03_ESTRUTURA_REPOSITORIO.md -->
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


---

<!-- Fonte: docs/03_DOMINIO/01_GLOSSARIO_INVARIANTES.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Glossário financeiro e invariantes

| Termo | Definição operacional | Não confundir com |
|---|---|---|
| Núcleo (`Workspace`) | fronteira de dados e permissões | perfil financeiro ou usuário |
| Perfil (`FinancialProfile`) | unidade de renda, contas, gastos e metas | identidade de login |
| Renda mensal | premissa orçamentária do perfil | crédito bancário |
| Saldo conhecido (`0`) | montante efetivamente informado como zero | não informado (`NULL`) |
| Despesa previsível | compromisso cadastrado por categoria e dia de vencimento | pagamento confirmado |
| Competência (`YYYY-MM`) | período contábil de obrigação | timestamp de execução |
| Despesa imprevisível | gasto avulso com data do evento | previsão mensal |
| Posição de investimento | patrimônio aplicado/atual estimado | aplicação ou resgate transacional |
| Reserva | objetivo prudencial calculado sobre despesas essenciais | conta bancária ou investimento automaticamente criado |
| Movimentação (`TransactionBatch`) | agrupamento de evento financeiro real | formulário de cadastro |
| Lançamento (`LedgerLeg`, `JournalEntry`) | efeitos contábeis de um evento | UI do gráfico |
| Estorno | evento vinculado que compensa o efeito anterior | DELETE do registro original |

## Invariantes a preservar
1. **Precisão:** armazenar dinheiro em `Decimal` / PostgreSQL `NUMERIC`. Não usar `float` para fonte de verdade.
2. **Sem dupla contagem:** obrigação paga já debitou a conta e não deve ser descontada novamente da projeção.
3. **`NULL != 0`:** campo ausente deve continuar sendo desconhecido, inclusive em gráficos e totais derivados.
4. **Saldo não negativo quando aplicável:** restrição `ck_account_nonnegative` e validação de débito por saldo disponível.
5. **Contas do mesmo perfil:** pagamentos divididos e transferências precisam garantir mesma fronteira do perfil autorizada.
6. **Atômico:** conjunto de pernas contábeis é validado e persistido ou revertido integralmente.
7. **Idempotente:** repetição de requisição/arquivo não pode criar evento financeiro duplicado.
8. **Estorno auditável:** criar contrapartida, manter vínculo `reversal_of` e trilha original.
9. **Permissões por objeto:** recurso fora do espaço/perfil autorizado não é editável por URL direta.
10. **Sem ação financeira por IA:** provedores só devolvem análise; backend controla lançamentos e consentimento.

## Fórmulas documentadas
- **Pendente de obrigação:** `max(0, obrigação do mês − soma dos pagamentos confirmados vinculados)`.
- **Projeção de caixa:** `saldo atual conhecido − total de compromissos ainda não confirmados e não debitados`.
- **Meta de Reserva:** `despesas essenciais mensais × meses de cobertura` (padrão nove; permitido de seis a doze).
- **Montante disponível para investimento:** parte da renda após despesas e prioridade de proteção; método específico depende de `planning.py` / parâmetros ativos.

## Testes de invariantes
Inclua casos de saldo desconhecido versus zero, vencimento no dia 31 em fevereiro, múltiplas contas, valores decimais, duas confirmações concorrentes, estorno parcial, transação estornada duas vezes, importação repetida e metas sem renda cadastrada.


---

<!-- Fonte: docs/03_DOMINIO/02_USUARIOS_PERFIS_PERMISSOES.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Identidades, núcleos, perfis e autorização

## Separação de identidades
`auth.User` é a conta de login. `UserProfile` guarda preferências complementares. `Workspace` limita a operação financeira; `WorkspaceMembership` vincula usuário e papel (`admin`/`common`). `FinancialProfile` guarda saldo, renda e vínculos financeiros. `ProfileGrant` concede acesso entre membership e perfil.

## Matriz por módulo
Cada grant contém níveis `none`, `view`, `edit` para `overview`, `accounts`, `expenses`, `investments` e `movements`. `edit` pressupõe leitura. Os checkboxes **Visualizar** e **Editar** são controles de interface para aplicar níveis em massa; o backend deve validar os níveis de cada módulo.

## Regras de acesso
- Administrador de núcleo: gerencia seu espaço e seus perfis, não ganha direitos em outros espaços.
- Usuário comum: só entra em perfil e módulo com grant explícito.
- O alvo de qualquer URL com `profile_id`, `workspace_id`, `account_id` ou `membership_id` precisa ser verificado no servidor.
- Arquivamento: o perfil deixa de aparecer nas operações ativas, preservando histórico.
- Exclusão lógica: `FinancialProfile.deleted_at` registra remoção de uso normal sem quebrar referências do ledger.
- A exclusão administrativa de usuário preserva identidade técnica anonimizável quando necessária para auditoria.

## Recuperação de conta
Recuperação por **seis códigos de uso único** gerados na emissão. O armazenamento inclui `code_hash`, `slot`, `used_at`; os originais não podem ser relidos após confirmados. O primeiro cadastro exige geração; copiar e baixar `txt` ocorre na emissão. Não é correto oferecer um botão de "ver códigos antigos".

## Login
Nome de usuário é obrigatório. E-mail é opcional e, se cadastrado de forma única, também pode identificar o usuário na autenticação; senha continua verificada pelo Django. Limites de tentativas ficam registrados sem salvar senhas digitadas.

## Fluxo de segurança
Autenticar → resolver espaço/perfil → verificar papel → verificar grant por módulo → validar vínculo de objeto → executar serviço → registrar auditoria. **Nunca** antecipar permissões apenas por checkbox do navegador.

## Casos negativos
- Usuário A tenta editar o perfil de outro núcleo → negar.
- Usuário comum tenta abrir `/configuracoes/api/` → negar.
- Usuário bloqueado tenta login por e-mail → negar.
- Seis códigos usados/expirados → negar reutilização.
- Conta desativada → bloquear sessão ou ações conforme política do backend.


---

<!-- Fonte: docs/03_DOMINIO/03_LEDGER_CONTAS_ESTORNOS.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Ledger, contas e integridade transacional

## Modelo de execução
`TransactionBatch` descreve o evento e vínculos (despesa, investimento, competência, estorno). `LedgerLeg` representa delta em conta. `JournalEntry` suporta efeitos contábeis e reconciliação. O serviço transacional `apps.finance.services.ledger` é a entrada preferida para alterações de saldo.

## Exemplo de pagamento dividido
Obrigação R$ 150,00. Conta A possui R$ 100,00 e Conta B R$ 80,00. Alocações solicitadas: A = 90, B = 60. O serviço deve validar saldo conhecido, perfil, autorização e correspondência da soma com o valor liquidado. O commit registra batch e efeitos em uma única transação. A UI só informa o resultado após a confirmação.

## Transferência interna
Transferir R$ 75,00 de A para B muda dois saldos, mas não configura receita nem despesa. O batch deve balancear as pernas correspondentes e preservar a unidade do perfil financeiro. Não incluir em gastos consumidos.

## Estorno
Em vez de excluir registro confirmado, criar evento `reversal_of`, manter histórico original e aplicar efeitos contrários. Validar que o lote de origem existe, pertence ao perfil, é reversível e não foi revertido antes. Em importação, estorno deve preservar vínculo da linha que gerou o lançamento.

## Idempotência e concorrência
Há campos `idempotency_key` em `TransactionBatch` e `ImportRow`. A camada de serviço deve coordenar unicidade no banco, bloqueios (`select_for_update` quando apropriado), `transaction.atomic()` e rejeição explícita de duplicações; uma chave sozinha não substitui tratamento completo de corrida.

## Anti-padrões
- `balance -= amount` em uma view fora de transação.
- Alterar ledger postado por `save()` manual de admin.
- Tratar `balance=None` como saldo disponível.
- Recalcular histórico antigo com regra nova e sobrescrever sem trilha.
- Importar `created_by` arbitrário de uma instalação externa.

## Evidências
`finance/models.py` (`TransactionBatch`, `LedgerLeg`, `JournalEntry`) e `finance/services/{ledger,accounts,records}.py`.


---

<!-- Fonte: docs/03_DOMINIO/04_IMPORTACAO_BANCARIA.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Ingestão CSV, OFX e PDF e conciliação

## Etapas
1. **Entrada não confiável:** arquivo escolhido ou arrastado, validado por tamanho, extensão e, no servidor, conteúdo.
2. **Parse:** adaptadores para CSV, OFX e PDF normalizam data, sinal, valor `Decimal`, descrição, conta e referência externa.
3. **Staging:** criar `ImportBatch` e `ImportRow` em estado de prévia; nenhum lançamento confirmado.
4. **Revisão humana:** ajustar categorias, contas, datas, sinal, vínculo de despesa/investimento e remover linhas que não devem entrar.
5. **Verificação:** simulação (`dry_run`), deduplicação, permissão, saldo e idempotência.
6. **Commit:** lote confirmado em `transaction.atomic`, gerando batches/lançamentos e trilha de auditoria.
7. **Pós-processamento:** relatório de inclusões, descartes, duplicatas, divergências e erros; estorno por contrapartida quando necessário.

## Limites e comportamento
O upload web atual apresenta uma área dropzone, envio automático após selecionar e redirecionamento para revisão. O limite reportado para essa interação é 5 MiB por arquivo; outros fluxos (transferência financeira completa) têm limites próprios. O servidor é a fonte final de validação; confiar apenas em extensão ou `accept` do input é inseguro.

## Deduplicação
Priorizar identificador bancário estável. Complementar com conta, data, quantidade de centavos, referência e fingerprint. A identidade do arquivo isoladamente não basta: o mesmo extrato pode ser reexportado com nome/codificação distinta. Rejeitar ambiguidade ao invés de confirmar silenciosamente.

## PDF
Extração PDF real não deve ser confundida com simulação do protótipo HTML histórico v1.32.1; cobertura final depende de validar parser e conteúdo no serviço `finance/services/importers.py` da versão alvo. OCR é último recurso.

## Ameaças e validação
CSV injection no XLSX, ZIP bombs, caminho de arquivo, strings malformadas, caracteres estranhos, datas inválidas, valores desproporcionais, duplicação concorrente e anexos contendo dados pessoais. O fluxo não deve enviar arquivos para IA sem consentimento.

## Evidências
`finance/services/{importers,imports,categorization}.py`, `finance/import_views.py`, modelos `ImportBatch`, `ImportRow`, `CategorizationRule`, `CategorizationRuleVersion`.


---

<!-- Fonte: docs/03_DOMINIO/05_INVESTIMENTOS_RESERVA.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Investimentos, renda, planejamento e Reserva

## Categorias de investimento
1. **Desenvolvimento pessoal e profissional** (`development`).
2. **Aquisição patrimonial** (`patrimony`).
3. **Consumo planejado** (`planned`).
4. **Reserva** (`reserve`).

A posição de investimento armazena aplicado, valor atual, data e meta opcional (não permitida como meta manual para Reserva). Cadastro de posição **não debita conta**. Aplicação/resgate efetivo usa movimentação própria autorizada.

## Despesas previsíveis
Categorias `essential`, `strategic` e `discretionary`, vencimento de 1 a 31; último dia válido nos meses menores. Despesa imprevisível tem ocorrência concreta com data.

## Reserva
`ReservePolicy.coverage_months` varia de 6 a 12 e usa padrão 9. O cálculo conceitual é despesa essencial mensal × meses de cobertura. Se faltar renda/despesa essencial de referência, indicar incompletude e não fabricar projeção a partir de zero.

## Renda e orçamento
`FinancialProfile.monthly_income` é nullable. `None` é desconhecido, 0 significa conhecido igual a zero. A distribuição mensal sugerida prioriza proteção da Reserva, seguida de objetivos. `MonthlyExpense` e `MonthlyInvestmentPlan` tratam competências e compromissos mensais.

## Casos de teste
Meta de Reserva automática; renda não informada; despesa essencial ausente; investimento com valor atual inferior ao aplicado; resgate maior que posição; aplicação de conta sem saldo conhecido; dois perfis distintos; mês com 28/29 dias.


---

<!-- Fonte: docs/03_DOMINIO/06_IA_PRIVACIDADE.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Integrações de IA e privacidade de dados

## Papel da IA
O ALECE oferece análises informativas para despesas, investimentos e movimentações. Um provedor não deve criar, alterar, cancelar ou confirmar eventos de ledger. A análise passa por integração HTTP do backend, com envio JSON controlado e consentimento informado.

## Gestão de provedores
Modelos `AIProviderConfig` e `AIAnalysis`. Presets documentados: OpenAI, Gemini, DeepSeek, Groq, Mistral e OpenRouter, além de endpoint personalizado compatível. Endpoint/modelo predefinidos quando possível; chave privada armazenada fora do PostgreSQL no volume `app_ai_tokens` / `/app/private/ai`. Não incluir tokens em HTML, URL, logs ou exportação financeira.

## Seleção exclusiva
A interface permite múltiplos cadastros, mas **uma integração ativa por Workspace**. A migração `core.0009_one_active_ai_provider` aplica exclusividade no banco. Alterar a seleção deve desabilitar o anterior em transação consistente e registrar a operação.

## Política de envio
- Antes do POST externo: mostrar destinatário e escopo dos dados; obter consentimento específico.
- Permitir apenas destinos autorizados (`ALECE_AI_ALLOWED_HOSTS`, onde aplicável), validar HTTPS e bloquear SSRF.
- Minimizar campos pessoais; nunca incluir senha, recovery codes, cookies, tokens, detalhes de sessão ou logs.
- Tratar saída da IA como **texto não confiável**; não renderizar HTML bruto nem executar comandos sugeridos.
- Preferir timeout, limite de tamanho, registros redigidos e falha controlada.

## Ameaças
SSRF por endpoint personalizado, prompt injection em extratos, vazamento de dados em prompt, excesso de permissão, formato JSON arbitrário e alucinação financeira. Esses pontos são requisitos de revisão contínua, não provas de segurança já certificada.

## Evidência
`core/ai_catalog.py`, `ai_credentials.py`, `ai_service.py`, `settings_views.py`, `models.py` e migração 0009.


---

<!-- Fonte: docs/03_DOMINIO/07_TRANSFERENCIA_FINANCEIRA.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Exportação e importação financeira portável

## Contrato da exportação
O sistema gera um ZIP lógico que contém `financeiro.json` (versão `alece-financeiro` v1, importável), `leitura_financeira.xlsx` (leitura humana), `manifesto.json` (SHA-256 e contagens) e `LEIA_ME.txt`. O XLSX **não é** o arquivo restaurado.

## 14 entidades transferidas
`FinancialProfile`, `BankAccount`, `RecurringExpense`, `UnexpectedExpense`, `InvestmentPosition`, `ReservePolicy`, `MonthlyExpense`, `MonthlyInvestmentPlan`, `TransactionBatch`, `LedgerLeg`, `JournalEntry`, `ImportBatch`, `ImportRow`, `CategorizationRule`.

## Exclusões intencionais
NÃO transferir `auth.User`, `WorkspaceMembership`, `ProfileGrant`, `SystemLog`, `RecoveryCode`, segredos, chaves de IA, sessões, versões de regras e histórico operacional de exportação. Campos `created_by` são reatribuídos quando exigidos; autoria histórica **não é reconstituída**.

## Restauração no destino
1. Admin do espaço escolhe ZIP e confirma `IMPORTAR`.
2. Servidor valida limites, formato, manifesto, hashes, referências e schema.
3. Cria backup financeiro pré-importação, protegido por SHA-256, fora do request público.
4. Reconstitui novos IDs para perfis/contas/lotes, preservando ligações de negócio.
5. Importa de forma **aditiva** sob transação. Resolve nomes conflitantes com sufixo; perfis que excedem cinco ativos ficam arquivados.
6. Não traz permissões anteriores. **Por decisão implementada, membros já existentes no espaço de destino recebem acesso de edição aos perfis importados.** O administrador deve revisar imediatamente esse acesso. Essa política é deliberadamente permissiva e merece avaliação de risco antes de produção.

## Limites documentados
Arquivo ZIP até 25 MiB, total descompactado 65 MiB e 100.000 registros no formato atual. Verificar implementações exatas no ambiente instalado.

## Ressalva de recuperação
Um ZIP financeiro portável **não substitui** um dump consistente do PostgreSQL, backup de volumes, secrets e definição de serviço. Não contém auditoria/identidades, e não é rollback de toda a aplicação.

## Fonte
`finance/services/financial_transfer.py`, `financial_xlsx.py`, `financial_transfer_views.py`, `docs/TRANSFERENCIA_FINANCEIRA_COMPLETA_2026-10-24.md`.


---

<!-- Fonte: docs/04_DADOS/01_MODELO_RELACIONAL.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Modelagem de dados: conceitos, relacionamentos e integridade

## Modelo conceitual
Identidade de login e autorização são independentes do patrimônio. `Workspace` agrega vários `FinancialProfile`. `WorkspaceMembership` conecta usuário ao espaço, atribui papel e recebe permissões de módulo por `ProfileGrant`. Cada perfil tem contas, despesas, posições e eventos financeiros; movimentações pertencem ao perfil, às contas e, quando aplicável, à obrigação/investimento correspondente.

## Agregados relevantes
- **Identidade:** User → UserProfile / RecoveryCode / AuthenticationAttempt; membership em Workspace.
- **Patrimônio:** FinancialProfile → BankAccount, InvestmentPosition, ReservePolicy.
- **Planejamento:** RecurringExpense, UnexpectedExpense, MonthlyExpense, MonthlyInvestmentPlan.
- **Execução:** TransactionBatch → LedgerLeg e JournalEntry; vínculos com despesa/investimento e `reversal_of`.
- **Importação:** ImportBatch → ImportRow, CategorizationRule / Version.
- **Auditoria:** SystemLog com referências de usuário, espaço, perfil e ação; independente de ledger financeiro.
- **IA:** AIProviderConfig por Workspace; AIAnalysis armazena análise vinculada às referências permitidas.

## Chaves e vínculos
São usados `ForeignKey` com `PROTECT` em entidades financeiras para impedir exclusão de um objeto ainda referenciado, `CASCADE` em associações derivadas apropriadas e unicidade para membership, nome de perfil por espaço, conta por perfil e idempotência. Consulte o dicionário gerado `02_DICIONARIO_ORM_GERADO.md` para tipos reais e nulabilidade.

## Constraints de referência
Exemplos da base inspecionada: `uq_member_user`, `uq_profile_workspace_name`, `uq_member_profile_grant`, `uq_account_profile_name`, `ck_account_nonnegative`, `ck_recurring_due_day_range`, `ck_reserve_months_range`. Uma constraint no DB é proteção suplementar, não substituto da validação de caso de uso.

## Quadro conceitual versus físico
O desenho `diagramas/04_modelo_entidades.svg` é **simplificado** para leitura. Não inclui todas as 23+ classes/colunas. O inventário físico gerado por AST é a referência precisa dos campos declarados no snapshot; só migrations efetivamente aplicadas confirmam o esquema do servidor.


---

<!-- Fonte: docs/04_DADOS/02_DICIONARIO_ORM_GERADO.md -->
# Dicionário de modelos ORM (gerado automaticamente)

> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.


> **Método:** leitura sintática do AST de `apps/core/models.py` e `apps/finance/models.py` no snapshot de código auditado. Os campos são **declarações Python**; o estado real das tabelas depende das migrations aplicadas ao banco. Campos automáticos `id` e relacionamentos reversos não aparecem aqui.

## Índice de modelos
**26 classes ORM** e **219 campos explicitamente declarados**.

- `finance.Workspace` — 3 campos
- `finance.WorkspaceMembership` — 3 campos
- `finance.FinancialProfile` — 7 campos
- `finance.ProfileGrant` — 9 campos
- `finance.BankAccount` — 7 campos
- `finance.RecurringExpense` — 6 campos
- `finance.UnexpectedExpense` — 5 campos
- `finance.InvestmentPosition` — 9 campos
- `finance.ReservePolicy` — 2 campos
- `finance.TransactionBatch` — 16 campos
- `finance.LedgerLeg` — 3 campos
- `finance.MonthlyExpense` — 5 campos
- `finance.MonthlyInvestmentPlan` — 5 campos
- `finance.JournalEntry` — 5 campos
- `finance.ImportBatch` — 15 campos
- `finance.ImportRow` — 19 campos
- `finance.CategorizationRule` — 16 campos
- `finance.CategorizationRuleVersion` — 13 campos
- `finance.ReportExport` — 13 campos
- `core.UserProfile` — 8 campos
- `core.RecoveryCode` — 5 campos
- `core.AuthenticationAttempt` — 3 campos
- `core.BootstrapToken` — 6 campos
- `core.SystemLog` — 18 campos
- `core.AIProviderConfig` — 9 campos
- `core.AIAnalysis` — 9 campos

## Declarações por entidade

### `finance.Workspace`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `name` | `CharField` | `—` | `False` | `False` | `—` |
| `created_by` | `ForeignKey` | `settings.AUTH_USER_MODEL` | `False` | `False` | `—` |
| `created_at` | `DateTimeField` | `—` | `False` | `False` | `—` |

### `finance.WorkspaceMembership`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `workspace` | `ForeignKey` | `Workspace` | `False` | `False` | `—` |
| `user` | `ForeignKey` | `settings.AUTH_USER_MODEL` | `False` | `False` | `—` |
| `role` | `CharField` | `—` | `False` | `False` | `Role.COMMON` |

### `finance.FinancialProfile`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `workspace` | `ForeignKey` | `Workspace` | `False` | `False` | `—` |
| `name` | `CharField` | `—` | `False` | `False` | `—` |
| `emoji` | `CharField` | `—` | `False` | `False` | `—` |
| `monthly_income` | `DecimalField` | `—` | `True` | `False` | `—` |
| `is_archived` | `BooleanField` | `—` | `False` | `False` | `False` |
| `deleted_at` | `DateTimeField` | `—` | `True` | `False` | `—` |
| `created_at` | `DateTimeField` | `—` | `False` | `False` | `—` |

### `finance.ProfileGrant`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `membership` | `ForeignKey` | `WorkspaceMembership` | `False` | `False` | `—` |
| `profile` | `ForeignKey` | `FinancialProfile` | `False` | `False` | `—` |
| `can_view` | `BooleanField` | `—` | `False` | `False` | `True` |
| `can_edit` | `BooleanField` | `—` | `False` | `False` | `False` |
| `overview_level` | `CharField` | `—` | `False` | `False` | `Level.NONE` |
| `accounts_level` | `CharField` | `—` | `False` | `False` | `Level.NONE` |
| `expenses_level` | `CharField` | `—` | `False` | `False` | `Level.NONE` |
| `investments_level` | `CharField` | `—` | `False` | `False` | `Level.NONE` |
| `movements_level` | `CharField` | `—` | `False` | `False` | `Level.NONE` |

### `finance.BankAccount`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `profile` | `ForeignKey` | `FinancialProfile` | `False` | `False` | `—` |
| `name` | `CharField` | `—` | `False` | `False` | `—` |
| `kind` | `CharField` | `—` | `False` | `False` | `Kind.BANK` |
| `balance` | `DecimalField` | `—` | `True` | `False` | `—` |
| `opening_balance` | `DecimalField` | `—` | `True` | `False` | `—` |
| `is_archived` | `BooleanField` | `—` | `False` | `False` | `False` |
| `created_at` | `DateTimeField` | `—` | `False` | `False` | `—` |

### `finance.RecurringExpense`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `profile` | `ForeignKey` | `FinancialProfile` | `False` | `False` | `—` |
| `name` | `CharField` | `—` | `False` | `False` | `—` |
| `category` | `CharField` | `—` | `False` | `False` | `—` |
| `amount` | `DecimalField` | `—` | `False` | `False` | `—` |
| `due_day` | `PositiveSmallIntegerField` | `—` | `False` | `False` | `—` |
| `is_active` | `BooleanField` | `—` | `False` | `False` | `True` |

### `finance.UnexpectedExpense`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `profile` | `ForeignKey` | `FinancialProfile` | `False` | `False` | `—` |
| `name` | `CharField` | `—` | `False` | `False` | `—` |
| `amount` | `DecimalField` | `—` | `False` | `False` | `—` |
| `recorded_on` | `DateField` | `—` | `False` | `False` | `—` |
| `created_at` | `DateTimeField` | `—` | `False` | `False` | `—` |

### `finance.InvestmentPosition`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `profile` | `ForeignKey` | `FinancialProfile` | `False` | `False` | `—` |
| `name` | `CharField` | `—` | `False` | `False` | `—` |
| `institution` | `CharField` | `—` | `False` | `False` | `—` |
| `category` | `CharField` | `—` | `False` | `False` | `—` |
| `applied_amount` | `DecimalField` | `—` | `False` | `False` | `Decimal('0.00')` |
| `current_value` | `DecimalField` | `—` | `False` | `False` | `Decimal('0.00')` |
| `target_amount` | `DecimalField` | `—` | `True` | `False` | `—` |
| `is_active` | `BooleanField` | `—` | `False` | `False` | `True` |
| `recorded_on` | `DateField` | `—` | `True` | `False` | `—` |

### `finance.ReservePolicy`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `profile` | `OneToOneField` | `FinancialProfile` | `False` | `False` | `—` |
| `coverage_months` | `PositiveSmallIntegerField` | `—` | `False` | `False` | `9` |

### `finance.TransactionBatch`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `profile` | `ForeignKey` | `FinancialProfile` | `False` | `False` | `—` |
| `kind` | `CharField` | `—` | `False` | `False` | `—` |
| `amount` | `DecimalField` | `—` | `False` | `False` | `—` |
| `occurred_on` | `DateField` | `—` | `False` | `False` | `—` |
| `competence_month` | `DateField` | `—` | `True` | `False` | `—` |
| `note` | `CharField` | `—` | `False` | `False` | `—` |
| `created_by` | `ForeignKey` | `settings.AUTH_USER_MODEL` | `True` | `False` | `—` |
| `investment_applied_delta` | `DecimalField` | `—` | `False` | `False` | `Decimal('0.00')` |
| `idempotency_key` | `CharField` | `—` | `True` | `True` | `—` |
| `recurring_expense` | `ForeignKey` | `RecurringExpense` | `True` | `False` | `—` |
| `monthly_expense` | `ForeignKey` | `'MonthlyExpense'` | `True` | `False` | `—` |
| `monthly_investment_plan` | `ForeignKey` | `'MonthlyInvestmentPlan'` | `True` | `False` | `—` |
| `unexpected_expense` | `ForeignKey` | `UnexpectedExpense` | `True` | `False` | `—` |
| `investment` | `ForeignKey` | `InvestmentPosition` | `True` | `False` | `—` |
| `reversal_of` | `OneToOneField` | `'self'` | `True` | `False` | `—` |
| `created_at` | `DateTimeField` | `—` | `False` | `False` | `—` |

### `finance.LedgerLeg`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `batch` | `ForeignKey` | `TransactionBatch` | `False` | `False` | `—` |
| `account` | `ForeignKey` | `BankAccount` | `False` | `False` | `—` |
| `delta` | `DecimalField` | `—` | `False` | `False` | `—` |

### `finance.MonthlyExpense`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `profile` | `ForeignKey` | `FinancialProfile` | `False` | `False` | `—` |
| `recurring_expense` | `ForeignKey` | `RecurringExpense` | `False` | `False` | `—` |
| `competence_month` | `DateField` | `—` | `False` | `False` | `—` |
| `amount` | `DecimalField` | `—` | `False` | `False` | `—` |
| `created_at` | `DateTimeField` | `—` | `False` | `False` | `—` |

### `finance.MonthlyInvestmentPlan`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `profile` | `ForeignKey` | `FinancialProfile` | `False` | `False` | `—` |
| `investment` | `ForeignKey` | `InvestmentPosition` | `False` | `False` | `—` |
| `competence_month` | `DateField` | `—` | `False` | `False` | `—` |
| `amount` | `DecimalField` | `—` | `False` | `False` | `—` |
| `created_at` | `DateTimeField` | `—` | `False` | `False` | `—` |

### `finance.JournalEntry`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `batch` | `ForeignKey` | `TransactionBatch` | `False` | `False` | `—` |
| `account_code` | `CharField` | `—` | `False` | `False` | `—` |
| `debit` | `DecimalField` | `—` | `False` | `False` | `Decimal('0.00')` |
| `credit` | `DecimalField` | `—` | `False` | `False` | `Decimal('0.00')` |
| `bank_account` | `ForeignKey` | `BankAccount` | `True` | `False` | `—` |

### `finance.ImportBatch`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `profile` | `ForeignKey` | `FinancialProfile` | `False` | `False` | `—` |
| `account` | `ForeignKey` | `BankAccount` | `True` | `False` | `—` |
| `filename` | `CharField` | `—` | `False` | `False` | `—` |
| `file_hash` | `CharField` | `—` | `False` | `False` | `—` |
| `idempotency_key` | `CharField` | `—` | `True` | `True` | `—` |
| `format` | `CharField` | `—` | `False` | `False` | `—` |
| `parser_version` | `CharField` | `—` | `False` | `False` | `—` |
| `status` | `CharField` | `—` | `False` | `False` | `Status.STAGED` |
| `total_rows` | `PositiveIntegerField` | `—` | `False` | `False` | `0` |
| `valid_rows` | `PositiveIntegerField` | `—` | `False` | `False` | `0` |
| `duplicate_rows` | `PositiveIntegerField` | `—` | `False` | `False` | `0` |
| `error_rows` | `PositiveIntegerField` | `—` | `False` | `False` | `0` |
| `created_by` | `ForeignKey` | `settings.AUTH_USER_MODEL` | `False` | `False` | `—` |
| `created_at` | `DateTimeField` | `—` | `False` | `False` | `—` |
| `committed_at` | `DateTimeField` | `—` | `True` | `False` | `—` |

### `finance.ImportRow`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `batch` | `ForeignKey` | `ImportBatch` | `False` | `False` | `—` |
| `row_number` | `PositiveIntegerField` | `—` | `False` | `False` | `—` |
| `fitid` | `CharField` | `—` | `False` | `False` | `—` |
| `occurred_on` | `DateField` | `—` | `False` | `False` | `—` |
| `posted_on` | `DateField` | `—` | `True` | `False` | `—` |
| `description` | `CharField` | `—` | `False` | `False` | `—` |
| `memo` | `TextField` | `—` | `False` | `False` | `—` |
| `amount` | `DecimalField` | `—` | `False` | `False` | `—` |
| `is_credit` | `BooleanField` | `—` | `False` | `False` | `False` |
| `raw_data` | `JSONField` | `—` | `False` | `False` | `dict` |
| `suggested_kind` | `CharField` | `—` | `False` | `False` | `—` |
| `suggested_link` | `JSONField` | `—` | `False` | `False` | `dict` |
| `confidence` | `DecimalField` | `—` | `False` | `False` | `Decimal('0.00')` |
| `justification` | `TextField` | `—` | `False` | `False` | `—` |
| `status` | `CharField` | `—` | `False` | `False` | `Status.PENDING` |
| `linked_batch` | `ForeignKey` | `TransactionBatch` | `True` | `False` | `—` |
| `decided_by` | `ForeignKey` | `settings.AUTH_USER_MODEL` | `True` | `False` | `—` |
| `decided_at` | `DateTimeField` | `—` | `True` | `False` | `—` |
| `idempotency_key` | `CharField` | `—` | `True` | `True` | `—` |

### `finance.CategorizationRule`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `workspace` | `ForeignKey` | `Workspace` | `False` | `False` | `—` |
| `profile` | `ForeignKey` | `FinancialProfile` | `True` | `False` | `—` |
| `name` | `CharField` | `—` | `False` | `False` | `—` |
| `description` | `TextField` | `—` | `False` | `False` | `—` |
| `match_type` | `CharField` | `—` | `False` | `False` | `MatchType.EXACT` |
| `pattern` | `CharField` | `—` | `False` | `False` | `—` |
| `match_field` | `CharField` | `—` | `False` | `False` | `MatchField.BOTH` |
| `case_sensitive` | `BooleanField` | `—` | `False` | `False` | `False` |
| `suggested_kind` | `CharField` | `—` | `False` | `False` | `—` |
| `suggested_link` | `JSONField` | `—` | `False` | `False` | `dict` |
| `priority` | `PositiveIntegerField` | `—` | `False` | `False` | `100` |
| `is_active` | `BooleanField` | `—` | `False` | `False` | `True` |
| `created_by` | `ForeignKey` | `settings.AUTH_USER_MODEL` | `False` | `False` | `—` |
| `created_at` | `DateTimeField` | `—` | `False` | `False` | `—` |
| `updated_by` | `ForeignKey` | `settings.AUTH_USER_MODEL` | `True` | `False` | `—` |
| `updated_at` | `DateTimeField` | `—` | `False` | `False` | `—` |

### `finance.CategorizationRuleVersion`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `rule` | `ForeignKey` | `CategorizationRule` | `False` | `False` | `—` |
| `version_number` | `PositiveIntegerField` | `—` | `False` | `False` | `—` |
| `pattern` | `CharField` | `—` | `False` | `False` | `—` |
| `match_type` | `CharField` | `—` | `False` | `False` | `—` |
| `match_field` | `CharField` | `—` | `False` | `False` | `—` |
| `case_sensitive` | `BooleanField` | `—` | `False` | `False` | `False` |
| `suggested_kind` | `CharField` | `—` | `False` | `False` | `—` |
| `suggested_link` | `JSONField` | `—` | `False` | `False` | `dict` |
| `priority` | `PositiveIntegerField` | `—` | `False` | `False` | `—` |
| `is_active` | `BooleanField` | `—` | `False` | `False` | `—` |
| `changed_by` | `ForeignKey` | `settings.AUTH_USER_MODEL` | `False` | `False` | `—` |
| `changed_at` | `DateTimeField` | `—` | `False` | `False` | `—` |
| `change_reason` | `CharField` | `—` | `False` | `False` | `—` |

### `finance.ReportExport`
Arquivo: `src/controller/apps/finance/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `profile` | `ForeignKey` | `FinancialProfile` | `False` | `False` | `—` |
| `report_type` | `CharField` | `—` | `False` | `False` | `—` |
| `format` | `CharField` | `—` | `False` | `False` | `—` |
| `status` | `CharField` | `—` | `False` | `False` | `Status.PENDING` |
| `period_start` | `DateField` | `—` | `False` | `False` | `—` |
| `period_end` | `DateField` | `—` | `False` | `False` | `—` |
| `interval` | `CharField` | `—` | `False` | `False` | `—` |
| `file` | `FileField` | `—` | `True` | `False` | `—` |
| `file_hash` | `CharField` | `—` | `False` | `False` | `—` |
| `error_message` | `TextField` | `—` | `False` | `False` | `—` |
| `requested_by` | `ForeignKey` | `settings.AUTH_USER_MODEL` | `False` | `False` | `—` |
| `requested_at` | `DateTimeField` | `—` | `False` | `False` | `—` |
| `completed_at` | `DateTimeField` | `—` | `True` | `False` | `—` |

### `core.UserProfile`
Arquivo: `src/controller/apps/core/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `user` | `OneToOneField` | `settings.AUTH_USER_MODEL` | `False` | `False` | `—` |
| `recovery_code_hash` | `CharField` | `—` | `True` | `False` | `—` |
| `recovery_code_version` | `PositiveSmallIntegerField` | `—` | `False` | `False` | `0` |
| `recovery_code_created` | `DateTimeField` | `—` | `True` | `False` | `—` |
| `recovery_acknowledged_at` | `DateTimeField` | `—` | `True` | `False` | `—` |
| `theme` | `CharField` | `—` | `False` | `False` | `'auto'` |
| `created_at` | `DateTimeField` | `—` | `False` | `False` | `—` |
| `updated_at` | `DateTimeField` | `—` | `False` | `False` | `—` |

### `core.RecoveryCode`
Arquivo: `src/controller/apps/core/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `user` | `ForeignKey` | `settings.AUTH_USER_MODEL` | `False` | `False` | `—` |
| `slot` | `PositiveSmallIntegerField` | `—` | `False` | `False` | `—` |
| `code_hash` | `CharField` | `—` | `False` | `False` | `—` |
| `created_at` | `DateTimeField` | `—` | `False` | `False` | `—` |
| `used_at` | `DateTimeField` | `—` | `True` | `False` | `—` |

### `core.AuthenticationAttempt`
Arquivo: `src/controller/apps/core/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `key` | `CharField` | `—` | `False` | `True` | `—` |
| `window_started` | `DateTimeField` | `—` | `False` | `False` | `—` |
| `attempts` | `PositiveIntegerField` | `—` | `False` | `False` | `0` |

### `core.BootstrapToken`
Arquivo: `src/controller/apps/core/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `token_hash` | `CharField` | `—` | `False` | `True` | `—` |
| `is_used` | `BooleanField` | `—` | `False` | `False` | `False` |
| `used_at` | `DateTimeField` | `—` | `True` | `False` | `—` |
| `used_by` | `ForeignKey` | `settings.AUTH_USER_MODEL` | `True` | `False` | `—` |
| `expires_at` | `DateTimeField` | `—` | `False` | `False` | `—` |
| `created_at` | `DateTimeField` | `—` | `False` | `False` | `—` |

### `core.SystemLog`
Arquivo: `src/controller/apps/core/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `timestamp` | `DateTimeField` | `—` | `False` | `False` | `—` |
| `severity` | `CharField` | `—` | `False` | `False` | `Severity.INFO` |
| `module` | `CharField` | `—` | `False` | `False` | `—` |
| `action` | `CharField` | `—` | `False` | `False` | `—` |
| `result` | `CharField` | `—` | `False` | `False` | `Result.SUCCESS` |
| `description` | `TextField` | `—` | `False` | `False` | `—` |
| `details` | `JSONField` | `—` | `False` | `False` | `dict` |
| `workspace` | `ForeignKey` | `'finance.Workspace'` | `True` | `False` | `—` |
| `profile` | `ForeignKey` | `'finance.FinancialProfile'` | `True` | `False` | `—` |
| `user` | `ForeignKey` | `settings.AUTH_USER_MODEL` | `True` | `False` | `—` |
| `request_id` | `CharField` | `—` | `False` | `False` | `—` |
| `ip_address` | `GenericIPAddressField` | `—` | `True` | `False` | `—` |
| `user_agent` | `TextField` | `—` | `False` | `False` | `—` |
| `object_type` | `CharField` | `—` | `False` | `False` | `—` |
| `object_id` | `CharField` | `—` | `False` | `False` | `—` |
| `object_repr` | `CharField` | `—` | `False` | `False` | `—` |
| `is_financial_audit` | `BooleanField` | `—` | `False` | `False` | `False` |
| `ledger_batch_id` | `CharField` | `—` | `False` | `False` | `—` |

### `core.AIProviderConfig`
Arquivo: `src/controller/apps/core/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `workspace` | `ForeignKey` | `'finance.Workspace'` | `False` | `False` | `—` |
| `name` | `CharField` | `—` | `False` | `False` | `—` |
| `endpoint` | `URLField` | `—` | `False` | `False` | `—` |
| `model_name` | `CharField` | `—` | `False` | `False` | `—` |
| `api_key_env` | `CharField` | `—` | `False` | `False` | `—` |
| `sections` | `JSONField` | `—` | `False` | `False` | `list` |
| `enabled` | `BooleanField` | `—` | `False` | `False` | `False` |
| `created_at` | `DateTimeField` | `—` | `False` | `False` | `—` |
| `updated_at` | `DateTimeField` | `—` | `False` | `False` | `—` |

### `core.AIAnalysis`
Arquivo: `src/controller/apps/core/models.py`.

| Campo | Tipo ORM | Referência / valor | null | único | default |
|---|---|---|---|---|---|
| `workspace` | `ForeignKey` | `'finance.Workspace'` | `False` | `False` | `—` |
| `profile` | `ForeignKey` | `'finance.FinancialProfile'` | `False` | `False` | `—` |
| `provider` | `ForeignKey` | `AIProviderConfig` | `False` | `False` | `—` |
| `section` | `CharField` | `—` | `False` | `False` | `—` |
| `summary` | `TextField` | `—` | `False` | `False` | `—` |
| `data_hash` | `CharField` | `—` | `False` | `False` | `—` |
| `record_count` | `PositiveSmallIntegerField` | `—` | `False` | `False` | `—` |
| `created_by` | `ForeignKey` | `settings.AUTH_USER_MODEL` | `False` | `False` | `—` |
| `created_at` | `DateTimeField` | `—` | `False` | `False` | `—` |


---

<!-- Fonte: docs/04_DADOS/03_MIGRACOES_EVOLUCAO.md -->
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


---

<!-- Fonte: docs/05_INTERFACE/01_DESIGN_SYSTEM.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Design system e experiência responsiva

## Identidade visual
O site de apresentação e o projeto usam a marca ALECE Finance, com cor primária verde, tipografia sans-serif do ambiente e variações light/dark. Os SVGs oficiais do ZIP original são preservados em `assets/identidade/`, especialmente `favicon_original.svg`. O frontend possui tokens em `src/view/static/finance/alece.css`, não dependência de uma biblioteca UI geral.

## Tokens evidenciados
| Token | Tema claro | Tema escuro |
|---|---|---|
| Fundo | `#F6F8F5` | `#0D1512` |
| Superfície | `#FFFFFF` | `#15211B` |
| Texto | `#17261D` | `#F2F7F2` |
| Primário | `#146C43` | `#65D4A0` |
| Borda | `#DBE5DD` | `#34453B` |

## Princípios de composição
- Títulos e ações pertencem ao cartão que comandam; margem superior consistente.
- Tabelas têm contêiner com bordas e espaçamento interno; extremidades de colunas com recuo suficiente.
- Botões + filtros com alturas e raios compatíveis, sem gradientes discrepantes.
- `checkbox`, `select`, `input`, date e opções de select legíveis no dark mode.
- Popup ~540 px no desktop e largura fluida no mobile; scrollbar discreta, sem rolar a página atrás.
- Alterações não salvas pedem confirmação antes de fechar; ações destrutivas exigem confirmação específica.
- Ícones têm `aria-label` em botões sem texto; formulários rotulados, foco visível e teclado suportado.

## Não confundir consistência com uniformidade absoluta
Tabelas densas podem usar scroll horizontal **interno** no mobile; cards e filtros devem refluír. Acessibilidade de contraste, zoom 200% e leitores de tela requerem testes dedicados, não apenas comparação visual.

## Componentes e CSS
`alece.css` define os tokens; `alece_ui_consistency.css` contém regras adicionais específicas. Regras globais conflitantes foram fonte de regressões históricas; documente precedência e remova overrides obsoletos antes de expandir o design system.


---

<!-- Fonte: docs/05_INTERFACE/02_ROTAS_TELAS_FORMULARIOS.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Rotas, views e contratos de UI

## Rotas canônicas
| Caminho | Tela | Operação típica |
|---|---|---|
| `/visao-geral/` | dashboard | leitura, edição contextual de renda |
| `/despesas/` | despesas | CRUD, filtro, pagamento vinculado |
| `/investimentos/` | investimentos | posições, metas, reserva |
| `/movimentacoes/` | transações | consulta, importação e confirmação |
| `/configuracoes/` | conta/admin | usuários, perfis, APIs, logs e relatórios |
| `/logs/` | auditoria | filtros e expansão de evento |
| `/relatorios/` | panoramas | relatórios e transferências |
| `/entrar/` / `/sair/` | autenticação | sessão |
| `/saude/ativo/` / `/saude/pronto/` | health | liveness/readiness |

A origem exata dos caminhos está em `src/web.py`. Rotas de detalhes, CRUD e auditoria também são definidas nos includes de apps. Consulte `03_CATALOGO_ROTAS_GERADO.md` para extratos diretos das declarações `path()` observadas. Algumas URLs são construídas dinamicamente; o inventário estático não substitui `python manage.py show_urls` ou a resolução real em Django.

## Formulários
- HTTP GET carrega leitura/formulário; POST faz operação mutável com CSRF.
- O redirecionamento após POST reduz reenvio e permite mostrar confirmação.
- Um modal visual não muda autorização; o endpoint continua independente e seguro.
- Nunca montar URL de escrita concatenando IDs fornecidos sem validar seu espaço.

## Tratamento de erros
Handlers Django 400, 403, 404, 500 e 503 renderizam página ALECE de erro; logs de diagnóstico devem ser protegidos. Nenhum stack trace, token, segredo de sessão ou cookie deve aparecer em página pública.


---

<!-- Fonte: docs/05_INTERFACE/03_CATALOGO_ROTAS_GERADO.md -->
# Catálogo de rotas identificadas por inspeção de código

> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.


> **Método:** leitura estática de chamadas `path()` e `re_path()` em `src/web.py` e `apps/**/urls.py`. Includes possuem prefixos próprios; rotas montadas em laços Python podem não aparecer aqui. Este não é um dump de URLconf Django executado.

**100 declarações `path()`/`re_path()` de padrão literal encontradas.**

| Origem | Caminho declarado | Nome | Handler ou include |
|---|---|---|---|
| `src/controller/apps/core/urls.py` | `configuracao-inicial/` | `setup` | `setup_view` |
| `src/controller/apps/core/urls.py` | `logs-sistema/` | `system-logs-list` | `views.system_logs_legacy_redirect` |
| `src/controller/apps/core/urls.py` | `logs-sistema/<int:log_id>/` | `system-log-detail` | `views.system_log_detail` |
| `src/controller/apps/core/urls.py` | `permissoes/<int:workspace_id>/<int:membership_id>/` | `grant-management` | `grant_management` |
| `src/controller/apps/core/urls.py` | `usuarios/<int:workspace_id>/` | `user-management` | `user_management` |
| `src/controller/apps/core/urls.py` | `usuarios/<int:workspace_id>/<int:user_id>/editar/` | `user-edit` | `user_edit` |
| `src/controller/apps/core/urls.py` | `usuarios/<int:workspace_id>/<int:user_id>/excluir/` | `user-delete-account` | `user_delete_account` |
| `src/controller/apps/core/urls.py` | `usuarios/<int:workspace_id>/<int:user_id>/remover/` | `user-remove-access` | `user_remove_access` |
| `src/controller/apps/core/urls.py` | `usuarios/<int:workspace_id>/<int:user_id>/revogar-sessoes/` | `user-revoke-sessions` | `user_revoke_sessions` |
| `src/controller/apps/core/urls.py` | `usuarios/<int:workspace_id>/<int:user_id>/senha/` | `user-password-reset` | `user_password_reset` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/` | `overview` | `views.workspace_page` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/categorizacao/` | `categorization-list` | `categorization_views.categorization_list` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/categorizacao/<int:rule_id>/editar/` | `categorization-edit` | `categorization_views.categorization_edit` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/categorizacao/<int:rule_id>/excluir/` | `categorization-delete` | `categorization_views.categorization_delete` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/categorizacao/novo/` | `categorization-create` | `categorization_views.categorization_create` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/categorizacao/testar/` | `categorization-test` | `categorization_views.categorization_test` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/despesas/` | `expenses` | `views.workspace_page` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/importacoes/` | `import-list` | `import_views.import_list` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/investimentos/` | `investments` | `views.workspace_page` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/movimentacoes/` | `movements` | `views.workspace_page` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/perfis/` | `profile-list` | `views.profile_list` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/perfis/<int:profile_id>/relatorios/dre/` | `dre-report` | `reports_views.dre_report` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/perfis/<int:profile_id>/relatorios/exportar/<relatorio:report_type>/` | `export-report` | `reports_views.export_report` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/perfis/<int:profile_id>/relatorios/investimentos/` | `investment-report` | `reports_views.investment_report` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/perfis/<int:profile_id>/relatorios/metas/` | `goals-report` | `reports_views.goals_report` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/perfis/<int:profile_id>/relatorios/patrimonio/` | `equity-report` | `reports_views.equity_evolution_report` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/perfis/novo/` | `profile-create` | `views.profile_create` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/relatorios/` | `reports-dashboard` | `reports_views.reports_dashboard` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/relatorios/tecnico/` | `technical-reports` | `financial_transfer_views.technical_reports` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/relatorios/tecnico/exportar/` | `financial-export` | `financial_transfer_views.export_financial` |
| `src/controller/apps/finance/urls.py` | `nucleos/<int:workspace_id>/relatorios/tecnico/importar/` | `financial-import` | `financial_transfer_views.import_financial` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/` | `profile-detail` | `views.profile_detail` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/contas/novo/` | `account-create` | `views.account_create` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/desmarcar/<tipo:kind>/<int:object_id>/` | `reverse-item` | `transaction_views.reverse_item` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/editar/` | `profile-edit` | `views.profile_edit` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/gerenciar/` | `profile-manage` | `views.profile_manage` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/importacoes/<int:batch_id>/` | `import-preview` | `import_views.import_preview` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/importacoes/<int:batch_id>/confirmar/` | `import-commit` | `import_views.import_commit` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/importacoes/<int:batch_id>/linhas/<int:row_id>/` | `import-row-detail` | `import_views.import_row_detail` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/importacoes/<int:batch_id>/linhas/<int:row_id>/editar/` | `import-row-edit` | `import_views.import_row_edit` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/importacoes/<int:batch_id>/relatorio/` | `import-report` | `import_views.import_report` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/importacoes/<int:batch_id>/simulacao/` | `import-dry-run` | `import_views.import_dry_run` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/importacoes/novo/` | `import-upload` | `import_views.import_upload` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/investimentos/<int:investment_id>/resgatar/` | `withdrawal` | `transaction_views.withdrawal` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/movimentacoes/<int:batch_id>/` | `movement-detail` | `transaction_views.movement_detail` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/movimentacoes/<int:batch_id>/estornar/` | `reverse-movement` | `transaction_views.reverse_movement` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/pagar/<tipo:kind>/<int:object_id>/` | `payment` | `transaction_views.payment` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/permissoes/` | `grant-list` | `grant_views.grant_list` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/permissoes/<int:membership_id>/` | `grant-edit` | `grant_views.grant_edit` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/renda/` | `income-edit` | `views.income_edit` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/reserva/` | `reserve-edit` | `views.record_edit` |
| `src/controller/apps/finance/urls.py` | `perfis/<int:profile_id>/transferir/` | `transfer` | `transaction_views.transfer_view` |
| `src/web.py` | `` | `home` | `views.index` |
| `src/web.py` | `about/` | `—` | `views.about_page` |
| `src/web.py` | `admin/` | `—` | `admin.site.urls` |
| `src/web.py` | `administracao/` | `—` | `admin.site.urls` |
| `src/web.py` | `configuracao-inicial/` | `setup` | `user_views.setup_view` |
| `src/web.py` | `configuracoes/` | `configuracoes` | `public_routes.public_page` |
| `src/web.py` | `configuracoes/api/<int:provider_id>/analisar/` | `configuracoes-api-analisar` | `settings_views.analyze_imports` |
| `src/web.py` | `configuracoes/api/<int:provider_id>/editar/` | `configuracoes-api-editar` | `settings_views.provider_form` |
| `src/web.py` | `configuracoes/api/<int:provider_id>/excluir/` | `configuracoes-api-excluir` | `settings_views.provider_delete` |
| `src/web.py` | `configuracoes/api/<int:provider_id>/selecionar/` | `configuracoes-api-selecionar` | `settings_views.provider_select` |
| `src/web.py` | `configuracoes/api/nova/` | `configuracoes-api-nova` | `settings_views.provider_form` |
| `src/web.py` | `configuracoes/codigos/` | `configuracoes-codigos` | `settings_views.recovery_status` |
| `src/web.py` | `configuracoes/minha-conta/` | `configuracoes-minha-conta` | `settings_views.my_information` |
| `src/web.py` | `core/` | `—` | `include('apps.core.legacy_urls')` |
| `src/web.py` | `despesas/` | `despesas` | `public_routes.public_page` |
| `src/web.py` | `entrar/` | `login` | `auth_views.login_view` |
| `src/web.py` | `financas/` | `—` | `include('apps.finance.urls')` |
| `src/web.py` | `finance/` | `—` | `include('apps.finance.legacy_urls')` |
| `src/web.py` | `health/live/` | `—` | `views.live` |
| `src/web.py` | `health/ready/` | `—` | `views.ready` |
| `src/web.py` | `healthz/` | `—` | `views.healthz` |
| `src/web.py` | `investimentos/` | `investimentos` | `public_routes.public_page` |
| `src/web.py` | `login/` | `—` | `auth_views.login_view` |
| `src/web.py` | `logout/` | `—` | `auth_views.logout_view` |
| `src/web.py` | `logs/` | `logs` | `views.system_logs_list` |
| `src/web.py` | `logs/diagnostico/` | `logs-diagnostico` | `views.system_logs_diagnostic` |
| `src/web.py` | `movimentacoes/` | `movimentacoes` | `public_routes.public_page` |
| `src/web.py` | `password/change/` | `—` | `auth_views.password_change_view` |
| `src/web.py` | `preferencias/tema/` | `preferencia-tema` | `set_theme_preference` |
| `src/web.py` | `recovery/` | `—` | `auth_views.recovery_code_request_view` |
| `src/web.py` | `recovery/generate/` | `—` | `auth_views.recovery_code_generate_view` |
| `src/web.py` | `recovery/use/` | `—` | `auth_views.recovery_code_use_view` |
| `src/web.py` | `recuperacao/` | `recovery_request` | `auth_views.recovery_code_request_view` |
| `src/web.py` | `recuperacao/gerar/` | `recovery_generate` | `auth_views.recovery_code_generate_view` |
| `src/web.py` | `recuperacao/usar/` | `recovery_use` | `auth_views.recovery_code_use_view` |
| `src/web.py` | `relatorios/` | `relatorios` | `public_routes.public_technical_reports` |
| `src/web.py` | `relatorios/exportar/` | `relatorios-exportar` | `public_routes.public_financial_export` |
| `src/web.py` | `relatorios/importar/` | `relatorios-importar` | `public_routes.public_financial_import` |
| `src/web.py` | `sair/` | `logout` | `auth_views.logout_view` |
| `src/web.py` | `saude/` | `healthz` | `views.healthz` |
| `src/web.py` | `saude/ativo/` | `health-live` | `views.live` |
| `src/web.py` | `saude/pronto/` | `health-ready` | `views.ready` |
| `src/web.py` | `selecionar-nucleo/<int:workspace_id>/` | `selecionar-nucleo` | `public_routes.select_workspace` |
| `src/web.py` | `senha/alterar/` | `password_change` | `auth_views.password_change_view` |
| `src/web.py` | `setup/` | `—` | `user_views.setup_view` |
| `src/web.py` | `sistema/` | `—` | `include('apps.core.urls')` |
| `src/web.py` | `sobre/` | `about-page` | `views.about_page` |
| `src/web.py` | `visao-geral/` | `visao-geral` | `public_routes.public_page` |


---

<!-- Fonte: docs/06_SEGURANCA/01_MODELO_AMEACAS.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Segurança: ativos, ameaças e controles

## Ativos críticos
Dados financeiros, integridade do ledger, conta de admin, códigos de recuperação, sessões, chaves de IA, DB, uploads, dumps e logs de auditoria.

## Fronteiras de confiança
Browser e uploads são não confiáveis. Provedores de IA são terceiros externos. O container web tem direito restrito ao banco e volumes. A aplicação deve verificar autorização por workspace/objeto em **cada** ação.

| Ameaça | Vetor | Controle documentado / a confirmar |
|---|---|---|
| IDOR/BOLA | manipular `profile_id` ou `object_id` | `require_workspace_admin`, `require_module`, validação de ownership |
| CSRF | POST originado em outra página | Django CSRF middleware e tokens |
| força bruta | login/recovery | `AuthenticationAttempt`, throttling, hashes de códigos |
| exfiltração IA | endpoint externo ou prompt injection | allowlist, consentimento, minimização, volume privado de tokens |
| SSRF | endpoint de IA personalizado | validação de host/HTTPS, bloqueio de destinos internos |
| upload malicioso | CSV/OFX/PDF e ZIP de backup | limites, parser defensivo, staging, hashes, transação |
| concorrência financeira | confirmação duplicada | idempotência, bloqueio transacional e constraints |
| vazamento em logs | traceback e parâmetros | sanitização, permissão admin, sem segredos nos logs |
| perda de dados | volume removido ou migração | pg_dump, teste de restore, backups SHA-256, rollback |
| tema/acessibilidade | baixo contraste em opções | CSS de `color-scheme`, testes light/dark |

## Controles configurados
`SECURE_CONTENT_TYPE_NOSNIFF=True`, `X_FRAME_OPTIONS='DENY'`, SameSite=Lax para cookies e proteção CSRF. `ALECE_SECURE_COOKIES` configura Secure de cookies; defina `true` quando servido sobre HTTPS com proxy corretamente configurado. `DEBUG=False` em produção.

## Recomendações de desenvolvimento
Usar OWASP ASVS, autenticação com teste negativo, threat modeling nos fluxos de importação/IA/export, scan de dependências e revisão de permissão por objeto em PR. Este documento não certifica a implementação nem substitui um pentest.


---

<!-- Fonte: docs/06_SEGURANCA/02_PRIVACIDADE_DADOS.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Privacidade, retenção e exportação

O ALECE adota compromisso de self-host e não transmissão compulsória de telemetria. O usuário mantém controle do servidor, mas continua responsável por segurança física/lógica, acesso, rotinas de backup e eventuais obrigações legais aplicáveis.

## Classes de dados
- **Credenciais:** hash de senha e códigos de uso único; não exportar em pacote financeiro.
- **Dados financeiros:** nomes de contas, datas, valores, descrições e categorias; podem conter dados pessoais incidentalmente.
- **Dados de segurança/auditoria:** IP e eventos de operação sujeitos a retenção controlada e acesso restrito.
- **Integração externa:** JSON financeiro enviado a IA somente mediante ação/autorização/consentimento.

## Minimização
Não usar dados reais nos screenshots/fixtures; evitar PII em logs; mascarar códigos de recuperação após primeiro acesso; exportações portáveis não incluem usuários ou senhas; auditar downloads de backups.

## Retenção e deleção
Exclusão lógica preserva relações de ledger. A definição de prazos reais de retenção, atendimento de direitos de titulares e base legal depende de política organizacional e não está inteiramente estabelecida no pacote histórico.

## Backup
Criptografar armazenamento e transferência de backup quando aplicável; incluir integridade com SHA-256 e testar restauração. Logs de importação devem registrar sucesso/falha sem conter o conteúdo integral de dados sensíveis.


---

<!-- Fonte: docs/07_OPERACOES/01_IMPLANTACAO_SELF_HOST.md -->
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


---

<!-- Fonte: docs/07_OPERACOES/02_VARIAVEIS_AMBIENTE.md -->
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


---

<!-- Fonte: docs/07_OPERACOES/03_STARTUP_HEALTH.md -->
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


---

<!-- Fonte: docs/07_OPERACOES/04_LOGS_OBSERVABILIDADE.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Logs, auditoria e diagnóstico

## Fontes diferentes
- `SystemLog` em PostgreSQL: auditoria de autenticação, usuários, acessos, ações financeiras, importação e erros; passível de consulta em `/logs/` (administradores).
- Logs de execução em `src/logs/`: saída stdout/stderr por inicialização quando `ALECE_LOG_VALIDACAO=true`, capturada pelo entrypoint.
- Gunicorn/Docker: saída de serviço e healthcheck; não deve receber query string ou secrets em texto.

## Identificação de evento
A UI de logs oferece filtros por severidade, módulo, ação, resultado, usuário, período e texto, além de expansão de detalhes por registro. O endpoint `/logs/diagnostico/` trata exportação sanitizada condicionada a autorização.

## Política mínima
| Assunto | Recomendação |
|---|---|
| Nível | `INFO` no funcionamento normal, `DEBUG` somente temporariamente em local seguro |
| Redação | remover cookies, tokens, recovery codes, Authorization e dados financeiros desnecessários |
| Permissões | admins do escopo; diagnóstico operacional global apenas superusuários quando aplicável |
| Retenção | definir por política/legislação; evitar apagar sem aprovação |
| Ingestão | alertar em erro de DB, loop de restart, falhas de backup e migrations |

## Investigação de HTTP 500
Capturar timestamp, request id, rota, usuário (ID interno quando permitido), stacktrace sanitizado; correlacionar com migração ou deploy; reproduzir em ambiente isolado. A tela pública de erro não deve exibir traceback.


---

<!-- Fonte: docs/07_OPERACOES/05_BACKUP_ROLLBACK.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Backup, restauração e rollback

## Camadas de backup
1. **PostgreSQL lógico consistente:** schema, usuários, auditoria, financeiro, permissões e dependências.
2. **Volumes persistentes:** mídia, chaves de IA, segredos e backup financeiro. Não confundir dump do DB com conteúdo de `app_media`.
3. **Configuração versionada:** `compose.yaml`, imagem/tag, variáveis sem segredos e registro de mudanças.
4. **Financeiro portável:** ZIP `financeiro.json` + XLSX + manifesto; **não inclui** identidades, permissões nem auditoria e não substitui (1).

## Processo seguro
Inventariar → realizar backup anterior → calcular SHA-256 → verificar hash imediatamente → validar restauração em instância isolada → aplicar alteração → smoke + regressão → conservar arquivos e log de intervenção → manter retorno documentado.

## Exemplo de manifesto técnico
Para cada arquivo registrar SHA-256, tamanho, data/hora, host, versão, tipo de backup e local de armazenamento. Evitar colocar senha de banco em parâmetros de linha de comando e log.

## Falhas a evitar
- `docker compose down -v` elimina volumes.
- Restaurar DB sem segredos de sessão/chaves/mídia pode quebrar login, anexos e integrações.
- Rodar migrations novas antes de ter backup impedirá rollback simples.
- Importar ZIP financeiro dando edição geral a usuários de destino aumenta superfície de acesso.

## Teste de recuperação
Validar login administrativo, perfil, conta, saldos, ledger, uma movimentação de teste no ambiente **isolado**, histórico e mídia. Nunca declarar backup “testado” apenas porque o arquivo existe e o hash bate.


---

<!-- Fonte: docs/08_QUALIDADE/01_ESTRATEGIA_TESTES.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Estratégia de testes: qualidade funcional e estabilidade

## Camadas
| Nível | Exemplos | Quando executar |
|---|---|---|
| Static/lint | compile Python, validar YAML, lockfiles e importação de módulos | cada PR |
| Unitário | cálculos Decimal, Reserva, competência, normalização, idempotência lógica | a cada alteração de regra |
| Integração Django/DB | CRUD, constraints, autenticação, permissões, migrações, ledger | CI em DB isolado |
| E2E | criação de perfil, pagamento, estorno, importação/revisão, UI responsiva | release / homologação |
| Segurança | IDOR, CSRF, rate-limit, dados enviados para IA, upload adversarial | PRs sensíveis e releases |
| Operação | restore real, startup, liveness/readiness, health, logs | homologação / após deploy |

## Organização de testes
- `tests/auth/`: setup, login, senha, e-mail, recuperação por 6 códigos.
- `tests/configuration/`: gestão de usuário, perfis, grants, IA e seleção exclusiva.
- `tests/finance/`: cálculos, views, ledger, CRUD e indicadores.
- `tests/imports/`: importação bancária e ZIP financeiro.
- `tests/reports/`: relatórios e exportações.
- `tests/ui/`: navegação, tema e screenshots.
- `tests/operations/`: startup, rotas, segurança, logs e estrutura do repo.

## Critérios mínimos do pipeline
Compilação, check Django, migrations no banco de teste, suíte unit/integration, form CSRF, cobertura prioritária de dinheiro/permissão, visual em mobile/desktop, teste de instalação limpa e restauração em ambiente descartável.

## Limites de evidência
Há testes estruturais e de cálculo declarados em conversas anteriores, mas a suíte Django/PostgreSQL integral não foi executada no ambiente desta documentação. A presença de um arquivo de teste não prova execução ou aprovação.


---

<!-- Fonte: docs/08_QUALIDADE/02_MATRIZ_CRUD_ACEITE.md -->
> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Matriz de CRUD, autorização e renderização

| Recurso | Criar | Ler | Editar | Desativar/Excluir | Casos negativos a cobrir |
|---|---:|---:|---:|---:|---|
| Usuário | ✓ | ✓ | ✓ | ✓, preservar auditoria | duplicidade email, self-delete, usuário comum |
| Perfil | ✓ | ✓ | ✓ | arquivar/excluir lógico | limite cinco ativos, outro Workspace |
| Grant | ✓ | ✓ | ✓ | revogar | `edit` sem leitura, módulo fora do escopo |
| Conta | ✓ | ✓ | ✓ | arquivar | saldo negativo, conta com ledger |
| Despesa previsível | ✓ | ✓ | ✓ | desativar | vencimento 31, valor <= 0, outro perfil |
| Despesa imprevisível | ✓ | ✓ | ✓ | conforme regras | data inválida, valor <= 0 |
| Posição de investimento | ✓ | ✓ | ✓ | desativar | Reserva com meta manual, resgate acima do saldo |
| Movimentação | confirmar | ✓ | não editar evento postado | estornar | repetição, duas contas, status parcial |
| Importação bancária | upload | prévia | revisar linha | descartar prévia | parser inválido, duplicata, CSV Injection |
| API de IA | ✓ | ✓ | ✓ | desativar/excluir | múltiplas ativas, SSRF, falta de consentimento |
| Relatório | — | ✓ | — | — | leitura por perfil não autorizado |
| ZIP financeiro | export | ✓ | import aditivo | — | hash errado, ZIP bomb, referência cruzada |
| Logs | — | ✓ | — | — | usuário comum acessando diagnóstico global |

## Testes de apresentação
Cada página deve renderizar em claro/escuro e 320, 390, 768, 1280 px, sem overflow horizontal da **página**. Tabelas podem ter scroll interno. Verificar foco, `Esc`, overlay, saída de modal com mudanças pendentes e reentrada após redirect.

## Fluxos críticos mínimos E2E
1. Criar usuário comum → gerar recuperação → login por nome/e-mail → grant por módulo → negar ação não permitida.
2. Criar perfil → cadastrar renda e despesa → confirmar pagamento → conferir conta, competência, métricas e auditoria → estornar.
3. Importar CSV → prévia → correção de linha → confirmar → repetir mesmo arquivo → não duplicar.
4. Exportar ZIP financeiro → validar hash/XLSX → importar num espaço isolado → conferir IDs e concessões de destino.
5. Ativar uma API → confirmar que as demais desativam → negar envio sem consentimento.


---

<!-- Fonte: docs/08_QUALIDADE/03_CICD_PROCESSO_EQUIPE.md -->
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


---

<!-- Fonte: docs/09_DECISOES/01_ADRS_E_STATUS.md -->
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


---

<!-- Fonte: docs/09_DECISOES/02_RISCOS_LIMITACOES_ROADMAP.md -->
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
