/**
 * homeFaqs.ts — Fonte única para o FAQ da homepage.
 * Consumida por HomeFAQ.astro (renderização) e index.astro (FAQPage JSON-LD).
 * Adicionar/editar perguntas aqui atualiza automaticamente UI + schema.
 */
export const homeFaqs: { q: string; a: string }[] = [
  {
    q: 'Como funciona o pagamento?',
    a: 'Pagamento único pela entrega contratada. Site: R$ 497 na Black Friday até 30/11/2026, depois R$ 1.497. Perfil Google: R$ 297. Site + Perfil Google: R$ 750. Sem mensalidade.',
  },
  {
    q: 'Preciso ter site para contratar?',
    a: 'Não — o site é justamente o que entregamos. Construímos do zero um site programático, com páginas por serviço e por bairro. Se você já tem site e quer apenas o Perfil da Empresa no Google cuidado de perto, isso é o add-on Gestão de Google, que pode ser contratado sozinho.',
  },
  {
    q: 'Quanto tempo leva para ficar pronto?',
    a: 'Até 7 dias após você preencher o formulário de onboarding com suas informações.',
  },
  {
    q: 'Eu consigo editar o site depois?',
    a: 'Sim! Você recebe acesso para fazer pequenas atualizações. Para mudanças maiores, podemos ajustar com custo adicional.',
  },
  {
    q: 'Vocês fazem gestão de redes sociais?',
    a: 'Não. Nosso foco é construir e manter seu posicionamento orgânico no Google e nas IAs. Gestão de conteúdo ou tráfego pago não fazem parte do serviço.',
  },
  {
    q: 'Meu negócio vai aparecer no Google automaticamente após o setup?',
    a: 'O sistema é otimizado tecnicamente para isso, mas o ranqueamento orgânico cresce com o tempo — depende de fatores como concorrência local e volume de avaliações. Entregamos a base técnica. Sem acompanhamento mensal.',
  },
  {
    q: 'Posso usar meu próprio domínio?',
    a: 'Sim! Você pode adquirir seu domínio personalizado (ex: draanacardoso.com.br) e nós configuramos. Custo adicional de R$ 100 (taxa única de configuração).',
  },
  {
    q: 'E se eu não gostar do resultado?',
    a: 'Trabalhamos com processo de aprovação em etapas. Você acompanha e aprova cada fase antes de seguirmos adiante: <strong>Etapa 1</strong> — você aprova o layout e estrutura; <strong>Etapa 2</strong> — você aprova textos e conteúdo; <strong>Etapa 3</strong> — você aprova o site final. Só publicamos quando você estiver 100% satisfeito. Revisões estão incluídas no processo. Se por algum motivo o trabalho não atender às especificações combinadas, ajustamos até ficar perfeito — sem custo adicional.',
  },
];
