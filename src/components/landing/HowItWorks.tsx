const steps = [
  { title: 'Conte sobre seu negócio', text: 'Preencha suas informações, serviços e referências no seu tempo, direto no painel.' },
  { title: 'Nós cuidamos da criação', text: 'Preparamos o site e o Perfil Google do Sistema Completo, ou o GBP avulso que você escolheu.' },
  { title: 'Revise com tranquilidade', text: 'Confira a entrega e solicite os ajustes do escopo antes da aprovação.' },
  { title: 'Receba tudo organizado', text: 'Concluímos a entrega aprovada. A verificação do Perfil Google segue os prazos do Google.' },
];
export const HowItWorks = () => <section id="como-funciona" className="elegant-process"><div className="container"><div className="elegant-section-heading"><div><p className="elegant-intro">Simples do início à entrega</p><h2>Você cuida do seu negócio.<br />Nós cuidamos da presença digital.</h2></div><p>Sem reuniões longas.<br />Tudo acompanhado online.</p></div><div className="process-steps">{steps.map((step, i) => <article key={step.title}><span>{String(i + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></div></section>;
