import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Preciso ter Google Meu Negócio?",
    a: "Não. Se você ainda não tem, a JB cria e otimiza o perfil para você durante o processo.",
  },
  {
    q: "Vocês criam do zero?",
    a: "Sim. Tanto o site quanto o perfil no Google podem ser criados do zero ou otimizados, se já existirem.",
  },
  {
    q: "Isso inclui domínio?",
    a: "O plano Essencial entrega em subdomínio JB (cliente.jbdigital.com). Domínio próprio é um add-on opcional, sem travar a entrega.",
  },
  {
    q: "E se eu quiser independência total?",
    a: "Oferecemos handoff completo: você recebe todo o código, acesso ao Google e documentação. É um add-on, não obrigatório.",
  },
  {
    q: "Em quanto tempo fica pronto?",
    a: "Após o onboarding (que leva poucos minutos), a entrega do Essencial acontece em poucos dias úteis.",
  },
  {
    q: "Isso funciona em cidade pequena?",
    a: "Sim, e muitas vezes é ainda mais eficaz — menos concorrência no Google local significa mais visibilidade com menos esforço.",
  },
  {
    q: "Posso sair quando quiser?",
    a: "Sim. Não há contrato de fidelidade. O plano Crescimento é mensal e pode ser cancelado a qualquer momento.",
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
