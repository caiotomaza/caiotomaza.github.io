# Validação do site ALECE

- Site gerado a partir de ZIP enviado, preservando diagramas, fontes, favicon e identidade; backup do ZIP original criado e SHA-256 validado.
- Página principal atualizada com documentação, stack do Compose de referência e transparência sobre o estado da aplicação.
- Live teste atualizado com configurações, relatórios, logs, e cadastro/seleção fictícia de API; sem conectividade com Django nem terceiros.
- Arquivos das bandeiras Brasil/Ceará e marca NTEC extraídos de data URIs contidas no próprio site enviado.
- Links internos auditados por script, JavaScript verificado com Node.js, responsividade revisada em Chromium nos breakpoints testados (conforme relatório final).
- Documentação técnica consolidada foi incorporada, sem transformar dados históricos em garantia de comportamento de produção.
- Não foram executados testes de banco ou Docker porque esta entrega contém exclusivamente um site estático.

## Publicação e rollback
1. Preserve a versão atual em ZIP e valide SHA-256.
2. Substitua somente `projetos/alece/` pelo conteúdo da pasta `alece/` do ZIP.
3. Verifique `/projetos/alece/`, `/projetos/alece/teste/`, `/projetos/alece/documentacao/` em navegador e mobile.
4. Em regressão, restaure a pasta anterior; o repositório do backend e seus volumes não são alterados.

**Links relativos para `../../`:** apontam intencionalmente à raiz do portfólio no GitHub Pages e não existem dentro deste pacote isolado; devem ser testados depois de publicar na estrutura `/projetos/alece/`.
