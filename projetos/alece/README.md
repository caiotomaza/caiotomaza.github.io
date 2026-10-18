# ALECE — portfólio técnico e live teste

Site estático para **GitHub Pages** no endereço `https://caiotomaza.github.io/projetos/alece/`.

## Publicar

Extraia os **arquivos internos do ZIP** diretamente dentro de `projetos/alece/` no repositório `caiotomaza.github.io`. Não inclua outra pasta `alece` dentro da atual; não altere o `index.html` da raiz.

- `index.html` — página de apresentação (tema dark por padrão; alternância light).
- `styles.css`, `script.js`, `favicon.svg` — apresentação estática, sem build.
- `assets/interface-alece.webp` — captura da demo (valores ocultos).
- `assets/mapa-financeiro-original.jpg` — mapa mental fornecido pelo autor, preservado.
- `assets/diagramas/*.svg` — diagramas vetoriais renderizados (arquitetura, classes/UML e fluxo de confirmação).
- `docs/*.puml` / `*.dot` / `*.md` — código-fonte dos diagramas e explicação da modelagem para baixar e adaptar.
- `teste/index.html` — live teste, com dados fictícios e processamento local na aba, preservado da versão anterior.

## URLs

- Site: `https://caiotomaza.github.io/projetos/alece/`
- Protótipo: `https://caiotomaza.github.io/projetos/alece/teste/`
- Repo do produto: `https://github.com/caiotomaza/alece`

## Critérios documentais

O repositório oficial informa **base técnica v0.2.0**, licença **GNU GPL v3 somente (GPL-3.0-only)**, Django 5.2 LTS, Python 3.13, PostgreSQL 18, Docker Compose e auth/modelos iniciais; a interface HTML v1.32.1 **não está integrada** ao banco. Conteúdo do portfólio distingue o que já está disponível do planejado. O ALECE homenageia Alice, mãe do autor e profissional da área de economia; o nome está sujeito à revisão de distintividade por coincidir com sigla institucional conhecida. **Não há afiliação com a Assembleia Legislativa do Estado do Ceará.**

A privacidade e a ausência de telemetria compulsória são compromissos de produto; não substituem auditoria de futuras versões. Não utilizar o starter para dados financeiros reais antes de completar implementação e homologação.

## Diagramas

Os diagramas foram construídos com base nos modelos em `apps/finance/models.py` e regras de `docs/ARCHITECTURE.md` / `docs/DOMAIN.md` do repositório do projeto, combinados com a especificação e a lógica financeira disponibilizada pelo autor. UML é documental: o esquema persistido verdadeiro está nas migrations Django.

O `.puml` pode ser editado em ferramentas compatíveis com PlantUML; o `.dot` é fonte para Graphviz (exemplo `dot -Tsvg docs/modelo-classes.dot -o modelo.svg`).

**Visualização mobile:** o fluxo de confirmação usa diagrama vertical; o modelo UML pode ser arrastado horizontalmente e possui link para o SVG em escala completa.
