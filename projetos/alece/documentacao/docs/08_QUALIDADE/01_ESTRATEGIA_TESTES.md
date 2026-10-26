> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Estratégia de testes: qualidade funcional e estabilidade

## Camadas
| Nível | Exemplos | Quando executar |
|---|---|---|
| Static/lint | compile Python, validar YAML, lockfiles e importação de módulos | cada PR |
| Unitário | cálculos Decimal, Reserva, competência, normalização, idempotência lógica | a cada alteração de regra |
| Integração Django/DB | CRUD, constraints, autenticação, permissões, migrações, ledger | CI em DB isolado |
| E2E | criação de perfil, pagamento, estorno, importação/revisão, UI responsiva | release / homologação |
| Segurança | IDOR, CSRF, rate-limit, dados enviados para IA, upload adversarial | PRs sensíveis e releases |
| Operação | restore real, startup, liveness/readiness, health, logs | homologação / após deploy |

## Organização de testes
- `tests/auth/`: setup, login, senha, e-mail, recuperação por 6 códigos.
- `tests/configuration/`: gestão de usuário, perfis, grants, IA e seleção exclusiva.
- `tests/finance/`: cálculos, views, ledger, CRUD e indicadores.
- `tests/imports/`: importação bancária e ZIP financeiro.
- `tests/reports/`: relatórios e exportações.
- `tests/ui/`: navegação, tema e screenshots.
- `tests/operations/`: startup, rotas, segurança, logs e estrutura do repo.

## Critérios mínimos do pipeline
Compilação, check Django, migrations no banco de teste, suíte unit/integration, form CSRF, cobertura prioritária de dinheiro/permissão, visual em mobile/desktop, teste de instalação limpa e restauração em ambiente descartável.

## Limites de evidência
Há testes estruturais e de cálculo declarados em conversas anteriores, mas a suíte Django/PostgreSQL integral não foi executada no ambiente desta documentação. A presença de um arquivo de teste não prova execução ou aprovação.
