const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build no servidor...');

try {
  // Verificar se o package.json existe
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json não encontrado');
  }

  // Instalar dependências
  console.log('📦 Instalando dependências...');
  execSync('npm install --production', { stdio: 'inherit' });

  // Fazer build
  console.log('🔨 Fazendo build do Next.js...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('✅ Build concluído com sucesso!');
  console.log('📁 Verifique se a pasta .next foi criada com tamanho grande');

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}
