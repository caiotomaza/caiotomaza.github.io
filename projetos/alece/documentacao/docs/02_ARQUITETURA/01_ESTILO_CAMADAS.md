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
