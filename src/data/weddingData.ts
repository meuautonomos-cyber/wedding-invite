import { WeddingData, TimelineEvent, Padrinho, DressCode, FAQ, NossaHistoria } from '@/types';

export const weddingData: WeddingData = {
  casamento: {
    noivos: {
      nome_noiva: "Esther",
      nome_noivo: "Anthony",
      monograma: "AE"
    },
    evento: {
      data: "21/03/26",
      hora: "15:30",
      local_resumo: "São Mateus - ES",
      endereco_completo: "Estrada do Nativo KM 1,4, Liberdade, São Mateus - ES, 29938-310",
      google_maps_link: "https://www.google.com/maps/search/?api=1&query=Estrada+do+Nativo+KM+1,4+Liberdade+São+Mateus+ES+29938-310",
      ics_texto_local: "Cerimonial Valle Verde"
    },
    video_convite: {
      tipo: "mp4",
      url: "/videos/test-video.mp4",
      poster: "/images/video-poster.jpg"
    },
    capa: {
      background_floral: "/images/bg-floral.jpg",
      envelope_3d: "/images/envelope-3d.png",
      selo_svg: "/images/selo-ae.svg",
      texto_chamada: "Você está convidado para a cerimônia de casamento de:"
    },
    lista_presentes: {
      modo: "cotas",
      pix: {
        chave: "(27) 99838-1284",
        qr: "/images/pix-qr.png",
        link: "https://nubank.com.br/cobrar/zf8yn/68c8e7c6-8563-47e5-9400-39ac8077affa"
      },
      itens: [
        // ELETRODOMÉSTICOS CAROS (Prioridade 1)
        { nome: "Smart TV", valor: 2000, imagem: "/images/itens/Smart Tv 50 Polegadas.webp", link: "https://mercadolivre.com/sec/1jaff8k" },
        { nome: "Máquina de Lavar", valor: 1500, imagem: "/images/itens/Maquina de Lavar.webp", link: "https://mercadolivre.com/sec/32siZuq" },
        { nome: "Robô Aspirador de Pó", valor: 800, imagem: "/images/itens/Aspirador de Pó Robô.webp", link: "https://mercadolivre.com/sec/1pdsqFp" },
        { nome: "Aspirador de Pó Vertical", valor: 400, imagem: "/images/itens/Aspirador de Pó Vertical.webp", link: "https://mercadolivre.com/sec/18fYNWW" },
        { nome: "Micro-ondas", valor: 300, imagem: "/images/itens/Micro-Ondas.webp", link: "https://mercadolivre.com/sec/2gGDJiH" },
        
        // COZINHA CARA (Prioridade 2)
        { nome: "Fritadeira sem óleo (Airfryer)", valor: 400, imagem: "/images/itens/Fritadeira Digital Clear - Air Fryer.webp", link: "https://mercadolivre.com/sec/1jDdXWD" },
        { nome: "Jogo de panelas antiaderentes/inox", valor: 300, imagem: "/images/itens/Panelas Ceramico.webp", link: "https://mercadolivre.com/sec/2usVbzq" },
        { nome: "Conjunto de travessas de vidro/cerâmica", valor: 250, imagem: "/images/itens/Kit Travessas.webp", link: "https://mercadolivre.com/sec/26av8p9" },
        { nome: "Jogo de cama (lençóis, fronhas, edredom)", valor: 200, imagem: "/images/itens/Conjunto de Cama.webp", link: "https://mercadolivre.com/sec/2NXLpcs" },
        
        // COZINHA MÉDIA (Prioridade 3)
        { nome: "Batedeira", valor: 150, imagem: "/images/itens/Batedeira.webp", link: "https://mercadolivre.com/sec/2frVCiG" },
        { nome: "Liquidificador", valor: 120, imagem: "/images/itens/Liquidificador.webp", link: "https://mercadolivre.com/sec/1SoRVx2" },
        { nome: "Mixer 3 em 1", valor: 100, imagem: "/images/itens/Mixer 3 em 1.webp", link: "https://mercadolivre.com/sec/1JScTpa" },
        { nome: "Panela elétrica de arroz", valor: 80, imagem: "/images/itens/Panela de Arroz Elétrica.webp", link: "https://mercadolivre.com/sec/2MXn8XZ" },
        { nome: "Conjunto de formas para bolo e assadeira", valor: 60, imagem: "/images/itens/Conjunto de Forma para Bolos.webp", link: "https://mercadolivre.com/sec/2rfXnPM" },
        
        // MESA E DECORAÇÃO (Prioridade 4)
        { nome: "Jogo de pratos", valor: 80, imagem: "/images/itens/Jogo de Prato Rasos.webp", link: "https://mercadolivre.com/sec/15kfbN3" },
        { nome: "Jogo de Talheres", valor: 60, imagem: "/images/itens/Jogo de Talheres.webp", link: "https://mercadolivre.com/sec/1VpEqxE" },
        { nome: "Conjunto de copos", valor: 50, imagem: "/images/itens/Conjunto de Copos.webp", link: "https://mercadolivre.com/sec/1bwH3eF" },
        { nome: "Colcha ou cobre-leito", valor: 80, imagem: "/images/itens/Colcha.webp", link: "https://mercadolivre.com/sec/2Pk99ys" },
        { nome: "Travesseiros", valor: 60, imagem: "/images/itens/Travesseiros.webp", link: "https://mercadolivre.com/sec/1piNg8B" },
        { nome: "Cortinas", valor: 100, imagem: "/images/itens/Cortinas.webp", link: "https://mercadolivre.com/sec/1CwNdqD" },
        { nome: "Estante para Livros", valor: 120, imagem: "/images/itens/Estante para Livros.webp", link: "https://mercadolivre.com/sec/1tnwT39" },
        
        // COZINHA BÁSICA (Prioridade 5)
        { nome: "Torradeira", valor: 50, imagem: "/images/itens/Torradeira Eletrica.webp", link: "https://mercadolivre.com/sec/2RJhMuX" },
        { nome: "Sanduicheira/grill", valor: 40, imagem: "/images/itens/Sanduicheira Grill.webp", link: "https://mercadolivre.com/sec/19tYLWx" },
        { nome: "Conjunto de facas", valor: 30, imagem: "/images/itens/Conjunto de Facas.webp", link: "https://mercadolivre.com/sec/19LNmft" },
        { nome: "Jogo de potes herméticos para mantimentos", valor: 40, imagem: "/images/itens/Jogo de potes Herméticos.webp", link: "https://mercadolivre.com/sec/2P9bHYg" },
        { nome: "Jogo Tapete Cozinha", valor: 25, imagem: "/images/itens/Tapetes Cozinha.webp", link: "https://mercadolivre.com/sec/1AeuNjb" },
        
        // BANHEIRO E ORGANIZAÇÃO (Prioridade 6)
        { nome: "Jogo de Toalhas", valor: 60, imagem: "/images/itens/Jogo de Toalhas.webp", link: "https://mercadolivre.com/sec/14QL9NG" },
        { nome: "Roupões de casal", valor: 80, imagem: "/images/itens/Roupões de Casal.webp", link: "https://mercadolivre.com/sec/27xRcLL" },
        { nome: "Kit de higiene (porta-sabonete, escova, etc.)", valor: 40, imagem: "/images/itens/Kit de Higiene.webp", link: "https://mercadolivre.com/sec/1DPEiFu" },
        { nome: "Kit organizadores de guarda-roupa", valor: 50, imagem: "/images/itens/Kit Organizador.webp", link: "https://mercadolivre.com/sec/23LXFht" },
        
        // DECORAÇÃO E ACESSÓRIOS (Prioridade 7)
        { nome: "Almofadas decorativas", valor: 30, imagem: "/images/itens/Kit Almofadas.webp", link: "https://mercadolivre.com/sec/16vMCgZ" },
        { nome: "Manta aconchegante", valor: 40, imagem: "/images/itens/Manta Aconchegante.webp", link: "https://mercadolivre.com/sec/1B8XRBh" },
        { nome: "Tapetes antiderrapantes", valor: 25, imagem: "/images/itens/Tapate Antiaderrente.webp", link: "https://mercadolivre.com/sec/1FKWkrJ" },
        
        // MESA E ACESSÓRIOS (Prioridade 8)
        { nome: "Jogo Americano", valor: 20, imagem: "/images/itens/Jogo Americano.webp", link: "https://mercadolivre.com/sec/2sytDNj" },
        { nome: "Travessas Retangular", valor: 15, imagem: "/images/itens/Travessa de Vidro.webp", link: "https://mercadolivre.com/sec/2xcp8oD" },
        { nome: "Jarra de suco/água", valor: 25, imagem: "/images/itens/Jarra de Suco.webp", link: "https://mercadolivre.com/sec/1j4AAFa" },
        { nome: "Garrafa térmica para café/chá", valor: 30, imagem: "/images/itens/Garrafa Termica Café.webp", link: "https://mercadolivre.com/sec/1k75wCy" },
        { nome: "Jogo de Xícaras", valor: 20, imagem: "/images/itens/Jogo de Xicaras.webp", link: "https://mercadolivre.com/sec/28yi7aT" },
        
        // ELETRODOMÉSTICOS BÁSICOS (Prioridade 9)
        { nome: "Ventilador", valor: 80, imagem: "/images/itens/Ventilador.webp", link: "https://mercadolivre.com/sec/2GYR7oM" },
        { nome: "Ferro de Passar", valor: 60, imagem: "/images/itens/Ferro de Passar.webp", link: "https://mercadolivre.com/sec/1NdYDhp" }
      ]
    },
    rsvp: {
      data_limite: "21/02/26",
      limite_total: 200,
      mensagem_pos_confirmacao: "Obrigado! Estamos contando os dias."
    },
    seo: {
      title: "Anthony & Esther — 21/03/26, 15:30h",
      description: "Nosso convite de casamento. Confirme presença, veja o local e a lista de presentes.",
      og_image: "/images/og-image.jpg"
    }
  }
};

