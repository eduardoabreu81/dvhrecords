import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getAboutContent, type AboutContent } from '@/lib/firebaseHelpers';

export default function About() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getAboutContent();
        setContent(data);
      } catch (error) {
        console.error('Error loading about content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Conteúdo padrão caso não haja no Firestore
  const defaultContent: AboutContent = {
    title: 'ABOUT DVH',
    paragraphs: [
      'A DVH Records é uma gravadora digital independente nascida da paixão pela música eletrônica e pela cultura bass. Fundada com o objetivo de dar voz a artistas emergentes e consolidados, a DVH se especializou em gêneros como Drum & Bass, House, Bass Music e Electropop.',
      'Nossa missão é criar uma ponte entre produtores talentosos e o público global, oferecendo uma plataforma que valoriza a qualidade sonora, a criatividade e a autenticidade. Acreditamos que a música eletrônica transcende fronteiras e conecta pessoas através de batidas, baixos e melodias.',
      'Com um roster diversificado de 9 artistas únicos, cada um trazendo sua própria identidade sonora, a DVH Records se posiciona como um selo que não apenas lança músicas, mas constrói carreiras e cultiva comunidades.',
    ],
    philosophyTitle: 'Nossa Filosofia',
    philosophyItems: [
      {
        title: 'Qualidade acima de tudo',
        description: 'Cada lançamento passa por um processo rigoroso de curadoria.',
      },
      {
        title: 'Apoio aos artistas',
        description: 'Fornecemos suporte completo em produção, distribuição e marketing.',
      },
      {
        title: 'Inovação constante',
        description: 'Estamos sempre explorando novos sons e tecnologias.',
      },
      {
        title: 'Comunidade global',
        description: 'Nossa música alcança ouvintes em todos os continentes.',
      },
    ],
    tagline: 'Global sounds. Bass driven.',
    backgroundImage: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1920',
  };

  const displayContent = content || defaultContent;

  if (loading) {
    return (
      <section 
        id="about" 
        className="min-h-screen bg-background flex items-center justify-center py-20 px-4"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="about" 
      className="min-h-screen bg-background flex items-center justify-center py-12 sm:py-16 md:py-20 px-3 sm:px-4 relative"
      style={{
        backgroundImage: displayContent.backgroundImage ? `url(${displayContent.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay escuro para melhor legibilidade */}
      <div className="absolute inset-0 bg-black/80" />
      <div className="container max-w-4xl relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-center text-primary glow-cyan-strong mb-8 sm:mb-10 md:mb-12"
        >
          {displayContent.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-card/80 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-4 sm:p-6 md:p-8 glow-box-cyan"
        >
          <div className="space-y-4 sm:space-y-6 text-foreground/90 leading-relaxed text-sm sm:text-base">
            {displayContent.paragraphs.map((paragraph, index) => (
              <p key={index} className={index === 0 ? 'text-base sm:text-lg' : ''}>
                {index === 0 ? (
                  <>
                    A <span className="text-primary font-display glow-cyan">DVH Records</span>{paragraph.substring(14)}
                  </>
                ) : (
                  paragraph
                )}
              </p>
            ))}

            <div className="pt-6 border-t border-primary/20">
              <h3 className="text-2xl font-display text-primary glow-cyan mb-4">
                {displayContent.philosophyTitle}
              </h3>
              <ul className="space-y-3">
                {displayContent.philosophyItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary mt-1">▸</span>
                    <span>
                      <strong>{item.title}:</strong> {item.description}
                    </span>
                  </li>
                ))}
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
            {displayContent.tagline}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
