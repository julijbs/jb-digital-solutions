# Correção do checkout — pagamento antes do onboarding

Fluxo: contratar na landing → checkout com resumo → conta/login, se necessário → Mercado Pago → confirmação no servidor → onboarding. O cadastro não solicita dados do negócio; os dados do negócio só são preenchidos após o pagamento.

- As ofertas continuam Sistema Completo por R$ 497 na campanha e GBP avulso por R$ 297.
- A função cria/reutiliza um projeto ainda não pago, sem criar intake. Projetos com dados já preenchidos são preservados.
- O link de retorno do Mercado Pago leva ao checkout, com o projeto e o plano. Parâmetros de aprovação na URL não liberam o formulário: a cobrança precisa estar `paid` no banco, após consulta à API do provedor ou webhook assinado.
- O banco restringe INSERT e UPDATE do intake para clientes sem pagamento e cria o intake automaticamente na confirmação. Administradores mantêm o acesso de suporte.
- Checkout e verificador mantêm JWT obrigatório na entrada e também validam usuário/propriedade no código. O webhook usa HMAC e deve ser publicado explicitamente com `--no-verify-jwt`, pois o Mercado Pago não envia JWT do Supabase.
- Na investigação, a tentativa relatada tinha uma preferência criada de 49700 centavos, ainda `pending`. Reabrir seu endereço exibiu “Escolha como pagar” com Sistema Completo e R$ 497; nenhuma compra real foi concluída pelo assistente.

Validação local: nove testes passaram, incluindo bloqueio sem pagamento, recusa de pagamento de outro serviço e acesso com pagamento confirmado; build React e Deno check passaram. A aprovação real de um pagamento e o retorno financeiro exigem transação real do comprador ou teste completo em sandbox; não declarar essa etapa validada sem efetuá-la.

## Pagamento direto, sem conta Mercado Pago

A página `/checkout` usa o Payment Brick oficial, com Pix e cartões habilitados e carteira Mercado Pago ausente. O login no portal JB permanece para vincular o projeto ao comprador; não há redirecionamento para login do Mercado Pago. A área de cobranças também aponta para essa página.

`create-mercadopago-checkout` aceita `mode: embedded` e cria a cobrança com preço calculado no servidor. `process-mercadopago-payment` autentica e verifica a propriedade, usa apenas token de cartão (nunca número/CVV), valida o tipo do meio e envia o valor do banco. Cada cobrança é uma chave de idempotência, e um pagamento já criado é consultado antes de nova tentativa. O Status Screen exibe Pix e desafios 3DS do banco; só aprovação com referência/moeda/valor conferidos libera onboarding. Webhook e verificação existentes continuam válidos. Credencial pública do SDK é intencionalmente publicável; Access Token permanece exclusivamente nos Secrets.

Validação automatizada: preço não adulterável, carteira sem token rejeitada, expiração, campos de cartão e 3DS, além dos testes anteriores de aprovação e bloqueio de onboarding. Não confundir renderização do formulário com confirmação de transação real.
