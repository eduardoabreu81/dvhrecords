# 🚀 Guia de Configuração - DVH Records

Este guia contém **TODOS os passos** para configurar Firebase, AWS S3 e fazer deploy no Netlify.

---

## 📋 Pré-requisitos

- Conta Google (para Firebase)
- Conta AWS (para S3)
- Conta GitHub
- Conta Netlify

---

## 🔥 PARTE 1: Configurar Firebase

### Passo 1: Criar Projeto Firebase

1. Acesse https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"**
3. Nome do projeto: `dvh-records` (ou qualquer nome)
4. Desabilite Google Analytics (opcional)
5. Clique em **"Criar projeto"**

### Passo 2: Configurar Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Modo: **"Produção"** (para segurança)
4. Localização: Escolha a mais próxima (ex: `southamerica-east1`)
5. Clique em **"Ativar"**

### Passo 3: ~~Configurar Firebase Storage~~ (NÃO NECESSÁRIO)

**PULAR ESTE PASSO** - Vamos usar AWS S3 para storage (Firebase Storage é pago)

### Passo 4: Configurar Authentication

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Começar"**
3. Aba **"Sign-in method"**
4. Ative **"E-mail/senha"**
5. Salve

### Passo 5: Obter Credenciais Firebase

1. Clique no ícone de **engrenagem** (⚙️) ao lado de "Visão geral do projeto"
2. Clique em **"Configurações do projeto"**
3. Role até **"Seus aplicativos"**
4. Clique no ícone **Web** (`</>`)
5. Nome do app: `dvh-records-web`
6. **NÃO** marque Firebase Hosting
7. Clique em **"Registrar app"**
8. **COPIE** as credenciais que aparecem:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "dvh-records.firebaseapp.com",
  projectId: "dvh-records",
  storageBucket: "dvh-records.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Passo 6: Configurar Regras de Segurança

