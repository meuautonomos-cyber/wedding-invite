# 🚀 Guia de Deploy - Convite de Casamento

## 📋 Pré-requisitos

- Conta na [Turbo Cloud](https://turbo.build/cloud)
- Repositório GitHub com o código
- Domínio `flowdamemorizacao.com` configurado

## 🛠️ Configuração do Projeto

### 1. Build Local
```bash
npm run build
```

### 2. Verificação
```bash
node deploy.js
```

## 🌐 Deploy na Turbo Cloud

### Passo 1: Login e Criação do Projeto
1. Acesse [Turbo Cloud](https://turbo.build/cloud)
2. Faça login com sua conta
3. Clique em "New Project"
4. Conecte seu repositório GitHub

### Passo 2: Configuração do Build
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node.js Version**: `20`
- **Install Command**: `npm install`

### Passo 3: Variáveis de Ambiente
```
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://flowdamemorizacao.com
NEXT_PUBLIC_SITE_NAME=Anthony & Esther
NEXT_PUBLIC_SITE_DESCRIPTION=Convite de Casamento - 21/03/26, 15:30h
NEXT_TELEMETRY_DISABLED=1
```

### Passo 4: Configuração do Domínio
1. No painel do projeto, vá para "Domains"
2. Adicione o domínio: `flowdamemorizacao.com`
3. Configure o DNS conforme instruções da Turbo Cloud

## 🔧 Configuração do DNS (Cloudflare)

### Registros DNS necessários:
```
Tipo: A
Nome: @
Valor: 45.148.96.61

Tipo: CNAME
Nome: www
Valor: flowdamemorizacao.com
```

### Nameservers atuais (já configurados):
- `ns1.brasil116-4060.com.br (45.148.96.61)`
- `ns2.brasil116-4060.com.br (45.148.96.58)`

### Configurações adicionais:
- **SSL/TLS**: Full (Strict)
- **Always Use HTTPS**: Ativado
- **HTTP/2**: Ativado
- **Brotli Compression**: Ativado

## 📁 Arquivos de Configuração

### Dockerfile
- Multi-stage build otimizado
- Imagem Alpine para menor tamanho
- Usuário não-root para segurança

### turbo.json
- Configuração de build e deploy
- Cache otimizado
- Dependências globais

### domain-config.json
- Configurações específicas do domínio
- URLs e metadados

## 🚀 Deploy Automático

Após a configuração inicial, o deploy será automático a cada push para a branch principal.

### Comandos úteis:
```bash
# Verificar status do build
npm run build

# Executar script de verificação
node deploy.js

# Limpar cache (se necessário)
rm -rf .next
npm run build
```

## 🔍 Verificação Pós-Deploy

1. Acesse `https://flowdamemorizacao.com`
2. Verifique todas as páginas:
   - Página inicial
   - Site (informações)
   - Confirmar presença
   - Lista de presentes
   - Local do evento
   - Vídeo convite
   - Admin

3. Teste funcionalidades:
   - Upload de vídeo (admin)
   - Formulário de RSVP
   - Links de calendário
   - Responsividade mobile

## 🆘 Troubleshooting

### Build falha:
- Verifique se todas as dependências estão instaladas
- Execute `npm run build` localmente para identificar erros

### Domínio não funciona:
- Verifique configurações DNS no Cloudflare
- Aguarde propagação (até 24h)
- Verifique certificado SSL

### Performance lenta:
- Ative CDN no Cloudflare
- Verifique compressão
- Otimize imagens

## 📞 Suporte

Para problemas técnicos:
- Verifique logs na Turbo Cloud
- Consulte documentação do Next.js
- Verifique configurações DNS

---

**Status**: ✅ Pronto para deploy
**Última atualização**: 17/09/2025
**Versão**: 1.0.0
