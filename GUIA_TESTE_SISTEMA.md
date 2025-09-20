# 🧪 Guia de Teste do Sistema Inteligente

## 📋 Passos para Testar

### 1. **Executar SQL no Supabase**
1. Acesse o painel do Supabase
2. Vá em "SQL Editor"
3. Execute o SQL fornecido abaixo
4. Verifique se a tabela `wedding_presente_suggestions` foi criada

### 2. **Testar Localmente**
1. Abra o terminal
2. Execute: `npm run dev`
3. Acesse: `http://localhost:3000`

### 3. **Testar Sistema de Sugestões**

#### Teste 1: Primeira Confirmação
1. Acesse `/confirmar`
2. Preencha os dados:
   - Nome: João Silva
   - Email: joao@teste.com
   - Telefone: 27999999999
   - Status: Confirmado
3. Confirme a presença
4. Verifique se recebeu sugestões dos presentes mais caros

#### Teste 2: Segunda Confirmação
1. Acesse `/confirmar`
2. Preencha os dados:
   - Nome: Maria Santos
   - Email: maria@teste.com
   - Telefone: 27988888888
   - Status: Confirmado
3. Confirme a presença
4. Verifique se recebeu sugestões DIFERENTES (não repetidas)

#### Teste 3: Terceira Confirmação
1. Acesse `/confirmar`
2. Preencha os dados:
   - Nome: Pedro Costa
   - Email: pedro@teste.com
   - Telefone: 27977777777
   - Status: Confirmado
3. Confirme a presença
4. Verifique se recebeu sugestões DIFERENTES novamente

### 4. **Verificar no Admin**
1. Acesse `/admin`
2. Vá na aba "RSVPs"
3. Verifique se as confirmações aparecem
4. Verifique se os filtros funcionam

### 5. **Verificar no Supabase**
1. Acesse o painel do Supabase
2. Vá em "Table Editor"
3. Verifique a tabela `wedding_presente_suggestions`
4. Confirme se as sugestões foram salvas

## 🎯 O que Esperar

### ✅ Primeira Pessoa (João):
- Recebe: Smart TV, Máquina de Lavar, Robô Aspirador, etc.
- Presentes mais caros e prioritários

### ✅ Segunda Pessoa (Maria):
- Recebe: Airfryer, Panelas, Travessas, etc.
- Presentes diferentes, não repetidos

### ✅ Terceira Pessoa (Pedro):
- Recebe: Batedeira, Liquidificador, Mixer, etc.
- Presentes de prioridade média

### ✅ Quando Acabar os Únicos:
- Recebe sugestões de compra em grupo
- Marcadas com 👥
- Explicação sobre compra coletiva

## 🔍 Verificações Importantes

1. **Sugestões não se repetem** entre pessoas diferentes
2. **Presentes mais caros** são sugeridos primeiro
3. **Valores aparecem** na mensagem do WhatsApp
4. **Sugestões são salvas** no Supabase
5. **Sistema funciona** mesmo com muitas confirmações

## 🚨 Se Algo Der Errado

1. **Verifique o console** do navegador (F12)
2. **Verifique o console** do terminal
3. **Confirme se o SQL** foi executado no Supabase
4. **Verifique as variáveis** de ambiente

## 📊 Resultado Esperado

Após os testes, você deve ter:
- ✅ 3 confirmações de presença
- ✅ 3 conjuntos de sugestões diferentes
- ✅ Dados salvos no Supabase
- ✅ Sistema funcionando perfeitamente

**Boa sorte com os testes!** 🎉
