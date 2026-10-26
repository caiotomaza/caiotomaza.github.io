# ALECE — Estado documentado e fontes

**Marca:** ALECE. **Origem do nome:** homenagem a Alice Hercília. Não há vínculo institucional com a Assembleia Legislativa do Ceará.

## Fontes
1. `alece(3).zip`, portfólio e protótipo fornecidos para esta atualização.
2. Snapshot completo de código já disponível na conversa até 25/10/2026, incluindo Docker Compose, testes e documentação.
3. Pacote `ALECE_DOCUMENTACAO_TECNICA_COMPLETA_2026-10-25.zip`, 30 capítulos e 12 diagramas, publicado em `documentacao/`.

## Separação entre produto e demo
O live teste em `teste/` é HTML/JS estático e usa **somente dados fictícios**. Não autentica, não persiste em PostgreSQL, não grava recursos no backend e não oferece movimentações reais. A aplicação Django do repositório é outra distribuição, executada em Docker Compose.

## Implementação verificada no snapshot de código
- Monólito modular Django 5.2 (MVT/MVC por responsabilidade) com Python 3.12 no Docker, PostgreSQL 16 e Docker Compose.
- Núcleo/workspace, perfis, autenticação por usuário/e-mail opcional, senhas e códigos de recuperação, permissões por módulo, contas, despesas, investimentos, movimentações auditáveis e estornos.
- Importação de CSV/OFX/PDF com prévia e confirmação separada; compatibilidade por instituição/formato não é universal.
- Provedores de IA opcionais, uma integração habilitada por vez, consentimento antes de compartilhamento de dados.
- Relatórios e exportação/importação de dados financeiros sem identidade de usuários, com XLSX de leitura.
- Logs de inicialização, healthchecks e suíte de regressão por módulo; a passagem integral da suíte com PostgreSQL não foi comprovada nesta revisão estática.

## Limitações
A aplicação é projeto em desenvolvimento, sem afirmação de homologação 100% ou auditoria de segurança independente. A documentação pode conter capítulos e históricos específicos de datas anteriores. Consulte `documentacao/REGISTRO_DAS_FONTES.md` e o repositório oficial antes de usar para produção.

## Origem
Projeto brasileiro, iniciado no Ceará por profissionais da NTEC e aberto à comunidade brasileira e mundial, segundo declaração de seus responsáveis. A marca exibida foi recuperada dos arquivos do protótipo fornecidos pelo autor.
