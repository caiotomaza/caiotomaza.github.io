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
