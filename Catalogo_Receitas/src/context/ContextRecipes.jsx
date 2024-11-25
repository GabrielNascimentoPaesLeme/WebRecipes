import { createContext, useReducer, useEffect } from "react";

/* Importando a instância criada utilizando axios */
import api from "../services/api";

const STAGES = ["Home", "Search", "Login", "Register", "Perfil"];

/* Defino as receitas como uma lista vazia */
let recipes = [];
let favorites = []

async function getRecipes(dispatch) {
  try {
    const response = await api.get("/recipes");
    dispatch({ type: "SET_RECIPES", payload: response.data });
  } catch (error) {
    console.error("Erros ao buscar receitas: ", error);
  }
}

async function getFavorites(dispatch) {
  try {
    const response = await api.get('/favorite');
    dispatch({type: "SET_FAVORITES", payload: response.data})
  } catch (error) {
    console.error("Erro ao buscar Favoritos: ", error)
  }
}

async function setRecipes(dispatch, recipeData) {
  try {
    const response = await api.post("/recipes", recipeData);
    dispatch({ type: "ADD_RECIPE", payload: response.data });
  } catch (error) {
    console.error("Erro ao adicionar a receita: ", error);
  }
}

async function favoritedRecipe(dispatch, id, favorited) {
  /* console.log(id, favorited); */
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token não encontrado");
      return; 
    }

    
    await api.post(
      "/favorite",
      { recipeId: id, favorited: favorited },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(favorited)

    dispatch({
      type: "TOGGLE_FAVORITE",
      payload: { id, favorited },
    });

    let favoritedRecipes =
      JSON.parse(localStorage.getItem("favoritedRecipes")) || [];

    // Verifica se a receita já está na lista
    const existingRecipeIndex = favoritedRecipes.findIndex(
      (recipe) => recipe.id === id,
    );

    if(existingRecipeIndex){
      console.log(existingRecipeIndex)
    }
    

    if (favorited) {
      // Se a receita for favoritada e não estiver na lista, adiciona
      if (existingRecipeIndex === -1) {
        favoritedRecipes.push({ id, favorited });
      }
    } else {
      if (existingRecipeIndex !== 1) {
        favoritedRecipes.splice(existingRecipeIndex, 1);
      }
    }
    // Salva o objeto atualizado de receitas favoritedas no localStorage
    localStorage.setItem("favoritedRecipes", JSON.stringify(favoritedRecipes));
  } catch (error) {
    console.error("Erro ao favoritar a receita", error);
  }
}

async function register(dispatch, userData) {
  try {
    const response = await api.post("/register", userData);
    dispatch({ type: "REGISTER", payload: response.data });
    localStorage.setItem("user", JSON.stringify(userData));
  } catch (error) {
    console.error("Erro ao registrar: ", error);
  }
}

async function login(dispatch, userData) {
  try {
    const response = await api.post("/login", userData);
    if (response.data && response.data.token) {
      console.log("Token gerado:", response.data.token);
      dispatch({ type: "LOGIN", payload: userData });
      console.log(response.data.user.id)
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      return true;
    } else {
      console.error("Token não encontrado na resposta");
      return false;
    }
  } catch (error) {
    console.error("Erro ao fazer o login: ", error);
    return false;
  }
}

/* Função de logout que limpa os campos e efetua o disparo da ação */
async function logout(dispatch) {
  localStorage.clear();
  dispatch({ type: "LOGOUT" });
}

/* Estágio inicial da aplicação quando a página é carregada. Não possui usuários logados e a autenticação é falsa. Ao logar altera os estados de user e isAuthenticated */
const initialState = {
  page: STAGES[0],
  recipes,
  isAuthenticated: false,
  user: null,
  favorites,
};

