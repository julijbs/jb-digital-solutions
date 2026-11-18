# Venda avulsa e Black Friday — 18/11/2026

Oferta aprovada: Site Novo R$ 497 até 30/11/2026, 23h59 de Brasília (de R$ 1.497); criação do Perfil Google R$ 297; site + Perfil Google R$ 750. Sem recorrência. Apenas o site tem promoção. Valores calculados no servidor, sem aceitar preço vindo do navegador.

## Ativação Mercado Pago

O projeto do repositório é `rqiacrclsmixmaqhgicc`. Ele não está disponível no conector Supabase desta sessão; não foram aplicadas migrations nem publicados functions ou frontend.

1. Aplicar a migration `20261118000000_one_time_mercadopago.sql` após conferir o esquema real de billing (o repositório registra constraints antigas).
2. Configurar os secrets `MERCADOPAGO_ACCESS_TOKEN` e `MERCADOPAGO_WEBHOOK_SECRET` no projeto Supabase. Nunca colocar no frontend ou no Git. Definir `PUBLIC_SITE_URL=https://jbdigitalsystem.com`.
3. Publicar `create-mercadopago-checkout`, `verify-mercadopago-payment` e `mercadopago-webhook`, incluindo seus módulos em `_shared/`. A configuração JWT está em `supabase/config.toml`; o webhook autentica por HMAC.
4. No Mercado Pago, habilitar notificações de pagamentos para `https://rqiacrclsmixmaqhgicc.supabase.co/functions/v1/mercadopago-webhook` e usar o secret dessa aplicação. A criação da preferência também informa essa URL.
5. Fazer compras com credenciais e contas de teste em cada oferta. Conferir valor, retorno pendente, assinatura inválida, notificações duplicadas e aprovação mesmo sem retorno do navegador. Só então usar credenciais de produção e publicar a landing.
6. Conferir na conta o prazo de liberação real para Pix/cartão. A integração não garante antecipação nem altera as taxas da conta.

O frontend usa Mercado Pago para novas cobranças. O verificador Stripe continua aceitando retornos de sessões antigas. Não cancelamos assinaturas existentes; isso exige examinar as cobranças reais e definir a migração dos clientes.

## Limites e operação

- O fluxo atual exige cadastro e criação de projeto antes de pagar. Os links preservam a escolha do serviço no cadastro/login. Ainda não é compra anônima direto da landing.
- O webhook consulta o pagamento na API do Mercado Pago e só marca como pago após validar referência, moeda e valor; não aceita o status da URL de retorno como comprovante.
- A preferência do site promocional vence no encerramento da oferta. O combo continua a R$ 750 após essa data, conforme os preços aprovados.
- React e Astro recalculam o preço na página aberta. Para atualizar também o HTML e JSON-LD estáticos do Astro após o fim da promoção, reconstruir/publicar o marketing-site em 01/12. O JSON-LD promocional informa priceValidUntil.
- Hospedagem, domínio, transferência de acessos e suporte após entrega precisam de definição comercial antes de publicar a nova oferta; não foi prometida manutenção gratuita vitalícia.
- O engine agora permite `npm run publish -- slug-do-cliente` (vários slugs aceitos); sem argumentos mantém build de todos. Build não faz deploy. Não executamos publicação de sites reais.
- O onboarding recusa intake incompleto, GBP sem site, slugs inválidos e sobrescrita de cliente existente. Estrutura sem copy revisada não avança automaticamente para content_ready. A copy ainda tem etapa manual.

## Validação

Build React e build Astro concluídos. Testes unitários cobrem ofertas, limite da campanha, contador aberto na virada, correspondência do pagamento e assinatura HMAC. Preview mobile inspecionado sem dados de clientes. Checkout real, credenciais e webhook remoto ainda não validados.

O typecheck geral já encontra erros em useGbpReports e AdminProjectDetail; o lint geral também tem problemas anteriores. Os módulos novos de checkout são verificados separadamente.
