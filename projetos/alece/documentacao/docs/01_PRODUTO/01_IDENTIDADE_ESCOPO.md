> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Identidade, propósito e contrato do produto

**ALECE Finance** é uma aplicação web de gestão financeira pessoal/familiar, planejada para execução **self-hosted**. O usuário hospeda o software, mantém os dados sob seu controle e pode inspecionar e alterar o código sob **GNU GPL-3.0-only**. O nome remete à história familiar narrada nos documentos do projeto; essa origem não implica associação institucional com entidades homônimas.

## Problema e proposta de valor
O produto evita confundir previsão financeira com dinheiro movimentado. Reúne renda planejada, saldos de contas, despesas recorrentes e eventuais, investimentos, metas, reserva, movimentações efetivas, importações e relatórios. Cada evento financeiro tem uma fonte de verdade em dados persistidos e deve ser auditável.

## Público e operação
- Pessoa individual ou grupo familiar em espaço financeiro (`Workspace`) com um ou mais usuários.
- Dois papéis de negócio: `admin` e `common`. Ser administrador de um espaço não concede acesso a outro.
- Até cinco perfis financeiros **ativos** por espaço, além de arquivados/históricos.
- Navegação em português brasileiro com rotas sem acentos: `/visao-geral/`, `/despesas/`, `/investimentos/`, `/movimentacoes/`, `/configuracoes/`.
- Interface em claro/escuro e controle de aparência associado ao usuário.

## Princípios normativos
1. **Estabilidade > confiabilidade > segurança > recuperabilidade > manutenibilidade > desempenho.**
2. **Privacidade por desenho:** o sistema não exige telemetria; envio a provedor externo de IA requer escolha e consentimento explícitos.
3. **Planejar não é executar:** cadastro de renda, contas ou compromissos não gera pagamento.
4. **Histórico auditável:** valores financeiros confirmados não devem ser apagados por correção silenciosa; usar estorno/correção rastreável.
5. **Autorização no servidor** por usuário, espaço, perfil, módulo e objeto; esconder botões não equivale a controlar acesso.
6. **Portabilidade:** Docker Compose é o alvo operacional, sem dependência indispensável de um servidor ZimaOS específico.

## Fora do escopo desta documentação
Não é garantia de retorno financeiro, conciliação automática sem supervisão, auditoria regulatória, política de privacidade jurídica nem laudo de pentest. A especificação v1.32.1 inclui decisões históricas que podem não ter sido materializadas.

## Evidências e trilha
- Fontes anexadas: `ALECE_Contexto_Integral_para_Gemini_2026-10-18.md`, `ALECE_Documentacao_Completa_Engenharia_2026-10-18.md`, `documentacao-tecica_v1.32.1.md`.
- Código conferido: `README.md`, `docs/PRODUCT.md`, `src/web.py`, `src/controller/apps/finance/models.py`.
