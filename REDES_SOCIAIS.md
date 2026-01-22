# Como Configurar as Redes Sociais do Footer

Para atualizar os links das redes sociais que aparecem no rodapé do site, siga estes passos:

## Passo 1: Abrir o arquivo de configuração

Navegue até o arquivo:
```
client/src/config/socialLinks.ts
```

## Passo 2: Editar os links

No arquivo, você encontrará um objeto com os links das redes sociais:

```typescript
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/dvhrecords',
  soundcloud: 'https://soundcloud.com/dvhrecords',
};
```

## Passo 3: Adicionar novas redes sociais (opcional)

Para adicionar mais redes sociais, basta descomentar ou adicionar novas linhas:

```typescript
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/seu_perfil',
  soundcloud: 'https://soundcloud.com/seu_perfil',
  spotify: 'https://open.spotify.com/user/seu_perfil',
  facebook: 'https://facebook.com/sua_pagina',
  twitter: 'https://twitter.com/seu_perfil',
  youtube: 'https://youtube.com/@seu_canal',
};
```

## Passo 4: Atualizar o componente Footer (se adicionar novas redes)

Se você adicionar novas redes sociais, precisará também adicionar os ícones e links no arquivo:
```
client/src/components/Footer.tsx
```

Procure pela seção "Social Links" e adicione novos links seguindo o padrão existente.

## Exemplo de como adicionar o Spotify:

1. No `socialLinks.ts`:
```typescript
spotify: 'https://open.spotify.com/user/dvhrecords',
```

2. No `Footer.tsx`, adicione após o SoundCloud:
```tsx
<a
  href={SOCIAL_LINKS.spotify}
  target="_blank"
  rel="noopener noreferrer"
  className="text-primary/70 hover:text-primary transition-colors"
  aria-label="Spotify"
>
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
</a>
```

## Notas importantes:

- Os ícones SVG podem ser encontrados em sites como [Simple Icons](https://simpleicons.org/)
- Sempre use `target="_blank"` e `rel="noopener noreferrer"` para abrir em nova aba com segurança
- Adicione `aria-label` para acessibilidade

---

✅ Após fazer as mudanças, o site atualizará automaticamente (hot reload) ou faça o deploy novamente.
