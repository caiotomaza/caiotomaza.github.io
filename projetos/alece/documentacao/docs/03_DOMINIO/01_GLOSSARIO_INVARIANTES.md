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
