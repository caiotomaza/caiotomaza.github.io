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
