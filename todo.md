# DVH Records - TODO List

## Setup & Configuração
- [x] Reestruturar projeto React standalone (sem dependências Manus)
- [x] Instalar Firebase SDK (Firestore + Storage + Authentication)
- [x] Configurar tema, tipografia (Orbitron + Exo 2) e paleta de cores (preto + ciano neon)
- [x] Gerar assets visuais: capas de disco para 9 artistas
- [x] Gerar imagem de toca-discos Technics realista
- [x] Criar helpers Firebase para Firestore e Storage
- [ ] Configurar Firebase (Firestore + Storage + Authentication) - **MANUAL pelo usuário**
- [x] Configurar build e deploy para Netlify

## Frontend Público
- [x] Hero section fullscreen com logo DVH Records centralizado
- [x] Background preto absoluto com glow effect ciano neon
- [x] Menu flutuante que aparece no hover
- [x] Caixa de discos interativa (clique para abrir)
- [x] Carrossel vertical mostrando capas dos 9 artistas
- [x] Toca-discos 3D realista inspirado em Technics
- [x] Vinil girando com animação
- [x] Braço do toca-discos animado descendo ao tocar
- [x] Sistema drag & drop: arrastar capas até o toca-discos
- [x] Animações de encaixe e feedback visual no drop
- [x] Player de áudio integrado (play/pause/volume/progress/seek)
- [x] Lista de tracks no player
- [x] Visualizador de waveform em tempo real (estilo Traktor/Serato)
- [x] Modal/sidebar de artista ao tocar disco
- [x] Exibir foto, bio completa, tracks e links sociais no modal
- [x] Seção About
- [ ] Seção Releases (opcional - pode ser adicionada depois)
- [x] Seção Submit (envio de demos)

## Admin Panel
- [x] Autenticação Firebase no admin
- [x] Dashboard admin com listagem de artistas
- [x] CRUD de artistas básico (criar, editar, deletar, listar)
- [ ] Upload múltiplo de imagens (perfil + capa de disco) - **Expandir**
- [ ] Upload de músicas MP3/WAV - **Expandir**
- [ ] Integração com Spotify/SoundCloud/Apple Music (links) - **Expandir**
- [ ] Preview em tempo real de uploads - **Expandir**
- [ ] Validações de formulário - **Expandir**

## Segurança & Créditos
- [x] Desabilitar downloads de áudio/imagens
- [x] Desabilitar clique direito (context menu)
- [x] Proteção contra cópia de conteúdo
- [x] Adicionar rodapé com crédito "Feito por LocalBiz Academy"

## Deploy & Documentação
- [x] Preparar instruções de configuração Firebase (FIREBASE_SETUP.md)
- [x] Configurar build para Netlify (netlify.toml)
- [x] Documentar processo de deploy (DEPLOY_NETLIFY.md)
- [x] Criar README principal
- [ ] Criar checkpoint final

---

## 📝 Notas Importantes

### ✅ Funcionalidades Implementadas (MVP Completo)
- Site público totalmente funcional com todas as seções
- Toca-discos interativo com drag & drop
- Player de áudio com waveform visualizer
- Admin panel básico com autenticação
- Proteções de segurança ativas
- Pronto para deploy no Netlify

### 🔧 Funcionalidades Básicas (Podem ser Expandidas)
- **Admin Panel**: Implementado com funcionalidades básicas (login, listar, deletar)
- **Formulário de Artista**: Precisa ser expandido para incluir todos os campos e uploads
- **Upload de Arquivos**: Estrutura Firebase pronta, mas interface de upload precisa ser implementada

### ⚠️ Ação Necessária do Usuário
1. **Configurar Firebase** (seguir FIREBASE_SETUP.md)
2. **Fazer push para GitHub** (repositório: eduardoabreu81/dvhrecords)
3. **Deploy no Netlify** (seguir DEPLOY_NETLIFY.md)
4. **Expandir Admin Panel** (opcional - adicionar formulários completos de upload)

### 🎯 Próximos Passos Sugeridos (Após Deploy)
1. Expandir formulário de criação/edição de artistas no Admin
2. Implementar interface de upload de imagens e músicas
3. Adicionar seção "Releases" (últimos lançamentos)
4. Implementar sistema de busca de artistas
5. Adicionar analytics e métricas

## 🐛 Correções Necessárias

