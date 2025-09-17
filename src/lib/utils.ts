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
  
  // Formatar datas para URLs
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  // Formato para Google Calendar
  const formatForGoogle = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }
  
  // Formato para Apple Calendar
  const formatForApple = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0]
  }
  
  // URLs para diferentes calendários
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatForGoogle(start)}/${formatForGoogle(end)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`
  
  const appleUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatForApple(start)}
DTEND:${formatForApple(end)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`
  
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`
  
  // Decidir qual calendário usar baseado no dispositivo
  if (isIOS || isMac) {
    // iOS/Mac - usar Apple Calendar
    window.location.href = appleUrl
  } else if (isAndroid) {
    // Android - tentar Google Calendar primeiro
    window.open(googleUrl, '_blank')
  } else {
    // Desktop - mostrar opções ou usar Google Calendar
    const choice = confirm('Escolha o calendário:\n\nOK = Google Calendar\nCancelar = Outlook')
    if (choice) {
      window.open(googleUrl, '_blank')
    } else {
      window.open(outlookUrl, '_blank')
    }
  }
}

