export interface Plan {
  name: string;
  setupPrice: string;
  monthlyPrice: string;
  features: string[];
  cta: string;
  featured: boolean;
  schemaPrice: string; // for JSON-LD Offer
}

export const plans: Plan[] = [
  {
    name: 'Essencial',
    setupPrice: 'R$ 600',
    monthlyPrice: 'R$ 150/mês',
    featured: false,
    features: [
      'Perfil Google completo e otimizado',
      'Schema de avaliações (estrelas visíveis no Google)',
      'Presença estruturada para as IAs (ChatGPT, Gemini, Perplexity)',
      'Monitoramento mensal do perfil',
      'Relatório mensal de posicionamento',
    ],
    cta: 'Começar com o Essencial',
    schemaPrice: 'R$600 setup + R$150/mês',
  },
  {
    name: 'Premium',
    setupPrice: 'R$ 1.200',
    monthlyPrice: 'R$ 350/mês',
    featured: true,
    features: [
      'Tudo do plano Essencial',
      'Site programático com páginas por serviço e bairro',
      'Dezenas de páginas otimizadas para buscas locais',
      'Otimização avançada para IAs (AEO)',
      'Relatório mensal de posições no Google',
    ],
    cta: 'Começar com o Premium',
    schemaPrice: 'R$1200 setup + R$350/mês',
  },
];

export const whatsappUrl = 'https://wa.me/5511966549407';
export const signupUrl   = 'https://jbdigitalsystem.com/signup';
