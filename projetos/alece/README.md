# ALECE — site institucional, documentação e live teste

Site estático para GitHub Pages em `https://caiotomaza.github.io/projetos/alece/`.

## Publicar
Extraia **o conteúdo dentro da pasta `alece/` do ZIP** diretamente em `projetos/alece/` no repositório `caiotomaza.github.io` (não aninhe outra pasta `alece`). Preserve o index do portfólio na raiz do repositório.

Estrutura:
- `index.html`, `styles.css`, `script.js`: landing page sem backend.
- `assets/`: imagens, diagramas, marcas e bandeiras originais.
- `documentacao/`: 30 capítulos, 12 diagramas com fontes e referências de código, manual HTML navegável.
- `teste/index.html`: ambiente estático demonstrativo, sem autenticação, banco, IA real ou dados de usuário.
- `docs/`: diagramas originais e notas do site anterior, preservados.
- `ESTADO_E_FONTES.md`: rastreabilidade do conteúdo.

## Produto real e demonstração
A aplicação Django é mantida no repositório oficial `https://github.com/caiotomaza/alece` e instalada com Docker Compose. O site público mostra conceitos e protótipos fictícios; não é o serviço financeiro real.

## Validação
Veja `VALIDACAO_SITE.md`: links internos, estados de páginas, sintaxe JavaScript, breakpoints e assets. Para novas versões, confira a stack declarada com o Dockerfile e Compose do repositório e atualize a documentação correspondente.

## Identidade e origens
Marca: ALECE, homenagem a Alice Hercília. Projeto independente; não há vínculo com a Assembleia Legislativa do Estado do Ceará. Iniciado no Ceará por profissionais da NTEC, aberto à comunidade brasileira e mundial, conforme informações do responsável. Logos de proveniência: `assets/identidade/CREDITOS.md`.
