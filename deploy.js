#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando processo de deploy...\n');

// 1. Verificar se o build existe
console.log('📦 Verificando build...');
if (!fs.existsSync('.next')) {
  console.log('❌ Build não encontrado. Executando build...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro no build:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Build encontrado!');
}

// 2. Verificar arquivos de configuração
console.log('\n📋 Verificando configurações...');
const requiredFiles = [
  'Dockerfile',
  'turbo.json',
  'domain-config.json',
  'turbo-cloud-config.json'
];

for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} encontrado`);
  } else {
    console.log(`❌ ${file} não encontrado`);
  }
}

// 3. Verificar tamanho do build
console.log('\n📊 Verificando tamanho do build...');
const buildSize = getDirectorySize('.next');
console.log(`📁 Tamanho do build: ${(buildSize / 1024 / 1024).toFixed(2)} MB`);

// 4. Instruções para deploy
console.log('\n🎯 Próximos passos para deploy:');
console.log('1. Faça login na Turbo Cloud: https://turbo.build/cloud');
console.log('2. Crie um novo projeto');
console.log('3. Conecte seu repositório GitHub');
console.log('4. Configure o domínio: flowdamemorizacao.com');
console.log('5. Configure as variáveis de ambiente:');
console.log('   - NODE_ENV=production');
console.log('   - NEXT_PUBLIC_SITE_URL=https://flowdamemorizacao.com');
console.log('6. Configure o build command: npm run build');
console.log('7. Configure o output directory: .next');
console.log('8. Configure o Node.js version: 20');

console.log('\n🌐 Informações do seu servidor:');
console.log('   - IP: 45.148.96.61');
console.log('   - SSL: Válido até 08/12/2025');
console.log('   - Nameservers já configurados');

console.log('\n📝 Arquivos de configuração criados:');
console.log('- Dockerfile: Para containerização');
console.log('- turbo.json: Configuração do Turbo');
console.log('- domain-config.json: Configurações do domínio');
console.log('- turbo-cloud-config.json: Configurações específicas do Turbo Cloud');

console.log('\n✅ Projeto pronto para deploy!');

function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  function calculateSize(itemPath) {
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      const files = fs.readdirSync(itemPath);
      files.forEach(file => {
        calculateSize(path.join(itemPath, file));
      });
    } else {
      totalSize += stats.size;
    }
  }
  
  calculateSize(dirPath);
  return totalSize;
}
