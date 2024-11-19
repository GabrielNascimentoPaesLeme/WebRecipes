import React, { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./CreateRecipe.css";
import { RecipeContext } from "../context/ContextRecipes";
import { ThemeContext } from "../context/ThemeContext";

const CreateRecipe = () => {
  const { dispatch, setRecipes } = useContext(RecipeContext);
  const {theme} = useContext(ThemeContext)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [preparation, setPreparation] = useState("");

  /* instancio uma nova receita recebendo os valores do useState */
  const newRecipe = {
    title,
    description,

    /* Separando os ingredientes, após cada "vírgula" é um novo ingrediente, gereando uma lista */
    ingredients: ingredients.split(","),

    /* Separando as etapas de preparação, após cada "ponto" é uma nova etapa, gerando uma lista */
    preparation: preparation.split("."),
  };

  /* Capturando o submit e passando o preventDefault */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Acessando a função de criar receitas passada pelo Provider no context e enviando newRecipe como argumento de criação */
    await setRecipes(dispatch, newRecipe);

    /* limpando o useState */
    setTitle("");
    setDescription("");
    setIngredients("");
    setPreparation("");
  };

  return (
    <div className="containerCreate">
      <form className="formRecipe" onSubmit={handleSubmit}>
        <div id="title">
          <Form.Label htmlFor="inputTitle">Nome da receita</Form.Label>
          <Form.Control
            type="text"
            id="inputTitle"
            placeholder="Título"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div id="description">
          <Form.Label htmlFor="inputDescription">Descreva a receita</Form.Label>
          <Form.Control
            type="text"
            id="inputDescription"
            placeholder="Descrição"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div id="ingredients">
          <Form.Label htmlFor="inputIngredients">Ingredientes</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            id="inputIngredients"
            placeholder='Exemplo: "3 gemas. 1/2 xícara de açúcar. 1 xícara de farinha de trigo"'
            onChange={(e) => setIngredients(e.target.value)}
          />
          <Form.Text id="passwordHelpBlock" muted>
            Os ingredientes devem ser separados por vírgula para criação de uma
            lista personalizada.
          </Form.Text>
        </div>

        <div id="preparation">
          <Form.Label htmlFor="inputPreparation">Modo de preparo</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            id="inputPreparation"
            placeholder='Exemplo: "Junte a farinha e o açúcar. adicione as gemas batidas à mistura de farinha e açúcar. deixe descansar por 5 minutos"'
            onChange={(e) => setPreparation(e.target.value)}
          />
          <Form.Text id="passwordHelpBlock" muted>
            As etapas do modo de preparo, devem ser
            separados por ponto para criação de uma lista personalizada.
          </Form.Text>
        </div>

        <Button variant="primary" type="submit">
          Criar Receita
        </Button>
      </form>

      <div className={`createdRecipe createdRecipe-${theme}`}>
        <h5>Título: {title}</h5>
        <h5>Descrição: {description}</h5>
        <div>
          <h5>Ingredientes:</h5>
          <ul>
            {newRecipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h5>Modo de preparo:</h5>
          <ol>
            {newRecipe.preparation.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;
