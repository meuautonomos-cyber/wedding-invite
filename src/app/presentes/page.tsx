'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { weddingData } from '@/data/weddingData'
import { supabaseStorage, GiftData } from '@/lib/supabaseStorage'
import { 
  ArrowLeftIcon,
  GiftIcon,
  CheckCircleIcon,
  HeartIcon,
  HomeIcon,
  SparklesIcon,
  QrCodeIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline'

export default function PresentesPage() {
  const router = useRouter()
  const { noivos, lista_presentes } = weddingData.casamento
  const [selectedCota, setSelectedCota] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('lua-de-mel')
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [doadorInfo, setDoadorInfo] = useState({
    nome: '',
    telefone: '',
    email: '',
    mensagem: ''
  })


  // Categorias de presentes
  const categories = [
    {
      id: 'lua-de-mel',
      name: 'Lua de Mel',
      icon: HeartIcon,
      description: 'Ajudem-nos a realizar nossa viagem dos sonhos',
      color: 'from-pink-400 to-rose-500'
    },
    {
      id: 'casa',
      name: 'Nossa Casa',
      icon: HomeIcon,
      description: 'Itens para montarmos nosso lar',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      id: 'experiencias',
      name: 'Experiências',
      icon: SparklesIcon,
      description: 'Momentos especiais para viver juntos',
      color: 'from-purple-400 to-violet-500'
    }
  ]

  // Valores de cotas expandidos
  const expandedCotaValues = [25, 50, 75, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000]

  const handleCotaSelect = (valor: number) => {
    setSelectedCota(valor)
    setCurrentStep(3) // Vai para a etapa de pagamento
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }


  const handlePixCopy = async () => {
    if (lista_presentes.pix?.chave) {
      try {
        await navigator.clipboard.writeText(lista_presentes.pix.chave)
        // Aqui você pode adicionar uma notificação de sucesso
        alert('Chave PIX copiada!')
      } catch (err) {
        console.error('Erro ao copiar:', err)
      }
    }
  }

  const handlePixLink = () => {
    if (lista_presentes.pix?.link) {
      window.open(lista_presentes.pix.link, '_blank')
    }
  }

  const handleCustomAmount = () => {
    const amount = prompt('Digite o valor desejado (R$):')
    if (amount && !isNaN(Number(amount))) {
      setSelectedCota(Number(amount))
    }
  }

  const handlePresenteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Preparar dados do presente
      const giftData: Omit<GiftData, 'id' | 'data_presente'> = {
        doador_nome: doadorInfo.nome,
        doador_telefone: doadorInfo.telefone,
        doador_email: doadorInfo.email || undefined,
        tipo: selectedCota ? 'cota' : 'pix',
        valor: selectedCota || undefined,
        item_nome: selectedCota ? `Cota ${categories.find(c => c.id === selectedCategory)?.name}` : undefined,
        categoria: selectedCategory,
        mensagem: doadorInfo.mensagem || undefined,
        status: 'pendente'
      }

      // Salvar no Supabase
      await supabaseStorage.createGift(giftData)
      
      console.log('Presente registrado com sucesso:', giftData)
      
      setShowSuccessModal(true)
      setDoadorInfo({ nome: '', telefone: '', email: '', mensagem: '' })
      setSelectedCota(null)
      setCurrentStep(1) // Voltar ao início
    } catch (error) {
      console.error('Erro ao registrar presente:', error)
      alert('Erro ao registrar presente. Tente novamente.')
    }
  }

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
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
                Lista de Presentes
              </h1>
          <div className="w-9"></div>
        </div>
      </header>

      <main className="px-4 py-8 max-w-6xl mx-auto">
        {/* Introdução Elegante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
              <h2 className="text-4xl font-script text-wedding-olive-800 mb-4 title-elegant">
                {noivos.nome_noiva} & {noivos.nome_noivo}
              </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-wedding-gold to-wedding-olive mx-auto rounded-full mb-6"></div>
          <p className="text-wedding-olive-700 text-xl max-w-3xl mx-auto leading-relaxed">
            Sua presença é o maior presente que poderíamos receber! 
            Mas se desejar nos presentear, ficaremos muito felizes com qualquer contribuição.
          </p>
        </motion.div>


        {/* Etapa 1: Categorias de Presentes */}
        {currentStep === 1 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-3xl font-script text-wedding-olive-800 text-center mb-8">
              Escolha uma Categoria
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedCategory(category.id)
                      nextStep()
                    }}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'border-wedding-gold bg-gradient-to-br from-wedding-gold/10 to-wedding-olive/10 shadow-xl'
                        : 'border-wedding-ring bg-white hover:border-wedding-gold/50 hover:shadow-lg'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold text-wedding-olive-800 mb-2">
                        {category.name}
                      </h4>
                      <p className="text-wedding-olive-600 text-sm">
                        {category.description}
                      </p>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.section>
        )}

        {/* Etapa 2: Seleção de Valor */}
        {currentStep === 2 && lista_presentes.modo === 'cotas' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-wedding-ring/20 overflow-hidden relative">
              {/* Decoração de fundo */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-wedding-gold/5 to-wedding-olive/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-wedding-cream/10 to-wedding-gold/10 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-script text-wedding-olive-800 text-center mb-4">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </h3>
                <p className="text-wedding-olive-600 text-center mb-8 text-lg">
                  {categories.find(c => c.id === selectedCategory)?.description}
                </p>
                
                {/* Valores de cotas em grid responsivo */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                  {expandedCotaValues.map((valor) => (
                    <motion.button
                      key={valor}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCotaSelect(valor)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedCota === valor
                          ? 'border-wedding-gold bg-gradient-to-br from-wedding-gold/20 to-wedding-olive/20 shadow-lg'
                          : 'border-wedding-ring bg-white hover:border-wedding-gold/50 hover:shadow-md'
                      }`}
                    >
                      <div className="text-center">
                        <GiftIcon className={`w-6 h-6 mx-auto mb-2 ${
                          selectedCota === valor ? 'text-wedding-gold' : 'text-wedding-olive-600'
                        }`} />
                        <p className={`font-semibold text-sm ${
                          selectedCota === valor ? 'text-wedding-gold' : 'text-wedding-olive-800'
                        }`}>
                          {formatCurrency(valor)}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Botão para valor personalizado */}
                <div className="text-center mb-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCustomAmount}
                    className="px-6 py-3 bg-gradient-to-r from-wedding-olive to-wedding-olive-ink text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                  >
                    + Valor Personalizado
                  </motion.button>
                </div>

                {/* Botões de navegação */}
                <div className="flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevStep}
                    className="px-6 py-3 bg-wedding-cream-200 text-wedding-olive-800 rounded-xl font-medium hover:bg-wedding-cream-300 transition-all duration-300"
                  >
                    ← Voltar
                  </motion.button>
                  
                  {selectedCota && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextStep}
                      className="px-6 py-3 bg-gradient-to-r from-wedding-gold to-wedding-olive text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                    >
                      Continuar →
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Etapa 3: Pagamento PIX */}
        {currentStep === 3 && selectedCota && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-wedding-ring/20 overflow-hidden relative">
              {/* Decoração de fundo */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-wedding-gold/5 to-wedding-olive/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-wedding-cream/10 to-wedding-gold/10 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-script text-wedding-olive-800 text-center mb-4">
                  Pagamento via PIX
                </h3>
                
                {/* Resumo do valor */}
                <div className="bg-gradient-to-r from-wedding-gold/10 to-wedding-olive/10 rounded-2xl p-6 mb-8">
                  <div className="text-center">
                    <p className="text-wedding-olive-700 mb-2">Valor selecionado:</p>
                    <p className="text-4xl font-bold text-wedding-gold">
                      {formatCurrency(selectedCota)}
                    </p>
                    <p className="text-wedding-olive-600 text-sm mt-2">
                      {categories.find(c => c.id === selectedCategory)?.name}
                    </p>
                  </div>
                </div>
                
                {/* Seção PIX */}
                <div className="bg-gradient-to-r from-wedding-olive/5 to-wedding-gold/5 rounded-2xl p-8 border border-wedding-ring/30">
                  <h4 className="text-2xl font-script text-wedding-olive-800 text-center mb-6 flex items-center justify-center gap-3">
                    <QrCodeIcon className="w-6 h-6 text-wedding-gold" />
                    Contribua via PIX
                  </h4>
                  
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                    {/* QR Code maior e mais visível */}
                    <div className="text-center">
                      <div className="w-48 h-48 bg-white rounded-2xl shadow-lg p-4 mb-4 mx-auto">
                        <img
                          src={lista_presentes.pix?.qr || '/images/pix-qr.png'}
                          alt="QR Code PIX"
                          className="w-full h-full object-contain high-quality-image"
                        />
                      </div>
                      <p className="text-wedding-olive-600 text-sm">
                        Escaneie o QR Code com seu app de pagamento
                      </p>
                    </div>
                    
                    {/* Informações e botões */}
                    <div className="text-center lg:text-left space-y-6">
                      <div>
                        <p className="text-wedding-olive-700 mb-2 font-medium">
                          Chave PIX:
                        </p>
                        <div className="bg-white rounded-xl p-4 border border-wedding-ring/50">
                          <p className="text-wedding-olive-800 font-mono text-lg break-all">
                            {lista_presentes.pix?.chave}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handlePixCopy}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-wedding-gold text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                        >
                          <ClipboardDocumentIcon className="w-5 h-5" />
                          Copiar Chave
                        </motion.button>
                        
                        {lista_presentes.pix?.link && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handlePixLink}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-wedding-olive text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Pagar via Nubank
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botões de navegação */}
                <div className="flex justify-between mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevStep}
                    className="px-6 py-3 bg-wedding-cream-200 text-wedding-olive-800 rounded-xl font-medium hover:bg-wedding-cream-300 transition-all duration-300"
                  >
                    ← Voltar
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextStep}
                    className="px-6 py-3 bg-gradient-to-r from-wedding-gold to-wedding-olive text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Continuar →
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Lista Tradicional */}
        {lista_presentes.modo === 'tradicional' && lista_presentes.itens && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-script text-wedding-green-800 text-center mb-8">
              Lista de Presentes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lista_presentes.itens.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card"
                >
                  <div className="aspect-square bg-wedding-cream-200 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-semibold text-wedding-green-800 mb-2">
                    {item.nome}
                  </h4>
                  <p className="text-wedding-green-600 font-semibold mb-4">
                    {formatCurrency(item.valor)}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full text-center"
                  >
                    Presentear
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Etapa 4: Formulário de Dados */}
        {currentStep === 4 && selectedCota && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-wedding-ring/20 overflow-hidden relative">
              {/* Decoração de fundo */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-wedding-gold/5 to-wedding-olive/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-wedding-cream/10 to-wedding-gold/10 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-script text-wedding-olive-800 text-center mb-6">
                  Seus Dados
                </h3>
                
                {/* Resumo do presente */}
                <div className="bg-gradient-to-r from-wedding-gold/10 to-wedding-olive/10 rounded-2xl p-6 mb-8">
                  <div className="text-center">
                    <p className="text-wedding-olive-700 mb-2">Valor selecionado:</p>
                    <p className="text-4xl font-bold text-wedding-gold">
                      {formatCurrency(selectedCota)}
                    </p>
                    <p className="text-wedding-olive-600 text-sm mt-2">
                      {categories.find(c => c.id === selectedCategory)?.name}
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handlePresenteSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-wedding-olive-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={doadorInfo.nome}
                        onChange={(e) => setDoadorInfo({...doadorInfo, nome: e.target.value})}
                        className="w-full px-4 py-3 border border-wedding-ring rounded-xl focus:ring-2 focus:ring-wedding-gold focus:border-transparent transition-all duration-300"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-wedding-olive-700 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={doadorInfo.telefone}
                        onChange={(e) => setDoadorInfo({...doadorInfo, telefone: e.target.value})}
                        className="w-full px-4 py-3 border border-wedding-ring rounded-xl focus:ring-2 focus:ring-wedding-gold focus:border-transparent transition-all duration-300"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-wedding-olive-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={doadorInfo.email}
                      onChange={(e) => setDoadorInfo({...doadorInfo, email: e.target.value})}
                      className="w-full px-4 py-3 border border-wedding-ring rounded-xl focus:ring-2 focus:ring-wedding-gold focus:border-transparent transition-all duration-300"
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-wedding-olive-700 mb-2">
                      Mensagem para os noivos (opcional)
                    </label>
                    <textarea
                      value={doadorInfo.mensagem}
                      onChange={(e) => setDoadorInfo({...doadorInfo, mensagem: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border border-wedding-ring rounded-xl focus:ring-2 focus:ring-wedding-gold focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Deixe uma mensagem carinhosa para Esther e Anthony..."
                    />
                  </div>
                  
                  {/* Botões de navegação */}
                  <div className="flex justify-between">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={prevStep}
                      className="px-6 py-3 bg-wedding-cream-200 text-wedding-olive-800 rounded-xl font-medium hover:bg-wedding-cream-300 transition-all duration-300"
                    >
                      ← Voltar
                    </motion.button>
                    
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-3 bg-gradient-to-r from-wedding-gold to-wedding-olive text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300"
                    >
                      Finalizar Presente
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.section>
        )}

        {/* Modal de Sucesso Melhorado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showSuccessModal ? 1 : 0 }}
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${
            showSuccessModal ? 'block' : 'hidden'
          }`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: showSuccessModal ? 1 : 0.8, opacity: showSuccessModal ? 1 : 0 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-wedding-gold to-wedding-olive rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-script text-wedding-olive-800 mb-4">
              Obrigado!
            </h3>
            <p className="text-wedding-olive-700 mb-6 leading-relaxed">
              Seu presente foi registrado com sucesso. Esther e Anthony ficarão muito felizes com sua contribuição!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-gradient-to-r from-wedding-gold to-wedding-olive text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Fechar
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}