# Registro de fontes, método e limites

## Fontes primárias
1. **Arquivo fornecido:** `docs-alece.zip` (SHA-256 `1191a66eb87a9a7710cf192b12e0abe68cb69b6c8c3ff919fd6326067f6b719a`), com especificação técnica v1.32.1, contextualização até 18/10/2026, portfólio e SVGs originais. Preservado em `fontes/docs-alece-original.zip`.
2. **Snapshot adicional de código**, já disponível nesta conversa: `ALECE_COMPLETO_Arquitetura_Web_Startup_Testes_Modulares_2026-10-24.zip` (SHA-256 `3c5fc12804edc39c876f113022982df713841edf3490144570fa3ed52034d723`). Não distribuído aqui porque a solicitação é de documentação, não de pacote de instalação.

## Classificação das afirmações
- **Histórico/requisito:** aparece no documento original; não garante que funcione no código atual.
- **Inspeção estática:** foi lido em arquivo Python, migration, compose, JS ou CSS da distribuição indicada; não garante deploy nem sucesso funcional.
- **Inferência técnica:** síntese de relação entre componentes e padrões, devidamente identificada.
- **Proposta:** melhorias recomendadas, não realizadas nesta entrega documental.

## Divergências observadas
| Tema | Material histórico | Snapshot conferido |
|---|---|---|
| Banco PostgreSQL | referência a 18 em contexto de DevKit/proposta | `postgres:16-bookworm` em `compose.yaml` |
| Python | histórico de DevKit menciona 3.13 | `secrets-init` usa 3.12 Alpine; imagem web é definida por Dockerfile |
| Protótipo v1.32.1 | demo HTML em memória, várias simulações | monólito Django com apps, services, migrations, importação e relatórios presentes |
| Organização | arquitetura alvo modular | `src/web.py`, `src/controller`, `src/model`, `src/view` e testes por domínio |
| Segurança | requisito sem telemetria obrigatória | ausência de telemetria na arquitetura documentada; ainda depende de auditoria de rede e dependências |

## Limites metodológicos
- Não foi instanciado o ORM em PostgreSQL; o inventário usa AST e pode omitir relacionamentos dinâmicos, heranças ou campos criados por metaclasses.
- Não executamos URLconf; rotas criadas em loops ou includes com prefixos dinâmicos precisam ser confirmadas pelo Django.
- Gráficos de entidade são representações **simplificadas**, não provas de integridade do banco.
- A documentação de operações explica procedimentos e riscos, não realizou implantações, restore ou testes E2E.
- Os materiais originais do portfólio podem conter informações de protótipo desatualizadas e permaneceram intactos apenas como arquivo histórico.

## Arquivos de código usados na inspeção
`compose.yaml`, `docker/Dockerfile`, `docker/start.sh`, `docker/logged_start.py`, `src/web.py`, `src/controller/config/settings.py`, `src/controller/apps/{core,finance}/models.py`, `src/controller/apps/{core,finance}/urls.py`, `src/controller/apps/finance/services/*`, `src/requirements/production.lock`, `tests/`, documentação do projeto.
