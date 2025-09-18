'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cms } from '@/lib/cms'
import { videoStorage } from '@/lib/videoStorage'
import { RSVPData, GiftData } from '@/types'
import { 
  UsersIcon,
  GiftIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  VideoCameraIcon,
  CloudArrowUpIcon,
  PlayIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

export default function AdminPage() {
  const [rsvpData, setRsvpData] = useState<RSVPData[]>([])
  const [giftData, setGiftData] = useState<GiftData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'rsvp' | 'gifts' | 'video'>('rsvp')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadData()
    loadCurrentVideo()
  }, [])

  const loadCurrentVideo = () => {
    const currentVideo = videoStorage.getCurrentVideo()
    console.log('Admin - Carregando vídeo:', currentVideo)
    if (currentVideo) {
      setVideoUrl(currentVideo.url)
      // Simular um arquivo para exibir as informações
      const mockFile = new File([], currentVideo.name, { type: currentVideo.type })
      Object.defineProperty(mockFile, 'size', { value: currentVideo.size })
      Object.defineProperty(mockFile, 'lastModified', { value: new Date(currentVideo.uploadedAt).getTime() })
      setVideoFile(mockFile)
      console.log('Admin - Vídeo carregado com sucesso:', currentVideo.url)
    } else {
      console.log('Admin - Nenhum vídeo encontrado no storage')
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [rsvpResponse, giftsResponse] = await Promise.all([
        cms.getRSVPs(),
        cms.getGifts()
      ])
      
      setRsvpData(rsvpResponse)
      setGiftData(giftsResponse)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('Admin - Arquivo selecionado:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Validar tipo de arquivo
    if (!file.type.startsWith('video/')) {
      console.log('Admin - Tipo de arquivo inválido:', file.type)
      alert('Por favor, selecione um arquivo de vídeo válido.')
      return
    }

    // Validar tamanho (máximo 3MB)
    if (file.size > 3 * 1024 * 1024) {
      console.log('Admin - Arquivo muito grande:', file.size)
      alert('O arquivo de vídeo deve ter no máximo 3MB (para evitar problemas de armazenamento).')
      return
    }

    console.log('Admin - Arquivo válido, iniciando upload automático...')
    setVideoFile(file)
    setVideoUrl(URL.createObjectURL(file))
    
    // Upload automático
    setUploading(true)
    try {
      console.log('Admin - Iniciando upload automático do vídeo:', file.name)
      console.log('Admin - Convertendo vídeo para base64... (isso pode demorar para arquivos grandes)')
      
      // Upload do vídeo usando o sistema de armazenamento
      const videoData = await videoStorage.uploadVideo(file)
      console.log('Admin - Vídeo enviado com sucesso:', videoData)
      
      alert('Vídeo enviado com sucesso! Agora ele persistirá mesmo após recarregar a página.')
      
      // Recarregar o vídeo atual
      loadCurrentVideo()
      
    } catch (error) {
      console.error('Admin - Erro ao enviar vídeo:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      alert('Erro ao enviar vídeo: ' + errorMessage)
      
      // Limpar arquivo selecionado em caso de erro
      setVideoFile(null)
      setVideoUrl('')
      if (event.target) {
        event.target.value = ''
      }
    } finally {
      setUploading(false)
    }
  }

  const handleVideoRemove = () => {
    videoStorage.removeVideo()
    setVideoFile(null)
    setVideoUrl('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800'
      case 'com_acompanhante':
        return 'bg-blue-100 text-blue-800'
      case 'nao_poderei':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado'
      case 'com_acompanhante':
        return 'Com Acompanhante'
      case 'nao_poderei':
        return 'Não Poderá Ir'
      default:
        return status
    }
  }

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert('Nenhum dado para exportar')
      return
    }

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-wedding-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-green-600 mx-auto mb-4"></div>
          <p className="text-wedding-green-700">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-wedding-cream-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-wedding-green-800 mb-2">Painel Administrativo</h1>
          <p className="text-wedding-green-600">Gerencie RSVPs, presentes e vídeo convite</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8">
          <button
            onClick={() => setActiveTab('rsvp')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'rsvp'
                ? 'bg-wedding-green-600 text-white'
                : 'bg-white text-wedding-green-700 hover:bg-wedding-green-50'
            }`}
          >
            <UsersIcon className="w-5 h-5 inline mr-2" />
            RSVPs ({rsvpData.length})
          </button>
          <button
            onClick={() => setActiveTab('gifts')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'gifts'
                ? 'bg-wedding-green-600 text-white'
                : 'bg-white text-wedding-green-700 hover:bg-wedding-green-50'
            }`}
          >
            <GiftIcon className="w-5 h-5 inline mr-2" />
            Presentes ({giftData.length})
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'video'
                ? 'bg-wedding-green-600 text-white'
                : 'bg-white text-wedding-green-700 hover:bg-wedding-green-50'
            }`}
          >
            <VideoCameraIcon className="w-5 h-5 inline mr-2" />
            Vídeo Convite
          </button>
          <a
            href="/admin/whatsapp"
            className="px-4 py-2 rounded-lg font-medium transition-colors bg-white text-wedding-green-700 hover:bg-wedding-green-50 border border-wedding-green-200"
          >
            <PhoneIcon className="w-5 h-5 inline mr-2" />
            Configurar WhatsApp
          </a>
        </div>

        {/* RSVP Tab */}
        {activeTab === 'rsvp' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 bg-wedding-green-600 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Confirmações de Presença</h2>
                <button
                  onClick={() => exportToCSV(rsvpData, 'rsvps.csv')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-wedding-green-600 rounded-lg hover:bg-wedding-green-50 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acompanhante</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rsvpData.map((rsvp, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {rsvp.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {rsvp.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {rsvp.telefone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rsvp.status)}`}>
                          {getStatusText(rsvp.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {rsvp.quantidade_convidados > 1 ? `${rsvp.quantidade_convidados} pessoas` : '1 pessoa'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(rsvp.data_confirmacao).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Gifts Tab */}
        {activeTab === 'gifts' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 bg-wedding-green-600 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Lista de Presentes</h2>
                <button
                  onClick={() => exportToCSV(giftData, 'presentes.csv')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-wedding-green-600 rounded-lg hover:bg-wedding-green-50 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comprador</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {giftData.map((gift, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {gift.item_nome || 'Presente'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {gift.tipo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        R$ {gift.valor?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          gift.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 
                          gift.status === 'confirmado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {gift.status === 'pendente' ? 'Pendente' : 
                           gift.status === 'confirmado' ? 'Confirmado' : 'Entregue'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {gift.doador_nome || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(gift.data_presente).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Video Tab */}
        {activeTab === 'video' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-wedding-green-800 mb-4">
                Upload do Vídeo Convite
              </h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Instruções:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Formato obrigatório: 1080x1920 (vertical)</li>
                  <li>• O vídeo será exibido em tela cheia no formato vertical</li>
                  <li>• Upload Automático: O vídeo é enviado automaticamente ao selecionar</li>
                  <li>• Persistência: O vídeo permanece após recarregar a página (F5)</li>
                  <li>• Tamanho máximo: 3MB (para evitar problemas de armazenamento)</li>
                </ul>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  disabled={uploading}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {uploading ? 'Enviando vídeo...' : 'Clique para selecionar um vídeo'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {uploading ? 'Aguarde...' : 'MP4, MOV, AVI (máx. 3MB)'}
                  </p>
                </label>
              </div>

              {videoFile && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Vídeo Atual:</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Nome:</strong> {videoFile.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Tamanho:</strong> {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Última modificação:</strong> {new Date(videoFile.lastModified).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {videoUrl && (
                        <button
                          onClick={() => window.open(videoUrl, '_blank')}
                          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <PlayIcon className="w-4 h-4" />
                          <span>Visualizar</span>
                        </button>
                      )}
                      <button
                        onClick={handleVideoRemove}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span>Remover</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}