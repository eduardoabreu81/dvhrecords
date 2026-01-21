import { motion } from 'framer-motion';

export default function LabelBio() {
  return (
    <section
      id="label-bio"
      className="relative py-24 px-6 overflow-hidden"
    >
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00F0FF_1px,transparent_1px)] bg-[size:2rem_2rem]" />
      </div>

      <div className="container max-w-5xl mx-auto relative z-10">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display text-primary glow-cyan-strong mb-4">
            SOBRE A DVH RECORDS
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto glow-box-cyan" />
        </motion.div>

        {/* Conteúdo da Bio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6 text-foreground/90 text-lg leading-relaxed"
        >
          <p>
            A <span className="text-primary font-semibold glow-cyan">DVH Records</span> é uma gravadora digital independente nascida da paixão pela música eletrônica e pela cultura bass. Fundada com o objetivo de dar voz a artistas emergentes e consolidados, a DVH se especializou em gêneros como <span className="text-primary">Drum & Bass</span>, <span className="text-primary">House</span>, <span className="text-primary">Bass Music</span> e <span className="text-primary">Electropop</span>.
          </p>

          <p>
            Nossa missão é criar uma ponte entre produtores talentosos e o público global, oferecendo uma plataforma que valoriza a qualidade sonora, a criatividade e a autenticidade. Acreditamos que a música eletrônica transcende fronteiras e conecta pessoas através de batidas, baixos e melodias.
          </p>

          <p>
            Com um roster diversificado de <span className="text-primary font-semibold">9 artistas únicos</span>, cada um trazendo sua própria identidade sonora, a DVH Records se posiciona como um selo que não apenas lança músicas, mas constrói carreiras e cultiva comunidades.
          </p>

          {/* Filosofia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-primary/20"
          >
            <h3 className="text-2xl font-display text-primary glow-cyan mb-6">
              Nossa Filosofia
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-primary text-2xl">•</span>
                <span>
                  <strong className="text-primary">Qualidade acima de tudo:</strong> Cada lançamento passa por um processo rigoroso de curadoria.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-2xl">•</span>
                <span>
                  <strong className="text-primary">Apoio aos artistas:</strong> Fornecemos suporte completo em produção, distribuição e marketing.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-2xl">•</span>
                <span>
                  <strong className="text-primary">Inovação constante:</strong> Estamos sempre explorando novos sons e tecnologias.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-2xl">•</span>
                <span>
                  <strong className="text-primary">Comunidade global:</strong> Nossa música alcança ouvintes em todos os continentes.
                </span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
