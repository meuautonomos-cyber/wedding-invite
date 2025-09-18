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

      {/* Conteúdo principal com posicionamento absoluto baseado no layout */}
      <main className="relative z-10 w-full min-h-screen max-h-screen overflow-hidden">
        
            {/* Área clicável do selo de cera - posicionada sobre o selo na imagem */}
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
                top: '56%',
                left: '43%',
                transform: 'translate(-50%, -50%)',
                width: '90px',
                height: '90px'
              }}
            >
              {/* Área clicável invisível sobre o selo de cera */}
              <div className="w-full h-full rounded-full focus:outline-none focus:ring-4 focus:ring-wedding-gold focus:ring-offset-4 group-hover:scale-110 transition-transform duration-300" />
            </motion.div>

        {/* Área clicável dos ícones - USANDO GRID SIMPLES */}
        <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
          <div className="grid grid-cols-4 gap-8 justify-items-center">
            
            {/* Site - ajustado para direita */}
            <motion.a
              href="/site"
              className="w-20 h-20 rounded-full cursor-pointer group ml-4"
              aria-label="Abrir site do casamento"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-full h-full rounded-full focus:outline-none focus:ring-4 focus:ring-wedding-gold focus:ring-offset-2 group-hover:bg-wedding-gold/10 transition-all duration-300" />
            </motion.a>

            {/* Lista de presentes */}
            <motion.a
              href="/presentes"
              className="w-20 h-20 rounded-full cursor-pointer group"
              aria-label="Abrir lista de presentes"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-full h-full rounded-full focus:outline-none focus:ring-4 focus:ring-wedding-gold focus:ring-offset-2 group-hover:bg-wedding-gold/10 transition-all duration-300" />
            </motion.a>

            {/* Confirmar presença - ajustado para esquerda */}
            <motion.a
              href="/confirmar"
              className="w-20 h-20 rounded-full cursor-pointer group -ml-2"
              aria-label="Confirmar presença"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-full h-full rounded-full focus:outline-none focus:ring-4 focus:ring-wedding-gold focus:ring-offset-2 group-hover:bg-wedding-gold/10 transition-all duration-300" />
            </motion.a>

            {/* Local - ajustado para esquerda */}
            <motion.a
              href="/local"
              className="w-20 h-20 rounded-full cursor-pointer group -ml-4"
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