#### Firestore Rules
1. Vá em **Firestore Database** → **Regras**
2. Cole este código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura pública de artistas
    match /artists/{artistId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Permitir leitura pública de tracks
    match /tracks/{trackId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Clique em **"Publicar"**

#### ~~Storage Rules~~ (NÃO NECESSÁRIO)

**PULAR ESTE PASSO** - Não vamos usar Firebase Storage

---

## ☁️ PARTE 2: Configurar AWS S3 (para TUDO: imagens + músicas)

### Passo 1: Criar Bucket S3

1. Acesse https://s3.console.aws.amazon.com/
2. Clique em **"Criar bucket"**
3. Nome do bucket: `dvh-records-files` (deve ser único globalmente)
4. Região: Escolha a mais próxima (ex: `sa-east-1` - São Paulo)
5. **Desmarque** "Bloquear todo o acesso público"
6. Marque a confirmação de risco
7. Clique em **"Criar bucket"**

### Passo 2: Configurar CORS

1. Clique no bucket criado
2. Aba **"Permissões"**
3. Role até **"Compartilhamento de recursos entre origens (CORS)"**
4. Clique em **"Editar"**
5. Cole este JSON:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

6. Clique em **"Salvar alterações"**

### Passo 3: Criar Usuário IAM

1. Acesse https://console.aws.amazon.com/iam/
2. Menu lateral → **"Usuários"**
3. Clique em **"Criar usuário"**
4. Nome: `dvh-records-s3-user`
5. Clique em **"Próximo"**
6. Selecione **"Anexar políticas diretamente"**
7. Busque e marque: **"AmazonS3FullAccess"**
8. Clique em **"Próximo"** → **"Criar usuário"**

### Passo 4: Obter Credenciais AWS

1. Clique no usuário criado (`dvh-records-s3-user`)
2. Aba **"Credenciais de segurança"**
3. Role até **"Chaves de acesso"**
4. Clique em **"Criar chave de acesso"**
5. Caso de uso: **"Aplicativo em execução fora da AWS"**
6. Clique em **"Próximo"** → **"Criar chave de acesso"**
7. **COPIE E SALVE**:
   - **Access Key ID**: `AKIA...`
   - **Secret Access Key**: `wJalr...` (só aparece uma vez!)

---

## 🔐 PARTE 3: Configurar Variáveis de Ambiente

### Passo 1: Criar arquivo .env

1. Na raiz do projeto, crie o arquivo `.env`
2. Cole este template e **SUBSTITUA** pelos seus valores:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=dvh-records.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dvh-records
VITE_FIREBASE_STORAGE_BUCKET=dvh-records.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# AWS S3 Configuration (para imagens + músicas)
VITE_AWS_REGION=sa-east-1
VITE_AWS_BUCKET_NAME=dvh-records-files
VITE_AWS_ACCESS_KEY_ID=AKIA...
VITE_AWS_SECRET_ACCESS_KEY=wJalr...
```

3. **NUNCA** commite este arquivo no GitHub!

---

## 🌐 PARTE 4: Deploy no Netlify

### Passo 1: Preparar Repositório GitHub

1. Crie um repositório no GitHub: `dvh-records`
2. No terminal do projeto:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/dvh-records.git
git push -u origin main
```

### Passo 2: Conectar Netlify

1. Acesse https://app.netlify.com/
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Escolha **"GitHub"**
4. Autorize o Netlify
5. Selecione o repositório `dvh-records`

### Passo 3: Configurar Build

1. **Build command**: `cd client && pnpm install && pnpm build`
2. **Publish directory**: `client/dist`
3. Clique em **"Show advanced"** → **"New variable"**
4. **ADICIONE TODAS** as variáveis do `.env`:

```
VITE_FIREBASE_API_KEY = AIza...
VITE_FIREBASE_AUTH_DOMAIN = dvh-records.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = dvh-records
VITE_FIREBASE_STORAGE_BUCKET = dvh-records.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 123456789
VITE_FIREBASE_APP_ID = 1:123456789:web:abc123
VITE_AWS_REGION = sa-east-1
VITE_AWS_BUCKET_NAME = dvh-records-files
VITE_AWS_ACCESS_KEY_ID = AKIA...
VITE_AWS_SECRET_ACCESS_KEY = wJalr...
```

5. Clique em **"Deploy site"**

### Passo 4: Configurar Domínio (Opcional)

1. No painel do Netlify, vá em **"Domain settings"**
2. Clique em **"Add custom domain"**
3. Digite seu domínio: `dvhrecords.com`
4. Siga as instruções para configurar DNS

---

## ✅ PARTE 5: Testar Tudo

### Teste 1: Admin Login
1. Acesse `https://SEU_SITE.netlify.app/admin`
2. Faça login com email/senha
3. Deve funcionar!

### Teste 2: Upload de Imagem
1. No Admin, clique em "Adicionar Artista"
2. Faça upload de uma imagem
3. Deve salvar no AWS S3 (pasta `images/`)

### Teste 3: Upload de Música
1. No Admin, adicione uma track
2. Faça upload de um MP3
3. Deve salvar no AWS S3

---

## 🆘 Problemas Comuns

### Erro: "Firebase: Error (auth/invalid-api-key)"
- Verifique se copiou a API Key corretamente
- Verifique se adicionou no `.env` e no Netlify

### Erro: "Access Denied" no S3
- Verifique se o bucket está público
- Verifique se configurou CORS
- Verifique as credenciais IAM

### Site não carrega no Netlify
- Verifique se o build command está correto
- Verifique se todas as variáveis de ambiente foram adicionadas
- Veja os logs de build no Netlify

---

## 📞 Próximos Passos

Depois de configurar tudo:

1. Me envie as variáveis de ambiente (via mensagem privada)
2. Vou testar localmente
3. Vou criar o primeiro usuário admin para você
4. Site estará pronto para uso!

---

**Dúvidas? Me envie mensagem!**
