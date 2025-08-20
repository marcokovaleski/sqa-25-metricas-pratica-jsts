# Atividade #4 - Prática de métricas: Refatoração para atingir a qualidade

Projeto didático para análise de métricas de código e refatoração.

## 🚀 Como executar

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd sqa-25-metricas-pratica-jsts
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute os testes
```bash
npm test
```

### 4. Execute o linter
```bash
npm run lint
```

### 5. Execute os testes em modo watch
```bash
npm run test:watch
```

### 6. Ver cobertura de testes
```bash
npm run test:coverage
```

## 📁 Estrutura do projeto

- `src/` - Código fonte
- `src/__tests__/` - Testes unitários
- `.husky/` - Hooks do Git
- `eslint.config.mjs` - Configuração do ESLint
- `jest.config.js` - Configuração do Jest

## 🔧 Scripts disponíveis

- `npm test` - Executa todos os testes
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:coverage` - Gera relatório de cobertura
- `npm run lint` - Executa o linter
- `npm run prepare` - Configura hooks do Husky

## 📝 Padrão de commits

O projeto usa Conventional Commits. Exemplos:
- `feat: adicionar nova funcionalidade`
- `fix: corrigir bug`
- `refactor: refatorar código`
- `test: adicionar testes`
- `chore: configuração de ferramentas`

## 👓 Hooks do Husky

O projeto utiliza Husky para gerenciar hooks do Git automaticamente:

- **commit-msg**: Valida se as mensagens de commit seguem o padrão Conventional Commits
- **prepare**: Configura automaticamente os hooks após `npm install`

### Como funciona:
- Após `npm install`, os hooks são configurados automaticamente
- Tentativas de commit com mensagens inválidas serão rejeitadas
- Mensagens devem seguir o formato: `tipo(escopo?): descrição`

### Exemplo de commit válido:
```bash
git commit -m "feat(auth): adicionar validação de email"
```
