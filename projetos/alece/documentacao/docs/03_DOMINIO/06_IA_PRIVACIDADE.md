> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Integrações de IA e privacidade de dados

## Papel da IA
O ALECE oferece análises informativas para despesas, investimentos e movimentações. Um provedor não deve criar, alterar, cancelar ou confirmar eventos de ledger. A análise passa por integração HTTP do backend, com envio JSON controlado e consentimento informado.

## Gestão de provedores
Modelos `AIProviderConfig` e `AIAnalysis`. Presets documentados: OpenAI, Gemini, DeepSeek, Groq, Mistral e OpenRouter, além de endpoint personalizado compatível. Endpoint/modelo predefinidos quando possível; chave privada armazenada fora do PostgreSQL no volume `app_ai_tokens` / `/app/private/ai`. Não incluir tokens em HTML, URL, logs ou exportação financeira.

## Seleção exclusiva
A interface permite múltiplos cadastros, mas **uma integração ativa por Workspace**. A migração `core.0009_one_active_ai_provider` aplica exclusividade no banco. Alterar a seleção deve desabilitar o anterior em transação consistente e registrar a operação.

## Política de envio
- Antes do POST externo: mostrar destinatário e escopo dos dados; obter consentimento específico.
- Permitir apenas destinos autorizados (`ALECE_AI_ALLOWED_HOSTS`, onde aplicável), validar HTTPS e bloquear SSRF.
- Minimizar campos pessoais; nunca incluir senha, recovery codes, cookies, tokens, detalhes de sessão ou logs.
- Tratar saída da IA como **texto não confiável**; não renderizar HTML bruto nem executar comandos sugeridos.
- Preferir timeout, limite de tamanho, registros redigidos e falha controlada.

## Ameaças
SSRF por endpoint personalizado, prompt injection em extratos, vazamento de dados em prompt, excesso de permissão, formato JSON arbitrário e alucinação financeira. Esses pontos são requisitos de revisão contínua, não provas de segurança já certificada.

## Evidência
`core/ai_catalog.py`, `ai_credentials.py`, `ai_service.py`, `settings_views.py`, `models.py` e migração 0009.
