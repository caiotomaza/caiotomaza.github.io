> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Design system e experiência responsiva

## Identidade visual
O site de apresentação e o projeto usam a marca ALECE Finance, com cor primária verde, tipografia sans-serif do ambiente e variações light/dark. Os SVGs oficiais do ZIP original são preservados em `assets/identidade/`, especialmente `favicon_original.svg`. O frontend possui tokens em `src/view/static/finance/alece.css`, não dependência de uma biblioteca UI geral.

## Tokens evidenciados
| Token | Tema claro | Tema escuro |
|---|---|---|
| Fundo | `#F6F8F5` | `#0D1512` |
| Superfície | `#FFFFFF` | `#15211B` |
| Texto | `#17261D` | `#F2F7F2` |
| Primário | `#146C43` | `#65D4A0` |
| Borda | `#DBE5DD` | `#34453B` |

## Princípios de composição
- Títulos e ações pertencem ao cartão que comandam; margem superior consistente.
- Tabelas têm contêiner com bordas e espaçamento interno; extremidades de colunas com recuo suficiente.
- Botões + filtros com alturas e raios compatíveis, sem gradientes discrepantes.
- `checkbox`, `select`, `input`, date e opções de select legíveis no dark mode.
- Popup ~540 px no desktop e largura fluida no mobile; scrollbar discreta, sem rolar a página atrás.
- Alterações não salvas pedem confirmação antes de fechar; ações destrutivas exigem confirmação específica.
- Ícones têm `aria-label` em botões sem texto; formulários rotulados, foco visível e teclado suportado.

## Não confundir consistência com uniformidade absoluta
Tabelas densas podem usar scroll horizontal **interno** no mobile; cards e filtros devem refluír. Acessibilidade de contraste, zoom 200% e leitores de tela requerem testes dedicados, não apenas comparação visual.

## Componentes e CSS
`alece.css` define os tokens; `alece_ui_consistency.css` contém regras adicionais específicas. Regras globais conflitantes foram fonte de regressões históricas; documente precedência e remova overrides obsoletos antes de expandir o design system.
