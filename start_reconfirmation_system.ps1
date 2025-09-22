# Script para iniciar o sistema de reconfirmação
Write-Host "🔄 Iniciando sistema de reconfirmação..." -ForegroundColor Green

# Verificar se o Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Instale o Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se o servidor está rodando
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Servidor Next.js está rodando" -ForegroundColor Green
} catch {
    Write-Host "❌ Servidor Next.js não está rodando. Execute 'npm run dev' primeiro." -ForegroundColor Red
    exit 1
}

# Função para processar reconfirmações
function Process-Reconfirmations {
    try {
        Write-Host "🔄 Processando reconfirmações..." -ForegroundColor Yellow
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/reconfirmation/notify" -Method POST -TimeoutSec 30 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            $result = $response.Content | ConvertFrom-Json
            Write-Host "✅ $($result.message)" -ForegroundColor Green
        } else {
            Write-Host "❌ Erro na resposta: $($response.StatusCode)" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Erro ao processar reconfirmações: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Processar imediatamente
Process-Reconfirmations

# Processar a cada 6 horas (21600 segundos)
Write-Host "📅 Sistema configurado para verificar reconfirmações a cada 6 horas" -ForegroundColor Cyan
Write-Host "⏹️  Pressione Ctrl+C para parar" -ForegroundColor Yellow

while ($true) {
    Start-Sleep -Seconds 21600  # 6 horas
    Process-Reconfirmations
}
