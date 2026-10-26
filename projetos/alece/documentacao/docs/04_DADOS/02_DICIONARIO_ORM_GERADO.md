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
