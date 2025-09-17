# 💒 Site de Convite de Casamento

Um site de convite de casamento moderno, responsivo e totalmente funcional, desenvolvido com Next.js 15, TypeScript e Tailwind CSS.

## ✨ Funcionalidades

### 🏠 Página Inicial
- Design elegante com envelope 3D clicável
- Paleta de cores verde/creme/dourado
- Tipografia elegante (serif + script)
- Botões de compartilhamento (WhatsApp, copiar link, QR Code)
- Ícones circulares para navegação
- Animações suaves com Framer Motion

### 📱 Páginas Principais
- **Vídeo-Convite**: Player de vídeo com suporte a YouTube, Vimeo e MP4
- **Site**: História dos noivos, cronograma, dress code, padrinhos, FAQ
- **Lista de Presentes**: Sistema de cotas, PIX e lista tradicional
- **Local**: Google Maps integrado, informações de estacionamento
- **Confirmar Presença**: Formulário RSVP completo com validação

### 🛠️ Funcionalidades Técnicas
- **Mobile-First**: Otimizado para TikTok/Instagram Stories
- **SEO Otimizado**: Meta tags, Open Graph, Twitter Cards
- **PWA**: Instalável no celular
- **Performance**: LCP < 2.5s, imagens otimizadas
- **Acessibilidade**: Contraste AA, navegação por teclado
- **CMS Simples**: Painel administrativo para gerenciar dados

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/wedding-invite.git
cd wedding-invite
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local`:
```env
NEXT_PUBLIC_BASE_URL=https://seu-dominio.com
GOOGLE_MAPS_API_KEY=sua_chave_do_google_maps
```

4. **Execute o projeto**
```bash
npm run dev
# ou
yarn dev
```

5. **Acesse no navegador**
```
http://localhost:3000
```

## 📝 Configuração

### Personalizar Dados do Casamento

Edite o arquivo `src/data/weddingData.ts`:

```typescript
export const weddingData: WeddingData = {
  casamento: {
    noivos: {
      nome_noiva: "Sua Noiva",
      nome_noivo: "Seu Noivo", 
      monograma: "SN" // Usado no selo do envelope
    },
    evento: {
      data: "2026-03-08",
      hora: "17:00",
      local_resumo: "Sua Cidade - UF",
      endereco_completo: "Endereço completo do local",
      google_maps_link: "https://maps.google.com/?q=...",
      ics_texto_local: "Nome do local para o calendário"
    },
    // ... outros dados
  }
}
```

### Adicionar Imagens

1. Coloque as imagens na pasta `public/images/`
2. Atualize os caminhos no arquivo de dados
3. Use formatos otimizados (WebP, AVIF)

### Configurar Vídeo-Convite

```typescript
video_convite: {
  tipo: "youtube", // ou "vimeo" ou "mp4"
  url: "https://www.youtube.com/watch?v=SEU_VIDEO_ID",
  poster: "/images/video-poster.jpg"
}
```

## 🎨 Personalização

### Cores
As cores estão definidas em `tailwind.config.js`:
- Verde: `wedding-green-*`
- Creme: `wedding-cream-*` 
- Dourado: `wedding-gold-*`

### Fontes
- Serif: Playfair Display (títulos)
- Script: Dancing Script (nomes dos noivos)
- Sans: Inter (textos)

### Animações
Use as classes do Tailwind ou Framer Motion:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
```

## 📊 Painel Administrativo

Acesse `/admin` para gerenciar:
- Confirmações de presença (RSVP)
- Lista de presentes
- Exportar dados em CSV

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Netlify

1. Build do projeto: `npm run build`
2. Upload da pasta `out/` para Netlify
3. Configure redirects no `_redirects`

### Outros Provedores

```bash
npm run build
npm run start
```

## 📱 PWA

O site é instalável como PWA:
- Manifest configurado
- Ícones para diferentes tamanhos
- Funciona offline (com cache)

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificar código
```

## 📁 Estrutura do Projeto

```
src/
├── app/                 # Páginas (App Router)
│   ├── page.tsx        # Página inicial
│   ├── video/          # Vídeo-convite
│   ├── site/           # Informações do casamento
│   ├── presentes/      # Lista de presentes
│   ├── local/          # Local do evento
│   ├── confirmar/      # RSVP
│   └── admin/          # Painel administrativo
├── components/         # Componentes reutilizáveis
├── data/              # Dados do casamento
├── hooks/             # Hooks personalizados
├── lib/               # Utilitários e CMS
└── types/             # Tipos TypeScript
```

## 🎯 Critérios de Aceite

- ✅ Envelope clicável redireciona para vídeo
- ✅ Ícones de navegação funcionam
- ✅ RSVP grava dados e exibe confirmação
- ✅ Lista de presentes com funcionalidade real
- ✅ Local abre Google Maps e gera .ics
- ✅ Performance ≥ 90 no Lighthouse
- ✅ Acessibilidade ≥ 85
- ✅ Preview bonito no WhatsApp
- ✅ Totalmente responsivo

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 💝 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Framer Motion](https://www.framer.com/motion/) - Animações
- [Heroicons](https://heroicons.com/) - Ícones
- [Google Fonts](https://fonts.google.com/) - Tipografia

---

**Desenvolvido com 💚 para celebrar o amor**

Para dúvidas ou suporte, entre em contato: [seu-email@exemplo.com](mailto:seu-email@exemplo.com)