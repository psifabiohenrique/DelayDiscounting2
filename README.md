# Experimento de Desconto de Atraso

Um aplicativo desktop desenvolvido em Electron para conduzir experimentos de pesquisa em psicologia comportamental, focado no estudo de desconto de atraso com estímulos visuais.

## 📋 Descrição

Este programa foi desenvolvido para pesquisadores conduzirem experimentos controlados onde participantes:
1. Selecionam fotos dos reforços de sua preferência
2. Ranqueiam as fotos selecionadas por ordem de preferência
3. Respondem questionário informando a probabilidade de uma resposta impulsiva ou autocontrolada, para valores de atraso selecionados pelo pesquisador e sobre fotos específicas selecionadas pelo pesquisador

## ✨ Funcionalidades

### Para o Pesquisador
- **Interface de Configuração Completa**: Configure todos os parâmetros do experimento
- **Instruções Personalizáveis**: Defina instruções com formatação HTML (negrito, itálico, sublinhado) e com inserção dinâmica do valor de atraso (utilize {valor} onde quer inserir o valor na tela de questionário)
- **Listas Dinâmicas**: Configure facilmente quais fotos irão para o questionário e os valores de intervalo
- **Exportação Automática**: Dados salvos automaticamente em formato CSV
- **Controle de Sessão**: Geração automática de IDs de participantes preservando o anonimato

### Para o Participante
- **Interface Intuitiva**: Design limpo e fácil de usar
- **Seleção Visual de Fotos**: Grid responsivo com feedback visual
- **Drag & Drop**: Ranqueamento por arrastar e soltar
- **Modo Fullscreen**: Experiência imersiva durante o experimento
- **Questionários Dinâmicos**: Interface adaptável com sliders e escalas

## 🚀 Instalação e Uso

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação para Desenvolvimento
```bash
# Clone o repositório
git clone https://github.com/psifabiohenrique/DealyDiscounting2
cd DelayDiscounting2

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm start
```
### Gerar Executável

```bash
# Para Windows
npm run build-win

# Para macOS
npm run build-mac

# Para Linux
npm run build-linux
```
O executável será criado na pasta dist/

### Estrutura do Projeto

```plaintext
DelayDiscounting2/
├── main.js                # Processo principal do Electron
├── preload.js             # Script de pré-carregamento
├── index.html             # Página principal
├── package.json           # Configurações do projeto
├── src/
│   ├── js/
│   │   ├── app.js         # Controlador principal da aplicação
│   │   ├── modules/       # Módulos do sistema
│   │   └── controllers/   # Controladores de cada tela
│   ├── css/
│   │   └── global.css     # Estilos da aplicação
│   └── media/             # Imagens para o experimento
├── views/                 # Templates HTML das telas
├── utils/                 # Utilitários (exportação, configurações)
└── dist/                  # Executáveis gerados
```

### Configuração do Experimento

#### Parâmetros Configuráveis
- **Instruções:** Texto em formato HTML para cada fase
- **Lista de Imagens:** Conjunto dinâmico de imagens para seleção, ordenação e visualização nos questionários.
- **Intervalos de Valores:** Configuração de valores para os questionários e experimentos.
- **Tempo de Botão:** Tempo mínimo antes de permitir prosseguir

### Exemplo de Configuração

```json
{
  "totalPhotosNumber": 20,
  "selectPhotosNumber": 10,
  "photosToQuestionary": [0, 1, 2],
  "intervalValues": [1, 2, 3, 4, 5],
  "firstInstruction": "Bem-vindo ao experimento..."
}
```

### 📊 Dados Coletados
Os dados são automaticamente salvos em formato CSV contendo:

- ID único do participante
- Idade do participante
- Fotos selecionadas e sua ordem de ranqueamento
- Respostas aos questionários por foto

### 📂 Localização dos Dados
- **Windows:** C:\Users\[Usuario]\AppData\Roaming\Experimento Desconto de Atraso\data\
- **macOS:** ~/Library/Application Support/Experimento Desconto de Atraso/data/
- **Linux:** ~/.config/Experimento Desconto de Atraso/data/

### 🎯 Fluxo do Experimento
- **Tela Inicial:** Inserção de dados do participante
- **Configuração:** (Apenas pesquisador) Ajuste de parâmetros
- **Instrução Inicial:** Apresentação das regras
- **Seleção de Fotos:** Participante escolhe fotos preferidas
- **Ranqueamento:** Ordenação por drag & drop
- **Questionários:** Perguntas sobre impulsividade/autocontrole para cada valor de intervalo
- **Finalização:** Salvamento automático e encerramento


### 🛠️ Tecnologias Utilizadas
- **Electron:** Framework para aplicações desktop
- **JavaScript ES6+:** Linguagem principal
- **HTML5/CSS3:** Interface do usuário
- **Node.js:** Runtime do backend
- **CSV:** Formato de exportação de dados


### 🔒 Segurança e Privacidade
- Dados armazenados localmente na máquina
- Nenhuma transmissão de dados pela internet
- IDs de participantes gerados aleatoriamente
- Controle total do pesquisador sobre os dados

### 📝 Licença
Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

### 👥 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Abrir issues para reportar bugs ou sugerir melhorias
- Enviar pull requests com correções ou novas funcionalidades
- Propor melhorias na documentação

Para contribuir:
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request