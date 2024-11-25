import React from "react";
import { useContext, useState } from "react";
import { RecipeContext } from "../context/ContextRecipes";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import "./LoginRegister.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  /* Captura o dispatch e a função register enviada pelo provider no context (como se fossem props) */
  const { register, dispatch } = useContext(RecipeContext);

  /* navigate para navegação entre rotas */
  const navigate = useNavigate();

  /* Constante userData utilizando o useState para capturar as informações passadas pelo usuário ao fazer o registro */
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  /* Captura o Submit e efetua o preventDefault */
  const handleSubmit = (e) => {
    e.preventDefault();

    /* Chama a função register enviada pelo reducer e envia os dados armazenados em userData*/
    register(dispatch, userData);

    /* Ao finalizar o registro encaminha para a página principal */
    navigate("/");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6} className="centered">
          <Card className="register-card">
            <Card.Body>
              <Card.Title className="text-center mb-4">Register</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsernameRegister">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    onChange={(e) =>
                      setUserData({ ...userData, username: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmailRegister">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPasswordRegister">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    onChange={(e) =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100">
                  Register
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
