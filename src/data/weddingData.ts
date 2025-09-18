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
        {
          nome: "Panela de pressão",
          valor: 199.90,
          imagem: "/images/itens/panela.jpg",
          link: "https://loja.com/panela"
        }
      ]
    },
    rsvp: {
      data_limite: "2026-02-21",
      limite_total: 200,
      mensagem_pos_confirmacao: "Obrigado! Estamos contando os dias."
    },
    seo: {
      title: "Anthony & Esther — 21/03/26, 16h",
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
    hora: "16:00",
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
