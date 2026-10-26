> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Segurança: ativos, ameaças e controles

## Ativos críticos
Dados financeiros, integridade do ledger, conta de admin, códigos de recuperação, sessões, chaves de IA, DB, uploads, dumps e logs de auditoria.

## Fronteiras de confiança
Browser e uploads são não confiáveis. Provedores de IA são terceiros externos. O container web tem direito restrito ao banco e volumes. A aplicação deve verificar autorização por workspace/objeto em **cada** ação.

| Ameaça | Vetor | Controle documentado / a confirmar |
|---|---|---|
| IDOR/BOLA | manipular `profile_id` ou `object_id` | `require_workspace_admin`, `require_module`, validação de ownership |
| CSRF | POST originado em outra página | Django CSRF middleware e tokens |
| força bruta | login/recovery | `AuthenticationAttempt`, throttling, hashes de códigos |
| exfiltração IA | endpoint externo ou prompt injection | allowlist, consentimento, minimização, volume privado de tokens |
| SSRF | endpoint de IA personalizado | validação de host/HTTPS, bloqueio de destinos internos |
| upload malicioso | CSV/OFX/PDF e ZIP de backup | limites, parser defensivo, staging, hashes, transação |
| concorrência financeira | confirmação duplicada | idempotência, bloqueio transacional e constraints |
| vazamento em logs | traceback e parâmetros | sanitização, permissão admin, sem segredos nos logs |
| perda de dados | volume removido ou migração | pg_dump, teste de restore, backups SHA-256, rollback |
| tema/acessibilidade | baixo contraste em opções | CSS de `color-scheme`, testes light/dark |

## Controles configurados
`SECURE_CONTENT_TYPE_NOSNIFF=True`, `X_FRAME_OPTIONS='DENY'`, SameSite=Lax para cookies e proteção CSRF. `ALECE_SECURE_COOKIES` configura Secure de cookies; defina `true` quando servido sobre HTTPS com proxy corretamente configurado. `DEBUG=False` em produção.

## Recomendações de desenvolvimento
Usar OWASP ASVS, autenticação com teste negativo, threat modeling nos fluxos de importação/IA/export, scan de dependências e revisão de permissão por objeto em PR. Este documento não certifica a implementação nem substitui um pentest.
