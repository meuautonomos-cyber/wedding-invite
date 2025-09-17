'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { weddingData, timeline, padrinhoes, dressCode, nossaHistoria, faqs } from '@/data/weddingData'
import { 
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'

export default function SitePage() {
  const router = useRouter()
  const { noivos, evento } = weddingData.casamento
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  // Dados das imagens do Valle Verde
  const valleVerdeImages = [
    {
      src: "/images/valle-verde-01.jpg",
      alt: "Valle Verde - Vista panorâmica do local",
      title: "Vista Panorâmica",
      description: "Uma visão geral do belo espaço do Valle Verde"
    },
    {
      src: "/images/valle-verde-02.jpg",
      alt: "Valle Verde - Área gourmet",
      title: "Área Gourmet",
      description: "O espaço principal com iluminação especial"
    },
    {
      src: "/images/valle-verde-03.jpg",
      alt: "Valle Verde - Jardins e vegetação",
      title: "Jardins Naturais",
      description: "Vegetação tropical e jardins bem cuidados"
    },
    {
      src: "/images/valle-verde-04.jpg",
      alt: "Valle Verde - Balanço decorativo",
      title: "Balanço Decorativo",
      description: "Lugar de Lembranças Perfeitas"
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % valleVerdeImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + valleVerdeImages.length) % valleVerdeImages.length)
  }

  return (
    <div className="min-h-screen bg-wedding-cream-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-wedding-cream-200 z-50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="p-2 hover:bg-wedding-cream-100 rounded-full transition-colors z-10"
            aria-label="Voltar"
          >
            <ArrowLeftIcon className="w-5 h-5 text-wedding-olive-600" />
          </motion.button>
              <h1 className="text-xl font-script text-wedding-olive-800 z-10 title-elegant">
                {noivos.nome_noiva} & {noivos.nome_noivo}
              </h1>
          <div className="w-9"></div> {/* Spacer para centralizar */}
        </div>
      </header>

      <main className="px-4 py-8 max-w-4xl mx-auto">
        {/* Nossa História - Design Elegante */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
                <h2 className="text-4xl font-script text-wedding-olive-800 mb-4 title-elegant">
                  {nossaHistoria.titulo}
                </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-wedding-gold to-wedding-olive mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Card principal com decoração */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-wedding-ring/20 overflow-hidden relative">
              {/* Decoração de fundo */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-wedding-gold/5 to-wedding-olive/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-wedding-cream/10 to-wedding-gold/10 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                {/* Texto da história */}
                <div className="text-center mb-12">
                  <div className="max-w-4xl mx-auto">
                        <p className="text-wedding-olive-700 leading-relaxed text-xl font-light italic text-readable">
                          &ldquo;{nossaHistoria.conteudo}&rdquo;
                        </p>
                  </div>
                </div>
                
                    {/* Galeria de fotos do casal */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                      >
                        <div className="aspect-[4/3] bg-wedding-cream-200 overflow-hidden">
                          <img
                            src="/images/historia-1.jpg"
                            alt="Esther e Anthony caminhando na praia"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 high-quality-image"
                            style={{ 
                              objectPosition: 'center 70%'
                            }}
                            loading="eager"
                            decoding="async"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-sm font-medium">Caminhando na praia</p>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                      >
                        <div className="aspect-[4/3] bg-wedding-cream-200 overflow-hidden">
                          <img
                            src="/images/historia-2.jpg"
                            alt="Esther e Anthony em um momento romântico"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 high-quality-image"
                            loading="eager"
                            decoding="async"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-sm font-medium">Momento romântico</p>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                      >
                        <div className="aspect-[4/3] bg-wedding-cream-200 overflow-hidden">
                          <img
                            src="/images/historia-3.jpg"
                            alt="Esther e Anthony em um abraço carinhoso"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 high-quality-image"
                            style={{ 
                              objectPosition: 'center 30%'
                            }}
                            loading="eager"
                            decoding="async"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-sm font-medium">Abraço carinhoso</p>
                        </div>
                      </motion.div>
                    </div>

                {/* Fotos adicionais da nossaHistoria.fotos se existirem */}
                {nossaHistoria.fotos && nossaHistoria.fotos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {nossaHistoria.fotos.map((foto, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: (index + 3) * 0.1 }}
                        className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="aspect-square bg-wedding-cream-200 overflow-hidden">
                          <img
                            src={foto}
                            alt={`Foto ${index + 1} da nossa história`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Cronograma do Dia - Design Limpo e Elegante */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
              <h2 className="text-3xl font-script text-wedding-olive-800 text-center mb-8 title-elegant">
                Cronograma do Dia
              </h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {timeline.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-wedding-ring/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-wedding-olive rounded-full flex items-center justify-center">
                        <ClockIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-wedding-gold font-bold text-xl">
                          {event.hora}
                        </span>
                        <span className="text-wedding-olive-800 font-semibold text-xl">
                          {event.evento}
                        </span>
                      </div>
                      {event.descricao && (
                        <p className="text-wedding-olive-700 text-base">
                          {event.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Dress Code - Design Refinado */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
              <h2 className="text-3xl font-script text-wedding-olive-800 text-center mb-8 title-elegant">
                Dress Code
              </h2>
          
          <div className="max-w-5xl mx-auto">
            {/* Card principal */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-wedding-ring/20 overflow-hidden relative">
              {/* Decoração de fundo */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-wedding-gold/5 to-wedding-olive/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-wedding-cream/10 to-wedding-gold/10 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                {/* Cores a evitar */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-wedding-olive-800 mb-6 flex items-center justify-center gap-3">
                    <svg className="w-6 h-6 text-wedding-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                    </svg>
                    Cores a Evitar
                  </h3>
                  
                  <div className="flex justify-center gap-8 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-3 border-4 border-gray-300"></div>
                      <span className="text-wedding-olive-800 font-semibold">Branco</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-wedding-olive rounded-full flex items-center justify-center shadow-lg mb-3"></div>
                      <span className="text-wedding-olive-800 font-semibold">Verde</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-wedding-cream rounded-full flex items-center justify-center shadow-lg mb-3 border-2 border-wedding-olive"></div>
                      <span className="text-wedding-olive-800 font-semibold">Creme</span>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
                    <p className="text-red-800 font-medium text-lg">
                      ⚠️ <strong>Importante:</strong> Evitem essas cores para que os noivos se destaquem!
                    </p>
                  </div>
                </div>

                {/* Sugestões de cores */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-wedding-olive-800 mb-6 text-center flex items-center justify-center gap-3">
                    <svg className="w-6 h-6 text-wedding-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Cores Sugeridas
                  </h3>
                  
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    <div className="text-center group">
                      <div className="w-14 h-14 bg-blue-500 rounded-full mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white"></div>
                      <span className="text-wedding-olive-800 font-medium text-sm">Azul</span>
                    </div>
                    <div className="text-center group">
                      <div className="w-14 h-14 bg-pink-400 rounded-full mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white"></div>
                      <span className="text-wedding-olive-800 font-medium text-sm">Rosa</span>
                    </div>
                    <div className="text-center group">
                      <div className="w-14 h-14 bg-purple-400 rounded-full mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white"></div>
                      <span className="text-wedding-olive-800 font-medium text-sm">Lilás</span>
                    </div>
                    <div className="text-center group">
                      <div className="w-14 h-14 bg-amber-300 rounded-full mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white"></div>
                      <span className="text-wedding-olive-800 font-medium text-sm">Bege</span>
                    </div>
                    <div className="text-center group">
                      <div className="w-14 h-14 bg-yellow-400 rounded-full mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white"></div>
                      <span className="text-wedding-olive-800 font-medium text-sm">Amarelo</span>
                    </div>
                    <div className="text-center group">
                      <div className="w-14 h-14 bg-rose-300 rounded-full mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white"></div>
                      <span className="text-wedding-olive-800 font-medium text-sm">Rosa-claro</span>
                    </div>
                    <div className="text-center group">
                      <div className="w-14 h-14 bg-indigo-400 rounded-full mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white"></div>
                      <span className="text-wedding-olive-800 font-medium text-sm">Índigo</span>
                    </div>
                    <div className="text-center group">
                      <div className="w-14 h-14 bg-orange-300 rounded-full mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white"></div>
                      <span className="text-wedding-olive-800 font-medium text-sm">Laranja</span>
                    </div>
                    <div className="text-center group">
                      <div className="w-14 h-14 bg-cyan-400 rounded-full mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white"></div>
                      <span className="text-wedding-olive-800 font-medium text-sm">Ciano</span>
                    </div>
                    <div className="text-center group">
                      <div className="w-14 h-14 bg-violet-400 rounded-full mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white"></div>
                      <span className="text-wedding-olive-800 font-medium text-sm">Violeta</span>
                    </div>
                    <div className="text-center group">
                      <div className="w-14 h-14 bg-red-400 rounded-full mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white"></div>
                      <span className="text-wedding-olive-800 font-medium text-sm">Vermelho</span>
                    </div>
                    <div className="text-center group">
                      <div className="w-14 h-14 bg-sky-400 rounded-full mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white"></div>
                      <span className="text-wedding-olive-800 font-medium text-sm">Céu</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-wedding-olive-600 text-sm italic">
                      💡 Escolham qualquer cor vibrante que não seja branco, verde ou creme!
                    </p>
                  </div>
                </div>

                {/* Instruções detalhadas */}
                <div className="bg-wedding-olive/5 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-wedding-olive-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-wedding-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Instruções Detalhadas
                  </h3>
                  <p className="text-wedding-olive-700 leading-relaxed text-base">
                    {dressCode.descricao}
                  </p>
                </div>

                {/* Exemplo de imagem se existir */}
                {dressCode.exemplo_imagem && (
                  <div className="text-center mt-8">
                    <h3 className="text-xl font-semibold text-wedding-olive-800 mb-4">
                      Exemplo de Look dos Padrinhos
                    </h3>
                    <div className="bg-wedding-cream/20 rounded-2xl p-6">
                      <img
                        src={dressCode.exemplo_imagem}
                        alt="Exemplo de dress code para padrinhos"
                        className="w-full max-w-md mx-auto rounded-xl shadow-lg"
                      />
                    </div>
                    <p className="text-wedding-olive-600 text-sm mt-3 italic">
                      💡 Este é um exemplo de como os padrinhos devem se vestir
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

            {/* Padrinhos e Madrinhas - Design Elegante */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-script text-wedding-olive-800 mb-4">
                  Padrinhos e Madrinhas
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-wedding-gold to-wedding-olive mx-auto rounded-full"></div>
                <p className="text-wedding-olive-600 mt-4 text-lg italic">
                  Pessoas especiais que fazem parte da nossa história
                </p>
              </div>
              
              <div className="max-w-6xl mx-auto">
                {/* Card principal com decoração */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-wedding-ring/20 overflow-hidden relative">
                  {/* Decoração de fundo */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-wedding-gold/5 to-wedding-olive/5 rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-wedding-cream/10 to-wedding-gold/10 rounded-full translate-y-24 -translate-x-24"></div>
                  
                  <div className="relative z-10">
                    {/* Grid responsivo com design elegante */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                      {padrinhoes.map((padrinho, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ 
                            duration: 0.6, 
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 100
                          }}
                          className="group text-center"
                        >
                          {/* Card individual com hover effect */}
                          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-wedding-ring/30 hover:shadow-2xl hover:scale-105 transition-all duration-500 group-hover:bg-white/80">
                            
                            {/* Foto com efeito elegante */}
                            <div className="relative mb-4">
                              <div className="w-28 h-28 mx-auto relative">
                                {/* Anel dourado decorativo */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-wedding-gold to-wedding-olive p-1">
                                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                    <img
                                      src={padrinho.foto}
                                      alt={padrinho.nome}
                                      className="w-full h-full object-cover high-quality-image group-hover:scale-110 transition-transform duration-500"
                                      loading="lazy"
                                      decoding="async"
                                      onError={(e) => {
                                        // Ocultar toda a seção do padrinho se a imagem não carregar
                                        const parentCard = e.currentTarget.closest('.group')
                                        if (parentCard) {
                                          (parentCard as HTMLElement).style.display = 'none'
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                
                                {/* Efeito de brilho no hover */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-wedding-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              </div>
                            </div>
                            
                            {/* Informações */}
                            <div className="space-y-2">
                              <h3 className="font-semibold text-wedding-olive-800 text-lg group-hover:text-wedding-gold transition-colors duration-300">
                                {padrinho.nome}
                              </h3>
                              <div className="flex items-center justify-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${padrinho.relacao === 'Madrinha' ? 'bg-pink-400' : 'bg-blue-400'}`}></div>
                                <p className="text-wedding-olive-600 font-medium text-sm">
                                  {padrinho.relacao}
                                </p>
                              </div>
                            </div>
                            
                            {/* Linha decorativa */}
                            <div className="mt-4 w-12 h-0.5 bg-gradient-to-r from-wedding-gold to-wedding-olive mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Mensagem especial */}
                    <div className="mt-12 text-center">
                      <div className="bg-gradient-to-r from-wedding-gold/10 to-wedding-olive/10 rounded-2xl p-6 border border-wedding-ring/30">
                        <p className="text-wedding-olive-700 text-lg italic leading-relaxed">
                          &ldquo;Agradecemos a cada um de vocês por fazerem parte desta jornada conosco. 
                          Sua presença e apoio significam o mundo para nós.&rdquo;
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                          <div className="w-8 h-0.5 bg-wedding-gold rounded-full"></div>
                          <span className="text-wedding-gold font-script text-xl">Esther & Anthony</span>
                          <div className="w-8 h-0.5 bg-wedding-gold rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

        {/* Dúvidas Frequentes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-script text-wedding-olive-800 text-center mb-8">
            Dúvidas Frequentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="font-medium text-wedding-olive-800 pr-4">
                    {faq.pergunta}
                  </h3>
                  {openFAQ === index ? (
                    <ChevronUpIcon className="w-5 h-5 text-wedding-olive-600 flex-shrink-0" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-wedding-olive-600 flex-shrink-0" />
                  )}
                </button>
                {openFAQ === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-wedding-cream-200"
                  >
                    <p className="text-wedding-olive-700 leading-relaxed">
                      {faq.resposta}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

            {/* Informações do Evento - Com Fotos do Local */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-script text-wedding-olive-800 mb-4">
                  Informações do Evento
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-wedding-gold to-wedding-olive mx-auto rounded-full"></div>
                <p className="text-wedding-olive-600 mt-4 text-lg italic">
                  Um local especial para celebrar nosso grande dia
                </p>
              </div>
              
              <div className="max-w-6xl mx-auto">
                {/* Card principal com decoração */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-wedding-ring/20 overflow-hidden relative">
                  {/* Decoração de fundo */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-wedding-gold/5 to-wedding-olive/5 rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-wedding-cream/10 to-wedding-gold/10 rounded-full translate-y-24 -translate-x-24"></div>
                  
                  <div className="relative z-10">
                    {/* Informações básicas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                      <div className="flex items-center gap-4 p-4 bg-wedding-cream/30 rounded-xl">
                        <div className="w-12 h-12 bg-wedding-olive rounded-full flex items-center justify-center">
                          <CalendarIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-wedding-olive-800 text-lg">Data</p>
                          <p className="text-wedding-olive-700 font-medium">{evento.data}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-wedding-cream/30 rounded-xl">
                        <div className="w-12 h-12 bg-wedding-gold rounded-full flex items-center justify-center">
                          <ClockIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-wedding-olive-800 text-lg">Horário</p>
                          <p className="text-wedding-olive-700 font-medium">{evento.hora}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-wedding-cream/30 rounded-xl md:col-span-1">
                        <div className="w-12 h-12 bg-wedding-olive-ink rounded-full flex items-center justify-center">
                          <MapPinIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-wedding-olive-800 text-lg">Local</p>
                          <p className="text-wedding-olive-700 font-medium">{evento.local_resumo}</p>
                        </div>
                      </div>
                    </div>

                    {/* Endereço completo */}
                    <div className="bg-gradient-to-r from-wedding-olive/5 to-wedding-gold/5 rounded-2xl p-6 mb-12">
                      <h3 className="text-xl font-semibold text-wedding-olive-800 mb-3 flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-wedding-gold" />
                        Endereço Completo
                      </h3>
                      <p className="text-wedding-olive-700 text-lg leading-relaxed">
                        {evento.endereco_completo}
                      </p>
                      <a 
                        href={evento.google_maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-wedding-gold hover:text-wedding-olive-ink transition-colors duration-300 font-medium"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Ver no Google Maps
                      </a>
                    </div>

                    {/* Carrossel de fotos do Valle Verde */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-semibold text-wedding-olive-800 mb-6 text-center flex items-center justify-center gap-3">
                        <svg className="w-6 h-6 text-wedding-gold" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        Conheça o Valle Verde
                      </h3>
                      
                      <div className="relative max-w-4xl mx-auto">
                        {/* Carrossel container */}
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                            {valleVerdeImages.map((image, index) => (
                              <div key={index} className="w-full flex-shrink-0">
                                <div className="aspect-[16/9] bg-wedding-cream-200 overflow-hidden relative group">
                                  <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 high-quality-image"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                  <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <p className="text-lg font-semibold mb-2">{image.title}</p>
                                    <p className="text-sm opacity-90">{image.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Botões de navegação */}
                          <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-10"
                            aria-label="Foto anterior"
                          >
                            <svg className="w-6 h-6 text-wedding-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-10"
                            aria-label="Próxima foto"
                          >
                            <svg className="w-6 h-6 text-wedding-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Indicadores de slide */}
                        <div className="flex justify-center gap-2 mt-6">
                          {valleVerdeImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentSlide 
                                  ? 'bg-wedding-gold scale-125' 
                                  : 'bg-wedding-olive/30 hover:bg-wedding-olive/60'
                              }`}
                              aria-label={`Ir para foto ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mensagem especial sobre o local */}
                    <div className="text-center">
                      <div className="bg-gradient-to-r from-wedding-gold/10 to-wedding-olive/10 rounded-2xl p-6 border border-wedding-ring/30">
                        <p className="text-wedding-olive-700 text-lg italic leading-relaxed">
                          &ldquo;Escolhemos o Valle Verde por sua beleza natural e atmosfera acolhedora. 
                          Um lugar especial onde queremos celebrar este momento único com vocês.&rdquo;
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                          <div className="w-8 h-0.5 bg-wedding-gold rounded-full"></div>
                          <span className="text-wedding-gold font-script text-xl">Esther & Anthony</span>
                          <div className="w-8 h-0.5 bg-wedding-gold rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
      </main>
    </div>
  )
}