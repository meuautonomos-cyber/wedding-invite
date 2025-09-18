'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const handleEnvelopeClick = () => {
    router.push('/video')
  }

  return (
    <div className="min-h-screen bg-wedding-cream relative overflow-hidden page-container">
      {/* Layout principal como imagem de fundo */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/images/layout-principal.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center top'
        }}
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
            top: 'clamp(50%, 56%, 60%)',
            left: 'clamp(40%, 43%, 50%)',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(70px, 90px, 110px)',
            height: 'clamp(70px, 90px, 110px)'
          }}
        >
          {/* Área clicável invisível sobre o selo de cera */}
          <div className="w-full h-full rounded-full focus:outline-none focus:ring-4 focus:ring-wedding-gold focus:ring-offset-4 group-hover:scale-110 transition-transform duration-300" />
        </motion.div>

        {/* Área clicável dos ícones - RESPONSIVO */}
        <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 left-1/2 transform -translate-x-1/2 w-full max-w-xs sm:max-w-sm md:max-w-2xl px-4">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-8 justify-items-center">
            
            {/* Site */}
            <motion.a
              href="/site"
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full cursor-pointer group"
              aria-label="Abrir site do casamento"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-full h-full rounded-full focus:outline-none focus:ring-4 focus:ring-wedding-gold focus:ring-offset-2 group-hover:bg-wedding-gold/10 transition-all duration-300" />
            </motion.a>

            {/* Lista de presentes */}
            <motion.a
              href="/presentes"
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full cursor-pointer group"
              aria-label="Abrir lista de presentes"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-full h-full rounded-full focus:outline-none focus:ring-4 focus:ring-wedding-gold focus:ring-offset-2 group-hover:bg-wedding-gold/10 transition-all duration-300" />
            </motion.a>

            {/* Confirmar presença */}
            <motion.a
              href="/confirmar"
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full cursor-pointer group"
              aria-label="Confirmar presença"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-full h-full rounded-full focus:outline-none focus:ring-4 focus:ring-wedding-gold focus:ring-offset-2 group-hover:bg-wedding-gold/10 transition-all duration-300" />
            </motion.a>

            {/* Local */}
            <motion.a
              href="/local"
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full cursor-pointer group"
              aria-label="Ver local do evento"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-full h-full rounded-full focus:outline-none focus:ring-4 focus:ring-wedding-gold focus:ring-offset-2 group-hover:bg-wedding-gold/10 transition-all duration-300" />
            </motion.a>
          </div>
        </div>
      </main>
    </div>
  )
}