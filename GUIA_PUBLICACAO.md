# 🚀 Guia Completo para Publicar o Site

## 📋 **Informações do Seu Servidor**
- **Domínio**: `flowdamemorizacao.com`
- **IP**: `45.148.96.61`
- **Usuário**: `flowd4638004`
- **Diretório**: `/home/flowd4638004`
- **SSL**: Válido até 08/12/2025

## 🎯 **Método 1: Upload via cPanel (Recomendado)**

### **Passo 1: Acessar o Gerenciador de Arquivos**
1. No seu cPanel, clique em **"Gerenciador de arquivos"** (na seção Arquivos)
2. Navegue até a pasta `public_html`
3. **IMPORTANTE**: Delete todos os arquivos existentes nesta pasta (se houver)

### **Passo 2: Upload dos Arquivos**
1. Clique em **"Upload"** no topo do gerenciador
2. Faça upload do arquivo `wedding-site.zip` que foi criado
3. Após o upload, clique com o botão direito no arquivo ZIP
4. Selecione **"Extrair"** e confirme

### **Passo 3: Configurar o Servidor**
1. Volte para a pasta `public_html`
2. Você deve ver as seguintes pastas e arquivos:
   - `.next/` (pasta com os arquivos compilados)
   - `public/` (pasta com imagens e assets)
   - `package.json`
   - `next.config.js`
   - `tailwind.config.js`
   - `tsconfig.json`
   - `server.js` (arquivo de servidor personalizado)

### **Passo 4: Configurar Node.js**
1. No cPanel, procure por **"Node.js"** ou **"Node.js Selector"**
2. Selecione a versão **Node.js 22.16.0** (ou a mais recente disponível)
3. Configure o **Application Root** como `/home/flowd4638004/public_html`
4. Configure o **Application URL** como `https://flowdamemorizacao.com`
5. Configure o **Application Startup File** como `server.js`
6. Configure o **Modo de aplicação** como `Production`

### **Passo 5: Instalar Dependências**
1. No Node.js, clique em **"Terminal"** ou **"SSH Terminal"**
2. Execute os comandos:
```bash
cd public_html
npm install
```

### **Passo 6: Configurar Variáveis de Ambiente**
1. No Node.js, clique em **"ADICIONAR VARIÁVEL"** e adicione:
   - **Nome**: `NODE_ENV` | **Valor**: `production`
   - **Nome**: `NEXT_PUBLIC_SITE_URL` | **Valor**: `https://flowdamemorizacao.com`
   - **Nome**: `NEXT_PUBLIC_SITE_NAME` | **Valor**: `Anthony & Esther`
   - **Nome**: `NEXT_PUBLIC_SITE_DESCRIPTION` | **Valor**: `Convite de Casamento - 21/03/26, 15:30h`

### **Passo 7: Iniciar o Servidor**
1. No terminal, execute:
```bash
npm start
```

## 🎯 **Método 2: Upload via FTP (Alternativo)**

### **Passo 1: Configurar FTP**
1. No cPanel, vá para **"Contas de FTP"**
2. Crie uma nova conta FTP ou use a existente
3. Anote as credenciais:
   - **Servidor**: `45.148.96.61`
   - **Usuário**: `flowd4638004`
   - **Senha**: [sua senha]

### **Passo 2: Conectar via FTP**
1. Use um cliente FTP como FileZilla
2. Conecte com as credenciais acima
3. Navegue até `/public_html`
4. Faça upload de todos os arquivos do projeto

## 🔧 **Configurações Adicionais**

### **Configurar Domínio**
1. No cPanel, vá para **"Domínios"**
2. Verifique se `flowdamemorizacao.com` está configurado
3. Se não estiver, adicione o domínio

### **Configurar SSL**
1. No cPanel, vá para **"SSL/TLS"**
2. Ative o SSL para `flowdamemorizacao.com`
3. Force HTTPS (se disponível)

### **Configurar Cache**
1. No cPanel, procure por **"Cache"** ou **"Performance"**
2. Ative o cache do site
3. Configure compressão GZIP

## ✅ **Verificação Final**

### **Teste o Site**
1. Acesse `https://flowdamemorizacao.com`
2. Teste todas as páginas:
   - Página inicial
   - Site (informações)
   - Confirmar presença
   - Lista de presentes
   - Local do evento
   - Vídeo convite
   - Admin

### **Teste Mobile**
1. Acesse o site pelo celular
2. Verifique se está responsivo
3. Teste todas as funcionalidades

## 🆘 **Solução de Problemas**

### **Site não carrega**
- Verifique se o Node.js está rodando
- Verifique os logs de erro
- Confirme se os arquivos estão na pasta correta

### **Erro 500**
- Verifique as permissões das pastas
- Confirme se todas as dependências foram instaladas
- Verifique os logs de erro

### **CSS não carrega**
- Verifique se o Tailwind foi compilado
- Confirme se os arquivos estão na pasta `public`

## 📞 **Suporte**

Se encontrar problemas:
1. Verifique os logs de erro no cPanel
2. Confirme se todas as configurações estão corretas
3. Teste localmente primeiro

---

**Status**: ✅ Arquivos prontos para upload
**Arquivo ZIP**: `wedding-site.zip` criado
**Próximo passo**: Upload via cPanel
