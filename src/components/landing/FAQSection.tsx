import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Preciso pagar hospedagem todo mês?",
    a: "Não! A hospedagem já está inclusa no serviço e é gratuita para sempre. Zero mensalidade.",
  },
  {
    q: "Quanto tempo leva para ficar pronto?",
    a: "Até 7 dias após você preencher o formulário de onboarding com suas informações.",
  },
  {
    q: "Eu consigo editar o site depois?",
    a: "Sim! Você recebe acesso para fazer pequenas atualizações. Para mudanças maiores, podemos ajustar com custo adicional.",
  },
  {
    q: "Vocês fazem gestão de redes sociais?",
    a: "Não. Nosso foco é construir sua base técnica no Google, não gestão de conteúdo ou tráfego pago.",
  },
  {
    q: "O site vai aparecer no Google automaticamente?",
    a: "O site é otimizado tecnicamente, mas o ranqueamento depende de fatores como concorrência local, conteúdo e avaliações. Entregamos a base, o crescimento é orgânico.",
  },
  {
    q: "Posso usar meu próprio domínio?",
    a: "Sim! Você pode comprar seu domínio personalizado (ex: psicologamaria.com.br) e nós configuramos. Custo adicional de R$ 100 (setup único).",
  },
  {
    q: "Tem garantia?",
    a: "Sim! 7 dias de garantia incondicional. Se não gostar, devolvemos 100% do valor.",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="section-divider mx-auto mb-20 max-w-xl" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl">Perguntas frequentes</h2>
        </motion.div>

        <div className="mx-auto max-w-2xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="glass-card overflow-hidden rounded-xl border-none px-6"
              >
                <AccordionTrigger className="py-4 text-left text-sm font-medium text-foreground hover:text-primary hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
