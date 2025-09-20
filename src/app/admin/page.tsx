'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabaseStorage, RSVPData, GiftData } from '@/lib/supabaseStorage'
import { 
  UsersIcon,
  GiftIcon,
  DocumentArrowDownIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

export default function AdminPage() {
  const [rsvpData, setRsvpData] = useState<RSVPData[]>([])
  const [giftData, setGiftData] = useState<GiftData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'rsvp' | 'gifts'>('rsvp')
  const [statusFilter, setStatusFilter] = useState<'todos' | 'confirmado' | 'com_acompanhante' | 'nao_podera_ir'>('todos')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      console.log('Admin - Carregando dados do Supabase...')
      
      // Carregar RSVPs e presentes do Supabase
      const [rsvpResponse, giftsResponse] = await Promise.all([
        supabaseStorage.getAllRSVPs(),
        supabaseStorage.getAllGifts()
      ])
      
      console.log('Admin - RSVPs carregados:', rsvpResponse.length)
      console.log('Admin - Presentes carregados:', giftsResponse.length)
      
      setRsvpData(rsvpResponse)
      setGiftData(giftsResponse)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      alert('Erro ao carregar dados do Supabase: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
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
      case 'nao_podera_ir':
        return 'Não Poderá Ir'
      default:
        return status
    }
  }

  // Filtrar RSVPs por status
  const filteredRSVPs = rsvpData.filter(rsvp => {
    if (statusFilter === 'todos') return true
    return rsvp.status === statusFilter
  })

  // Estatísticas dos filtros
  const getFilterStats = () => {
    const total = rsvpData.length
    const confirmados = rsvpData.filter(r => r.status === 'confirmado').length
    const comAcompanhante = rsvpData.filter(r => r.status === 'com_acompanhante').length
    const naoPoderao = rsvpData.filter(r => r.status === 'nao_podera_ir').length
    
    return { total, confirmados, comAcompanhante, naoPoderao }
  }

  // Atualizar status do presente
  const handleUpdateGiftStatus = async (giftId: string, newStatus: 'pendente' | 'confirmado' | 'entregue') => {
    try {
      const success = await supabaseStorage.updateGiftStatus(giftId, newStatus)
      if (success) {
        // Recarregar dados após atualização
        loadData()
        alert(`Status atualizado para: ${newStatus}`)
      } else {
        alert('Erro ao atualizar status')
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status')
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
                  onClick={() => exportToCSV(filteredRSVPs, 'rsvps.csv')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-wedding-green-600 rounded-lg hover:bg-wedding-green-50 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>
            
            {/* Filtros e Estatísticas */}
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Filtros por status */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setStatusFilter('todos')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      statusFilter === 'todos'
                        ? 'bg-wedding-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Todos ({getFilterStats().total})
                  </button>
                  <button
                    onClick={() => setStatusFilter('confirmado')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      statusFilter === 'confirmado'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Confirmados ({getFilterStats().confirmados})
                  </button>
                  <button
                    onClick={() => setStatusFilter('com_acompanhante')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      statusFilter === 'com_acompanhante'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Com Acompanhante ({getFilterStats().comAcompanhante})
                  </button>
                  <button
                    onClick={() => setStatusFilter('nao_podera_ir')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      statusFilter === 'nao_podera_ir'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Não Poderão Ir ({getFilterStats().naoPoderao})
                  </button>
                </div>
                
                {/* Contador de resultados filtrados */}
                <div className="text-sm text-gray-600">
                  Mostrando {filteredRSVPs.length} de {rsvpData.length} confirmações
                </div>
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
                  {filteredRSVPs.map((rsvp, index) => (
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {giftData.map((gift, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {gift.item_nome || gift.tipo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {gift.categoria || gift.tipo}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-1">
                          {gift.status === 'pendente' && (
                            <button
                              onClick={() => handleUpdateGiftStatus(gift.id, 'confirmado')}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded hover:bg-green-200 transition-colors"
                              title="Confirmar presente"
                            >
                              ✓
                            </button>
                          )}
                          {gift.status === 'confirmado' && (
                            <button
                              onClick={() => handleUpdateGiftStatus(gift.id, 'entregue')}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 transition-colors"
                              title="Marcar como entregue"
                            >
                              📦
                            </button>
                          )}
                          {gift.status === 'entregue' && (
                            <span className="text-xs text-gray-400">Finalizado</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  )
}