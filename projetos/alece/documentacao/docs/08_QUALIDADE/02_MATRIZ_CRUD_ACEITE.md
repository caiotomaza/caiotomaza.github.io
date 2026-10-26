> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Matriz de CRUD, autorização e renderização

| Recurso | Criar | Ler | Editar | Desativar/Excluir | Casos negativos a cobrir |
|---|---:|---:|---:|---:|---|
| Usuário | ✓ | ✓ | ✓ | ✓, preservar auditoria | duplicidade email, self-delete, usuário comum |
| Perfil | ✓ | ✓ | ✓ | arquivar/excluir lógico | limite cinco ativos, outro Workspace |
| Grant | ✓ | ✓ | ✓ | revogar | `edit` sem leitura, módulo fora do escopo |
| Conta | ✓ | ✓ | ✓ | arquivar | saldo negativo, conta com ledger |
| Despesa previsível | ✓ | ✓ | ✓ | desativar | vencimento 31, valor <= 0, outro perfil |
| Despesa imprevisível | ✓ | ✓ | ✓ | conforme regras | data inválida, valor <= 0 |
| Posição de investimento | ✓ | ✓ | ✓ | desativar | Reserva com meta manual, resgate acima do saldo |
| Movimentação | confirmar | ✓ | não editar evento postado | estornar | repetição, duas contas, status parcial |
| Importação bancária | upload | prévia | revisar linha | descartar prévia | parser inválido, duplicata, CSV Injection |
| API de IA | ✓ | ✓ | ✓ | desativar/excluir | múltiplas ativas, SSRF, falta de consentimento |
| Relatório | — | ✓ | — | — | leitura por perfil não autorizado |
| ZIP financeiro | export | ✓ | import aditivo | — | hash errado, ZIP bomb, referência cruzada |
| Logs | — | ✓ | — | — | usuário comum acessando diagnóstico global |

## Testes de apresentação
Cada página deve renderizar em claro/escuro e 320, 390, 768, 1280 px, sem overflow horizontal da **página**. Tabelas podem ter scroll interno. Verificar foco, `Esc`, overlay, saída de modal com mudanças pendentes e reentrada após redirect.

## Fluxos críticos mínimos E2E
1. Criar usuário comum → gerar recuperação → login por nome/e-mail → grant por módulo → negar ação não permitida.
2. Criar perfil → cadastrar renda e despesa → confirmar pagamento → conferir conta, competência, métricas e auditoria → estornar.
3. Importar CSV → prévia → correção de linha → confirmar → repetir mesmo arquivo → não duplicar.
4. Exportar ZIP financeiro → validar hash/XLSX → importar num espaço isolado → conferir IDs e concessões de destino.
5. Ativar uma API → confirmar que as demais desativam → negar envio sem consentimento.
