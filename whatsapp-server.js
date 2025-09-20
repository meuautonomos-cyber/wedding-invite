const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// QR Code generation
client.on('qr', (qr) => {
    console.log('QR Code gerado! Escaneie com seu WhatsApp:');
    qrcode.generate(qr, {small: true});
});

// Client ready
client.on('ready', () => {
    console.log('WhatsApp Web conectado e pronto!');
});

// Client authentication
client.on('authenticated', () => {
    console.log('WhatsApp Web autenticado!');
});

// Client disconnected
client.on('disconnected', (reason) => {
    console.log('WhatsApp Web desconectado:', reason);
});

// Inicializar cliente
client.initialize();

// API para enviar mensagem
app.post('/api/whatsapp/send', async (req, res) => {
    try {
        const { to, message, qrCode, ticketId } = req.body;
        
        if (!to || !message) {
            return res.status(400).json({ error: 'Telefone e mensagem são obrigatórios' });
        }

        // Formatar número do telefone
        const phoneNumber = to.replace(/\D/g, '');
        const formattedNumber = phoneNumber.endsWith('@c.us') ? phoneNumber : `${phoneNumber}@c.us`;

        // Enviar mensagem
        await client.sendMessage(formattedNumber, message);
        
        // Se tiver QR Code, salvar no sistema de arquivos
        if (qrCode && ticketId) {
            const fs = require('fs');
            const path = require('path');
            const qrPath = path.join(__dirname, 'public', 'qrcodes', `${ticketId}.png`);
            
            // Criar diretório se não existir
            const qrDir = path.dirname(qrPath);
            if (!fs.existsSync(qrDir)) {
                fs.mkdirSync(qrDir, { recursive: true });
            }
            
            // Salvar QR Code
            const base64Data = qrCode.replace(/^data:image\/png;base64,/, '');
            fs.writeFileSync(qrPath, base64Data, 'base64');
        }

        res.json({ 
            success: true, 
            message: 'Mensagem enviada com sucesso',
            ticketId 
        });
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).json({ 
            error: 'Erro ao enviar mensagem',
            details: error.message 
        });
    }
});

// API para verificar status
app.get('/api/whatsapp/status', (req, res) => {
    const isReady = client.info ? true : false;
    res.json({ 
        ready: isReady,
        status: isReady ? 'Conectado' : 'Desconectado'
    });
});

// API para gerar QR Code
app.get('/api/whatsapp/qr', (req, res) => {
    if (client.qr) {
        res.json({ qr: client.qr });
    } else {
        res.status(404).json({ error: 'QR Code não disponível' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor WhatsApp rodando na porta ${PORT}`);
    console.log(`API disponível em: http://localhost:${PORT}/api/whatsapp`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Encerrando servidor...');
    await client.destroy();
    process.exit(0);
});
