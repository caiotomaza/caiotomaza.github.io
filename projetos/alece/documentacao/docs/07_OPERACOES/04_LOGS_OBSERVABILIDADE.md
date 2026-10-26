> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Logs, auditoria e diagnóstico

## Fontes diferentes
- `SystemLog` em PostgreSQL: auditoria de autenticação, usuários, acessos, ações financeiras, importação e erros; passível de consulta em `/logs/` (administradores).
- Logs de execução em `src/logs/`: saída stdout/stderr por inicialização quando `ALECE_LOG_VALIDACAO=true`, capturada pelo entrypoint.
- Gunicorn/Docker: saída de serviço e healthcheck; não deve receber query string ou secrets em texto.

## Identificação de evento
A UI de logs oferece filtros por severidade, módulo, ação, resultado, usuário, período e texto, além de expansão de detalhes por registro. O endpoint `/logs/diagnostico/` trata exportação sanitizada condicionada a autorização.

## Política mínima
| Assunto | Recomendação |
|---|---|
| Nível | `INFO` no funcionamento normal, `DEBUG` somente temporariamente em local seguro |
| Redação | remover cookies, tokens, recovery codes, Authorization e dados financeiros desnecessários |
| Permissões | admins do escopo; diagnóstico operacional global apenas superusuários quando aplicável |
| Retenção | definir por política/legislação; evitar apagar sem aprovação |
| Ingestão | alertar em erro de DB, loop de restart, falhas de backup e migrations |

## Investigação de HTTP 500
Capturar timestamp, request id, rota, usuário (ID interno quando permitido), stacktrace sanitizado; correlacionar com migração ou deploy; reproduzir em ambiente isolado. A tela pública de erro não deve exibir traceback.
