import React from "react";
import { useLocation } from "react-router-dom";

import { useContext, useState } from "react";
import { RecipeContext } from "../context/ContextRecipes";
import { ThemeContext } from "../context/ThemeContext";

import "../components/FormRecipes.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Image, Card, Button } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";

const SearchResult = () => {
  /* contém a parte da URL após o ponto de interrogação. Basicamente, é a query string da URL, como "?q=bolo" */
  const { search } = useLocation();

  /* Usa a classe nativa do JS (URLSearch...), para trabalhar com query string
  o get extrai o valor do parametro q. exemplo ?q=bolo. q será "bolo". */
  const query = new URLSearchParams(search).get("q");
  const { state } = useContext(RecipeContext);

  /* Filtrando todas as receitas somente com as que possuem inclusas nela, tanto no nome, quanto na descrição o query. */
  const recipes = state.recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(query.toLowerCase()) ||
      recipe.description.toLowerCase().includes(query.toLowerCase()) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(query.toLowerCase()),
      ),
  );

  /* Bootstrap */
  const [modalShow, setModalShow] = useState(false);
  const [indexRecipe, setIndexRecipe] = useState(null);
  const { theme } = useContext(ThemeContext);

  /* Função para capturar o index (key) da receita para pegar as informações dela e abrir o modal bootstrap */
  const handleRecipe = (index) => {
    setModalShow(true);
    setIndexRecipe(index);
  };

  // Função para lidar com a ação de favoritar
  const handleFavorite = (id) => {
    console.log(`Favoritou a receita com id: ${id}`);
  };

  function MyVerticallyCenteredModal({ theme, ...props }) {
    if (indexRecipe === null || !recipes[indexRecipe]) {
      return null; // Retorna null se o índice não for válido
    }
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className={`modal-${theme}`}>
          <Modal.Title
            style={{ textAlign: "center" }}
            id="contained-modal-title-vcenter"
          >
            {recipes[indexRecipe].title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`modal-${theme}`}>
          <div className="presentation">
            <div>
              <h4>Ingredientes:</h4>

              <ul>
                {recipes[indexRecipe].ingredients.map((recipe, index) => (
                  <li key={index}>{recipe}</li>
                ))}
              </ul>
            </div>
          </div>

          <h4 style={{ textAlign: "center" }}>Modo de Preparo:</h4>
          <ol>
            {recipes[indexRecipe].preparation.map((recipe, index) => (
              <li key={index}>{recipe}</li>
            ))}
          </ol>
        </Modal.Body>
        <Modal.Footer className={`modal-${theme}`}>
          <Button
            className={`${state.recipes.favorited ? "favorite" : ""}`}
            variant="outline-danger"
            onClick={() => handleFavorite(recipes[indexRecipe].id)}
          >
            <FaHeart /> Favoritar
          </Button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <div>
      {/* Catálogo de Receitas */}
      <Container className="mt-4">
        <Row style={{ display: "flex", justifyContent: "center" }}>
          {recipes.map((recipe, index) => (
            <Col key={index} xs={12} md={3} className="mb-5">
              <a
                style={{ textDecoration: "none" }}
                onClick={() => handleRecipe(index)}
              >
                <Card
                  className={`card-${theme}`}
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Card.Body
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: "15px",
                      minHeight: "30vh",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <Card.Title className={`card-title-${theme}`}>
                        {recipe.title}
                      </Card.Title>

                      <Card.Text style={{ fontSize: ".8rem" }}>
                        {recipe.description}
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </a>
            </Col>
          ))}
        </Row>
        <MyVerticallyCenteredModal
          show={modalShow && indexRecipe !== null}
          onHide={() => setModalShow(false)}
          theme={theme}
        />
      </Container>
    </div>
  );
};

export default SearchResult;