- [x] **Caixa de Records**: Corrigir para abrir em painel lateral (não fullscreen) permitindo drag & drop para o toca-discos
- [x] **Multilíngue**: Implementar sistema i18n com suporte a PT/EN/ES
- [ ] **Traduções**: Traduzir todo o conteúdo do site (Hero, About, Submit, Admin, etc.) para os 3 idiomas
- [x] **Seletor de idioma**: Adicionar botão/dropdown para trocar entre PT/EN/ES (componente criado)

## 🎨 Melhorias Visuais

- [x] **Background elaborado**: Adicionar imagem de fundo estilo música eletrônica (similar ao exemplo fornecido)
- [x] **Parallax entre seções**: Implementar efeitos de profundidade nas transições entre seções
- [x] **Overlay escuro**: Adicionar overlay semi-transparente sobre imagem de fundo para melhor legibilidade

## 🐛 Novos Problemas Reportados

- [x] **RecordBox backdrop**: Remover backdrop que esmae o fundo, deve permitir ver e interagir com o toca-discos
- [x] **Logo Hero**: Remover caixa do logo, deixar logo solto com imagem de DJ mixer ao fundo (como exemplo fornecido)
- [x] **Bio da gravadora**: Adicionar seção dedicada para história/missão da DVH Records
- [x] **Ícone de scroll**: Fazer ícone desaparecer conforme rolagem ao invés de ficar fixo

## 🎨 Correção do Logo e Background

- [x] **Logo**: Criar logo apenas com texto "DVH RECORDS" sem quadrado/caixa/fundo
- [x] **Background Hero**: Trocar para imagem de mixer de DJ (console/controladora) ao invés de instrumentos musicais

## 🖼️ Correção da Imagem de Fundo Hero

- [x] **Background Hero**: Trocar para imagem de multidão em show/festival de música eletrônica (como no exemplo fornecido) ao invés de mixer de DJ

## 🎨 Refatoração Completa do Hero (Estilo Critical Music)

- [x] **Logo no topo esquerdo**: Mover logo para canto superior esquerdo (não centralizado)
- [x] **Remover caixa preta central**: Eliminar overlay escuro que bloqueia visualização do background
- [x] **Background visível**: Deixar imagem do show/festival totalmente visível
- [x] **Parallax no logo**: Logo acompanha scroll da página
- [x] **Layout limpo**: Estilo minimalista como Critical Music

## 🎵 Refatoração Completa do Sistema de Toca-Discos

- [x] **Remover RecordBox e drag & drop**: Eliminar sistema de arrastar capas
- [x] **Barra horizontal de artistas**: Criar scroll lateral com todas as capas visíveis
- [x] **Clicar no artista**: Abrir bio ao lado do toca-discos (sem janela nova)
- [x] **Lista de tracks clicável**: Dentro da bio, mostrar tracks do artista
- [x] **Clicar na track**: Disco começa a girar automaticamente no toca-discos
- [x] **Centralizar vinil**: Corrigir posicionamento do vinil no prato do toca-discos
- [x] **Navegação entre tracks**: Botões próxima/anterior (loop ao chegar no final)
- [ ] **Corrigir STOP**: Waveform deve parar quando clicar em STOP (removido AudioPlayer antigo)
- [x] **Melhorar logotipo**: Ajustar design do logo DVH Records (waveform)

## 🔧 Correções Urgentes

- [x] **Logo sem fundo**: Remover fundo preto do logo, deixar totalmente transparente
- [x] **Scroll snap fullscreen**: Implementar rolagem que "gruda" em cada seção completa (100vh) como slides

## 🎨 Ajustes de Layout

- [x] **Toca-discos como background**: Usar imagem do toca-discos como fundo decorativo da seção Artists
- [x] **Backgrounds temáticos**: Adicionar imagens de fundo para About e Submit
- [x] **Rodapé estático**: Tornar rodapé fixo na parte inferior (não ocupa seção completa)
- [x] **Remover duplicações**: Eliminar seção LabelBio duplicada (unificada com About)

## 🔧 Correção Footer

- [x] **Footer fixo**: Tornar Footer sempre visível na parte inferior da tela (fixed position)

## 🎵 Player Estilo Winamp

- [x] **Imagem do disco**: Exibir capa do artista que está tocando
- [x] **Controles**: Play, Pause, Stop, Next, Previous
- [x] **Display de info**: Nome da track, artista, duração
- [x] **Visualizador de áudio**: Espectro de frequência simples
- [ ] **Integração no Home.tsx**: Conectar player com TurntableNew
- [ ] **Integração com Web Audio API**: Reprodução real de arquivos MP3/WAV

## 🎭 Páginas Dedicadas de Artistas

