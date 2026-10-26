# ALECE Finance — Documentação técnica consolidada

![ALECE Finance](assets/identidade/logo_horizontal_derivado.svg)

**Data:** 25 de outubro de 2026  
**Idioma:** português brasileiro  
**Natureza:** documentação de engenharia, produto, arquitetura, regras financeiras, dados, UI, operação, segurança e qualidade.  
**Licença do software documentado:** GNU GPL-3.0-only, conforme fontes examinadas. O pacote documental preserva o conteúdo original de referência.

## Como usar

- **Navegar offline:** abra [`index.html`](index.html) ou [`manual.html`](manual.html) no navegador.
- **Consultar por tema:** [`INDICE.md`](INDICE.md), e os arquivos em `docs/`.
- **Modificar diagramas:** use `diagramas/*.mmd` (Mermaid), `diagramas/*.dot` (Graphviz) e abra `diagramas/*.svg`.
- **Conferir models e URLs declaradas:** `docs/04_DADOS/02_DICIONARIO_ORM_GERADO.md`, `docs/05_INTERFACE/03_CATALOGO_ROTAS_GERADO.md`, `apendices/*.csv`.
- **Preservar história:** `fontes/docs-alece-original.zip` é cópia byte a byte do arquivo fornecido.

## Escopo da inspeção

Foram cruzados:

1. **Arquivo enviado nesta conversa:** `docs-alece.zip`, que contém especificações, contexto e material do portfólio gerados até 18/10/2026, além de diagramas e protótipo HTML.
2. **Snapshot do código ALECE já presente nesta conversa:** `ALECE_COMPLETO_Arquitetura_Web_Startup_Testes_Modulares_2026-10-24.zip`. Usado apenas como fonte adicional para checagem estrutural de stack, classes, rotas e infraestrutura.

Não foi executada a aplicação real com Django/PostgreSQL, nem provada a implantação atualmente em uso. O material histórico contém requisitos **propostos** e estados de protótipo, que não devem ser promovidos automaticamente a funcionalidades testadas.

## Números documentais

- **30 capítulos Markdown** organizados por domínio.
- **12 diagramas novos** em 3 formatos cada (SVG, DOT e Mermaid), além dos desenhos históricos preservados.
- **26 modelos ORM, 219 campos declarados** e **100 chamadas a path literais** inventariadas por AST.
- **9 bibliotecas** no lockfile de produção do snapshot inspecionado.

### Arquitetura resumida

- **Estilo:** monólito modular Python/Django, **MVT** com diretórios que representam papéis de **MVC adaptado**; serviço de aplicação e domínio separado.
- **Persistência:** PostgreSQL 16 no Compose conferido; ORM e migrations Django.
- **Interface:** Django Templates + CSS/JS próprios; light/dark e design ALECE Finance.
- **Segurança:** autorização por workspace/perfil/módulo/objeto, CSRF, recuperação por seis códigos hash-only, auditoria.
- **Operação:** Docker Compose, Gunicorn, volumes persistentes e healthchecks.
- **Financeiro:** previsão distinta de transação, Decimal, ledger, estornos, importação revisada, IA informativa mediante consentimento, exportação portável JSON/XLSX.

## Pontos de atenção

- Os documentos originais de 18/10 citam PostgreSQL 18 como base técnica histórica; `compose.yaml` do snapshot de 24/10 define **PostgreSQL 16**.
- `docker/start.sh` roda `migrate --noinput` **antes** das validações read-only. Requer backup antes de upgrades.
- Importação do ZIP financeiro para outro espaço, conforme implementação documentada, dá **direito de edição aos membros já cadastrados no destino** nos perfis importados. Reavaliar política de privilégio mínimo.
- **Nenhuma documentação comprova 100% de funcionamento.** O teste em Django/PostgreSQL real e a restauração em ambiente isolado continuam essenciais.
- A exportação financeira portável é deliberadamente incompleta para recuperação total: não inclui identidade, logs ou permissões.

## Logos, marca e fontes

O ícone oficial original foi copiado integralmente em [`assets/identidade/favicon_original.svg`](assets/identidade/favicon_original.svg). A versão horizontal nesta capa é uma composição derivada para fins documentais. Consulte `assets/identidade/README.md`. Nenhum arquivo de fonte foi incluído.

## Integridade e rastreabilidade

- SHA-256 do ZIP original `docs-alece.zip`: `1191a66eb87a9a7710cf192b12e0abe68cb69b6c8c3ff919fd6326067f6b719a`.
- SHA-256 do snapshot de código inspecionado: `3c5fc12804edc39c876f113022982df713841edf3490144570fa3ed52034d723`.
- `MANIFESTO_SHA256.txt` apresenta os hashes dos documentos e mídias.
- `REGISTRO_DAS_FONTES.md` identifica o que é requisito, o que foi visto em código e o que precisa ser verificado em operação.

A documentação é organizada para leitura e manutenção; não altera dados financeiros nem a instalação ALECE existente.
