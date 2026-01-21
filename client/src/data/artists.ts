export interface Artist {
  id: string;
  name: string;
  genre: string;
  bio: string;
  image: string;
  logo?: string;
  tracks: Track[];
  socialLinks: {
    spotify?: string;
    soundcloud?: string;
    appleMusic?: string;
    instagram?: string;
  };
}

export interface Track {
  id: string;
  title: string;
  duration: string;
  audioUrl?: string;
}

export const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'Digital Hunters',
    genre: 'Drum & Bass',
    bio: 'Dupla brasileira especializada em Drum & Bass de alta energia. Com influências do neurofunk e breakbeat, Digital Hunters traz batidas pesadas e baixos profundos que dominam as pistas.',
    image: '/images/artists/digital-hunters.png',
    tracks: [
      { id: 't1', title: 'Bassline Hunter', duration: '4:32' },
      { id: 't2', title: 'Digital Warfare', duration: '5:15' },
      { id: 't3', title: 'Breakbeat Revolution', duration: '4:48' },
    ],
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/digital-hunters',
      soundcloud: 'https://soundcloud.com/digital-hunters',
    },
  },
  {
    id: '2',
    name: 'Eddie Hunter',
    genre: 'Deep House',
    bio: 'Produtor de Deep House com mais de 10 anos de carreira. Eddie Hunter combina grooves sensuais com melodias atmosféricas, criando sets hipnotizantes que atravessam a noite.',
    image: '/images/artists/eddie-hunter.png',
    tracks: [
      { id: 't4', title: 'Midnight Groove', duration: '6:20' },
      { id: 't5', title: 'Soulful Nights', duration: '5:45' },
      { id: 't6', title: 'Deep Reflections', duration: '7:10' },
    ],
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/eddie-hunter',
      appleMusic: 'https://music.apple.com/artist/eddie-hunter',
    },
  },
  {
    id: '3',
    name: 'AION',
    genre: 'Bass Music / Dubstep',
    bio: 'Projeto solo focado em Bass Music pesado e experimental. AION explora as fronteiras do dubstep, halftime e bass music, com drops devastadores e texturas sonoras únicas.',
    image: '/images/artists/aion.png',
    tracks: [
      { id: 't7', title: 'Eternal Bass', duration: '4:55' },
      { id: 't8', title: 'Halftime Chaos', duration: '5:30' },
      { id: 't9', title: 'Subsonic Warfare', duration: '4:20' },
    ],
    socialLinks: {
      soundcloud: 'https://soundcloud.com/aion-bass',
      instagram: 'https://instagram.com/aion.bass',
    },
  },
  {
    id: '4',
    name: 'JFX',
    genre: 'Jungle / Drum & Bass',
    bio: 'Veterano da cena Jungle brasileira. JFX traz a essência old school do jungle com breakbeats acelerados, samples de reggae e uma energia contagiante que remete aos anos 90.',
    image: '/images/artists/jfx.png',
    tracks: [
      { id: 't10', title: 'Jungle Fever', duration: '5:05' },
      { id: 't11', title: 'Amen Break', duration: '4:40' },
      { id: 't12', title: 'Ragga Jungle', duration: '5:25' },
    ],
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/jfx',
      soundcloud: 'https://soundcloud.com/jfx-jungle',
    },
  },
  {
    id: '5',
    name: 'C.A.B.L.E.',
    genre: 'Pagode Eletrônico / Axé Bass',
    bio: 'Fusão única de pagode e axé com música eletrônica. C.A.B.L.E. traz a energia do carnaval brasileiro para as pistas de dança, combinando percussão tropical com baixos eletrônicos.',
    image: '/images/artists/cable.png',
    tracks: [
      { id: 't13', title: 'Carnaval Bass', duration: '4:15' },
      { id: 't14', title: 'Axé Eletrizante', duration: '5:00' },
      { id: 't15', title: 'Pagode 140 BPM', duration: '4:50' },
    ],
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/cable',
      instagram: 'https://instagram.com/cable.music',
    },
  },
  {
    id: '6',
    name: 'Daniel Maia',
    genre: 'Tech House',
    bio: 'DJ e produtor de Tech House minimalista. Daniel Maia constrói sets hipnóticos com grooves precisos e elementos percussivos que mantêm a pista em movimento constante.',
    image: '/images/artists/daniel-maia.png',
    tracks: [
      { id: 't16', title: 'Minimal Groove', duration: '6:30' },
      { id: 't17', title: 'Tech Rhythm', duration: '5:55' },
      { id: 't18', title: 'Underground Pulse', duration: '6:15' },
    ],
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/daniel-maia',
      appleMusic: 'https://music.apple.com/artist/daniel-maia',
    },
  },
  {
    id: '7',
    name: 'Samuel Smithson',
    genre: 'Electropop',
    bio: 'Produtor de Electropop com vocais cativantes e melodias dançantes. Samuel Smithson mistura sintetizadores vintage com produção moderna, criando hits radiofônicos com alma eletrônica.',
    image: '/images/artists/samuel-smithson.png',
    tracks: [
      { id: 't19', title: 'Neon Dreams', duration: '3:45' },
      { id: 't20', title: 'Electric Love', duration: '4:10' },
      { id: 't21', title: 'Synth Paradise', duration: '3:55' },
    ],
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/samuel-smithson',
      appleMusic: 'https://music.apple.com/artist/samuel-smithson',
      instagram: 'https://instagram.com/samuelsmithson',
    },
  },
  {
    id: '8',
    name: 'Crystal Wash',
    genre: 'Progressive House',
    bio: 'Produtora de Progressive House com foco em melodias emotivas e builds épicos. Crystal Wash cria jornadas sonoras que elevam o público a estados de êxtase coletivo.',
    image: '/images/artists/crystal-wash.png',
    tracks: [
      { id: 't22', title: 'Euphoria Rising', duration: '7:20' },
      { id: 't23', title: 'Crystal Waves', duration: '6:45' },
      { id: 't24', title: 'Progressive Dawn', duration: '8:00' },
    ],
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/crystal-wash',
      soundcloud: 'https://soundcloud.com/crystal-wash',
    },
  },
  {
    id: '9',
    name: 'Digital Queens',
    genre: 'Bass House',
    bio: 'Duo feminino de Bass House que domina as pistas com drops pesados e grooves irresistíveis. Digital Queens traz atitude e energia feminina para o mundo do bass.',
    image: '/images/artists/digital-queens.png',
    tracks: [
      { id: 't25', title: 'Queen Bass', duration: '4:25' },
      { id: 't26', title: 'House Royalty', duration: '5:10' },
      { id: 't27', title: 'Bass Anthem', duration: '4:50' },
    ],
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/digital-queens',
      instagram: 'https://instagram.com/digitalqueens',
      soundcloud: 'https://soundcloud.com/digital-queens',
    },
  },
];
