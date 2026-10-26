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
