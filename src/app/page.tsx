'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  GlobeAltIcon, 
  GiftIcon, 
  CheckCircleIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline'

export default function HomePage() {
  const router = useRouter()
  const handleEnvelopeClick = () => {
    router.push('/video')
  }

  return (
    <div className="min-h-screen bg-wedding-cream relative overflow-hidden page-container">
      {/* Fundo principal */}
      <div
        className="absolute inset-0 w-full h-full bg-gradient-to-br from-wedding-cream via-wedding-cream/95 to-wedding-sage/10"
        aria-hidden="true"
      />

      {/* Overlay sutil para melhorar legibilidade */}
      <div className="absolute inset-0 bg-wedding-cream/5" aria-hidden="true" />

      {/* Conteúdo principal com posicionamento responsivo */}
      <main className="relative z-10 w-full min-h-screen max-h-screen overflow-hidden">
        
        {/* Área clicável do selo de cera - posicionamento responsivo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute cursor-pointer group"
          onClick={handleEnvelopeClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleEnvelopeClick();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Abrir vídeo-convite"
          style={{
            top: 'clamp(45%, 50%, 55%)',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(80px, 100px, 120px)',
            height: 'clamp(80px, 100px, 120px)'
          }}
        >
          {/* Área clicável invisível sobre o selo de cera */}
          <div className="w-full h-full rounded-full focus:outline-none focus:ring-4 focus:ring-wedding-gold focus:ring-offset-4 group-hover:scale-110 transition-transform duration-300" />
          
          {/* Botão de play posicionado para baixo e esquerda */}
          <div className="absolute -bottom-6 -left-8 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-transparent flex items-center justify-center group-hover:scale-110 transition-all duration-300">
              <svg 
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-transparent ml-1" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Área clicável dos ícones - RESPONSIVO */}
        <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 lg:bottom-24 xl:bottom-28 left-1/2 transform -translate-x-1/2 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 justify-items-center">
            
            {/* Site */}
            <div className="flex flex-col items-center space-y-2 sm:space-y-3">
              <motion.a
                href="/site"
                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 xl:w-24 xl:h-24 rounded-full cursor-pointer group flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: '#6E8643' }}
                aria-label="Abrir site do casamento"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <GlobeAltIcon className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 text-white" />
              </motion.a>
              <span className="text-sm sm:text-base md:text-lg font-medium text-wedding-olive-ink text-center leading-relaxed tracking-wide max-w-24 sm:max-w-28 md:max-w-32">Site</span>
            </div>

            {/* Lista de presentes */}
            <div className="flex flex-col items-center space-y-2 sm:space-y-3">
              <motion.a
                href="/presentes"
                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 xl:w-24 xl:h-24 rounded-full cursor-pointer group flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: '#6E8643' }}
                aria-label="Abrir lista de presentes"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <GiftIcon className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 text-white" />
              </motion.a>
              <span className="text-sm sm:text-base md:text-lg font-medium text-wedding-olive-ink text-center leading-relaxed tracking-wide max-w-24 sm:max-w-28 md:max-w-32">Lista de presentes</span>
            </div>

            {/* Confirmar presença */}
            <div className="flex flex-col items-center space-y-2 sm:space-y-3">
              <motion.a
                href="/confirmar"
                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 xl:w-24 xl:h-24 rounded-full cursor-pointer group flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: '#6E8643' }}
                aria-label="Confirmar presença"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircleIcon className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 text-white" />
              </motion.a>
              <span className="text-sm sm:text-base md:text-lg font-medium text-wedding-olive-ink text-center leading-relaxed tracking-wide max-w-24 sm:max-w-28 md:max-w-32">Confirmar presença</span>
            </div>

            {/* Local */}
            <div className="flex flex-col items-center space-y-2 sm:space-y-3">
              <motion.a
                href="/local"
                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 xl:w-24 xl:h-24 rounded-full cursor-pointer group flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: '#6E8643' }}
                aria-label="Ver local do evento"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <MapPinIcon className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 text-white" />
              </motion.a>
              <span className="text-sm sm:text-base md:text-lg font-medium text-wedding-olive-ink text-center leading-relaxed tracking-wide max-w-24 sm:max-w-28 md:max-w-32">Local</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}