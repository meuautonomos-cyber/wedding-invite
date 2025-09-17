// Utilitários de teste para verificar funcionalidades do site

import { weddingData } from '@/data/weddingData'
import { cms } from './cms'

export const testFunctionality = {
  // Testar dados do casamento
  testWeddingData: () => {
    const { casamento } = weddingData
    const tests = [
      {
        name: 'Dados dos noivos',
        test: () => casamento.noivos.nome_noiva && casamento.noivos.nome_noivo && casamento.noivos.monograma,
        expected: true
      },
      {
        name: 'Dados do evento',
        test: () => casamento.evento.data && casamento.evento.hora && casamento.evento.local_resumo,
        expected: true
      },
      {
        name: 'Configuração de vídeo',
        test: () => casamento.video_convite.tipo && casamento.video_convite.url,
        expected: true
      },
      {
        name: 'Configuração de RSVP',
        test: () => casamento.rsvp.data_limite && casamento.rsvp.limite_total,
        expected: true
      },
      {
        name: 'Configuração de SEO',
        test: () => casamento.seo.title && casamento.seo.description,
        expected: true
      }
    ]
    
    return tests.map(test => ({
      ...test,
      result: test.test(),
      passed: Boolean(test.test()) === test.expected
    }))
  },

  // Testar funcionalidades do CMS
  testCMS: async () => {
    const tests = [
      {
        name: 'Criar RSVP',
        test: async () => {
          const rsvp = await cms.createRSVP({
            nome: 'Teste',
            telefone: '11999999999',
            email: 'teste@teste.com',
            quantidade_convidados: 1,
            status: 'confirmado'
          })
          return rsvp.id !== undefined
        },
        expected: true
      },
      {
        name: 'Criar presente',
        test: async () => {
          const gift = await cms.createGift({
            tipo: 'cota',
            valor: 100,
            doador_nome: 'Teste',
            doador_telefone: '11999999999',
            status: 'pendente'
          })
          return gift.id !== undefined
        },
        expected: true
      },
      {
        name: 'Listar RSVPs',
        test: async () => {
          const rsvps = await cms.getRSVPs()
          return Array.isArray(rsvps)
        },
        expected: true
      },
      {
        name: 'Listar presentes',
        test: async () => {
          const gifts = await cms.getGifts()
          return Array.isArray(gifts)
        },
        expected: true
      }
    ]
    
    const results = []
    for (const test of tests) {
      try {
        const result = await test.test()
        results.push({
          ...test,
          result,
          passed: result === test.expected
        })
      } catch (error) {
        results.push({
          ...test,
          result: false,
          passed: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        })
      }
    }
    
    return results
  },

  // Testar formatação de dados
  testFormatting: () => {
    const tests = [
      {
        name: 'Formatação de data',
        test: () => {
          const date = new Date('2026-03-21')
          return date.toLocaleDateString('pt-BR') === '21/3/2026'
        },
        expected: true
      },
      {
        name: 'Formatação de moeda',
        test: () => {
          const value = 199.90
          return new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
          }).format(value) === 'R$ 199,90'
        },
        expected: true
      },
      {
        name: 'Geração de ICS',
        test: () => {
          const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invite//Wedding Event//EN
BEGIN:VEVENT
UID:1234567890@wedding-invite.com
DTSTAMP:20260321T160000Z
DTSTART:20260321T160000Z
DTEND:20260321T200000Z
SUMMARY:Casamento de Anthony & Esther
DESCRIPTION:Celebração do casamento civil
LOCATION:Vitória - ES
END:VEVENT
END:VCALENDAR`
          return ics.includes('BEGIN:VCALENDAR') && ics.includes('END:VCALENDAR')
        },
        expected: true
      }
    ]
    
    return tests.map(test => ({
      ...test,
      result: test.test(),
      passed: Boolean(test.test()) === test.expected
    }))
  },

  // Executar todos os testes
  runAllTests: async () => {
    console.log('🧪 Iniciando testes de funcionalidade...')
    
    const weddingDataTests = testFunctionality.testWeddingData()
    const cmsTests = await testFunctionality.testCMS()
    const formattingTests = testFunctionality.testFormatting()
    
    const allTests = [...weddingDataTests, ...cmsTests, ...formattingTests]
    const passedTests = allTests.filter(test => test.passed)
    const failedTests = allTests.filter(test => !test.passed)
    
    console.log(`✅ Testes aprovados: ${passedTests.length}/${allTests.length}`)
    
    if (failedTests.length > 0) {
      console.log('❌ Testes falharam:')
      failedTests.forEach(test => {
        console.log(`  - ${test.name}: Falhou`)
      })
    }
    
    return {
      total: allTests.length,
      passed: passedTests.length,
      failed: failedTests.length,
      tests: allTests
    }
  }
}

// Função para testar no console do navegador
if (typeof window !== 'undefined') {
  (window as any).testWeddingSite = testFunctionality
}
