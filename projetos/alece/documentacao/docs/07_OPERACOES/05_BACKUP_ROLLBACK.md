> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Backup, restauração e rollback

## Camadas de backup
1. **PostgreSQL lógico consistente:** schema, usuários, auditoria, financeiro, permissões e dependências.
2. **Volumes persistentes:** mídia, chaves de IA, segredos e backup financeiro. Não confundir dump do DB com conteúdo de `app_media`.
3. **Configuração versionada:** `compose.yaml`, imagem/tag, variáveis sem segredos e registro de mudanças.
4. **Financeiro portável:** ZIP `financeiro.json` + XLSX + manifesto; **não inclui** identidades, permissões nem auditoria e não substitui (1).

## Processo seguro
Inventariar → realizar backup anterior → calcular SHA-256 → verificar hash imediatamente → validar restauração em instância isolada → aplicar alteração → smoke + regressão → conservar arquivos e log de intervenção → manter retorno documentado.

## Exemplo de manifesto técnico
Para cada arquivo registrar SHA-256, tamanho, data/hora, host, versão, tipo de backup e local de armazenamento. Evitar colocar senha de banco em parâmetros de linha de comando e log.

## Falhas a evitar
- `docker compose down -v` elimina volumes.
- Restaurar DB sem segredos de sessão/chaves/mídia pode quebrar login, anexos e integrações.
- Rodar migrations novas antes de ter backup impedirá rollback simples.
- Importar ZIP financeiro dando edição geral a usuários de destino aumenta superfície de acesso.

## Teste de recuperação
Validar login administrativo, perfil, conta, saldos, ledger, uma movimentação de teste no ambiente **isolado**, histórico e mídia. Nunca declarar backup “testado” apenas porque o arquivo existe e o hash bate.
