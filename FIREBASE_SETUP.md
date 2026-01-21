# 🔥 Configuração do Firebase para DVH Records

Este projeto utiliza Firebase para backend (Firestore, Storage e Authentication). Siga os passos abaixo para configurar.

## 📋 Passo 1: Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"** ou **"Create a project"**
3. Nome do projeto: `dvh-records` (ou outro nome de sua preferência)
4. Desabilite Google Analytics (opcional)
5. Clique em **"Criar projeto"**

## 🔧 Passo 2: Configurar Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Modo de produção"** (vamos configurar regras depois)
4. Selecione a localização mais próxima (ex: `southamerica-east1` para Brasil)
5. Clique em **"Ativar"**

### Regras de Segurança do Firestore

Após criar o banco, vá em **"Regras"** e substitua por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura pública de artistas
    match /artists/{artistId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Permitir leitura pública de releases
    match /releases/{releaseId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Demos apenas para admin
    match /demos/{demoId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📦 Passo 3: Configurar Storage

1. No menu lateral, clique em **"Storage"**
2. Clique em **"Começar"** ou **"Get started"**
3. Escolha **"Modo de produção"**
4. Use a mesma localização do Firestore
5. Clique em **"Concluído"**

### Regras de Segurança do Storage

Vá em **"Regras"** e substitua por:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir leitura pública de todos os arquivos
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🔐 Passo 4: Configurar Authentication

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Começar"** ou **"Get started"**
3. Na aba **"Sign-in method"**, ative:
   - **Email/Password** (para login do admin)
4. Clique em **"Salvar"**

### Criar Usuário Admin

1. Vá na aba **"Users"**
2. Clique em **"Adicionar usuário"**
3. Email: `admin@dvhrecords.com` (ou seu email)
4. Senha: (escolha uma senha forte)
5. Clique em **"Adicionar usuário"**

## 🔑 Passo 5: Obter Credenciais

1. No menu lateral, clique no ícone de **engrenagem** ⚙️ > **"Configurações do projeto"**
2. Role até **"Seus aplicativos"**
3. Clique no ícone **Web** (`</>`)
4. Apelido do app: `dvh-records-web`
5. **NÃO** marque Firebase Hosting
6. Clique em **"Registrar app"**
7. Copie as credenciais que aparecem:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "dvh-records.firebaseapp.com",
  projectId: "dvh-records",
  storageBucket: "dvh-records.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## 📝 Passo 6: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as credenciais:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=dvh-records.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dvh-records
VITE_FIREBASE_STORAGE_BUCKET=dvh-records.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## ✅ Passo 7: Testar Configuração

1. Execute o projeto localmente:
```bash
pnpm install
pnpm dev
```

2. Acesse `http://localhost:3000/admin`
3. Faça login com o email/senha criados
4. Se conseguir acessar o admin panel, está tudo configurado! 🎉

## 🚀 Deploy no Netlify

### Configurar Variáveis de Ambiente no Netlify

1. Acesse [Netlify](https://app.netlify.com/)
2. Vá em **Site settings** > **Environment variables**
3. Adicione todas as variáveis do arquivo `.env`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### Build Settings

- **Build command**: `pnpm build`
- **Publish directory**: `client/dist`
- **Node version**: 22.x

## 📚 Estrutura do Firestore

O projeto criará automaticamente as seguintes coleções:

### `artists`
```javascript
{
  id: "digital-hunters",
  name: "Digital Hunters",
  genre: ["Drum & Bass", "Breakbeat"],
  bio: "Bio do artista...",
  profileImage: "https://storage...",
  coverImage: "https://storage...",
  tracks: [
    {
      id: "track-1",
      title: "Track Name",
      duration: 225,
      audioUrl: "https://storage...",
      releaseDate: "2025-01-15"
    }
  ],
  socialLinks: {
    spotify: "https://...",
    soundcloud: "https://...",
    instagram: "https://...",
    youtube: "https://..."
  },
  order: 1,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `releases` (opcional)
```javascript
{
  id: "release-1",
  title: "Release Name",
  type: "single" | "ep" | "album",
  artistIds: ["digital-hunters"],
  coverImage: "https://...",
  releaseDate: "2025-01-15",
  tracks: [...]
}
```

### `demos` (opcional)
```javascript
{
  id: "demo-1",
  artistName: "New Artist",
  email: "artist@email.com",
  genre: "Drum & Bass",
  demoUrl: "https://...",
  message: "Mensagem...",
  status: "pending" | "approved" | "rejected",
  submittedAt: Timestamp
}
```

## 🆘 Problemas Comuns

### Erro: "Firebase: Error (auth/configuration-not-found)"
- Verifique se ativou Authentication no Firebase Console
- Certifique-se de que Email/Password está habilitado

### Erro: "Missing or insufficient permissions"
- Verifique as regras de segurança do Firestore
- Certifique-se de estar autenticado ao tentar escrever dados

### Erro: "Storage: Object not found"
- Verifique as regras de segurança do Storage
- Certifique-se de que o arquivo foi enviado corretamente

## 📞 Suporte

Se tiver problemas, verifique:
1. Console do navegador (F12) para erros JavaScript
2. Firebase Console > Firestore/Storage para verificar dados
3. Firebase Console > Authentication para verificar usuários

---

**Desenvolvido por LocalBiz Academy** 🚀
