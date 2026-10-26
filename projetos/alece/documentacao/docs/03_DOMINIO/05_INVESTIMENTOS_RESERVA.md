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
