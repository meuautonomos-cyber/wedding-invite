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
      {/* Decoração floral sutil */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <img
          src="/images/floral-top.svg"
          alt=""
          className="absolute top-0 left-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-20"
        />
        <img
          src="/images/floral-bottom.svg"
          alt=""
          className="absolute bottom-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-20 rotate-180"
        />
      </div>

      {/* Conteúdo principal responsivo */}
      <main className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-8">
        
        {/* Banner com iniciais */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-wedding-olive rounded-b-2xl px-6 py-3 mb-6 shadow-lg"
        >
          <h1 className="text-wedding-gold text-2xl sm:text-3xl md:text-4xl font-script">
            EA
          </h1>
        </motion.div>

        {/* Texto de convite */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8 max-w-md mx-auto"
        >
          <p className="text-wedding-olive-ink text-sm sm:text-base md:text-lg font-medium mb-2">
            VOCÊ ESTÁ CONVIDADO PARA A
          </p>
          <p className="text-wedding-olive-ink text-sm sm:text-base md:text-lg font-medium mb-4">
            CERIMÔNIA DE CASAMENTO
          </p>
          <h2 className="text-wedding-olive-ink text-2xl sm:text-3xl md:text-4xl font-script mb-4">
            Esther & Anthony
          </h2>
        </motion.div>

        {/* Envelope interativo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
            className="relative cursor-pointer group"
          >
            {/* Envelope */}
            <div className="w-48 h-32 sm:w-56 sm:h-36 md:w-64 md:h-40 bg-wedding-olive rounded-lg shadow-2xl envelope-3d">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-wedding-gold text-sm sm:text-base md:text-lg font-script">
                  Abrir seu convite
                </span>
              </div>
              {/* Selo de cera */}
              <div className="absolute top-2 right-2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-wedding-gold rounded-full envelope-seal flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-bold">FA</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Data e horário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-wedding-olive-ink text-base sm:text-lg md:text-xl font-medium">
            21 DE MARÇO | 15:30 HORA
          </p>
        </motion.div>

        {/* Botões de navegação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full max-w-sm sm:max-w-md"
        >
          <div className="grid grid-cols-4 gap-4 sm:gap-6">
            
            {/* Site */}
            <motion.a
              href="/site"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full cursor-pointer group flex items-center justify-center bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Abrir site do casamento"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 text-wedding-olive">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 6H2V4C2 2.9 2.9 2 4 2H6V4H4V6ZM4 10H2V8H4V10ZM4 14H2V12H4V14ZM4 18H2V16H4V18ZM6 20H4V18H6V20ZM10 20H8V18H10V20ZM14 20H12V18H14V20ZM18 20H16V18H18V20ZM20 6H18V4H20V6ZM20 10H18V8H20V10ZM20 14H18V12H20V14ZM20 18H18V16H20V18ZM6 4H8V2H6V4ZM10 4H12V2H10V4ZM14 4H16V2H14V4ZM18 4H20V2H18V4Z"/>
                </svg>
              </div>
            </motion.a>

            {/* Lista de presentes */}
            <motion.a
              href="/presentes"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full cursor-pointer group flex items-center justify-center bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Abrir lista de presentes"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 text-wedding-olive">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
            </motion.a>

            {/* Confirmar presença */}
            <motion.a
              href="/confirmar"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full cursor-pointer group flex items-center justify-center bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Confirmar presença"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 text-wedding-olive">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM17 16H7V14H17V16ZM17 8H7V6H17V8Z"/>
                </svg>
              </div>
            </motion.a>

            {/* Local */}
            <motion.a
              href="/local"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full cursor-pointer group flex items-center justify-center bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Ver local do evento"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 text-wedding-olive">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z"/>
                </svg>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </main>
    </div>
  )
}