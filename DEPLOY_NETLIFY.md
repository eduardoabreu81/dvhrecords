# 🚀 Guia de Deploy no Netlify - DVH Records

Este guia explica como fazer o deploy do site DVH Records no Netlify usando o repositório GitHub.

---

## 📋 Pré-requisitos

1. **Conta no GitHub** - https://github.com
2. **Conta no Netlify** - https://netlify.com (pode fazer login com GitHub)
3. **Repositório GitHub** - https://github.com/eduardoabreu81/dvhrecords
4. **Firebase configurado** (veja `FIREBASE_SETUP.md`)

---

## 🔧 Passo 1: Preparar o Repositório GitHub

### 1.1 Fazer Push do Código

```bash
# Navegar até o diretório do projeto
cd /caminho/para/dvh-records

# Inicializar repositório Git (se ainda não foi feito)
git init

# Adicionar remote do GitHub
git remote add origin https://github.com/eduardoabreu81/dvhrecords.git

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit - DVH Records website"

# Fazer push para o GitHub
git push -u origin main
```

### 1.2 Verificar Arquivos Importantes

Certifique-se de que estes arquivos estão no repositório:
- ✅ `netlify.toml` (configuração de build)
- ✅ `.env.example` (template de variáveis de ambiente)
- ✅ `FIREBASE_SETUP.md` (instruções Firebase)
- ✅ `client/` (código do site)
- ✅ `package.json` (dependências)

---

## 🌐 Passo 2: Deploy no Netlify

### 2.1 Conectar Repositório

1. Acesse https://app.netlify.com
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Escolha **"Deploy with GitHub"**
4. Autorize o Netlify a acessar sua conta GitHub
5. Selecione o repositório `eduardoabreu81/dvhrecords`

### 2.2 Configurar Build Settings

O Netlify deve detectar automaticamente as configurações do `netlify.toml`, mas verifique:

- **Base directory**: `client`
- **Build command**: `pnpm install && pnpm build`
- **Publish directory**: `client/dist`
- **Node version**: 22.x (será detectado automaticamente)

### 2.3 Adicionar Variáveis de Ambiente

**IMPORTANTE:** Antes de fazer o deploy, adicione as variáveis de ambiente do Firebase:

1. No painel do Netlify, vá em **"Site settings"** → **"Environment variables"**
2. Clique em **"Add a variable"**
3. Adicione cada uma das seguintes variáveis (valores obtidos no Firebase Console):

```
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

**⚠️ ATENÇÃO:** Sem essas variáveis, o site não funcionará corretamente!

### 2.4 Fazer Deploy

1. Clique em **"Deploy site"**
2. Aguarde o build completar (leva ~2-5 minutos)
3. O Netlify fornecerá uma URL temporária: `https://random-name-123.netlify.app`

---

## 🎨 Passo 3: Configurar Domínio Personalizado (Opcional)

### 3.1 Usar Domínio Próprio

Se você já possui o domínio `dvhrecords.com`:

1. No Netlify, vá em **"Domain management"** → **"Add custom domain"**
2. Digite `dvhrecords.com`
3. Siga as instruções para configurar DNS:
   - **Tipo A**: Aponte para o IP do Netlify
   - **CNAME**: Aponte `www` para seu site Netlify

### 3.2 Configurar HTTPS

O Netlify fornece HTTPS automático via Let's Encrypt:

1. Vá em **"Domain management"** → **"HTTPS"**
2. Clique em **"Verify DNS configuration"**
3. Aguarde a emissão do certificado SSL (leva ~1 hora)

---

## 🔄 Passo 4: Configurar Deploy Automático

O Netlify já está configurado para deploy automático:

- ✅ Cada `git push` para a branch `main` dispara um novo deploy
- ✅ Pull requests criam preview deploys automáticos
- ✅ Rollback pode ser feito pelo painel do Netlify

---

## 🧪 Passo 5: Testar o Site

Após o deploy, teste as seguintes funcionalidades:

### Checklist de Testes:

- [ ] **Hero Section** - Logo e animações carregam
- [ ] **Caixa de Discos** - Abre e mostra carrossel
- [ ] **Toca-discos** - Drag & drop funciona
- [ ] **Player de Áudio** - Waveform aparece
- [ ] **Perfil do Artista** - Sidebar exibe informações
- [ ] **Seção About** - Conteúdo carrega
- [ ] **Seção Submit** - Formulário envia
- [ ] **Footer** - Crédito LocalBiz Academy aparece
- [ ] **Admin Panel** (`/admin`) - Login funciona
- [ ] **Segurança** - Clique direito desabilitado
- [ ] **Responsividade** - Funciona em mobile

---

## 🛠️ Troubleshooting

### Problema: Build falha com erro de dependências

**Solução:**
```bash
# Limpar cache do Netlify
# No painel: Site settings → Build & deploy → Clear cache and retry deploy
```

### Problema: Firebase não inicializa

**Solução:**
1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme que os valores estão corretos (sem espaços ou aspas extras)
3. Faça um novo deploy após adicionar as variáveis

### Problema: Imagens não carregam

**Solução:**
1. Verifique se a pasta `client/public/images/` está no repositório
2. Confirme que os caminhos das imagens começam com `/images/`

### Problema: Rotas retornam 404

**Solução:**
- Verifique se o arquivo `netlify.toml` está na raiz do projeto
- Confirme que a configuração de redirects está correta

---

## 📊 Monitoramento

### Analytics do Netlify

O Netlify fornece analytics básicos:
- Visitas por página
- Bandwidth usado
- Deploy history

Acesse em: **Site settings** → **Analytics**

### Logs de Deploy

Para ver logs detalhados de cada deploy:
1. Vá em **"Deploys"**
2. Clique em um deploy específico
3. Veja os logs de build

---

## 🔐 Segurança

### Headers de Segurança

O `netlify.toml` já inclui headers de segurança:
- `X-Frame-Options: DENY` - Previne clickjacking
- `X-Content-Type-Options: nosniff` - Previne MIME sniffing
- `X-XSS-Protection` - Proteção contra XSS

### Proteções Implementadas no Código

- ❌ Clique direito desabilitado
- ❌ Drag de imagens bloqueado
- ❌ Atalhos de teclado bloqueados
- ❌ Download de áudio desabilitado

---

## 📞 Suporte

Se encontrar problemas:

1. **Documentação Netlify**: https://docs.netlify.com
2. **Suporte Netlify**: https://answers.netlify.com
3. **Firebase Docs**: https://firebase.google.com/docs

---

## ✅ Checklist Final

Antes de considerar o deploy completo:

- [ ] Site acessível via URL Netlify
- [ ] Firebase configurado e funcionando
- [ ] Domínio personalizado configurado (se aplicável)
- [ ] HTTPS ativado
- [ ] Todos os testes passaram
- [ ] Admin panel acessível e funcional
- [ ] Proteções de segurança ativas

---

**🎉 Parabéns! Seu site DVH Records está no ar!**

Feito por **LocalBiz Academy**
