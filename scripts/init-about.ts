/**
 * Script para inicializar o conteúdo About no Firestore
 * Execute uma única vez: npx tsx scripts/init-about.ts
 */

import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../client/src/lib/firebase';

const defaultAboutContent = {
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
  updatedAt: Timestamp.now(),
};

async function initAbout() {
  try {
    if (!db) {
      throw new Error('Firebase não inicializado. Configure as credenciais do Firebase primeiro.');
    }

    const aboutRef = doc(db, 'settings', 'about');
    await setDoc(aboutRef, defaultAboutContent);
    
    console.log('✅ Conteúdo About inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar About:', error);
    process.exit(1);
  }
}

initAbout();
