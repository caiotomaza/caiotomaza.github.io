# ALECE — Índice da documentação técnica

**Consolidação documental — 25/10/2026**.

Esta biblioteca descreve o produto, o domínio, padrões de engenharia e implementação observada. **Não é laudo de instalação**; especificações históricas estão separadas das evidências do código.

Comece em [`README.md`](README.md) e no [`manual.html`](manual.html), que pode ser aberto offline.

## Produto

- [Identidade, propósito e contrato do produto](docs/01_PRODUTO/01_IDENTIDADE_ESCOPO.md)
- [Mapa funcional por página, regra e persistência](docs/01_PRODUTO/02_MATRIZ_FUNCIONAL.md)

## Arquitetura

- [Estilo arquitetural e fronteiras](docs/02_ARQUITETURA/01_ESTILO_CAMADAS.md)
- [Stack, dependências e infraestrutura](docs/02_ARQUITETURA/02_STACK_EXECUCAO.md)
- [Estrutura de repositório e responsabilidades](docs/02_ARQUITETURA/03_ESTRUTURA_REPOSITORIO.md)

## Domínio financeiro

- [Glossário financeiro e invariantes](docs/03_DOMINIO/01_GLOSSARIO_INVARIANTES.md)
- [Identidades, núcleos, perfis e autorização](docs/03_DOMINIO/02_USUARIOS_PERFIS_PERMISSOES.md)
- [Ledger, contas e integridade transacional](docs/03_DOMINIO/03_LEDGER_CONTAS_ESTORNOS.md)
- [Ingestão CSV, OFX e PDF e conciliação](docs/03_DOMINIO/04_IMPORTACAO_BANCARIA.md)
- [Investimentos, renda, planejamento e Reserva](docs/03_DOMINIO/05_INVESTIMENTOS_RESERVA.md)
- [Integrações de IA e privacidade de dados](docs/03_DOMINIO/06_IA_PRIVACIDADE.md)
- [Exportação e importação financeira portável](docs/03_DOMINIO/07_TRANSFERENCIA_FINANCEIRA.md)

## Modelagem de dados

- [Modelagem de dados: conceitos, relacionamentos e integridade](docs/04_DADOS/01_MODELO_RELACIONAL.md)
- [Dicionário de modelos ORM (gerado automaticamente)](docs/04_DADOS/02_DICIONARIO_ORM_GERADO.md)
- [Migrações, compatibilidade e evolução do esquema](docs/04_DADOS/03_MIGRACOES_EVOLUCAO.md)

## Interface e rotas

- [Design system e experiência responsiva](docs/05_INTERFACE/01_DESIGN_SYSTEM.md)
- [Rotas, views e contratos de UI](docs/05_INTERFACE/02_ROTAS_TELAS_FORMULARIOS.md)
- [Catálogo de rotas identificadas por inspeção de código](docs/05_INTERFACE/03_CATALOGO_ROTAS_GERADO.md)

## Segurança

- [Segurança: ativos, ameaças e controles](docs/06_SEGURANCA/01_MODELO_AMEACAS.md)
- [Privacidade, retenção e exportação](docs/06_SEGURANCA/02_PRIVACIDADE_DADOS.md)

## Operação e deploy

- [Implantação self-hosted e infraestrutura](docs/07_OPERACOES/01_IMPLANTACAO_SELF_HOST.md)
- [Configuração operacional por ambiente](docs/07_OPERACOES/02_VARIAVEIS_AMBIENTE.md)
- [Startup, healthchecks e condições de falha](docs/07_OPERACOES/03_STARTUP_HEALTH.md)
- [Logs, auditoria e diagnóstico](docs/07_OPERACOES/04_LOGS_OBSERVABILIDADE.md)
- [Backup, restauração e rollback](docs/07_OPERACOES/05_BACKUP_ROLLBACK.md)

## Qualidade e testes

- [Estratégia de testes: qualidade funcional e estabilidade](docs/08_QUALIDADE/01_ESTRATEGIA_TESTES.md)
- [Matriz de CRUD, autorização e renderização](docs/08_QUALIDADE/02_MATRIZ_CRUD_ACEITE.md)
- [CI/CD, modelo de trabalho e governança](docs/08_QUALIDADE/03_CICD_PROCESSO_EQUIPE.md)

## Decisões e roadmap

- [Decisões de arquitetura e estado das evidências](docs/09_DECISOES/01_ADRS_E_STATUS.md)
- [Riscos, limitações e roadmap técnico](docs/09_DECISOES/02_RISCOS_LIMITACOES_ROADMAP.md)

## Diagramas

Consulte [`diagramas/README.md`](diagramas/README.md). Diagramas novos em SVG + DOT + Mermaid, com desenhos anteriores preservados em `diagramas/historicos/`.

## Proveniência

- `fontes/docs-alece-original.zip`: fonte original anexada, **sem alterações**.
- Distribuição de código adicional disponível nesta conversa foi usada somente para checagem estática; **não está embutida neste ZIP documental**.

- SHA-256 da fonte histórica: `1191a66eb87a9a7710cf192b12e0abe68cb69b6c8c3ff919fd6326067f6b719a`.
- SHA-256 do snapshot de código: `3c5fc12804edc39c876f113022982df713841edf3490144570fa3ed52034d723`.
