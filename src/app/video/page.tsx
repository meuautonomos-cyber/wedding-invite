'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { weddingData } from '@/data/weddingData'
import { videoStorage } from '@/lib/videoStorage'
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  MapPinIcon,
  GiftIcon
} from '@heroicons/react/24/outline'

export default function VideoPage() {
  const router = useRouter()
  const { video_convite, noivos } = weddingData.casamento
  const [videoEnded, setVideoEnded] = useState(false)
  const [adminVideo, setAdminVideo] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Verificar se há um vídeo carregado pelo admin
    const loadVideo = () => {
      console.log('VideoPage - Carregando vídeo...')
      console.log('VideoPage - localStorage disponível:', typeof window !== 'undefined')
      
      // Primeiro, tentar carregar vídeo do admin (localStorage)
      let adminVideoUrl = null
      
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('wedding-video-data')
        console.log('VideoPage - Dados brutos do localStorage:', stored ? 'ENCONTRADO' : 'VAZIO')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            console.log('VideoPage - Dados parseados:', {
              id: parsed?.id,
              name: parsed?.name,
              hasUrl: !!parsed?.url,
              urlLength: parsed?.url?.length
            })
            if (parsed?.url) {
              adminVideoUrl = parsed.url
            }
          } catch (e) {
            console.error('VideoPage - Erro ao fazer parse:', e)
          }
        }
      }
      
      const currentVideo = videoStorage.getCurrentVideo()
      console.log('VideoPage - Vídeo atual do videoStorage:', currentVideo)
      
      if (currentVideo && currentVideo.url) {
        adminVideoUrl = currentVideo.url
      }
      
      if (adminVideoUrl) {
        console.log('VideoPage - Usando vídeo do admin:', adminVideoUrl.substring(0, 50) + '...')
        setAdminVideo(adminVideoUrl)
      } else {
        console.log('VideoPage - Nenhum vídeo do admin encontrado, usando vídeo padrão')
        // Usar vídeo padrão da pasta pública
        setAdminVideo('/video-convite.mp4')
      }
    }

    // Carregar vídeo inicial
    loadVideo()

    // Listener para mudanças no localStorage (só funciona entre abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wedding-video-data') {
        console.log('VideoPage - Storage change detectado')
        loadVideo()
      }
    }

    // Listener customizado para mudanças na mesma aba
    const handleCustomStorageChange = () => {
      console.log('VideoPage - Custom storage change detectado')
      loadVideo()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('videoStorageChanged', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('videoStorageChanged', handleCustomStorageChange)
    }
  }, [])


  // Função para entrar em fullscreen
  const enterFullscreen = async (): Promise<void> => {
    if (videoRef.current) {
      try {
        if (videoRef.current.requestFullscreen) {
          await videoRef.current.requestFullscreen()
        } else if ((videoRef.current as any).webkitRequestFullscreen) {
          await (videoRef.current as any).webkitRequestFullscreen()
        } else if ((videoRef.current as any).msRequestFullscreen) {
          await (videoRef.current as any).msRequestFullscreen()
        }
      } catch (error) {
        // Erro silencioso para fullscreen
      }
    }
  }

  // Entrar em fullscreen quando o vídeo começar a tocar
  useEffect(() => {
    if (videoRef.current) {
      const handlePlay = () => {
        enterFullscreen()
      }
      
      videoRef.current.addEventListener('play', handlePlay)
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('play', handlePlay)
        }
      }
    }
    return undefined
  }, [adminVideo])

  const handleVideoEnd = () => {
    setVideoEnded(true)
    setIsPlaying(false)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }


  return (
    <div className="min-h-screen bg-black page-container">
      {/* Header */}
      <header className="absolute top-4 left-4 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.back()}
          className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeftIcon className="w-5 h-5 text-wedding-green-600" />
        </motion.button>
      </header>


      {/* Conteúdo principal - Layout vertical otimizado */}
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-4 max-w-md mx-auto">
        {/* Título e descrição - apenas quando o vídeo terminar */}
        {videoEnded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <h1 className="text-2xl md:text-3xl font-script text-white mb-2 drop-shadow-lg">
              {noivos.nome_noiva} & {noivos.nome_noivo}
            </h1>
            <p className="text-white/80 text-base drop-shadow-md">
              Nosso vídeo-convite especial
            </p>
          </motion.div>
        )}

        {/* Player de vídeo - Formato vertical 1080x1920 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-sm mx-auto mb-8"
        >
          {adminVideo ? (
            // Vídeo carregado pelo admin ou vídeo padrão
            <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                src={adminVideo}
                className="w-full max-w-sm h-auto max-h-[80vh] object-cover"
                onEnded={handleVideoEnd}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={(e) => console.error('Erro no vídeo:', e)}
                preload="auto"
                autoPlay
                playsInline
                muted={false}
                controls
                style={{ aspectRatio: '9/16' }}
              >
                Seu navegador não suporta vídeos HTML5.
              </video>
              
              {/* Botão de play central - apenas quando não está reproduzindo */}
              {!isPlaying && (
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.play().catch(e => console.error('Erro ao reproduzir:', e))
                    }
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                  aria-label="Reproduzir vídeo"
                >
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <svg className="w-8 h-8 text-wedding-green-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </button>
              )}
              
              {/* Botão de som */}
              <button
                onClick={toggleMute}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                aria-label={isMuted ? "Ativar som" : "Desativar som"}
              >
                {isMuted ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.816a1 1 0 011.617.816zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.816a1 1 0 011.617.816zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          ) : (
            // Apenas vídeo MP4 local - nunca YouTube
            <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                className="w-full h-screen max-h-[80vh] object-cover"
                poster={video_convite.poster}
                onEnded={handleVideoEnd}
                onError={(e) => {
                  console.error('Erro no vídeo padrão:', e);
                  console.log('URL do vídeo:', video_convite.url);
                }}
                preload="metadata"
                playsInline
                muted={false}
                style={{ aspectRatio: '9/16' }}
              >
                <source src={video_convite.url} type="video/mp4" />
                Seu navegador não suporta vídeos HTML5.
              </video>
              
              {/* Botão de som */}
              <button
                onClick={toggleMute}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                aria-label={isMuted ? "Ativar som" : "Desativar som"}
              >
                {isMuted ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.816a1 1 0 011.617.816zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.816a1 1 0 011.617.816zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </motion.div>

        {/* Ações após o vídeo terminar */}
        {videoEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center mt-8"
          >
            <div className="flex flex-col gap-4 justify-center max-w-sm mx-auto">
              <button
                onClick={() => router.push('/confirmar')}
                className="bg-wedding-olive hover:bg-wedding-olive-ink text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <CheckCircleIcon className="w-6 h-6" />
                Confirmar Presença
              </button>
              <button
                onClick={() => router.push('/local')}
                className="bg-wedding-gold hover:bg-wedding-gold/90 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <MapPinIcon className="w-6 h-6" />
                Ver Local
              </button>
              <button
                onClick={() => router.push('/presentes')}
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <GiftIcon className="w-6 h-6" />
                Lista de Presentes
              </button>
              <button
                onClick={() => router.push('/site')}
                className="border-2 border-white/50 text-white/80 hover:bg-white/10 hover:text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
              >
                Ver Mais Informações
              </button>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  )
}