import React, { useState, useContext, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Image, Card, Button } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import "./FormRecipes.css";

import { RecipeContext } from "../context/ContextRecipes";
import { ThemeContext } from "../context/ThemeContext";

const FormRecipes = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const { state, favoritedRecipe, dispatch } = useContext(RecipeContext);
  const [indexRecipe, setIndexRecipe] = useState(Number);
  const { theme } = useContext(ThemeContext);
  const [favoriteData, setFavoriteData] = useState({
    id: "",
    favorited: false,
  });

  const recipes = state.recipes;
  const favorites = state.favorites;
  const contentRef = useRef();

  /* Função para capturar o index (key) da receita para pegar as informações dela e abrir o modal bootstrap */
  /* console.log(recipes) */
  const handleRecipe = (index) => {
    console.log(favorites)
    const recipe = recipes[index];
    if (indexRecipe !== null) {
      setModalShow(true);
      setIndexRecipe(index);
      if (recipe && recipe.id) {
          const favoriteId = favorites.find(
            (favorite) => favorite.recipeId === recipe.id,
          );
          if (favoriteId) {
          console.log(favorites)
          console.log(favoriteId);
          setFavoriteData({id: recipe.id, favorited: true });
        } else {
          setFavoriteData({favorited: false});
        }
      } else {
        console.error("Id indefinido");
      }
    }
  };

  const handleFavoritedData = () => {
    console.log(indexRecipe);
    if (indexRecipe !== null) {
      const recipe = recipes[indexRecipe];
      console.log(recipe)
      console.log(favoriteData)
      if (recipe && recipe.id) {
        setFavoriteData({ id: recipe.id, favorited: !favoriteData.favorited });
      } else {
        console.error("Id da receita indefinido");
      }
    }
  };

  // Função para lidar com a ação de favoritar
  const handleFavorited = () => {
    handleFavoritedData();
  };

  const generatePDF = async () => {
    try {
      const element = contentRef.current;
      console.log(element)
      if (!element) {
        console.error('Erro: Elemento #pdf-content não encontrado.');
        return;
      }

      const elementHeight = element.offsetHeight;
      const elementWidth = element.offsetWidth;
      
      if (elementHeight === 0 || elementWidth === 0) {
        console.error('Erro: O conteúdo do elemento está vazio ou não visível.');
        return;
      }

      const options = {
        margin: [10, 5, 10, 5],
        filename: `${recipes[indexRecipe].title}.pdf`,
        image: {type: 'jpeg', quality: 0.98},
        html2canvas: {scale: 8},
        jsPDF: {unit: "mm", format: "a4", orientation: "portrait"}
      }

      html2pdf().from(element).set(options).save().then(()=> {
        console.log('PDF gerado com sucesso!');
      })   
      
    } catch (error) {
      console.log('Erro ao gerar PDF', error)
    }
  }

  useEffect(() => {
    if (favoriteData.id !== "") {
      favoritedRecipe(dispatch, favoriteData.id, favoriteData.favorited);
      console.log(favoriteData);
    }
  }, [favoriteData.id]);

  function MyVerticallyCenteredModal({ theme, ...props }) {
    if (!recipes || recipes.length === 0 || !recipes[indexRecipe]) {
      return null; // Se recipes estiver indefinido ou indexRecipe estiver fora do intervalo, não renderiza o modal
    }
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div ref={contentRef}>
          <Modal.Header className={`modal-${theme}`}>
            <Modal.Title
              style={{ textAlign: "center" }}
              id="contained-modal-title-vcenter"
            >
              {recipes[indexRecipe].title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className={`modal-${theme}`}>
            <div className="presentation">
              <div style={{ textAlign: "center" }}>
                <h4>Ingredientes:</h4>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    textAlign: "start",
                  }}
                >
                  <ul>
                    {recipes[indexRecipe].ingredients.map(
                      (recipe, index) =>
                        index < 7 && <li key={index}>{recipe}</li>,
                    )}
                  </ul>
                  <ul>
                    {recipes[indexRecipe].ingredients.map(
                      (recipe, index) =>
                        index >= 7 && <li key={index}>{recipe}</li>,
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <h4 style={{ textAlign: "center" }}>Modo de Preparo:</h4>
            <ul>
              {recipes[indexRecipe].preparation.map((recipe, index) => (
                <li key={index}> {recipe}</li>
              ))}
            </ul>
          </Modal.Body>
        </div>

        <Modal.Footer className={`modal-${theme}`}>
          <Button variant="outline-danger" onClick={handleFavorited}>
            {favoriteData.favorited ? <FaHeart /> : <FaRegHeart />}
          </Button>

          <Button onClick={generatePDF}>Gerar PDF</Button>
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
          show={modalShow}
          onHide={() => setModalShow(false)}
          theme={theme}
        />
      </Container>
    </div>
  );
};

export default FormRecipes;
