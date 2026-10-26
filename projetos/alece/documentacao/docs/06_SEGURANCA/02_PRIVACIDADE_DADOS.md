> **Base factual.** Conferência documental do `docs-alece.zip` (especificações históricas de 18/10/2026) e inspeção estática de uma distribuição do projeto de 24/10/2026 fornecida nesta conversa. As afirmações sobre implementação apontam arquivos de código; nada aqui comprova implantação real, execução dos testes de integração ou ausência de defeitos.

# Privacidade, retenção e exportação

O ALECE adota compromisso de self-host e não transmissão compulsória de telemetria. O usuário mantém controle do servidor, mas continua responsável por segurança física/lógica, acesso, rotinas de backup e eventuais obrigações legais aplicáveis.

## Classes de dados
- **Credenciais:** hash de senha e códigos de uso único; não exportar em pacote financeiro.
- **Dados financeiros:** nomes de contas, datas, valores, descrições e categorias; podem conter dados pessoais incidentalmente.
- **Dados de segurança/auditoria:** IP e eventos de operação sujeitos a retenção controlada e acesso restrito.
- **Integração externa:** JSON financeiro enviado a IA somente mediante ação/autorização/consentimento.

## Minimização
Não usar dados reais nos screenshots/fixtures; evitar PII em logs; mascarar códigos de recuperação após primeiro acesso; exportações portáveis não incluem usuários ou senhas; auditar downloads de backups.

## Retenção e deleção
Exclusão lógica preserva relações de ledger. A definição de prazos reais de retenção, atendimento de direitos de titulares e base legal depende de política organizacional e não está inteiramente estabelecida no pacote histórico.

## Backup
Criptografar armazenamento e transferência de backup quando aplicável; incluir integridade com SHA-256 e testar restauração. Logs de importação devem registrar sucesso/falha sem conter o conteúdo integral de dados sensíveis.
