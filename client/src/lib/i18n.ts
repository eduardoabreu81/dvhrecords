import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traduções
const resources = {
  pt: {
    translation: {
      // Hero
      hero: {
        tagline: 'Global sounds. Bass driven.',
        scrollDown: 'Role para explorar',
      },
      // Menu
      menu: {
        home: 'Início',
        artists: 'Artistas',
        about: 'Sobre',
        submit: 'Enviar Demo',
        admin: 'Admin',
      },
      // Record Box
      recordBox: {
        title: 'RECORD BOX',
        dragInstruction: 'Arraste o disco até o toca-discos para tocar',
        counter: '{{current}} / {{total}}',
      },
      // Turntable
      turntable: {
        dropZone: 'Solte o disco aqui',
        nowPlaying: 'Tocando Agora',
        stop: 'PARAR',
      },
      // Artist Profile
      artistProfile: {
        bio: 'Biografia',
        tracks: 'Tracks',
        socialLinks: 'Links Sociais',
        duration: 'Duração',
      },
      // Audio Player
      audioPlayer: {
        nowPlaying: 'Tocando Agora',
        tracks: 'Tracks',
        volume: 'Volume',
        mute: 'Mudo',
      },
      // About Section
      about: {
        title: 'SOBRE DVH',
        intro: 'A <1>DVH Records</1> é uma gravadora digital independente nascida da paixão pela música eletrônica e pela cultura bass. Fundada com o objetivo de dar voz a artistas emergentes e consolidados, a DVH se especializou em gêneros como <3>Drum & Bass</3>, <4>House</4>, <5>Bass Music</5> e <6>Electropop</6>.',
        mission: 'Nossa missão é criar uma ponte entre produtores talentosos e o público global, oferecendo uma plataforma que valoriza a qualidade sonora, a criatividade e a autenticidade. Acreditamos que a música eletrônica transcende fronteiras e conecta pessoas através de batidas, baixos e melodias.',
        vision: 'Com um roster diversificado de 9 artistas únicos, cada um trazendo sua própria identidade sonora, a DVH Records se posiciona como um selo que não apenas lança músicas, mas constrói carreiras e cultiva comunidades.',
        philosophyTitle: 'Nossa Filosofia',
        philosophy: {
          quality: '<1>Qualidade acima de tudo:</1> Cada lançamento passa por um processo rigoroso de curadoria.',
          support: '<1>Apoio aos artistas:</1> Fornecemos suporte completo em produção, distribuição e marketing.',
          innovation: '<1>Inovação constante:</1> Estamos sempre explorando novos sons e tecnologias.',
          community: '<1>Comunidade global:</1> Nossa música alcança ouvintes em todos os continentes.',
        },
      },
      // Submit Section
      submit: {
        title: 'ENVIE SUA DEMO',
        subtitle: 'Envie sua demo e faça parte do roster DVH Records',
        form: {
          artistName: 'Nome do Artista',
          artistNamePlaceholder: 'Seu nome artístico',
          email: 'Email',
          emailPlaceholder: 'seu@email.com',
          genre: 'Gênero Musical',
          genrePlaceholder: 'Ex: Drum & Bass, House, Bass Music...',
          demoLink: 'Link da Demo',
          demoLinkPlaceholder: 'https://soundcloud.com/seu-link',
          demoLinkHint: 'SoundCloud, Dropbox, Google Drive ou similar',
          message: 'Mensagem (opcional)',
          messagePlaceholder: 'Conte-nos mais sobre você e sua música...',
          submit: 'Enviar Demo',
          sending: 'Enviando...',
          required: '*',
        },
        success: {
          title: 'Demo Enviada!',
          message: 'Obrigado pelo envio. Analisaremos sua demo e entraremos em contato em breve.',
        },
        disclaimer: 'Analisamos todas as demos recebidas. O tempo de resposta pode variar de 2 a 4 semanas.',
      },
      // Footer
      footer: {
        copyright: '© {{year}} DVH Records. Todos os direitos reservados.',
        madeBy: 'Feito por',
        followUs: 'Siga-nos:',
      },
      // Admin
      admin: {
        title: 'ADMIN PANEL',
        login: {
          title: 'DVH RECORDS ADMIN',
          email: 'Email',
          password: 'Senha',
          submit: 'Entrar',
          error: 'Email ou senha inválidos',
        },
        dashboard: {
          addArtist: 'Adicionar Artista',
          noArtists: 'Nenhum artista cadastrado. Clique em "Adicionar Artista" para começar.',
          edit: 'Editar',
          delete: 'Deletar',
          confirmDelete: 'Tem certeza que deseja deletar {{name}}?',
        },
        logout: 'Sair',
      },
    },
  },
  en: {
    translation: {
      // Hero
      hero: {
        tagline: 'Global sounds. Bass driven.',
        scrollDown: 'Scroll to explore',
      },
      // Menu
      menu: {
        home: 'Home',
        artists: 'Artists',
        about: 'About',
        submit: 'Submit Demo',
        admin: 'Admin',
      },
      // Record Box
      recordBox: {
        title: 'RECORD BOX',
        dragInstruction: 'Drag the record to the turntable to play',
        counter: '{{current}} / {{total}}',
      },
      // Turntable
      turntable: {
        dropZone: 'Drop the record here',
        nowPlaying: 'Now Playing',
        stop: 'STOP',
      },
      // Artist Profile
      artistProfile: {
        bio: 'Biography',
        tracks: 'Tracks',
        socialLinks: 'Social Links',
        duration: 'Duration',
      },
      // Audio Player
      audioPlayer: {
        nowPlaying: 'Now Playing',
        tracks: 'Tracks',
        volume: 'Volume',
        mute: 'Mute',
      },
      // About Section
      about: {
        title: 'ABOUT DVH',
        intro: '<1>DVH Records</1> is an independent digital label born from a passion for electronic music and bass culture. Founded with the goal of giving voice to emerging and established artists, DVH specializes in genres such as <3>Drum & Bass</3>, <4>House</4>, <5>Bass Music</5>, and <6>Electropop</6>.',
        mission: 'Our mission is to create a bridge between talented producers and a global audience, offering a platform that values sound quality, creativity, and authenticity. We believe electronic music transcends borders and connects people through beats, bass, and melodies.',
        vision: 'With a diverse roster of 9 unique artists, each bringing their own sonic identity, DVH Records positions itself as a label that not only releases music but builds careers and cultivates communities.',
        philosophyTitle: 'Our Philosophy',
        philosophy: {
          quality: '<1>Quality above all:</1> Every release goes through a rigorous curation process.',
          support: '<1>Artist support:</1> We provide full support in production, distribution, and marketing.',
          innovation: '<1>Constant innovation:</1> We are always exploring new sounds and technologies.',
          community: '<1>Global community:</1> Our music reaches listeners on every continent.',
        },
      },
      // Submit Section
      submit: {
        title: 'SUBMIT YOUR DEMO',
        subtitle: 'Submit your demo and become part of the DVH Records roster',
        form: {
          artistName: 'Artist Name',
          artistNamePlaceholder: 'Your artist name',
          email: 'Email',
          emailPlaceholder: 'your@email.com',
          genre: 'Music Genre',
          genrePlaceholder: 'Ex: Drum & Bass, House, Bass Music...',
          demoLink: 'Demo Link',
          demoLinkPlaceholder: 'https://soundcloud.com/your-link',
          demoLinkHint: 'SoundCloud, Dropbox, Google Drive or similar',
          message: 'Message (optional)',
          messagePlaceholder: 'Tell us more about you and your music...',
          submit: 'Submit Demo',
          sending: 'Sending...',
          required: '*',
        },
        success: {
          title: 'Demo Submitted!',
          message: 'Thank you for your submission. We will review your demo and get back to you soon.',
        },
        disclaimer: 'We review all demos received. Response time may vary from 2 to 4 weeks.',
      },
      // Footer
      footer: {
        copyright: '© {{year}} DVH Records. All rights reserved.',
        madeBy: 'Made by',
        followUs: 'Follow us:',
      },
      // Admin
      admin: {
        title: 'ADMIN PANEL',
        login: {
          title: 'DVH RECORDS ADMIN',
          email: 'Email',
          password: 'Password',
          submit: 'Login',
          error: 'Invalid email or password',
        },
        dashboard: {
          addArtist: 'Add Artist',
          noArtists: 'No artists registered. Click "Add Artist" to get started.',
          edit: 'Edit',
          delete: 'Delete',
          confirmDelete: 'Are you sure you want to delete {{name}}?',
        },
        logout: 'Logout',
      },
    },
  },
  es: {
    translation: {
      // Hero
      hero: {
        tagline: 'Sonidos globales. Impulsado por el bajo.',
        scrollDown: 'Desplázate para explorar',
      },
      // Menu
      menu: {
        home: 'Inicio',
        artists: 'Artistas',
        about: 'Acerca de',
        submit: 'Enviar Demo',
        admin: 'Admin',
      },
      // Record Box
      recordBox: {
        title: 'CAJA DE DISCOS',
        dragInstruction: 'Arrastra el disco al tocadiscos para reproducir',
        counter: '{{current}} / {{total}}',
      },
      // Turntable
      turntable: {
        dropZone: 'Suelta el disco aquí',
        nowPlaying: 'Reproduciendo Ahora',
        stop: 'DETENER',
      },
      // Artist Profile
      artistProfile: {
        bio: 'Biografía',
        tracks: 'Pistas',
        socialLinks: 'Enlaces Sociales',
        duration: 'Duración',
      },
      // Audio Player
      audioPlayer: {
        nowPlaying: 'Reproduciendo Ahora',
        tracks: 'Pistas',
        volume: 'Volumen',
        mute: 'Silenciar',
      },
      // About Section
      about: {
        title: 'ACERCA DE DVH',
        intro: '<1>DVH Records</1> es un sello digital independiente nacido de la pasión por la música electrónica y la cultura del bajo. Fundado con el objetivo de dar voz a artistas emergentes y consolidados, DVH se especializa en géneros como <3>Drum & Bass</3>, <4>House</4>, <5>Bass Music</5> y <6>Electropop</6>.',
        mission: 'Nuestra misión es crear un puente entre productores talentosos y una audiencia global, ofreciendo una plataforma que valora la calidad del sonido, la creatividad y la autenticidad. Creemos que la música electrónica trasciende fronteras y conecta a las personas a través de ritmos, bajos y melodías.',
        vision: 'Con un roster diverso de 9 artistas únicos, cada uno aportando su propia identidad sonora, DVH Records se posiciona como un sello que no solo lanza música, sino que construye carreras y cultiva comunidades.',
        philosophyTitle: 'Nuestra Filosofía',
        philosophy: {
          quality: '<1>Calidad ante todo:</1> Cada lanzamiento pasa por un riguroso proceso de curación.',
          support: '<1>Apoyo a los artistas:</1> Brindamos soporte completo en producción, distribución y marketing.',
          innovation: '<1>Innovación constante:</1> Siempre estamos explorando nuevos sonidos y tecnologías.',
          community: '<1>Comunidad global:</1> Nuestra música llega a oyentes en todos los continentes.',
        },
      },
      // Submit Section
      submit: {
        title: 'ENVÍA TU DEMO',
        subtitle: 'Envía tu demo y forma parte del roster de DVH Records',
        form: {
          artistName: 'Nombre del Artista',
          artistNamePlaceholder: 'Tu nombre artístico',
          email: 'Correo Electrónico',
          emailPlaceholder: 'tu@email.com',
          genre: 'Género Musical',
          genrePlaceholder: 'Ej: Drum & Bass, House, Bass Music...',
          demoLink: 'Enlace de la Demo',
          demoLinkPlaceholder: 'https://soundcloud.com/tu-enlace',
          demoLinkHint: 'SoundCloud, Dropbox, Google Drive o similar',
          message: 'Mensaje (opcional)',
          messagePlaceholder: 'Cuéntanos más sobre ti y tu música...',
          submit: 'Enviar Demo',
          sending: 'Enviando...',
          required: '*',
        },
        success: {
          title: '¡Demo Enviada!',
          message: 'Gracias por tu envío. Revisaremos tu demo y nos pondremos en contacto pronto.',
        },
        disclaimer: 'Revisamos todas las demos recibidas. El tiempo de respuesta puede variar de 2 a 4 semanas.',
      },
      // Footer
      footer: {
        copyright: '© {{year}} DVH Records. Todos los derechos reservados.',
        madeBy: 'Hecho por',
        followUs: 'Síguenos:',
      },
      // Admin
      admin: {
        title: 'PANEL DE ADMINISTRACIÓN',
        login: {
          title: 'DVH RECORDS ADMIN',
          email: 'Correo Electrónico',
          password: 'Contraseña',
          submit: 'Iniciar Sesión',
          error: 'Correo electrónico o contraseña inválidos',
        },
        dashboard: {
          addArtist: 'Agregar Artista',
          noArtists: 'No hay artistas registrados. Haz clic en "Agregar Artista" para comenzar.',
          edit: 'Editar',
          delete: 'Eliminar',
          confirmDelete: '¿Estás seguro de que deseas eliminar a {{name}}?',
        },
        logout: 'Cerrar Sesión',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['pt', 'en', 'es'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
