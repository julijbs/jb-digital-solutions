import { motion } from "framer-motion";
import { Bot, Database, HelpCircle, Shield } from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Estruturação de Dados (Schema Markup)",
    text: "Organizamos as informações do seu site em uma linguagem que a IA entende — nome, especialidade, localização, serviços — tudo estruturado para ser lido e recomendado.",
  },
  {
    icon: HelpCircle,
    title: "Conteúdo em Formato Pergunta & Resposta",
    text: "Criamos FAQs estratégicas que respondem exatamente o que seus futuros clientes perguntam ao ChatGPT, Gemini e Perplexity.",
  },
  {
    icon: Shield,
    title: "Autoridade Digital que a IA Confia",
    text: "Dados consistentes, avaliações reais, presença verificada no Google — tudo o que os algoritmos de IA precisam para te indicar como referência.",
  },
];

export const AEOSection = () => {
  return (
    <section id="aeo" className="py-20 md:py-28">
      <div className="section-divider mx-auto mb-20 max-w-xl" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-6 max-w-3xl text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gold-gradient-bg">
            <Bot size={28} className="text-primary-foreground" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl">
            Além do Google:{" "}
            <span className="gold-gradient-text">
              Preparando sua Marca para a Era da IA
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            O mundo mudou. Hoje, seus pacientes não buscam apenas no Google — eles{" "}
            <strong className="text-foreground">perguntam para a Inteligência Artificial</strong>.
            Nós estruturamos sua presença digital para ser encontrada e recomendada pelos dois.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mb-12 max-w-2xl rounded-xl border border-primary/20 bg-primary/5 p-5"
        >
          <p className="text-center text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">O que é AEO?</strong>{" "}
            É a Otimização para Respostas de IA — a técnica que usamos para que você seja
            recomendado quando alguém perguntar ao ChatGPT, Gemini ou Perplexity:{" "}
            <em className="text-primary">"Indique um bom dentista em São Paulo"</em>,{" "}
            <em className="text-primary">"Qual nutricionista atende em Pinheiros?"</em>,{" "}
            <em className="text-primary">"Preciso de um bom psicólogo perto de mim"</em>.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover rounded-xl p-6"
            >
              <feat.icon size={28} className="mb-4 text-primary" />
              <h3 className="font-serif text-lg text-foreground">{feat.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feat.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-10 max-w-2xl text-center text-sm italic text-muted-foreground"
        >
          Enquanto outras agências olham para o passado, a JB Digital estrutura seus dados
          para que os robôs do futuro leiam, entendam e recomendem o seu trabalho.
        </motion.p>
      </div>
    </section>
  );
};
