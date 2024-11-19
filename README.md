# WebRecipes

## Descrição do Projeto

O **WebRecipes** é uma aplicação web que permite aos usuários gerenciar receitas culinárias, oferecendo funcionalidades como criação, edição, visualização, pesquisa, e favoritar receitas. A aplicação tem uma arquitetura de backend baseada em **Node.js** com **Express** e um frontend construído com **React.js**. A autenticação é feita utilizando **JWT**, com funcionalidades de registro e login.

## Tecnologias Utilizadas

- **Backend**:
  - **Node.js**: Ambiente de execução para JavaScript no servidor.
  - **Express.js**: Framework para criação de servidores e rotas HTTP.
  - **Prisma**: ORM (Object-Relational Mapping) para facilitar a interação com o banco de dados.
  - **MongoDB**: Banco de dados NoSQL utilizado para armazenar dados da aplicação.
  - **bcrypt**: Biblioteca para criptografar senhas de usuários de forma segura.
  - **jsonwebtoken (JWT)**: Para a geração e verificação de tokens de autenticação.
  - **dotenv**: Para gerenciar variáveis de ambiente de forma segura.
  - **crypto** e **fs**: Para geração e armazenamento seguro da chave secreta utilizada para assinar tokens.
  - **cors**: Para configurar as permissões de requisições entre diferentes domínios.

- **Frontend**:
  - **React.js**: Biblioteca para construção de interfaces de usuário.
  - **React Router**: Gerenciamento de rotas para navegação entre diferentes páginas.
  - **Bootstrap**: Framework de design para construção de interfaces responsivas e estilizadas.

## Funcionalidades

### Backend
1. **Autenticação e Autorização**:
   - Registro de usuários com criptografia de senha utilizando **bcrypt**.
   - Login com autenticação baseada em **JWT** (token de acesso).
   - Middleware de autenticação para proteger rotas e garantir que apenas usuários autenticados acessem funcionalidades sensíveis.
   - **Refresh Tokens** para renovar tokens de acesso expirados.

2. **Gestão de Receitas**:
   - Criação, atualização e listagem de receitas.
   - Armazenamento de informações como título, descrição, ingredientes e modo de preparo.
   - Favoritar ou desfavoritar receitas, com a associação de receitas a usuários autenticados.

3. **Banco de Dados**:
   - Utilização do MongoDB Atlas para persistência dos dados.
   - Definição de modelos de dados utilizando o **Prisma** ORM.

### Frontend
1. **Componentes**:
   - Páginas de **Login**, **Registro**, **Criação de Receitas**, **Favoritos** e **Exibição de Receitas**.
   - **SearchResult** para exibição de resultados de pesquisa.
   - **FormRecipes** como página inicial para criação e listagem de receitas.
   - **ErrorPage** para exibição de erros quando o usuário acessar rotas inexistentes.

2. **Interatividade**:
   - Integração com a API para registrar, autenticar, criar, editar e favoritar receitas.
   - Exibição de mensagens de erro adequadas para feedback ao usuário.
   - Gerenciamento de estado global utilizando **React Context API**.

3. **Estilização**:
   - Estilo responsivo utilizando **Bootstrap** para garantir uma interface amigável e adaptável a diferentes dispositivos.

## Requisitos

### Backend
- **Node.js** versão 16 ou superior.
- **MongoDB Atlas** configurado com a variável `DATABASE_URL`.
- ## Arquivo `.env` contendo:
- `DATABASE_URL=<URL-do-banco-de-dados>`
- `SECRET_KEY=<chave-secreta-ou-gerada-automaticamente>`
- `PORT=<porta-do-servidor>`

### Frontend

- **Node.js** com `npm` ou `yarn` instalado.
- Configuração do backend para aceitar requisições do frontend.

## Instruções de Instalação

### Backend

1. Clone o repositório:
    ```bash
    git clone <url-do-repositorio>
    cd backend
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Crie o arquivo .env e configure as variáveis conforme mencionado acima.

4. Inicie o servidor:
    ```bash
    npm start
    ```

### Frontend

1. Navegue até o diretório do frontend:
    ```bash
    cd frontend
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

## Endpoints do Backend

### Autenticação

- **POST /register**: Registra um novo usuário (requisição com username, email, e password).
- **POST /login**: Realiza o login do usuário e gera um token de acesso.
- **POST /refresh**: Gera um novo token de acesso utilizando o refresh token.

### Receitas

- **POST /recipes**: Cria uma nova receita.
- **PUT /recipes/:id**: Atualiza uma receita existente.
- **GET /recipes**: Lista todas as receitas.

### Favoritos

- **POST /favorite**: Marca ou desmarca uma receita como favorita.
- **GET /favorite**: Lista as receitas favoritas do usuário autenticado.

## Estrutura de Arquivos

### /backend
```
├── models/       # Modelos de dados do MongoDB
├── routes/       # Rotas para autenticação e gestão de receitas
├── controllers/  # Funções de manipulação de dados
├── middleware/   # Middleware de autenticação e validação
├── prisma/       # Configurações e modelos do Prisma
├── .env          # Variáveis de ambiente
├── app.js        # Arquivo principal do servidor
├── server.js     # Arquivo que inicia o servidor
```

### /frontend
```
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   ├── App.js           # Componente principal da aplicação
│   ├── App.css          # Estilos globais
│   ├── index.js         # Ponto de entrada da aplicação React
│   └── api.js           # Configurações para chamadas à API
├── public/
│   └── index.html       # Arquivo HTML principal
├── .env                 # Configurações do ambiente de desenvolvimento
└── package.json         # Dependências e scripts do frontend
```

## Licença

Este projeto é licenciado sob a MIT License.