/* Reducer que controla os estados e as ações de cada caso.*/
const recipeReducer = (state, action) => {
  switch (action.type) {
    /* Retorno as receitas do state inicial com o payload que recebe a resposta do servidor contendo as receitas.O map percorre cada receita contida no db e adiciono às receitas um campo de favorited setado como falso */
    case "SET_RECIPES":
      return {
        ...state,
        recipes: action.payload.map((recipe) => ({
          ...recipe,
          favorited: false,
        })), // Define o valor inicial de favorited como false
      };


    case "SET_FAVORITES":
      return {
        ...state,
        favorites: action.payload.map(item => ({recipeId: item}))
      };

    case "SEARCH":
      return { ...state };

    /* Caso para adicionar receitas no DataBase */
    case "ADD_RECIPE":
      return {
        ...state, // recebe todos estados anterios do state
        recipes: [...state.recipes, { ...action.payload, favorited: false }], // Adiciona e Define favorited como false ao adicionar uma nova receita.
      };

    /* Caso de registro. Ao efetuar registro corretamente, retorno meus dados anteriores e altero a autenticação para true e defino que o usuário autenticado recebra dados pelo payload */
    case "REGISTER":
      return {
        ...state,
        user: action.payload,
      };

    /* Ao fazer login altero a autenticação para true e defino que o usuário autenticado recebra dados pelo payload */
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };

    /* Ao deslogar, apenas retorn o estágio inicial onde user era null e a autenticação falsa */
    case "LOGOUT":
      return initialState;

    /* Quando favorita uma receita recebe todos os dacos da receita*/
    case "TOGGLE_FAVORITE":
      return {
        ...state, //Recebendo todos os dados contidoas até o momento no state
        recipes: state.recipes.map((recipe) =>
          /* Utiliza o map para percorrer todas as receitas e retornar a receita que contem o id igual ao passado pelo payload. Se existir alguma, favorited recebe a negação dele mesmo (como um toggle). Ou seja, se for true recebe false, vice e versa */
          recipe.id === action.payload.id
            ? { ...recipe, favorited: action.payload.favorited }
            : recipe,
        ),
      };

    default:
      return state;
  }
};

/* Criando e exportando o contexto criado para menejo e relação entre usuários e receitas */
export const RecipeContext = createContext();

/* Exportando o provider. children é tudo que usará o contexto criado */
export const RecipeProvider = ({ children }) => {
  /* useReducer para gerenciar o estado e as ações associadas ao estado de forma mais estruturada.
  Recebe dois parâmetros, um reducer (que foi configurado - recipeReducer) e um estado inicial para as informações.  Executa uma desestruturação de array para extrair duas coisas do retorno de useReducer. Dispatch para disparar ação e envio de payload, e o state que é o estado atual gerenciado pelo context */
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  /* useEffect para disparar toda vez que a página for carregada e capturar os dados do db */
  useEffect(() => {
    /* função que captura as receitas */
    getRecipes(dispatch);
    
    console.log(state.recipes)
    /* Defino uma constante para receber o user autenticado setado na localStorage se houver */
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        /* Caso exista user salvo na localStorage, converto o JSON que vem e converto para o JavaScript. O "parse" transforma o conteúdo em um objeto para que possa acessar suas propriedades diretamente no código. Utilizo o objeto para disparar uma ação de login e passando como payload o user capturado da localStorage*/
        const parsedUser = JSON.parse(storedUser);
        dispatch({ type: "LOGIN", payload: parsedUser });
        getFavorites(dispatch);

      } catch (error) {
        console.error("Erro ao fazer parse de 'user':", error);
        localStorage.removeItem("user"); // Limpa o dado inválido
      }
    }
  }, []);

  return (
    /* O envio do context utilizando o provider. Cada value instanciado pode ser utilizado nos elementos filhos (children) do context como se fossem props. */
    <RecipeContext.Provider
      value={{
        state,
        dispatch,
        setRecipes,
        register,
        login,
        logout: () => logout(dispatch),
        favoritedRecipe,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};
