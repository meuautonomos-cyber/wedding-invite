'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { weddingData } from '@/data/weddingData'
import { addToCalendar } from '@/lib/utils'
import { 
  ArrowLeftIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  TruckIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'

export default function LocalPage() {
  const router = useRouter()
  const { noivos, evento } = weddingData.casamento

  const handleOpenMaps = () => {
    window.open(evento.google_maps_link, '_blank')
  }

  const handleSaveToCalendar = () => {
    // Converter data do formato DD/MM/YY para formato válido
    const [day, month, year] = evento.data.split('/')
    const fullYear = `20${year}`
    const paddedMonth = month ? month.padStart(2, '0') : '01'
    const paddedDay = day ? day.padStart(2, '0') : '01'
    const formattedDate = `${fullYear}-${paddedMonth}-${paddedDay}`
    
    const startDate = new Date(`${formattedDate}T${evento.hora}:00`)
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000) // 4 horas depois
    
    addToCalendar(
      `Casamento de ${noivos.nome_noiva} & ${noivos.nome_noivo}`,
      `Celebração do casamento civil de ${noivos.nome_noiva} & ${noivos.nome_noivo}`,
      startDate.toISOString(),
      endDate.toISOString(),
      evento.ics_texto_local
    )
  }

  return (
    <div className="min-h-screen bg-wedding-cream-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-wedding-cream-200 z-10">
        <div className="flex items-center justify-between p-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="p-2 hover:bg-wedding-cream-100 rounded-full transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeftIcon className="w-5 h-5 text-wedding-green-600" />
          </motion.button>
          <h1 className="text-xl font-script text-wedding-green-800 title-elegant">
            Local do Evento
          </h1>
          <div className="w-9"></div>
        </div>
      </header>

      <main className="px-4 py-8 max-w-4xl mx-auto">
        {/* Informações do Evento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-script text-wedding-green-800 mb-4 title-elegant">
            {noivos.nome_noiva} & {noivos.nome_noivo}
          </h2>
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center gap-3">
                <CalendarIcon className="w-6 h-6 text-wedding-green-600" />
                <div className="text-center">
                  <p className="font-medium text-wedding-green-800">Data</p>
                  <p className="text-wedding-green-700">{evento.data}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <ClockIcon className="w-6 h-6 text-wedding-green-600" />
                <div className="text-center">
                  <p className="font-medium text-wedding-green-800">Horário</p>
                  <p className="text-wedding-green-700">{evento.hora}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <MapPinIcon className="w-6 h-6 text-wedding-green-600" />
                <div className="text-center">
                  <p className="font-medium text-wedding-green-800">Local</p>
                  <p className="text-wedding-green-700">{evento.local_resumo}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Endereço Completo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="card">
            <h3 className="text-xl font-script text-wedding-green-800 text-center mb-6">
              Endereço Completo
            </h3>
            <div className="text-center">
              <p className="text-wedding-green-700 text-lg mb-4">
                {evento.endereco_completo}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenMaps}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                  Abrir no Google Maps
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveToCalendar}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <CalendarIcon className="w-5 h-5" />
                  Adicionar ao Calendário
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mapa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="card">
            <h3 className="text-xl font-script text-wedding-green-800 text-center mb-6">
              Como Chegar
            </h3>
            <div className="aspect-video bg-wedding-cream-200 rounded-lg overflow-hidden">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(evento.endereco_completo)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização do casamento - Cerimonial Valle Verde"
              />
            </div>
          </div>
        </motion.div>

        {/* Informações Adicionais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Estacionamento */}
          <div className="card">
            <h4 className="text-lg font-semibold text-wedding-green-800 mb-4 flex items-center gap-2">
              <TruckIcon className="w-5 h-5" />
              Estacionamento
            </h4>
            <ul className="space-y-2 text-wedding-green-700">
              <li>• Estacionamento gratuito disponível</li>
              <li>• Vagas limitadas - chegue cedo</li>
              <li>• Valet service disponível</li>
              <li>• Acesso para pessoas com deficiência</li>
            </ul>
          </div>

          {/* Dicas Importantes */}
          <div className="card">
            <h4 className="text-lg font-semibold text-wedding-green-800 mb-4 flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              Dicas Importantes
            </h4>
            <ul className="space-y-2 text-wedding-green-700">
              <li>• Chegue 15 minutos antes do horário</li>
              <li>• Confirme sua presença até {evento.data}</li>
              <li>• Em caso de dúvidas, entre em contato</li>
              <li>• Crianças são muito bem-vindas!</li>
            </ul>
          </div>
        </motion.div>


        {/* Botões de Ação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/confirmar')}
              className="btn-primary"
            >
              Confirmar Presença
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/presentes')}
              className="btn-outline"
            >
              Ver Lista de Presentes
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}