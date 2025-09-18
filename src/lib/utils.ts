import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatTime(timeString: string): string {
  return timeString
}

export function generateICS(
  title: string,
  description: string,
  startDate: string,
  endDate: string,
  location: string
): string {
  const start = new Date(startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const end = new Date(endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invite//Wedding Event//EN
BEGIN:VEVENT
UID:${Date.now()}@wedding-invite.com
DTSTAMP:${now}
DTSTART:${start}
DTEND:${end}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`
}

export function addToCalendar(
  title: string,
  description: string,
  startDate: string,
  endDate: string,
  location: string
) {
  // Detectar o dispositivo/sistema operacional
  const userAgent = navigator.userAgent.toLowerCase()
  const isIOS = /iphone|ipad|ipod/.test(userAgent)
  const isAndroid = /android/.test(userAgent)
  const isMac = /macintosh|mac os x/.test(userAgent)
  const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent)
  
  // Formatar datas para URLs
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  // Formato para Google Calendar
  const formatForGoogle = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }
  
  
  // URLs para diferentes calendários
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatForGoogle(start)}/${formatForGoogle(end)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`
  
  // Gerar arquivo ICS para download
  const icsContent = generateICS(title, description, startDate, endDate, location)
  const icsBlob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const icsUrl = URL.createObjectURL(icsBlob)
  
  
  // Decidir qual calendário usar baseado no dispositivo
  if (isIOS) {
    // iOS - tentar múltiplas abordagens
    try {
      // Primeiro, tentar Google Calendar
      const googleLink = document.createElement('a')
      googleLink.href = googleUrl
      googleLink.target = '_blank'
      googleLink.rel = 'noopener noreferrer'
      document.body.appendChild(googleLink)
      googleLink.click()
      document.body.removeChild(googleLink)
    } catch (error) {
      // Fallback: baixar arquivo ICS
      const link = document.createElement('a')
      link.href = icsUrl
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(icsUrl)
    }
  } else if (isMac && isSafari) {
    // Mac Safari - tentar Apple Calendar via ICS
    const link = document.createElement('a')
    link.href = icsUrl
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(icsUrl)
  } else if (isAndroid) {
    // Android - usar Google Calendar
    window.open(googleUrl, '_blank')
  } else {
    // Desktop - mostrar opções
    const choice = confirm('Escolha o calendário:\n\nOK = Google Calendar\nCancelar = Baixar arquivo ICS')
    if (choice) {
      window.open(googleUrl, '_blank')
    } else {
      // Baixar arquivo ICS
      const link = document.createElement('a')
      link.href = icsUrl
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(icsUrl)
    }
  }
}

