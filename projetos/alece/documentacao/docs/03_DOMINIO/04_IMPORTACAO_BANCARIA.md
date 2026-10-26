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
