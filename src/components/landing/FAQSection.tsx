import { motion } from "framer-motion";
import { Check } from "lucide-react";
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
    q: "E se eu não gostar do resultado?",
    a: "guarantee",
  },
];

const GuaranteeAnswer = () => (
  <div className="space-y-4">
    <p className="text-sm leading-relaxed text-muted-foreground">
      Trabalhamos com processo de aprovação em etapas. Você acompanha e aprova cada fase antes de seguirmos adiante:
    </p>
    <div className="space-y-2 border-l-2 border-primary/20 pl-4">
      {["Você aprova o layout e estrutura", "Você aprova textos e conteúdo", "Você aprova o site final"].map((step, i) => (
        <div key={i} className="flex items-start gap-2">
          <Check size={16} className="mt-0.5 shrink-0 text-primary" />
          <span className="text-sm text-muted-foreground">
            <strong className="text-foreground">Etapa {i + 1}:</strong> {step}
          </span>
        </div>
      ))}
    </div>
    <p className="text-sm leading-relaxed text-muted-foreground">
      Só publicamos quando você estiver <strong className="text-foreground">100% satisfeito</strong>. Revisões estão incluídas no processo.
    </p>
    <p className="text-sm leading-relaxed text-muted-foreground">
      Se por algum motivo o trabalho não atender às especificações combinadas, ajustamos até ficar perfeito — <strong className="text-foreground">sem custo adicional</strong>.
    </p>
  </div>
);

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
                <AccordionContent className="pb-4">
                  {faq.a === "guarantee" ? <GuaranteeAnswer /> : (
                    <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};