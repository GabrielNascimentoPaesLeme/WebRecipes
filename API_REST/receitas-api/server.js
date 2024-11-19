// Importação componentes ja instalados
import mongoose from 'mongoose';

// Express para facilitar a criação do server e realizar as requisições http
import express from 'express';

/* Configura as permissões para que um servidor possa aceitar requisições de domínios diferentes, ajudando a prevenir problemas de segurança ao controlar quem pode acessar a API. */
import cors from 'cors';

/* Um cliente para o Prisma, que é um ORM (Object-Relational Mapping) para Node.js e TypeScript. Facilita a interação com o banco de dados, permitindo consultas e operações CRUD (Create, Read, Update, Delete) de maneira tipada e segura, gerando consultas SQL a partir de modelos definidos no arquivo schema.prisma. */
import { PrismaClient } from '@prisma/client';

/* Biblioteca para hashing de senhas. Permite armazenar senhas de forma segura ao criar um hash (uma representação criptografada da senha) */
import bcrypt from 'bcrypt';

/* Um módulo embutido no Node.js que fornece funcionalidades de criptografia.
Para que serve: Oferece métodos para criar hashes, gerenciar chaves e implementar criptografia, ajudando a proteger dados sensíveis em aplicações. */
import crypto from 'crypto';

/* Permite ler, escrever, e manipular arquivos e diretórios no sistema, sendo útil para armazenar e recuperar dados persistentes. Utilizado para gerar a SECRET_KEY no .env que faz referencia ao token de autenticação */
import fs from 'fs'

/* Autenticação e autorização, permitindo que informações (como IDs de usuário) sejam transmitidas em um formato seguro e que podem ser verificadas e confiáveis. */
import jwt from 'jsonwebtoken';

/* Ajuda a gerenciar configurações sensíveis, como credenciais e URLs de banco de dados, sem precisar codificá-las diretamente no código-fonte, promovendo melhores práticas de segurança. */
import dotenv from 'dotenv';

/* Carregar variáveis de ambiente de um arquivo .env para o process.env */
dotenv.config();

/* instanciando um novo PrismaClient() na constante prisma para utilizar em requisições e resposta http */
const prisma = new PrismaClient()

/* Criando uma variável secret Key*/
let secretKey

/* Utilizando o process do dotoenv.config() para acessar SECRET_KEY na pesta .env*/
if(process.env.SECRET_KEY ){
  /* Se existir secretkey na pasta .env, defino a variavel criada com o valor da key no .env */
  secretKey = process.env.SECRET_KEY
} else {
  /* Caso não exista akey, gero uma aleatória usando o crypto para proteção da key */
  secretKey = crypto.randomBytes(32).toString("hex")
  console.log("Chave secreta gerada:", secretKey);

  // Adiciona a chave secreta ao arquivo .env
  fs.appendFileSync('.env', `\nSECRET_KEY=${secretKey}`, (err) => {
    if (err) {
      console.error("Erro ao salvar a chave secreta no .env:", err);
    } else {
      console.log("Chave secreta salva no arquivo .env.");
    }
  });
}

/* Definindo uma constante que cria uma instância do Express */
const app = express();

/* Configurando o Express para interpretar dados no formato JSON*/
app.use(express.json())

const baseUrl = process.env.DATABASE_URL
mongoose.connect(
  baseUrl,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("Error connecting to MongoDB", error));

/* Usa o CORS para fazer controle dos methodos e requisições permitidos */
app.use(cors({
  origin: ['http://localhost:5173' || 'https://web-recipes-smoky.vercel.app/'],// Permite requisições do seu front-end]
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permite métodos específicos
  allowedHeaders: ['Content-Type', 'Authorization'] // Define os cabeçalhos permitidos nas requisições
}));

/* Função para autenticação de token gerado no login. O token é armazenado na localStorage e verifica se o usuário está logado e possui um token para acesso a certas funcionalidades */
const authenticateToken = (req, res, next) => {
  /* o token vem pelo cabeçalho da requisição, com o nome de Authorization */
  const token = req.headers['authorization'];
  if (!token) {
    return res.sendStatus(401); // Se não houver token, retorna 401
    }

    /* Verificação se o token recebido tem ligação com a key pega no .env. Recebe o usuário que fez a requisição e anexa os dados à requisição*/
  jwt.verify(token.split(' ')[1], secretKey, (err, user) => {
    if(err) {
      console.error("Erro na verificação do token:", err);
      return res.sendStatus(403); // Se o token não for válido, retorna 403
      }
    req.user = user; // Anexa os dados do usuário à requisição
    next(); // Passa para a próxima função middleware ou rota
  });
};

/* 1) Tipo de Rota / Método HTTP.
   2) Endereço.
*/

