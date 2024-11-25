import React from "react";
import { useContext, useState } from "react";
import { RecipeContext } from "../context/ContextRecipes";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import "./LoginRegister.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  /* Captura o dispatch e a função login enviada pelo provider no context (como se fossem props) */
  const { login, dispatch } = useContext(RecipeContext);
  /* Constante userData utilizando o useState para capturar as informações passadas pelo usuário ao fazer login */
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  /* Usando o navigate para navegar entre as rotas */
  const navigate = useNavigate();

  /* Função que captura o submit do login e dispara um preventDefault para não recarregar */
  const handleSubmit = async (e) => {
    e.preventDefault();
    

    /* loginSucces é a constante que vai receber true ou false. O retorno da função login depende da autenticação do usuário pelos dados setados em "userData" */
    const loginSuccess = await login(dispatch, userData);

    /* Se a autenticação for bem sucedida, retorna um true e redireciona para  página principal de exibição de receitas */
    if (loginSuccess) {
      navigate("/");
      window.location.reload();
    } else {
      /* Manda para registro */
      navigate("/register");
    }
  };
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6} className="centered">
          <Card className="login-card">
            <Card.Body>
              <Card.Title className="text-center mb-4">Login</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsernameLogin">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    onChange={(e) =>
                      setUserData({ ...userData, username: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPasswordLogin">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    onChange={(e) =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
