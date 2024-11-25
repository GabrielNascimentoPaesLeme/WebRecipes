// utils/getRecipeImages.js

// Usando import.meta.glob para importar as imagens de forma dinâmica e assíncrona
export const getRecipeImages = (recipeId) => {
  // Fazendo a importação das imagens dinamicamente
  const images = import.meta.glob(
    "../assets/recipes/recipe" + recipeId + "-img*.jpg",
  );

  // Função para retornar as imagens como um array
  return Object.keys(images).map((key) => images[key]());
};
