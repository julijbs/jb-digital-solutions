const steps = [
  { title: 'Escolha e confirme o pagamento', text: 'Contrate o Sistema Completo ou o GBP avulso pelo Mercado Pago. Pagamento único, sem mensalidade.' },
  { title: 'Conte sobre seu negócio', text: 'Após a confirmação do pagamento, liberamos o formulário com suas informações, serviços e referências.' },
  { title: 'Nós cuidamos da criação', text: 'Preparamos o serviço contratado e você acompanha tudo online, sem reuniões longas.' },
  { title: 'Revise e receba a entrega', text: 'Confira o resultado e aprove a entrega. A verificação do Perfil Google segue os prazos do Google.' },
];
export const HowItWorks = () => <section id="como-funciona" className="elegant-process"><div className="container"><div className="elegant-section-heading"><div><p className="elegant-intro">Simples do início à entrega</p><h2>Você cuida do seu negócio.<br />Nós cuidamos da presença digital.</h2></div><p>Sem reuniões longas.<br />Tudo acompanhado online.</p></div><div className="process-steps">{steps.map((step, i) => <article key={step.title}><span>{String(i + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></div></section>;