/* Função para registro de novo usuário. Método POST para envio dos dadso para o bd  */
app.post("/register", async (req, res) => {
  
  const hashedPassword = await bcrypt.hash(req.body.password, 10); /* Faz o hash da senha usando bcrypt para segurança. Pego a senha do body da requisição*/

  try {
    /* Crio o usuário seguindo o modelo definido no schema */
    const newUser = await prisma.user.create({
      data: {
        username: req.body.username, //Recebendo dados do corpo da requisição
        email: req.body.email, //Recebendo dados do corpo da requisição
        password: hashedPassword, //Recebendo dados da senha criptografada
      }
    });
    res.status(201).json(newUser) //retorno código de sucesso na requisição
  } catch (error) {
    res.status(500).json({ error: "Error creating user." }); //Caso de algum erro, retorno erro 500
  }

})

/* função para login*/
app.post("/login", async (req, res) => {
  
  /* Faço a busca dos parâmetros necessários para login no body da requisição */
  const {username, password} = req.body
  if (!username || !password) {
    /* Caso o campo venha vazio e não retorne undefined */
    return res.status(400).json({ error: "Username e password são obrigatórios." });
  }

  try {
    /* Utilizo o prisma que setei como uma instância do PrismaClient.*/
    const user = await prisma.user.findUnique({
      /* A constante user vai utilizar o findUnique para guardar os dados do usuário que fez login usando username(username é unique) Onde (where) existir o username recebido na requisição */
      where: {username},
    })
    /* Comparo as informações passadas no corpo da requisição. Capturei, anteriormente, o user com o findUnique, agora uso o password vindo do body da req e utilizo o Compare do bcrypt para verificar se a senha passada na requisição e a existente no user do findUnique que contem aquele username, são iguais */
    if (user && (await bcrypt.compare(password, user.password))){
      /* Gerando o token e dando entrada com o campo id que referencia o id do user (o payload) que fez a requisição, passo a key utilizada para assinar o token */
      const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '10h' });
      const refreshToken = jwt.sign({ id: user.id }, secretKey, { expiresIn: '31d' });
      

      /* Enviando a resposta em formato JSON com o token e os dados do usuário autenticado no findUnique */
      res.json({token, refreshToken, user})
    } else {
      res.status(401).json({error: "Credenciais Inválidas"}) // Caso as credenciais nao sejam iguais
    }
  } catch (error) {
    res.status(500).json({ error: "Erro no servidor" }); // Erro no server
  } 
});

// Endpoint para gerar um novo token de acesso usando o refresh token
app.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!storedToken) return res.sendStatus(403);

    jwt.verify(refreshToken, secretKey, (err, user) => {
      if (err) return res.sendStatus(403);

      const newToken = jwt.sign({ id: user.id }, secretKey, { expiresIn: '10h' });
      res.json({ token: newToken });
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao processar o refresh token." });
  }
});


/* Função de favoritar as receitas. Recebe o token autenticado que veio no cabeçalho da requisição do usuário autenticado */
app.post("/favorite",authenticateToken , async(req, res) => {

  /* Recebe os dados da receita da qual foi feita a requisição */
  const {recipeId, favorited} = req.body

  /* Utilizo o id do usuario autenticado que fez a requisição para definir uma constante que recebera esse msmo id */
  const userId = req.user.id
  try {
    /* Verifico se a receita em questão possui o favorito como true (o favorited é gerado pelo front e inserido no db, o valor inicial é false e é alterado de acordo com o clique no botão). */
    if (favorited) {
      // Se favoritado, cria uma nova entrada na tabela de favoritos
      const favorite = await prisma.favorite.create({
        data: {
          userId: userId,
          recipeId,
        },
      });
      res.status(201).json(favorite);
    } else {
      // Se desfavoritado, remove a entrada da tabela de favoritos
      await prisma.favorite.deleteMany({
        where: {
          userId: userId,
          recipeId: recipeId,
        },
      });
      res.status(204).send(); // 204 No Content
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao favoritar/desfavoritar a receita." });
  }
});

app.get("/favorite", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: userId
      },
      select: {
        recipeId: true // Retorna apenas os IDs das receitas
      }
    });
    res.json(favorites.map(favorite => favorite.recipeId)); // Envia uma lista com os IDs das receitas favorited
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar receitas favoritas." });
  }
});


// Método POST, endereço ("/recipes") -> inseir itens no bd
app.post("/recipes", async (req, res) => {
  /* Modelo definido no schema.prisma para criação de receitas, recebe os dados do body da req e insere no db recipe*/
 await prisma.recipe.create({
    data: {
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients,
      preparation: req.body.preparation,
    }
  })
  res.status(201).json(req.body)
  
})

// Método PUT, endereço ("/recipes") -> editar os itens no db
app.put("/recipes/:id", async (req, res) => {
  await prisma.recipe.update({
    where: {
      id: req.params.id
    },
    data: {
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients,
      preparation: req.body.preparation,
    }
  })
  res.status(201).json(req.body)
})

// Método GET, endereço ("/recipes") -> Listar itens no banco de dados recipe
app.get("/recipes", async (req, res) => {
  /* Cria uma  constante que recebe todos os registros inseridos em 'Recipe'*/
  const recipes = await prisma.recipe.findMany()
  /* Envia a resposta para o cliente */
  res.send(recipes)
})

/* Define a porta na qual o servidor está escutando requisições */
app.listen(baseUrl || 3000)

