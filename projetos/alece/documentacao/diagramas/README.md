# Diagramas editáveis e renderizados

Os diagramas de `01_` a `12_` são sínteses técnicas da documentação e do snapshot de código inspecionados. Cada figura tem `.dot` (fonte Graphviz), `.mmd` (Mermaid) e `.svg` renderizado. A fonte SVG permite zoom sem perder nitidez; o DOT permite edição e renderização com Graphviz, e `.mmd` funciona em Markdown que aceita Mermaid.

**Modelo relacional:** o desenho `04_modelo_entidades.svg` é intencionalmente reduzido: o inventário `apendices/inventario_campos.csv` e o dicionário físico contêm as declarações detalhadas; não interprete ausência de aresta como ausência de FK.

**Arquivo original do autor:** `historicos/*.svg` e `historicos/fontes/*` foram preservados sem modificação, separados dos diagramas novos.

Renderizar fonte DOT, em ambiente com Graphviz instalado:

```sh
dot -Tsvg 02_deploy_containers.dot -o 02_deploy_containers.svg
```

Os diagramas não substituem código, migrations ou uma especificação UML executável. Para mudanças de domínio, atualize os desenhos junto dos contratos.
