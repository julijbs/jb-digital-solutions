# Handoff — Claude Code · 2026-07-30

Execução da fila do `HANDOFF-COWORK-2026-07-30.md`. Frase de retomada: **"Retomar HANDOFF-2026-07-30-CLAUDE-CODE.md"**.

> ⚠️ Dois itens da fila do Cowork eram **diagnóstico errado**. Detalhe abaixo — não gastar sessão refazendo.

---

## ✅ Concluído e verificado

### 1. Copy de psicologia vazando nos sites vet — RESOLVIDO

Confirmado live antes do fix: `cvp-tijuca.jbdigitalsystem.com` (clínica veterinária) exibia FAQ "…como funciona a **psicoterapia**" e rodapé "ligue **188 (CVV)** ou procure o CAPS".

- Commits `d931cdc` (fix) + `f288014` (artefatos), mergeados na `main` via `chore/testenoclose-legal-pages` (fast-forward, levou junto as páginas legais do TikTok).
- Causa: texto hardcoded em `FAQNativeDetails.astro` e `FooterSimpleColumns.astro` — blocos compartilhados por **todos** os spec-sites. Existe uma única variante de cada, então o fix cobre 100%.
- Solução: props `note` / `disclaimer` com default genérico + campos opcionais `faqNote` / `footerDisclaimer` em `ClientData.copy`. As duas psicólogas passam o texto explícito; `dra-marina-costa` (nutricionista) recebeu nota de nutrição e caiu no disclaimer genérico.
- **13 deploys** disparados via `gh workflow run deploy-client.yml`, todos verdes.
- Validado em produção: 11 domínios sem resíduo; `anamello` e `marcelabarcellos` mantêm psicoterapia + CVV (correto para elas).

**Comando de redeploy (para referência futura):**
```bash
gh workflow run deploy-client.yml -f slug=<slug> -f subdomain=<sub>
```
Subdomínio = slug, exceto: `animal-clinic-bacacheri`→`animalclinic-bacacheri`, `dra-ana-mello`→`anamello`, `dra-marina-costa`→`marinacosta`, `marcela-barcellos`→`marcelabarcellos`. Secrets `CF_*` já estão no repo — não precisa de `.env.local`.

### 2. Central de Objeções alinhada à oferta vigente

`objecoes_jb` (Supabase `rqiacrclsmixmaqhgicc`) — a tabela **só existe ao vivo**, não há migration no repo. Atualizada via PostgREST com o `SUPABASE_SERVICE_ROLE_KEY` do `.env.local` da raiz.

- **id 14** (Preço): R$ 997 sem mensalidade → R$ 1.497 (parcelável) + R$ 149/mês da Presença Ativa + add-on Google R$ 97/mês opcional, sem fidelidade.
- **id 15** (Medo de mensalidade): não podia mais dizer "você não paga mensalidade". Reescrito para afirmar a contrapartida (hospedagem, manutenção, atualizações, relatório) e negar a prisão, não a mensalidade.
- Espelhado em `~/local-seo-navigator/playbooks/jb-scripts-e-objecoes.md` (commit `cb502b5`) e o aviso "não usar" do `KIT-ABORDAGEM-THAIS.md` virou "pode usar".
- **Fato confirmado pela Juliana:** Presença Ativa é mensal, sem fidelidade, cancela quando quiser.

---

## ❌ Diagnósticos do Cowork que estavam errados

| Alegação | Realidade verificada em 30/07 |
|---|---|
| "Kiwify só mostra cartão, sem PIX" | **PIX já estava ativo.** Produto em "Cartão de crédito, boleto e Pix"; checkout `T4mUG5E` exibe Cartão, Boleto e Pix + Apple Pay. |
| "Aviso de lote esgotado no checkout" | **Não reproduz.** Checkout percorrido do topo ao rodapé, sem nenhum aviso de lote ou redirecionamento. |

---

## 🚧 Bloqueado

### PIX no Stripe — não é configuração, é liberação do Stripe

Conta `acct_1OGPWhAtjEQC8Uwg` (jbdigitalmarketing.com.br). **PIX não consta como forma de pagamento elegível.** Elegíveis: Cartões, Apple Pay, Meses sin intereses, Parcelas no Japão, Boleto. Não existe toggle no dashboard.

Não é problema de país — a conta é brasileira (estados BR, fuso America/Sao_Paulo, `pk_live` ativa).

**Caminho:** abrir chamado no suporte Stripe pedindo habilitação do PIX.
**Antes disso:** resolver a **verificação de telefone por SMS**, que está pendente na conta ("Você precisa verificar o número do telefone via SMS para processar pagamentos no Dashboard"). Bate com a nota `Stripe url/phone/branding/PIX` do MEMORY.md.

### Order bump R$ 27 — 80% montado, travou no upload (01/08)

⚠️ **NÃO ativar o bump antes de concluir o passo 1 abaixo.** Hoje o produto existe mas entrega uma pasta vazia.

**O que descobri antes de montar:** a copy do bump promete "Parecer aprofundado + Ata de reunião extraordinária + Portaria comentada" — versões *avançadas* de três documentos que o Kit já entrega (modelos 05, 06 e 10). Essas versões **não existiam** em lugar nenhum. Sem elas o bump venderia nada.