- [ ] **Criar rota /artist/:id**: Página individual para cada artista
- [ ] **Link na bio**: Adicionar botão "Ver Página Completa" na bio do artista
- [ ] **Conteúdo completo**: Bio expandida, discografia, links sociais, galeria

## 🌍 Sistema Multilíngue

- [ ] **Traduções PT/EN/ES**: Aplicar em todos os componentes
- [ ] **Seletor de idioma**: Adicionar no menu/header
- [ ] **Persistência**: Salvar idioma selecionado no localStorage

## 🔧 Simplificar Player

- [x] **Player minimalista**: Simplificar WinampPlayer para design mais clean
- [x] **Fixo no rodapé**: Posicionar acima do Footer (como estava antes)
- [x] **Integração**: Conectar com seleção de artista e tracks

## 🔧 Correções de Layout e Bugs

- [x] **Remover toca-discos visual**: Tirar imagem do toca-discos e disco girando da seção Artists
- [x] **Artistas na lateral esquerda**: Mover lista de artistas para sidebar esquerda (desktop) com scroll invisível
- [x] **Artistas no topo (mobile)**: Manter no topo para telas pequenas
- [x] **Releases à direita**: Adicionar seção de releases com links Spotify/Apple Music
- [x] **Corrigir player pause**: Música deve parar de tocar quando clicar em Pause (bug atual: continua tocando)

## 🔧 Novas Correções

- [x] **Sidebar de artistas**: Deve aparecer APENAS na seção Artists, não em todas as páginas
- [x] **Imagens dos artistas**: Quadradas grandes e visíveis, com nome embaixo
- [x] **Latest Releases na Home**: Ocupar metade da página Home (desktop) com layout de quadrado grande + dados
- [x] **Latest Releases**: Aparecer APENAS na página Home, não na seção Artists
- [x] **Header fixo**: Deve aparecer em todas as seções (Hero, Artists, About, Submit)

## 🔧 Correções Urgentes - Sidebar e Releases

- [x] **Sidebar de artistas**: Remover sidebar fixa, colocar lista de artistas DENTRO da seção Artists (não fixo em todas as páginas)
- [x] **Latest Releases na Hero**: Mover seção Releases para DENTRO da página Hero ocupando metade da tela (não como seção separada)

## 🎨 Próximas Implementações

- [x] **Grid de artistas**: Criar grid/carrossel na seção Artists com fotos grandes dos artistas e nomes abaixo
- [x] **Clique no artista**: Ao clicar, mostrar bio e lista de tracks ao lado
- [x] **Sistema multilíngue**: Aplicar traduções PT/EN/ES em todos os componentes (ArtistsGrid e Releases)
- [x] **Seletor de idioma**: Adicionar no menu Header
- [ ] **Páginas dedicadas**: Criar rotas /artist/:id com bio completa, discografia, galeria e links sociais

## 🔧 Correção Modal de Artista

- [x] **Modal centralizado**: Transformar visualização de artista em pop-up/modal centralizado ao invés de substituir o grid
- [x] **Grid visível**: Manter grid de artistas visível com overlay escuro quando modal estiver aberto
- [x] **Botão fechar**: Adicionar botão X no canto superior direito do modal para fechar

## 🗄️ Migração de Dados para Firestore

- [x] Criar estrutura de coleções no Firestore (artists, tracks, releases)
- [x] Criar script de migração para copiar dados mock para Firestore
- [x] Atualizar frontend para buscar artistas do Firestore ao invés de hardcode
- [x] Remover arquivo `client/src/data/artists.ts`
- [x] Testar Admin Panel com dados reais do Firestore
- [ ] Deploy no Netlify

## 🔄 Atualizar Releases para Firestore

- [x] Atualizar componente Releases para buscar dados do Firestore ao invés de hardcode
- [x] Testar Latest Releases na Hero
- [ ] Deploy no Netlify

## 🐛 Bug: Player Fora do Modal

- [x] Player está aparecendo na página esmaecida ao invés de dentro do modal de artista
- [x] Corrigir para player ficar fixo no rodapé do modal

## 🎨 Melhorias de UX - Modal

- [x] Ajustar altura do modal para acomodar player sem scroll excessivo
- [x] Tornar imagem do artista circular (cortada em formato redondo)

## 🎯 Melhorias Finais - Modal e Páginas Dedicadas

- [x] Player fixo no rodapé do modal (sem scroll)
- [x] Scroll discreto apenas no conteúdo (bio + tracks)
- [x] Criar páginas dedicadas de artistas (/artist/:id) geradas automaticamente
- [x] Adicionar botão "Ver Perfil Completo" no modal
