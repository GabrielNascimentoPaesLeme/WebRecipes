import axios from "axios";

/* Instancia uma constante que utiliza axios para fazer requisições no url informado (Local onde esta hospedado o DataBase) */
const api = axios.create({
  baseURL: "http://localhost:3000",
});

/*Os interceptors permitem modificar ou realizar ações antes que uma requisição HTTP seja enviada. Config é o objeto de configuração da requisição HTTP, que contém detalhes como URL, método, cabeçalhos, etc. */
api.interceptors.request.use(
  (config) => {
    /* Captura o token que foi armazenado na localStorage ao fazer login */
    const token = localStorage.getItem("token");
    if (token) {
      /* Se o token existir, ele é adicionado aos cabeçalhos da requisição HTTP no formato de Authorization Bearer Token. O Bearer é um padrão utilizado para enviar tokens JWT no cabeçalho HTTP. Esse cabeçalho será enviado junto com a requisição para que o servidor possa validar que o usuário está autenticado. */
      config.headers.Authorization = `Bearer ${token}`;
    }
    /* A configuração da requisição (que pode ter sido modificada ao adicionar o cabeçalho de autorização) é retornada. Isso garante que a requisição com o token JWT seja enviada ao servidor. */
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const response = await axios.post('http://localhost:3000/refresh', { token: refreshToken });
    const newAccessToken = response.data.accessToken;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Erro ao renovar o token de acesso:", error);
    return null;
  }
}

/* Interceptor para gerenciar token expirado e fazer refresh */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        /* Obtém o refresh token da localStorage */
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("Refresh token não encontrado");
        }

        /* Solicita um novo token de acesso usando o refresh token */
        const { data } = await axios.post("http://localhost:3000/refresh", {
          token: refreshToken,
        });

        const newAccessToken = data.token;

        /* Armazena o novo token de acesso na localStorage */
        localStorage.setItem("token", newAccessToken);

        /* Atualiza o cabeçalho Authorization com o novo token e repete a requisição original */
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Erro ao obter novo token de acesso:", refreshError);
        /* Redireciona para a página de login ou trata a situação */
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
