import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/config/contact";

export const SeoFinalCTA = () => (
  <section className="py-20 md:py-28">
    <div className="section-divider mx-auto mb-20 max-w-xl" />
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="font-serif text-3xl md:text-4xl">
          Pronto para prospectar{" "}
          <span className="gold-gradient-text">com dados reais?</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Fale com a nossa equipe e veja como o SEO Local pode funcionar para o seu processo
          comercial — sem compromisso.
        </p>
        <div className="mt-10">
          <Button
            variant="hero"
            size="default"
            className="gap-2 text-sm md:text-base md:px-8 md:py-6"
            onClick={() => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")}
          >
            <MessageCircle size={18} /> Conversar no WhatsApp
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);
