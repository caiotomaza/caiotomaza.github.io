> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Identidades, núcleos, perfis e autorização

## Separação de identidades
`auth.User` é a conta de login. `UserProfile` guarda preferências complementares. `Workspace` limita a operação financeira; `WorkspaceMembership` vincula usuário e papel (`admin`/`common`). `FinancialProfile` guarda saldo, renda e vínculos financeiros. `ProfileGrant` concede acesso entre membership e perfil.

## Matriz por módulo
Cada grant contém níveis `none`, `view`, `edit` para `overview`, `accounts`, `expenses`, `investments` e `movements`. `edit` pressupõe leitura. Os checkboxes **Visualizar** e **Editar** são controles de interface para aplicar níveis em massa; o backend deve validar os níveis de cada módulo.

## Regras de acesso
- Administrador de núcleo: gerencia seu espaço e seus perfis, não ganha direitos em outros espaços.
- Usuário comum: só entra em perfil e módulo com grant explícito.
- O alvo de qualquer URL com `profile_id`, `workspace_id`, `account_id` ou `membership_id` precisa ser verificado no servidor.
- Arquivamento: o perfil deixa de aparecer nas operações ativas, preservando histórico.
- Exclusão lógica: `FinancialProfile.deleted_at` registra remoção de uso normal sem quebrar referências do ledger.
- A exclusão administrativa de usuário preserva identidade técnica anonimizável quando necessária para auditoria.

## Recuperação de conta
Recuperação por **seis códigos de uso único** gerados na emissão. O armazenamento inclui `code_hash`, `slot`, `used_at`; os originais não podem ser relidos após confirmados. O primeiro cadastro exige geração; copiar e baixar `txt` ocorre na emissão. Não é correto oferecer um botão de "ver códigos antigos".

## Login
Nome de usuário é obrigatório. E-mail é opcional e, se cadastrado de forma única, também pode identificar o usuário na autenticação; senha continua verificada pelo Django. Limites de tentativas ficam registrados sem salvar senhas digitadas.

## Fluxo de segurança
Autenticar → resolver espaço/perfil → verificar papel → verificar grant por módulo → validar vínculo de objeto → executar serviço → registrar auditoria. **Nunca** antecipar permissões apenas por checkbox do navegador.

## Casos negativos
- Usuário A tenta editar o perfil de outro núcleo → negar.
- Usuário comum tenta abrir `/configuracoes/api/` → negar.
- Usuário bloqueado tenta login por e-mail → negar.
- Seis códigos usados/expirados → negar reutilização.
- Conta desativada → bloquear sessão ou ações conforme política do backend.
