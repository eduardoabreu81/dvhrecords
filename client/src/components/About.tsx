import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="min-h-screen bg-background flex items-center justify-center py-20 px-4">
      <div className="container max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-display text-center text-primary glow-cyan-strong mb-12"
        >
          ABOUT DVH
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-card/80 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-8 glow-box-cyan"
        >
          <div className="space-y-6 text-foreground/90 leading-relaxed">
            <p className="text-lg">
              A <span className="text-primary font-display glow-cyan">DVH Records</span> é uma gravadora digital independente 
              nascida da paixão pela música eletrônica e pela cultura bass. Fundada com o objetivo de dar voz a artistas 
              emergentes e consolidados, a DVH se especializou em gêneros como <strong>Drum & Bass</strong>, <strong>House</strong>, 
              <strong>Bass Music</strong> e <strong>Electropop</strong>.
            </p>

            <p>
              Nossa missão é criar uma ponte entre produtores talentosos e o público global, oferecendo uma plataforma 
              que valoriza a qualidade sonora, a criatividade e a autenticidade. Acreditamos que a música eletrônica 
              transcende fronteiras e conecta pessoas através de batidas, baixos e melodias.
            </p>

            <p>
              Com um roster diversificado de 9 artistas únicos, cada um trazendo sua própria identidade sonora, 
              a DVH Records se posiciona como um selo que não apenas lança músicas, mas constrói carreiras e 
              cultiva comunidades.
            </p>

            <div className="pt-6 border-t border-primary/20">
              <h3 className="text-2xl font-display text-primary glow-cyan mb-4">Nossa Filosofia</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">▸</span>
                  <span><strong>Qualidade acima de tudo:</strong> Cada lançamento passa por um processo rigoroso de curadoria.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">▸</span>
                  <span><strong>Apoio aos artistas:</strong> Fornecemos suporte completo em produção, distribuição e marketing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">▸</span>
                  <span><strong>Inovação constante:</strong> Estamos sempre explorando novos sons e tecnologias.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">▸</span>
                  <span><strong>Comunidade global:</strong> Nossa música alcança ouvintes em todos os continentes.</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-primary/70 font-display text-lg">
            Global sounds. Bass driven.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