**Criado do zero** em `~/Desktop/JB Digital Consulting 2026/Kit Documentos Oficiais/Pacote-Avancado/` (+ `.zip` irmão):
- `Modelo-A1-Parecer-Tecnico-Aprofundado.docx` — 5 seções contra as 3 do Kit; acrescenta EMENTA, fundamentação separada da análise e uma seção de riscos/impactos
- `Modelo-A2-Ata-de-Reuniao-Extraordinaria.docx` — convocação, quórum, justificativa da extraordinariedade e votação nominal por item com declaração de voto
- `Modelo-A3-Portaria-Comentada.docx` — cada bloco comentado: competência no preâmbulo, quando CONSIDERANDOS são obrigatórios, hierarquia artigo→parágrafo→inciso→alínea, e por que revogação genérica é vedada pela LC 95/1998
- `LEIA-ME.txt`

Mesmo padrão visual do Kit (Calibri 12, margens 3/1,5/2/2, dicas em cinza com 💡). **Juliana precisa revisar antes da primeira venda** — são documentos que eu escrevi, não que ela escreveu.

**Montado na Kiwify:**
- Produto `Pacote Avancado - 3 Modelos Aprofundados`, R$ 27, id `726357f0-8dbb-11f1-b50b-0f47f980b6f6`
- Grupo `Kit + Pacote Avancado` — todos os módulos, vinculado à oferta de R$ 27
- Módulo `Pacote Avancado (3 Modelos Aprofundados)` na área de membros do Kit — **vazio**

**Falta (nesta ordem):**
1. **Subir os 4 arquivos no módulo.** O editor da área de membros congelou em 3 tentativas seguidas (renderer sem responder a screenshot e a executeScript). Fazer manualmente ou em outra sessão.
2. **Restringir o Grupo A.** Ele está em "todos os módulos", então quem comprou só o Kit passa a ver o módulo novo. Enquanto está vazio é só ruído; depois do upload vira o produto de graça. Editar Grupo A para excluir o módulo do Pacote.
3. **Configurar o order bump** no checkout do Kit apontando para a oferta de R$ 27. Copy pronta em `CALENDARIO-REELS-SERVIDORSEMTRAVA.md`.

### ianapratica.net — construído e testado, esperando 1 URL

As duas seções (captura de newsletter + ponte B2B para o Decision Sprint) estão **prontas e verificadas no Chrome**: renderiza certo, zero erro de console, os 6 CTAs do Eduzz intactos. Falta só a URL de inscrição do Beehiiv.

**Mecânica do bundle (importante, custou tempo para descobrir):**
- `index.html` (7,5 MB) é um *self-extracting bundle* — o HTML real está escapado num `<script type="__bundler/template">` e os assets em base64 num `<script type="__bundler/manifest">`.
- Todo o JSX da página (copy, preço, link Eduzz) está no asset `f4d1418b-805b-49ee-92d3-14c55d12dbfa`, base64, `compressed: false`.
- **O asset do JSX NÃO tem `integrity`** — só os 3 scripts de vendor têm. Editar não exige recalcular hash.
- Script de reinjeção pronto: `scratchpad/inject.py` (decodifica → aplica edição → reencoda → valida round-trip byte a byte).
- O `CLAUDE.md` do repo `ianapratica-site` está **desatualizado**: manda editar por `grep` no `index.html`, o que não funciona para o conteúdo de negócio.

**Achado não resolvido:** havia uma edição **não commitada** no clone `~/Downloads/ianapratica-site` trocando **81 → 55 páginas** (copy, FAQ e bloco de preço). Nunca foi ao ar. O MEMORY.md diz que o miolo tem **58 páginas**. Confirmar o número certo antes de publicar.

---

## ⏸️ Não executado

- **E2E de checkout** (item 2 da fila) — parado no signup. Claude não cria conta nem digita senha; depende da Juliana preencher `localhost:8080/signup`. Escopo acordado: validar até a tela do Stripe Checkout, sem completar pagamento (os price IDs estão hardcoded em modo live em `create-billing-checkout`).
- **Order bump R$ 27** no Kiwify — confirmado ausente. Copy pronta em `CALENDARIO-REELS-SERVIDORSEMTRAVA.md` §"Melhorias de funil".
- **ManyChat** — captura de e-mail antes do link do Drive no fluxo MODELO.
- **Beehiiv** — conta/publicação "IA na Prática" não criada. Rascunho da sequência de onboarding de 7 e-mails já escrito em `…/Curso Viver de News…/IA-NA-PRATICA-onboarding-7-emails.md`, seguindo o doc-mestre.
- **Rotação de chaves** — Juliana pediu explicitamente para **não** rotacionar em 30/07. Seguem expostas desde junho: `sk_live_51OGP…` e o token Cloudflare (este último publica em `jbdigitalsystem.com`).
- **KDP** — sumário do "IA na Prática" com números reais de página.

## Notas técnicas

- **Supabase CLI local não enxerga o projeto JB** (`rqiacrclsmixmaqhgicc`) — a conta logada só lista LucidIA. `supabase secrets set` vai falhar; usar o dashboard.
- **Newsletter:** o handoff do Cowork diz "IA sem Hype", mas o doc-mestre e a Juliana dizem **"IA na Prática"**. Vale o doc-mestre.
- **Parcelamento do Kit:** 8x de R$ 5,38 = R$ 43,04 num produto de R$ 37. 8x é a parcela default exibida. Decisão da Juliana, não alterado.
