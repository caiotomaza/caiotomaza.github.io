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