export const timeline: TimelineEvent[] = [
  {
    hora: "15:30",
    evento: "Recepção",
    descricao: "Chegada dos convidados e welcome drink"
  },
  {
    hora: "15:30",
    evento: "Cerimônia de Casamento",
    descricao: "Celebração do casamento"
  },
  {
    hora: "16:30",
    evento: "Sessão de Fotos",
    descricao: "Fotos com os noivos e familiares"
  },
  {
    hora: "18:00",
    evento: "Jantar",
    descricao: "Jantar de celebração para os convidados"
  },
  {
    hora: "20:00",
    evento: "Festa",
    descricao: "Música, dança e celebração"
  }
];

export const padrinhoes: Padrinho[] = [
  {
    nome: "Angelica Clarindo",
    foto: "/images/angelica-clarindo.jpg",
    relacao: "Madrinha"
  },
  {
    nome: "Rondinelli Silva",
    foto: "/images/padrinhoes/Rondinelli Silva.jpg",
    relacao: "Padrinho"
  },
  {
    nome: "Paula Cardoso",
    foto: "/images/padrinhoes/Paula Cardoso.jpg",
    relacao: "Madrinha"
  },
  {
    nome: "Wellington Honório",
    foto: "/images/padrinhoes/Wellington Honório.jpg",
    relacao: "Padrinho"
  },
  {
    nome: "Ester Mattos",
    foto: "/images/padrinhoes/Ester Mattos.jpg",
    relacao: "Madrinha"
  },
  {
    nome: "Allan Mattos",
    foto: "/images/padrinhoes/Allan Mattos.jpg",
    relacao: "Padrinho"
  },
  {
    nome: "Yasmin Sant'anna",
    foto: "/images/padrinhoes/Yasmin Sant'anna.jpg",
    relacao: "Madrinha"
  },
  {
    nome: "Bruno Zardini",
    foto: "/images/padrinhoes/Bruno Zardini.jpg",
    relacao: "Padrinho"
  },
  {
    nome: "Maria Júlia",
    foto: "/images/padrinhoes/Maria Júlia.jpg",
    relacao: "Madrinha"
  },
  {
    nome: "Thiago Sant'anna",
    foto: "/images/padrinhoes/Thiago Sant'anna.jpg",
    relacao: "Padrinho"
  },
  {
    nome: "Erilene Marques",
    foto: "/images/padrinhoes/Erilene Marques.jpg",
    relacao: "Madrinha"
  },
  {
    nome: "Marcos Campagnaro",
    foto: "/images/padrinhoes/Marcos Campagnaro.jpg",
    relacao: "Padrinho"
  }
];

