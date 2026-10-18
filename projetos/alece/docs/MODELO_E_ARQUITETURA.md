# ALECE · Arquitetura e modelagem documentadas

> Fonte: repositório público `caiotomaza/alece` (base técnica v0.2.0), especificação histórica v1.32.1 e texto de lógica financeira fornecido em outubro de 2026. Estes diagramas são sínteses de documentação, não um schema SQL executável ou uma auditoria do banco.

## Estado atual

- Backend Django 5.2 LTS com modelos, migrações, autenticação básica e permissões por workspace/perfil.
- Serviço inicial de saída de caixa, idempotência, bloqueios de linha e pernas de lançamento.
- Interface HTML v1.32.1 funciona independentemente **em memória** e ainda não está conectada ao PostgreSQL.
- Importação permanente CSV/PDF, aplicação financeira real, estorno imutável completo e CRUD financeiro integrado **ainda são etapas de desenvolvimento**.

## Entidades modeladas no Django

| Classe | Papel |
|---|---|
| `Workspace` | Núcleo financeiro / escopo de dados |
| `WorkspaceMembership` | Vínculo usuário–núcleo e papel Administrador/Comum |
| `FinancialProfile` | Subconjunto financeiro, renda mensal distinguindo NULL e zero |
| `ProfileGrant` | Autorização de consulta e edição por perfil |
| `BankAccount` | Conta bancária ou dinheiro físico; saldo conhecido, zero ou desconhecido |
| `RecurringExpense` | Despesa previsível com dia mensal obrigatório |
| `UnexpectedExpense` | Despesa imprevisível datada |
| `InvestmentPosition` | Posição aplicada, valor atual e meta opcional |
| `ReservePolicy` | Cobertura de 6 a 12 meses (padrão 9) |
| `TransactionBatch` | Grupo de movimento com tipo, idempotência e vínculos |
| `LedgerLeg` | Alteração individual de saldo por conta, com delta não nulo |

## Princípios de engenharia

- Dinheiro em `Decimal` no backend e `NUMERIC` no PostgreSQL, nunca `float` como fonte de verdade.
- Transações multicon­ta atômicas, autorização no serviço, prevenção de dupla confirmação.
- Não confundir renda com saldo; despesa cadastrada com pagamento; aplicação com despesa de consumo; transferência com receita.
- Privilégio mínimo, contas segregadas, DB sem porta pública, backup testável e privacidade por design.
- Diagrama de classes UML simplificado: `modelo-classes.puml`; diagrama de sequência: `fluxo-confirmacao.puml`. Há arquivos `.dot` editáveis e `.svg` renderizados no site.

## Evolução planejada

- `ImportBatch/ImportCandidate`, `AuditEvent` completo, ocorrências por competência (`ExpenseOccurrence`), objetivos (`Goal`) e cálculos patrimoniais detalhados estão descritos em documentos de produto, mas **não são tratados como modelos já presentes** no starter que embasa o diagrama.
- Requer migrações e testes antes de publicar instalador para dados financeiros reais.

## Referências

- https://github.com/caiotomaza/alece/blob/main/apps/finance/models.py
- https://github.com/caiotomaza/alece/blob/main/docs/ARCHITECTURE.md
- https://github.com/caiotomaza/alece/blob/main/docs/DOMAIN.md
- https://github.com/caiotomaza/alece/blob/main/docs/ZIMAOS.md
- https://github.com/caiotomaza/alece/blob/main/LICENSE
