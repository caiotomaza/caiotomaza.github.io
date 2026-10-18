# Portfólio de Caio Tomaz — GitHub Pages

Este pacote já está pronto para publicação direta no repositório `caiotomaza.github.io`.
Não é necessário Lovable, npm, dependências ou compilação.

## Estrutura do repositório

```text
caiotomaza.github.io/
├── index.html                    # Seu portfólio principal
├── styles.css
├── script.js
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── .nojekyll
├── README.md
├── assets/
│   ├── perfil.jpg                # Mesma foto do portfólio antigo
│   └── curriculo-caio-tomaz.pdf # Currículo atualizado
└── projetos/
    └── alece/
        └── .gitkeep             # Mantém a pasta vazia no Git
```

Não existem pastas `alice/`, `Alice/` ou `alece/` na raiz e **nenhum site do ALECE foi publicado nesta versão**.

## ALECE — inclusão posterior

O card ALECE do `index.html` tem dois controles:

1. **Portfólio do ALECE**: link já apontando para `/projetos/alece/`. Essa página **não existe ainda**, portanto o endereço só começará a funcionar quando você adicionar o arquivo `projetos/alece/index.html`.
2. **Live teste · em breve**: indicação visual intencionalmente desabilitada. Quando houver uma URL pública, edite o bloco `alece-actions` no `index.html` e substitua o elemento `span` por um `a` com `href="URL_DO_TESTE"`, usando `target="_blank" rel="noopener noreferrer"` quando externo.

O arquivo `.gitkeep` é vazio e serve somente para o GitHub armazenar a pasta. Ele pode ser removido quando o `index.html` for adicionado.

## Publicação

1. Extraia o ZIP.
2. No GitHub, **remova da raiz** os diretórios antigos `Alice/`, `alice/` e `alece/`, além de quaisquer arquivos antigos em `projetos/alece/` que não sejam necessários. Enviar este ZIP **não apaga automaticamente** os arquivos anteriores do repositório.
3. Envie **o conteúdo extraído** para a raiz de `caiotomaza.github.io`, preservando a estrutura.
4. Faça commit na branch publicada pelo GitHub Pages (normalmente `main` com pasta `/ (root)`).

O GitHub Pages permanecerá em `https://caiotomaza.github.io/`.