export const dressCode: DressCode = {
  cor_principal: "Branco",
  cor_secundaria: "Verde e Creme",
  descricao: "Pedimos que evitem as cores branco, verde e creme para que os noivos se destaquem. Sugerimos tons de azul, rosa, lilás, bege ou outras cores vibrantes.",
  exemplo_imagem: "/images/dress-code-example.jpg"
};

export const cotaValues = [50, 100, 200, 300, 500, 1000];

export const nossaHistoria: NossaHistoria = {
  titulo: "Nossa História",
  conteudo: "Começamos com um \"oi\" despretensioso e, sem perceber, nos tornamos casa um no outro. Entre cafés, risos e silêncios confortáveis, descobrimos que o amor mora nos detalhes: um olhar que acolhe, uma mão que não solta, um sonho que se soma. Hoje, escolhemos celebrar aquilo que a vida já confirmou tantas vezes: juntos, somos o melhor destino.",
  fotos: []
};

export const faqs: FAQ[] = [
  {
    pergunta: "Posso levar crianças?",
    resposta: "Sim! As crianças são muito bem-vindas à nossa celebração. Teremos um espaço especial para elas se divertirem."
  },
  {
    pergunta: "Há estacionamento no local?",
    resposta: "Sim, o local possui estacionamento gratuito para todos os convidados."
  },
  {
    pergunta: "Qual o dress code?",
    resposta: "Pedimos que evitem as cores branco, verde e creme para que os noivos se destaquem. Sugerimos tons de azul, rosa, lilás, bege ou outras cores vibrantes."
  },
  {
    pergunta: "Posso levar acompanhante?",
    resposta: "Não, não será possível levar acompanhante para este evento."
  },
  {
    pergunta: "Há opções vegetarianas e veganas?",
    resposta: "Não, não disponibilizaremos refeições vegetarianas e veganas para este evento."
  }
];
