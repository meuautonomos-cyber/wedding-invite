// Sistema simples de armazenamento de vídeo para o admin
// Em produção, isso seria substituído por um backend real

interface VideoData {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedAt: string
}

class VideoStorage {
  private storageKey = 'wedding-video-data'
  private currentVideo: VideoData | null = null

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey)
      console.log('VideoStorage - Carregando do localStorage:', stored ? 'DADOS ENCONTRADOS' : 'VAZIO')
      if (stored) {
        try {
          this.currentVideo = JSON.parse(stored)
          console.log('VideoStorage - Vídeo carregado do storage:', {
            id: this.currentVideo?.id,
            name: this.currentVideo?.name,
            urlLength: this.currentVideo?.url?.length,
            hasUrl: !!this.currentVideo?.url,
            type: this.currentVideo?.type
          })
        } catch (error) {
          console.error('VideoStorage - Erro ao fazer parse do JSON:', error)
          this.currentVideo = null
        }
      } else {
        console.log('VideoStorage - Nenhum vídeo encontrado no localStorage')
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      if (this.currentVideo) {
        const dataToStore = JSON.stringify(this.currentVideo)
        console.log('VideoStorage - Tentando salvar no localStorage, tamanho dos dados:', dataToStore.length, 'caracteres')
        
        try {
          localStorage.setItem(this.storageKey, dataToStore)
          console.log('VideoStorage - Dados salvos com sucesso no localStorage')
          
          // Disparar evento customizado para notificar outras partes da aplicação
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('videoStorageChanged'))
          }
        } catch (error) {
          console.error('VideoStorage - Erro ao salvar no localStorage:', error)
          if (error instanceof Error && error.name === 'QuotaExceededError') {
            console.error('VideoStorage - ERRO: localStorage cheio! Tamanho dos dados:', dataToStore.length)
            alert('Erro: O vídeo é muito grande para ser salvo. Tente um vídeo menor.')
          }
        }
      } else {
        localStorage.removeItem(this.storageKey)
        console.log('VideoStorage - Dados removidos do localStorage')
      }
    }
  }

  async uploadVideo(file: File): Promise<VideoData> {
    console.log('VideoStorage - Iniciando upload:', file.name, file.size, file.type)
    
    // Verificar tamanho do arquivo (base64 aumenta ~33% o tamanho)
    const estimatedBase64Size = file.size * 1.33
    console.log('VideoStorage - Tamanho original:', file.size, 'bytes')
    console.log('VideoStorage - Tamanho estimado em base64:', Math.round(estimatedBase64Size), 'bytes')
    
    // Limite mais restritivo para evitar QuotaExceededError
    const maxFileSize = 3 * 1024 * 1024; // 3MB
    const maxBase64Size = 4 * 1024 * 1024; // 4MB
    
    if (file.size > maxFileSize) {
      throw new Error(`Vídeo muito grande! Tamanho máximo permitido: 3MB. Tamanho atual: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }
    
    if (estimatedBase64Size > maxBase64Size) {
      throw new Error(`Vídeo muito grande após conversão! Tamanho máximo estimado: 4MB. Tamanho estimado: ${(estimatedBase64Size / 1024 / 1024).toFixed(2)}MB`);
    }
    
    // Converter arquivo para base64 para persistência
    console.log('VideoStorage - Convertendo arquivo para base64...')
    const base64Url = await this.fileToBase64(file)
    console.log('VideoStorage - Base64 convertido, tamanho:', base64Url.length, 'caracteres')
    console.log('VideoStorage - Base64 começa com:', base64Url.substring(0, 50) + '...')
    
    // Verificar tamanho real do Base64
    if (base64Url.length > maxBase64Size) {
      throw new Error(`Vídeo muito grande após conversão! Tamanho máximo permitido: 4MB. Tamanho atual: ${(base64Url.length / 1024 / 1024).toFixed(2)}MB`);
    }
    
    const videoData: VideoData = {
      id: Date.now().toString(),
      name: file.name,
      url: base64Url, // Usar base64 em vez de URL temporária
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    }

    console.log('VideoStorage - Dados do vídeo criados:', {
      id: videoData.id,
      name: videoData.name,
      urlLength: videoData.url.length,
      size: videoData.size,
      type: videoData.type
    })
    
    this.currentVideo = videoData
    this.saveToStorage()
    console.log('VideoStorage - Vídeo salvo no storage')
    
    return videoData
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('VideoStorage - Iniciando FileReader para:', file.name)
      const reader = new FileReader()
      
      reader.onload = () => {
        console.log('VideoStorage - FileReader onload chamado')
        if (typeof reader.result === 'string') {
          console.log('VideoStorage - Base64 gerado com sucesso, tamanho:', reader.result.length)
          resolve(reader.result)
        } else {
          console.error('VideoStorage - Resultado do FileReader não é string:', typeof reader.result)
          reject(new Error('Erro ao converter arquivo para base64'))
        }
      }
      
      reader.onerror = (error) => {
        console.error('VideoStorage - Erro no FileReader:', error)
        reject(new Error('Erro ao ler arquivo'))
      }
      
      reader.readAsDataURL(file)
    })
  }

  getCurrentVideo(): VideoData | null {
    console.log('VideoStorage - getCurrentVideo chamado, retornando:', this.currentVideo)
    return this.currentVideo
  }

  removeVideo(): void {
    if (this.currentVideo) {
      // Não precisamos revogar URLs base64
      this.currentVideo = null
      this.saveToStorage()
    }
  }

  hasVideo(): boolean {
    return this.currentVideo !== null
  }
}

export const videoStorage = new VideoStorage()
