# ALECE — correção de qualidade, isolamento de testes e avaliação de maturidade

**Referência:** 25 de outubro de 2026. **Estado:** edição verificada estaticamente; testes Django/PostgreSQL e testes de restore aguardam execução em Docker.

## Correções nesta edição

1. **URLs:** `/administracao/` é a única instalação do Django Admin no namespace `admin`. `/admin/` e seus subcaminhos redirecionam requisições GET/HEAD com HTTP 302 para a rota canônica. POST legado responde 405 (não se redirecionam dados administrativos de formulário); o alias não instala uma segunda cópia do Admin. O aviso `urls.W005` não deve mais ocorrer. Validar com `python manage.py check --fail-level WARNING` no ambiente real.
2. **Auditoria financeira:** o comando `verify_ledger_backup` tinha um defeito de severidade alta: acumulava divergências apenas na saída de erro, mas retornava uma lista vazia. A correção acumula efetivamente as divergências e interrompe a operação com `CommandError`, sem emitir uma aprovação falsa. Perfis ausentes agora retornam erro. Snapshots aceitos têm SHA-256 externo do conteúdo efetivamente gravado e não sobrescrevem arquivo existente.
3. **CI:** checagens do Django passam a falhar com warnings. Mantidos migrações, linter, auditoria de dependências e suíte pytest; stdout e JUnit são exportados mesmo em falhas da suíte.
4. **Regressão local isolada:** adicionados `docker/Dockerfile.tests`, `compose.validation.yaml`, `scripts/Validar-Completo-ALECE.ps1` e `.sh`. Eles usam imagem de teste, PostgreSQL efêmero em `tmpfs`, rede separada e **nenhum volume compartilhado com a produção**. Relatório: `test-results/pytest.xml`, log da intervenção: `HOME/logs/YYYY-MM-DD_HH-MM-SS.log`. Não execute `pytest` usando o banco da produção.
5. **Restore de PostgreSQL:** `scripts/Testar-Restauracao-ALECE.ps1` restaura um `.dump` já criado e com `.sha256` validado em um container postgres isolado (`--network none` e `tmpfs`). Verifica `pg_restore` e tabelas essenciais. **Não é prova completa de consistência contábil**: executar posteriormente auditorias de saldos e testes financeiros em ambiente controlado. O container é descartável, mas não os arquivos de backup e logs.

## Validação no ambiente que gerou o pacote

- **31 testes locais de estrutura, navegação e cálculo**: aprovados (sem Django). Alguns testes adicionais podem ser encontrados na suíte isolada.
- **Sintaxe Python e YAML:** verificada.
- **Django/PostgreSQL completo, Docker Compose real, integração por HTTP e restore real:** não executados neste ambiente. Não há justificativa para classificar como verde.
- **Histórico recebido do usuário:** inicialização, migrações e rotas principais tiveram respostas normais no log de 25/10; houve aviso `urls.W005` no código anterior, agora corrigido. Esse log não demonstra aprovação de CRUD ou recuperação real de dados.

## Execução recomendada no Windows

1. Preserve o estado atual antes de implantar: dump do PostgreSQL, `.env` da instalação e volumes com dados. Verifique SHA-256 de cada backup; mantenha rollback e acesso administrativo.
2. Extraia o ZIP completo em um diretório novo. **Não copie `.env` sobre um `.env` existente sem reconciliar as configurações.** Os segredos reais ficam em volume externo do Docker.
3. Execute `./scripts/Validar-Completo-ALECE.ps1` (PowerShell na raiz do projeto) para rodar o banco de teste isolado. Abra `test-results/pytest.xml` e o log gerado em `HOME/logs`.
4. Execute `./scripts/Testar-Restauracao-ALECE.ps1 -Dump 'CAMINHO_DO_DUMP' -Sha256 'CAMINHO_DO_DUMP.sha256'` para ensaiar a restauração. O dump **nunca é importado no banco da aplicação atual**.
5. Somente se a suite e o restore passarem, faça a atualização planejada. Para reverter código, volte ao ZIP anterior; para reverter alterações de schema/dados, restaure o dump validado em procedimento controlado.

No Linux, utilize `bash scripts/Validar-Completo-ALECE.sh` na raiz; PowerShell no Windows requer acesso ao Docker Desktop.

## Critérios de liberação para produção

- `python manage.py check --fail-level WARNING` e `check --deploy` analisado de acordo com a configuração HTTPS de produção.
- Suíte Django/PostgreSQL e regressões financeiras verdes, com `pytest.xml` verificável e sem falhas ou erros.
- Testes de autenticação, CSRF, permissões por módulo, bloqueio entre usuários e perfis, códigos de recuperação, CRUD e trilhas de auditoria.
- Reconciliação contábil testada com lotes balanceados **e adulterados**; estornos, transferências e importação bancária sem duplicações.
- Backup PostgreSQL verificado por SHA-256; restauração real concluída, dados comparados, procedimento de rollback ensaiado.
- Segurança de ambiente, atualizações de dependências, limites de upload, HTTPS e política de retenção de logs avaliados.

Nenhum teste elimina todos os riscos. A avaliação atual é **funcional para desenvolvimento**, não produção financeira crítica certificada.

## Recomendação de nome e estratégia de marca

**ALICÉRIA — Finanças sob seu controle.** União de **Alice** + **Hercília**, nome da pessoa homenageada.

Proposta de identidade: "software livre, GNU GPLv3, self-hosted, privacidade por princípio, seus dados sob seu controle".

Alternativas: **Hercília** (mais pessoal) e **ALICE Livre** (mais imediatamente reconhecível, porém menos distintiva). **Alice Finance** já é utilizado por aplicativo publicado de terceiros; evite essa combinação sem pesquisa jurídica.

A alteração deste pacote **não renomeia** banco, chaves, namespaces internos `ALECE_*`, containers nem URLs: a troca de marca deverá ser realizada em fase separada para não comprometer volumes e compatibilidade.

Registrar disponibilidade e colisões antes de publicar: busca de marca no INPI, domínios, GitHub e lojas de aplicativos. Pesquisa web informal não dá exclusividade jurídica.
