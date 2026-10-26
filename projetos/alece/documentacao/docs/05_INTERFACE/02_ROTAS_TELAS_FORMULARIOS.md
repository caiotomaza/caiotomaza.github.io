> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Rotas, views e contratos de UI

## Rotas canônicas
| Caminho | Tela | Operação típica |
|---|---|---|
| `/visao-geral/` | dashboard | leitura, edição contextual de renda |
| `/despesas/` | despesas | CRUD, filtro, pagamento vinculado |
| `/investimentos/` | investimentos | posições, metas, reserva |
| `/movimentacoes/` | transações | consulta, importação e confirmação |
| `/configuracoes/` | conta/admin | usuários, perfis, APIs, logs e relatórios |
| `/logs/` | auditoria | filtros e expansão de evento |
| `/relatorios/` | panoramas | relatórios e transferências |
| `/entrar/` / `/sair/` | autenticação | sessão |
| `/saude/ativo/` / `/saude/pronto/` | health | liveness/readiness |

A origem exata dos caminhos está em `src/web.py`. Rotas de detalhes, CRUD e auditoria também são definidas nos includes de apps. Consulte `03_CATALOGO_ROTAS_GERADO.md` para extratos diretos das declarações `path()` observadas. Algumas URLs são construídas dinamicamente; o inventário estático não substitui `python manage.py show_urls` ou a resolução real em Django.

## Formulários
- HTTP GET carrega leitura/formulário; POST faz operação mutável com CSRF.
- O redirecionamento após POST reduz reenvio e permite mostrar confirmação.
- Um modal visual não muda autorização; o endpoint continua independente e seguro.
- Nunca montar URL de escrita concatenando IDs fornecidos sem validar seu espaço.

## Tratamento de erros
Handlers Django 400, 403, 404, 500 e 503 renderizam página ALECE de erro; logs de diagnóstico devem ser protegidos. Nenhum stack trace, token, segredo de sessão ou cookie deve aparecer em página pública.
