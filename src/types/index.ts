export interface WeddingData {
  casamento: {
    noivos: {
      nome_noiva: string;
      nome_noivo: string;
      monograma: string;
    };
    evento: {
      data: string;
      hora: string;
      local_resumo: string;
      endereco_completo: string;
      google_maps_link: string;
      ics_texto_local: string;
    };
    video_convite: {
      tipo: 'youtube' | 'vimeo' | 'mp4';
      url: string;
      poster: string;
    };
    capa: {
      background_floral: string;
      envelope_3d: string;
      selo_svg: string;
      texto_chamada: string;
    };
    lista_presentes: {
      modo: 'cotas' | 'tradicional' | 'pix';
      pix?: {
        chave: string;
        qr: string;
        link?: string;
      };
      itens?: Array<{
        nome: string;
        valor: number;
        imagem: string;
        link: string;
      }>;
    };
    rsvp: {
      data_limite: string;
      limite_total: number;
      mensagem_pos_confirmacao: string;
    };
    seo: {
      title: string;
      description: string;
      og_image: string;
    };
  };
}

export interface RSVPData {
  id?: string;
  nome: string;
  telefone: string;
  email: string;
  quantidade_convidados: number;
  restricoes_alimentares?: string;
  observacoes?: string;
  status: 'confirmado' | 'com_acompanhante' | 'nao_podera_ir';
  data_confirmacao: string;
}

export interface GiftData {
  id?: string;
  tipo: 'cota' | 'item' | 'pix';
  valor?: number;
  item_nome?: string;
  doador_nome: string;
  doador_telefone: string;
  doador_email?: string;
  mensagem?: string;
  data_presente: string;
  status: 'pendente' | 'confirmado' | 'entregue';
}

export interface TimelineEvent {
  hora: string;
  evento: string;
  descricao?: string;
}

export interface Padrinho {
  nome: string;
  foto: string;
  relacao: string;
}

export interface DressCode {
  cor_principal: string;
  cor_secundaria?: string;
  descricao: string;
  exemplo_imagem?: string;
}

export interface FAQ {
  pergunta: string;
  resposta: string;
}

export interface NossaHistoria {
  titulo: string;
  conteudo: string;
  fotos: string[];
}

export interface VideoConvite {
  tipo: 'youtube' | 'vimeo' | 'mp4';
  url: string;
  poster: string;
  titulo?: string;
  descricao?: string;
}
