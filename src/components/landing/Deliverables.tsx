import { motion } from "framer-motion";
import { Globe, MapPin, ListChecks, QrCode, LayoutDashboard, Package } from "lucide-react";

const items = [
  { icon: Globe, title: "Site one-page leve", desc: "Responsivo, com SEO local e performance otimizada." },
  { icon: MapPin, title: "Google Business Profile", desc: "Criação ou otimização completa do seu perfil no Google Maps." },
  { icon: ListChecks, title: "Checklist técnico", desc: "NAP, schema JSON-LD, meta tags e headings corretos." },
  { icon: QrCode, title: "Link de avaliação + QR", desc: "Facilite avaliações dos seus clientes com um link dedicado." },
  { icon: LayoutDashboard, title: "Dashboard do cliente", desc: "Acompanhe status, links e arquivos em tempo real." },
  { icon: Package, title: "Entrega organizada", desc: "Handoff pack com tudo documentado e acessível." },
];

export const Deliverables = () => {
  return (
    <section id="entregaveis" className="py-20 md:py-28">
      <div className="section-divider mx-auto mb-20 max-w-xl" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl">
            O que entregamos no <span className="gold-gradient-text">Essencial</span>
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card-hover rounded-xl p-6"
            >
              <item.icon size={24} className="text-primary" />
              <h3 className="mt-4 font-serif text-lg text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
